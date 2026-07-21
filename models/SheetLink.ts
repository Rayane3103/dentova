import mongoose, { Schema } from "mongoose";

const SheetLinkSchema = new Schema(
  {
    // Which dataset this sheet mirrors (currently only "reservations").
    resource: { type: String, required: true, unique: true },
    spreadsheetId: { type: String, required: true },
    spreadsheetUrl: { type: String, required: true },
    sheetId: { type: Number, default: 0 },
    lastSyncedAt: { type: Date }
  },
  { timestamps: true }
);

export const SheetLink =
  mongoose.models.SheetLink || mongoose.model("SheetLink", SheetLinkSchema);
