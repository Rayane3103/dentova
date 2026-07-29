import { AbandonedCartsList } from "@/components/admin/AbandonedCartsList";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  ABANDON_THRESHOLD_MINUTES,
  ABANDONED_CARTS_PAGE_SIZE,
  abandonedCountsFromAggregate,
  buildAbandonedCartFilter,
  emptyAbandonedCartCounts,
  serializeAbandonedCartRecord
} from "@/lib/data/abandoned-cart";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { AbandonedCart } from "@/models/AbandonedCart";
// Registers the Course schema so .populate("courseId") can resolve it.
import "@/models/Course";
import type { AbandonedCartRecord } from "@/types";

export default async function AbandonedCartsPage() {
  let carts: AbandonedCartRecord[] = [];
  let counts = emptyAbandonedCartCounts();
  let total = 0;
  let pages = 1;

  if (await tryConnectToDatabase()) {
    const filter = buildAbandonedCartFilter({});

    const [docs, totalCount, aggregate] = await Promise.all([
      AbandonedCart.find(filter)
        .populate("courseId")
        .sort({ lastActivityAt: -1 })
        .limit(ABANDONED_CARTS_PAGE_SIZE)
        .lean(),
      AbandonedCart.countDocuments(filter),
      AbandonedCart.aggregate<{ _id: string; count: number }>([
        { $match: filter },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ])
    ]);

    carts = docs.map((doc) =>
      serializeAbandonedCartRecord(doc as Record<string, unknown>)
    );
    counts = abandonedCountsFromAggregate(aggregate);
    total = totalCount;
    pages = Math.max(1, Math.ceil(totalCount / ABANDONED_CARTS_PAGE_SIZE));
  }

  return (
    <>
      <AdminHeader
        description={`Formulaires de réservation commencés puis laissés incomplets depuis plus de ${ABANDON_THRESHOLD_MINUTES} minutes.`}
        title="Paniers oubliés"
      />
      <AbandonedCartsList
        initialCarts={carts}
        initialCounts={counts}
        initialPages={pages}
        initialTotal={total}
      />
    </>
  );
}
