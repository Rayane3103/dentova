import { JWT } from "google-auth-library";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive"
];

const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";
const DRIVE_API = "https://www.googleapis.com/drive/v3/files";

// Dentova navy header background (Sheets uses 0..1 RGB floats).
const HEADER_COLOR = { red: 0.078, green: 0.071, blue: 0.227 };

export function hasGoogleSheetsConfig() {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
  );
}

function getClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !key) {
    throw new Error("Google Sheets service account is not configured.");
  }

  return new JWT({ email, key, scopes: SCOPES });
}

type SpreadsheetInfo = {
  spreadsheetId: string;
  spreadsheetUrl: string;
  sheetId: number;
};

/** Creates a new spreadsheet owned by the service account. */
export async function createSpreadsheet(
  title: string,
  tabTitle: string
): Promise<SpreadsheetInfo> {
  const client = getClient();
  const { data } = await client.request<{
    spreadsheetId: string;
    spreadsheetUrl: string;
    sheets: { properties: { sheetId: number } }[];
  }>({
    url: SHEETS_API,
    method: "POST",
    data: {
      properties: { title },
      sheets: [{ properties: { title: tabTitle, gridProperties: { frozenRowCount: 1 } } }]
    }
  });

  return {
    spreadsheetId: data.spreadsheetId,
    spreadsheetUrl: data.spreadsheetUrl,
    sheetId: data.sheets?.[0]?.properties?.sheetId ?? 0
  };
}

/**
 * Grants access to the created spreadsheet: the configured owner email as
 * writer, plus anyone-with-link as reader so the admin can always open it.
 */
export async function shareSpreadsheet(spreadsheetId: string) {
  const client = getClient();
  const shareEmail = process.env.GOOGLE_SHEETS_SHARE_EMAIL?.trim();

  await client.request({
    url: `${DRIVE_API}/${spreadsheetId}/permissions?sendNotificationEmail=false`,
    method: "POST",
    data: { role: "reader", type: "anyone" }
  });

  if (shareEmail) {
    await client.request({
      url: `${DRIVE_API}/${spreadsheetId}/permissions?sendNotificationEmail=false`,
      method: "POST",
      data: { role: "writer", type: "user", emailAddress: shareEmail }
    });
  }
}

/** Replaces the entire sheet contents with the provided matrix. */
export async function writeSheetValues(
  spreadsheetId: string,
  tabTitle: string,
  matrix: (string | number)[][]
) {
  const client = getClient();

  await client.request({
    url: `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(tabTitle)}:clear`,
    method: "POST",
    data: {}
  });

  await client.request({
    url: `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(
      tabTitle
    )}!A1?valueInputOption=RAW`,
    method: "PUT",
    data: { values: matrix }
  });
}

/** Applies branded header styling, banding, and auto column sizing. */
export async function formatSheet(
  spreadsheetId: string,
  sheetId: number,
  columnCount: number
) {
  const client = getClient();

  await client.request({
    url: `${SHEETS_API}/${spreadsheetId}:batchUpdate`,
    method: "POST",
    data: {
      requests: [
        {
          repeatCell: {
            range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: {
              userEnteredFormat: {
                backgroundColor: HEADER_COLOR,
                horizontalAlignment: "LEFT",
                textFormat: {
                  foregroundColor: { red: 1, green: 1, blue: 1 },
                  bold: true,
                  fontSize: 10
                }
              }
            },
            fields:
              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
          }
        },
        {
          updateSheetProperties: {
            properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
            fields: "gridProperties.frozenRowCount"
          }
        },
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId,
              dimension: "COLUMNS",
              startIndex: 0,
              endIndex: columnCount
            }
          }
        }
      ]
    }
  });
}

/** Verifies the spreadsheet is reachable with the current credentials. */
export async function getSpreadsheetMeta(spreadsheetId: string) {
  const client = getClient();
  const { data } = await client.request<{
    spreadsheetUrl: string;
    sheets: { properties: { sheetId: number; title: string } }[];
  }>({
    url: `${SHEETS_API}/${spreadsheetId}?fields=spreadsheetUrl,sheets.properties(sheetId,title)`,
    method: "GET"
  });

  return {
    spreadsheetUrl: data.spreadsheetUrl,
    sheetId: data.sheets?.[0]?.properties?.sheetId ?? 0,
    sheetTitle: data.sheets?.[0]?.properties?.title ?? "Sheet1"
  };
}

/** Renames a tab (used to normalize a client-created sheet's first tab). */
export async function renameSheet(
  spreadsheetId: string,
  sheetId: number,
  title: string
) {
  const client = getClient();
  await client.request({
    url: `${SHEETS_API}/${spreadsheetId}:batchUpdate`,
    method: "POST",
    data: {
      requests: [
        {
          updateSheetProperties: {
            properties: { sheetId, title },
            fields: "title"
          }
        }
      ]
    }
  });
}
