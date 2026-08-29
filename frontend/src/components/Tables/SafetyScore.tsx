interface SafetyScoreProps {
  score: number;
}

export default function SafetyScore({ score }: SafetyScoreProps) {
  return (
    <div className="flex items-center">
      <div className="w-full bg-[var(--color-3)] rounded-full h-2 mr-2 max-w-[100px]">
        <div 
          className={`h-2 rounded-full ${score > 80 ? 'bg-[var(--color-1)]' : score > 60 ? 'bg-[var(--color-2)]' : 'bg-[var(--color-1)]'}`} 
          style={{width: `${score}%`}}
        ></div>
      </div>
      <span className="text-xs font-semibold text-[var(--color-1)]">{score}</span>
    </div>
  );
}
