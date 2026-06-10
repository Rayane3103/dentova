import { NextResponse } from "next/server";
import { configureCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 422 });
  }

  const cloudinary = configureCloudinary();
  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "dentova"
  });

  return NextResponse.json({
    imagePublicId: result.public_id,
    imageUrl: result.secure_url
  });
}
