interface CardProps {
  label: string;
  value: string | number;
  note?: string;
}

export function Card({ label, value, note }: CardProps) {
  return (
    <div className="rounded-xl p-4" style={{ background: "var(--color-surface-secondary)" }}>
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      <p className="text-2xl font-medium text-gray-900">{value}</p>
      {note && <p className="text-xs mt-1" style={{ color: "var(--color-brand-500)" }}>{note}</p>}
    </div>
  );
}