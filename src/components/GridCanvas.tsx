import React, { useEffect, useMemo, useRef } from "react";
import type { Grid } from "../types";
import type { Mode } from "../types";

type Props = {
  rows: number;
  cols: number;
  cellSize: number;
  color: string;
  grid: Grid;
  setCell: (index: number, newColor: string) => void;
};

const GridCanvas: React.FC<Props> = ({
  rows,
  cols,
  cellSize,
  color,
  grid,
  setCell,
}) => {
  const isPaintingRef = useRef<boolean>(false);
  const modeRef = useRef<Mode>("paint");
  const gridRef = useRef<Grid>(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  const gridStyle: React.CSSProperties = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
      gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      gap: 1,
      background: "#e5e7eb",
      padding: 4,
      userSelect: "none",
      touchAction: "none",
    }),
    [cols, rows, cellSize]
  );

  const handlePointerDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ): void => {
    e.preventDefault();
    const hasColor = !!gridRef.current[index];
    modeRef.current = hasColor ? "erase" : "paint";
    isPaintingRef.current = true;
    setCell(index, hasColor ? "" : color);
  };

  const handlePointerEnter = (
    _e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ): void => {
    if (!isPaintingRef.current) return;
    if (modeRef.current === "paint") setCell(index, color);
    else setCell(index, "");
  };

  useEffect(() => {
    const stopPainting = (): void => {
      isPaintingRef.current = false;
    };
    window.addEventListener("mouseup", stopPainting);
    window.addEventListener("touchend", stopPainting);
    return () => {
      window.removeEventListener("mouseup", stopPainting);
      window.removeEventListener("touchend", stopPainting);
    };
  }, []);

  return (
    <section className="w-full overflow-auto p-4">
      <div style={gridStyle}>
        {grid.map((c: string, i: number) => (
          <div
            key={i}
            onMouseDown={(e) => handlePointerDown(e, i)}
            onMouseEnter={(e) => handlePointerEnter(e, i)}
            onContextMenu={(e) => e.preventDefault()}
            className="rounded-sm shadow-sm border border-gray-200"
            style={{
              width: cellSize,
              height: cellSize,
              background: c || "white",
            }}
            title={`(${Math.floor(i / cols) + 1}, ${(i % cols) + 1})`}
          />
        ))}
      </div>
    </section>
  );
};

export default GridCanvas;
