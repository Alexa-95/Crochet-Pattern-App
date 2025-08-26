import React from "react";

type Props = {
  rows: number;
  cols: number;
  cellSize: number;
  color: string;
  setRows: (v: number) => void;
  setCols: (v: number) => void;
  setCellSize: (v: number) => void;
  setColor: (v: string) => void;
  onClear: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
};

const Controls: React.FC<Props> = ({
  rows,
  cols,
  cellSize,
  color,
  setRows,
  setCols,
  setCellSize,
  setColor,
  onClear,
  onExportPNG,
  onExportPDF,
  onExportJson,
  onImportJson,

}) => {
  return (
    <section className="w-full max-w-5xl grid md:grid-cols-2 gap-4 items-end">
      <div className="grid grid-cols-3 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-gray-500">
            Wiersze
          </span>
          <input
            type="number"
            min={1}
            max={200}
            value={rows}
            onChange={(e) =>
              setRows(Math.max(1, Math.min(200, Number(e.currentTarget.value))))
            }
            className="border rounded-xl px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-gray-500">
            Kolumny
          </span>
          <input
            type="number"
            min={1}
            max={200}
            value={cols}
            onChange={(e) =>
              setCols(Math.max(1, Math.min(200, Number(e.currentTarget.value))))
            }
            className="border rounded-xl px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-gray-500">
            Rozmiar kratki (px)
          </span>
          <input
            type="number"
            min={8}
            max={48}
            value={cellSize}
            onChange={(e) =>
              setCellSize(
                Math.max(8, Math.min(48, Number(e.currentTarget.value)))
              )
            }
            className="border rounded-xl px-3 py-2"
          />
        </label>
      </div>

      <div className="flex items-end gap-3 flex-wrap">
        <label className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wide text-gray-500">
            Kolor
          </span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.currentTarget.value)}
            className="h-10 w-14 border rounded-lg"
            aria-label="Wybierz kolor"
          />
        </label>

        <button
          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 border"
          onClick={onClear}
        >
          Wyczyść
        </button>

        <button
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={onExportPNG}
        >
          Eksportuj PNG
        </button>

        <button
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={onExportPDF}
        >
          Eksportuj PDF
        </button>
        <button
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={onExportJson}
        >
          Eksportuj JSON
        </button>
        <div>
          <input
            id="import-json-input"
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onImportJson(file);
                e.currentTarget.value = "";
              }
            }}
          />
          <label htmlFor="import-json-input">
            <span className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 cursor-pointer inline-block">
              Importuj JSON
            </span>
          </label>
        </div>
      </div>
    </section>
  );
};

export default Controls;
