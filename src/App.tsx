import React, { useEffect, useState } from "react";
import Controls from "./components/Controls";
import GridCanvas from "./components/GridCanvas";
import Legend from "./components/Legend";
import { exportPDF, exportPNG } from "./utils/exportImage";
import { importJson, exportJson } from "./utils/importExportJson";
import type { Grid } from "./types";

const App: React.FC = () => {
  const [rows, setRows] = useState<number>(16);
  const [cols, setCols] = useState<number>(16);
  const [cellSize, setCellSize] = useState<number>(24);

  const [color, setColor] = useState<string>("#4f46e5");

  const [grid, setGrid] = useState<Grid>(() => Array(16 * 16).fill(""));

  useEffect(() => {
    setGrid((prev: Grid) => {
      const next: Grid = Array(rows * cols).fill("");
      const oldCols = Math.round(Math.sqrt(prev.length));
      const oldRows = Math.ceil(prev.length / oldCols);
      const r = Math.min(rows, oldRows);
      const c = Math.min(cols, oldCols);
      for (let y = 0; y < r; y++) {
        for (let x = 0; x < c; x++) {
          next[y * cols + x] = prev[y * oldCols + x];
        }
      }
      return next;
    });
  }, [rows, cols]);

  const setCell = (index: number, newColor: string): void => {
    setGrid((g) => {
      if (g[index] === newColor) return g;
      const copy = g.slice();
      copy[index] = newColor;
      return copy;
    });
  };

  const clear = (): void => setGrid(Array(rows * cols).fill(""));

  const handleImportJson = async (file: File) => {
    try {
      const { rows, cols, cellSize, grid } = await importJson(file);
      setRows(rows);
      setCols(cols);
      setCellSize(cellSize);
      setGrid(grid);
    } catch (err) {
      console.error(err);
      alert("Nie udało się zaimportować pliku JSON. Sprawdź format.");
    }
  };

  const handleExportJson = () => {
    exportJson(grid, rows, cols, cellSize);
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 p-10 flex flex-col items-center gap-6">
      <header className="w-full flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Crochet Pattern Editor</h1>
        <p className="text-sm text-gray-600">
          Click to color or erase. Clicking an already colored cell = eraser.
          Hold and drag to draw.
        </p>
      </header>

      <Controls
        rows={rows}
        cols={cols}
        cellSize={cellSize}
        color={color}
        setRows={setRows}
        setCols={setCols}
        setCellSize={setCellSize}
        setColor={setColor}
        onClear={clear}
        onExportPNG={() => exportPNG(grid, rows, cols, cellSize)}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />

      <GridCanvas
        rows={rows}
        cols={cols}
        cellSize={cellSize}
        color={color}
        grid={grid}
        setCell={setCell}
      />

      <Legend color={color} />
    </div>
  );
};

export default App;
