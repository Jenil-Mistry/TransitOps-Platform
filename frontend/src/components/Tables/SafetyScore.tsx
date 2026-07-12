interface SafetyScoreProps {
  score: number;
}

export default function SafetyScore({ score }: SafetyScoreProps) {
  return (
    <div className="flex items-center">
      <div className="w-full bg-[#ECECEC] rounded-full h-2 mr-2 max-w-[100px]">
        <div 
          className={`h-2 rounded-full ${score > 80 ? 'bg-[#16A34A]' : score > 60 ? 'bg-[#F59E0B]' : 'bg-[#DC2626]'}`} 
          style={{width: `${score}%`}}
        ></div>
      </div>
      <span className="text-xs font-semibold text-[#111111]">{score}</span>
    </div>
  );
}
