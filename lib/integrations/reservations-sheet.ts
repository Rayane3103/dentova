import { serializeReservationAnswers } from "@/lib/data/serialize";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import {
  createSpreadsheet,
  formatSheet,
  getSpreadsheetMeta,
  hasGoogleSheetsConfig,
  renameSheet,
  shareSpreadsheet,
  writeSheetValues
} from "@/lib/integrations/google-sheets";
import { Reservation } from "@/models/Reservation";
import { SheetLink } from "@/models/SheetLink";
// Side-effect import: ensures the Course schema is registered so the
// populate("courseId") in buildMatrix works in every serverless context.
import "@/models/Course";

const RESOURCE = "reservations";
const TAB_TITLE = "Réservations";

const HEADER = [
  "Nom complet",
  "Email",
  "Téléphone",
  "Wilaya",
  "Profession",
  "Formation",
  "Date événement",
  "Heure",
  "Lieu",
  "Prix (DZD)",
  "Statut",
  "Réponses",
  "Message",
  "Date réservation",
  "Dernière mise à jour"
];

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  paid: "Payé",
  cancelled: "Annulée"
};

export type ReservationsSheetLink = {
  spreadsheetId: string;
  spreadsheetUrl: string;
  sheetId: number;
  lastSyncedAt: string | null;
};

function toLink(doc: Record<string, unknown> | null): ReservationsSheetLink | null {
  if (!doc) return null;

  return {
    spreadsheetId: String(doc.spreadsheetId),
    spreadsheetUrl: String(doc.spreadsheetUrl),
    sheetId: Number(doc.sheetId ?? 0),
    lastSyncedAt: doc.lastSyncedAt ? new Date(String(doc.lastSyncedAt)).toISOString() : null
  };
}

function formatDay(value: unknown) {
  if (!value) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(String(value)));
}

function formatDateTime(value: unknown) {
  if (!value) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(String(value)));
}

async function buildMatrix(): Promise<(string | number)[][]> {
  const reservations = await Reservation.find({})
    .populate("courseId")
    .sort({ createdAt: -1 })
    .lean();

  const rows = reservations.map((raw) => {
    const doc = raw as Record<string, unknown>;
    const course = doc.courseId as Record<string, unknown> | null;
    const answers = serializeReservationAnswers(doc.answers)
      .map((answer) => `${answer.label}: ${answer.value.join(", ")}`)
      .join(" | ");

    return [
      String(doc.fullName ?? ""),
      String(doc.email ?? ""),
      String(doc.phone ?? ""),
      String(doc.wilaya ?? ""),
      String(doc.profession ?? ""),
      course?.title ? String(course.title) : "Formation non renseignée",
      formatDay(course?.date),
      course?.time ? String(course.time) : "",
      course?.location ? String(course.location) : "",
      course?.price != null ? Number(course.price) : "",
      STATUS_LABELS[String(doc.status)] ?? String(doc.status ?? ""),
      answers,
      String(doc.message ?? ""),
      formatDateTime(doc.createdAt),
      formatDateTime(doc.updatedAt)
    ];
  });

  return [HEADER, ...rows];
}

export async function getReservationsSheetLink(): Promise<ReservationsSheetLink | null> {
  if (!hasDatabaseConfig()) return null;
  await connectToDatabase();
  const doc = await SheetLink.findOne({ resource: RESOURCE }).lean();
  return toLink(doc as Record<string, unknown> | null);
}

/**
 * Rewrites the linked Google Sheet with the current reservation data.
 * Silently no-ops when Sheets or the DB are not configured, or no sheet is
 * linked yet — it must never break a reservation mutation.
 */
export async function syncReservationsSheet(): Promise<{ synced: boolean }> {
  if (!hasGoogleSheetsConfig() || !hasDatabaseConfig()) {
    return { synced: false };
  }

  try {
    await connectToDatabase();
    const linkDoc = await SheetLink.findOne({ resource: RESOURCE });
    if (!linkDoc) {
      return { synced: false };
    }

    const matrix = await buildMatrix();
    await writeSheetValues(linkDoc.spreadsheetId, TAB_TITLE, matrix);
    await formatSheet(linkDoc.spreadsheetId, Number(linkDoc.sheetId ?? 0), HEADER.length);

    linkDoc.lastSyncedAt = new Date();
    await linkDoc.save();

    return { synced: true };
  } catch (error) {
    console.error("[dentova] Reservations sheet sync failed:", error);
    return { synced: false };
  }
}

/**
 * Creates (or reuses) a Google Sheet mirroring reservations and performs the
 * initial sync. Reuses GOOGLE_SHEETS_RESERVATIONS_ID when provided.
 */
export async function linkReservationsSheet(): Promise<ReservationsSheetLink> {
  if (!hasGoogleSheetsConfig()) {
    throw new Error("GOOGLE_SHEETS_NOT_CONFIGURED");
  }

  await connectToDatabase();

  const existing = await SheetLink.findOne({ resource: RESOURCE }).lean();
  if (existing) {
    await syncReservationsSheet();
    return toLink(existing as Record<string, unknown>)!;
  }

  const presetId = process.env.GOOGLE_SHEETS_RESERVATIONS_ID?.trim();
  let spreadsheetId: string;
  let spreadsheetUrl: string;
  let sheetId: number;

  if (presetId) {
    const meta = await getSpreadsheetMeta(presetId);
    spreadsheetId = presetId;
    spreadsheetUrl = meta.spreadsheetUrl;
    sheetId = meta.sheetId;
    // The client's blank sheet has a default tab name; normalize it so the
    // sync target range ("Réservations") always resolves.
    if (meta.sheetTitle !== TAB_TITLE) {
      await renameSheet(spreadsheetId, sheetId, TAB_TITLE);
    }
  } else {
    const created = await createSpreadsheet(
      `Dentova — Réservations`,
      TAB_TITLE
    );
    spreadsheetId = created.spreadsheetId;
    spreadsheetUrl = created.spreadsheetUrl;
    sheetId = created.sheetId;
    await shareSpreadsheet(spreadsheetId);
  }

  await SheetLink.create({
    resource: RESOURCE,
    spreadsheetId,
    spreadsheetUrl,
    sheetId
  });

  await syncReservationsSheet();

  return {
    spreadsheetId,
    spreadsheetUrl,
    sheetId,
    lastSyncedAt: new Date().toISOString()
  };
}

export async function unlinkReservationsSheet() {
  if (!hasDatabaseConfig()) return;
  await connectToDatabase();
  await SheetLink.deleteOne({ resource: RESOURCE });
}
