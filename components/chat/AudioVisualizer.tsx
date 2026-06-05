'use client';

interface AudioVisualizerProps {
  frequencyData: Uint8Array | null;
  isActive: boolean;
}

export function AudioVisualizer({ frequencyData, isActive }: AudioVisualizerProps) {
  const barCount = 6;
  const bars = Array.from({ length: barCount }, (_, i) => {
    if (!frequencyData) return 0;
    const index = Math.floor((i / barCount) * frequencyData.length);
    return frequencyData[index] || 0;
  });

  return (
    <div className="flex items-center gap-1 h-8">
      {bars.map((height, i) => (
        <div
          key={i}
          className="flex-1 bg-gradient-to-t from-teal-accent to-teal-accent rounded-full transition-all duration-75"
          style={{
            height: isActive ? `${Math.max(8, (height / 255) * 100)}%` : '8px',
            opacity: isActive ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}
