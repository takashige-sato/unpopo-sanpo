export function PawTrack({ className = "" }: { className?: string }) {
  const paws = Array.from({ length: 20 });
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <div className="paw-track gap-8 opacity-50">
        {paws.concat(paws).map((_, i) => (
          <span
            key={i}
            className="text-2xl"
            style={{ transform: i % 2 ? "translateY(8px) rotate(8deg)" : "rotate(-8deg)" }}
          >
            🐾
          </span>
        ))}
      </div>
    </div>
  );
}
