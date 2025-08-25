import React from "react";

type Props = { color: string };

const Legend: React.FC<Props> = ({ color }) => {
  return (
    <footer className="w-full max-w-5xl flex items-center gap-3 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-5 h-5 rounded border"
          style={{ background: color }}
        />
        <span>
          Aktywny kolor:{" "}
          <code className="px-1 py-0.5 bg-gray-100 rounded">{color}</code>
        </span>
      </div>
    </footer>
  );
};

export default Legend;
