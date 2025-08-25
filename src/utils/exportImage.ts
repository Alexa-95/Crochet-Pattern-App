import { jsPDF } from "jspdf";
import type { Grid } from "../types";

export function drawToCanvas(
  grid: Grid,
  rows: number,
  cols: number,
  cellSize: number
): HTMLCanvasElement {
  const gap = 1 as const;
  const w = cols * cellSize + (cols - 1) * gap + 8;
  const h = rows * cellSize + (rows - 1) * gap + 8;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  let idx = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const c = grid[idx++] || "#ffffff";
      const px = 4 + x * (cellSize + gap);
      const py = 4 + y * (cellSize + gap);
      ctx.fillStyle = c;
      ctx.fillRect(px, py, cellSize, cellSize);
      ctx.strokeStyle = "#e5e7eb";
      ctx.strokeRect(px + 0.5, py + 0.5, cellSize - 1, cellSize - 1);
    }
  }
  return canvas;
}

export function exportPNG(
  grid: Grid,
  rows: number,
  cols: number,
  cellSize: number
): void {
  const canvas = drawToCanvas(grid, rows, cols, cellSize);
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = "wzor.png";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function exportPDF(
  grid: Grid,
  rows: number,
  cols: number,
  cellSize: number
): void {
  const canvas = drawToCanvas(grid, rows, cols, cellSize);
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const imgW = canvas.width;
  const imgH = canvas.height;
  const scale = Math.min((pageW - 72) / imgW, (pageH - 72) / imgH);
  const drawW = imgW * scale;
  const drawH = imgH * scale;
  const x = (pageW - drawW) / 2;
  const y = (pageH - drawH) / 2;

  pdf.addImage(canvas.toDataURL("image/png"), "PNG", x, y, drawW, drawH);
  pdf.save("wzor.pdf");
}
