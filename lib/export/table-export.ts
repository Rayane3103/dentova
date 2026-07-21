export type ExportColumn<T> = {
  header: string;
  value: (row: T) => string | number | null | undefined;
  /** Approximate column width (characters) used for Excel/PDF layout. */
  width?: number;
};

export type ExportFormat = "csv" | "excel" | "pdf";

export type ExportOptions<T> = {
  format: ExportFormat;
  filename: string;
  title: string;
  columns: ExportColumn<T>[];
  rows: T[];
  subtitle?: string;
};

// Dentova brand palette (hex without leading # for ExcelJS ARGB).
const NAVY = "14123A";
const TEAL = "73CBD5";

function cell<T>(column: ExportColumn<T>, row: T): string {
  const raw = column.value(row);
  if (raw == null) return "";
  return String(raw);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function timestamp() {
  return new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function exportCsv<T>({ columns, rows, filename }: ExportOptions<T>) {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const headerLine = columns.map((column) => escape(column.header)).join(";");
  const dataLines = rows.map((row) =>
    columns.map((column) => escape(cell(column, row))).join(";")
  );
  // BOM so Excel opens UTF-8 (accents) correctly.
  const content = `﻿${[headerLine, ...dataLines].join("\r\n")}`;
  triggerDownload(
    new Blob([content], { type: "text/csv;charset=utf-8;" }),
    `${filename}.csv`
  );
}

async function exportExcel<T>({
  columns,
  rows,
  filename,
  title
}: ExportOptions<T>) {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Dentova";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Export", {
    views: [{ state: "frozen", ySplit: 3 }]
  });

  const lastColumn = String.fromCharCode(64 + columns.length);

  // Title row.
  sheet.mergeCells(`A1:${lastColumn}1`);
  const titleCell = sheet.getCell("A1");
  titleCell.value = title;
  titleCell.font = { size: 15, bold: true, color: { argb: `FF${NAVY}` } };
  titleCell.alignment = { vertical: "middle" };
  sheet.getRow(1).height = 26;

  // Subtitle / generated date row.
  sheet.mergeCells(`A2:${lastColumn}2`);
  const subtitleCell = sheet.getCell("A2");
  subtitleCell.value = `Généré le ${timestamp()} · ${rows.length} entrée(s)`;
  subtitleCell.font = { size: 10, italic: true, color: { argb: "FF64748B" } };

  // Header row (row 3).
  const headerRow = sheet.getRow(3);
  columns.forEach((column, index) => {
    const headerCell = headerRow.getCell(index + 1);
    headerCell.value = column.header;
    headerCell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${NAVY}` }
    };
    headerCell.alignment = { vertical: "middle", horizontal: "left" };
    headerCell.border = {
      bottom: { style: "thin", color: { argb: `FF${TEAL}` } }
    };
  });
  headerRow.height = 20;

  // Data rows.
  rows.forEach((row, rowIndex) => {
    const dataRow = sheet.addRow(columns.map((column) => cell(column, row)));
    if (rowIndex % 2 === 1) {
      dataRow.eachCell((dataCell) => {
        dataCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF4F3FA" }
        };
      });
    }
    dataRow.alignment = { vertical: "top", wrapText: true };
  });

  // Column widths + autofilter.
  columns.forEach((column, index) => {
    sheet.getColumn(index + 1).width = column.width ?? 22;
  });
  sheet.autoFilter = { from: { row: 3, column: 1 }, to: { row: 3, column: columns.length } };

  const buffer = await workbook.xlsx.writeBuffer();
  triggerDownload(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }),
    `${filename}.xlsx`
  );
}

async function exportPdf<T>({
  columns,
  rows,
  filename,
  title,
  subtitle
}: ExportOptions<T>) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Branded header band.
  doc.setFillColor(20, 18, 58); // navy
  doc.rect(0, 0, pageWidth, 54, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("DENTOVA", 40, 26);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(title, 40, 44);
  doc.setFontSize(9);
  doc.setTextColor(180, 180, 200);
  doc.text(
    `Généré le ${timestamp()} · ${rows.length} entrée(s)`,
    pageWidth - 40,
    44,
    { align: "right" }
  );

  autoTable(doc, {
    startY: 70,
    head: [columns.map((column) => column.header)],
    body: rows.map((row) => columns.map((column) => cell(column, row))),
    styles: {
      fontSize: 8,
      cellPadding: 5,
      overflow: "linebreak",
      valign: "top"
    },
    headStyles: {
      fillColor: [20, 18, 58],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      lineWidth: { bottom: 1.2 },
      lineColor: [115, 203, 213]
    },
    alternateRowStyles: { fillColor: [244, 243, 250] },
    margin: { left: 40, right: 40 },
    didDrawPage: () => {
      const pageCount = doc.getNumberOfPages();
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 160);
      doc.text(
        subtitle ?? "Dentova — Formations dentaires premium",
        40,
        pageHeight - 16
      );
      doc.text(
        `Page ${doc.getCurrentPageInfo().pageNumber} / ${pageCount}`,
        pageWidth - 40,
        pageHeight - 16,
        { align: "right" }
      );
    }
  });

  doc.save(`${filename}.pdf`);
}

export async function exportTable<T>(options: ExportOptions<T>) {
  if (options.format === "csv") {
    exportCsv(options);
    return;
  }

  if (options.format === "excel") {
    await exportExcel(options);
    return;
  }

  await exportPdf(options);
}
