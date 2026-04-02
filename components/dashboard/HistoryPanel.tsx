"use client";

interface HistoryPanelProps<T> {
  items: T[];
  selected: T | null;
  onSelect: (item: T) => void;
  onNew: () => void;
  getLabel: (item: T) => string;
  getSub: (item: T) => string;
  newLabel: string;
}

export default function HistoryPanel<T extends { id: string; created_at: string }>({
  items,
  selected,
  onSelect,
  onNew,
  getLabel,
  getSub,
  newLabel,
}: HistoryPanelProps<T>) {
  return (
    <div
      className="w-56 shrink-0 flex flex-col border-r border-gray-100 bg-white overflow-y-auto"
      style={{ minHeight: 0 }}
    >
      <div className="p-3 border-b border-gray-100">
        <button onClick={onNew} className="btn-primary w-full text-xs py-2">
          + {newLabel}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-xs text-gray-400 text-center">No history yet</p>
        </div>
      ) : (
        <div className="flex-1 p-2 space-y-0.5">
          {items.map((item) => {
            const active = selected?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="w-full text-left px-3 py-2.5 rounded-lg transition-colors"
                style={
                  active
                    ? { background: "var(--color-brand-50)" }
                    : { background: "transparent" }
                }
              >
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: active ? "var(--color-brand-700)" : "#374151" }}
                >
                  {getLabel(item)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{getSub(item)}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}