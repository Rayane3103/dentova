import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  ABANDONED_CARTS_PAGE_SIZE,
  abandonedCountsFromAggregate,
  buildAbandonedCartFilter,
  emptyAbandonedCartCounts,
  serializeAbandonedCartRecord
} from "@/lib/data/abandoned-cart";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { abandonedCartUpdateSchema } from "@/lib/validators/admin-abandoned-cart";
import { AbandonedCart } from "@/models/AbandonedCart";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({
      carts: [],
      counts: emptyAbandonedCartCounts(),
      page: 1,
      pages: 1,
      total: 0
    });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const status = url.searchParams.get("status");
  const courseId = url.searchParams.get("courseId");
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = Math.min(
    100,
    Math.max(5, Number(url.searchParams.get("limit")) || ABANDONED_CARTS_PAGE_SIZE)
  );

  const filter = buildAbandonedCartFilter({ courseId, q, status });

  // Status counts ignore the status filter so the tab totals stay stable.
  const countFilter = { ...filter };
  delete countFilter.status;

  await connectToDatabase();

  const [docs, total, aggregate] = await Promise.all([
    AbandonedCart.find(filter)
      .populate("courseId")
      .sort({ lastActivityAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    AbandonedCart.countDocuments(filter),
    AbandonedCart.aggregate<{ _id: string; count: number }>([
      { $match: countFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ])
  ]);

  return NextResponse.json({
    carts: docs.map((doc) =>
      serializeAbandonedCartRecord(doc as Record<string, unknown>)
    ),
    counts: abandonedCountsFromAggregate(aggregate),
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    total
  });
}

export async function PATCH(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = abandonedCartUpdateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();

  const cart = await AbandonedCart.findByIdAndUpdate(
    parsed.data.id,
    { status: parsed.data.status },
    { new: true }
  ).populate("courseId");

  if (!cart) {
    return NextResponse.json({ error: "Panier introuvable." }, { status: 404 });
  }

  revalidatePath("/admin/abandoned-carts");

  return NextResponse.json({
    cart: serializeAbandonedCartRecord(cart.toObject() as Record<string, unknown>)
  });
}
