import { NextResponse } from "next/server";
import { hasGoogleSheetsConfig } from "@/lib/integrations/google-sheets";
import {
  getReservationsSheetLink,
  linkReservationsSheet,
  unlinkReservationsSheet
} from "@/lib/integrations/reservations-sheet";

export const runtime = "nodejs";

export async function GET() {
  const link = await getReservationsSheetLink();
  return NextResponse.json({ link, configured: hasGoogleSheetsConfig() });
}

export async function POST() {
  if (!hasGoogleSheetsConfig()) {
    return NextResponse.json(
      {
        error:
          "L'intégration Google Sheets n'est pas configurée. Ajoutez les identifiants du compte de service."
      },
      { status: 503 }
    );
  }

  try {
    const link = await linkReservationsSheet();
    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error("[dentova] Link reservations sheet failed:", error);
    return NextResponse.json(
      {
        error:
          "Impossible de créer la feuille. Vérifiez les identifiants Google et réessayez."
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await unlinkReservationsSheet();
  return NextResponse.json({ ok: true });
}
