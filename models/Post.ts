import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
  {
    content: { type: String, required: true },
    caption: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String },
    published: { type: Boolean, default: true },
    slug: { type: String, required: true, unique: true, trim: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "AdminUser" }]
  },
  { timestamps: true }
);

export const Post =
  mongoose.models.Post || mongoose.model("Post", PostSchema);
