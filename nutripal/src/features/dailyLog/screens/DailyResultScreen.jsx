import MascotBubble from '../../../core/components/MascotBubble';
import BalanceSummaryCard from '../components/BalanceSummaryCard';

export default function DailyResultScreen() {
  // TODO: read calculation result from navigation state or context
  const result = {
    coveredGroups: [],
    missingGroups: ['carbs', 'protein', 'vitamins'],
    whoaCount: 0,
    isBalanced: false,
  };

  return (
    <div className="daily-result-screen">
      <MascotBubble text={null} />
      <BalanceSummaryCard result={result} />
      {/* TODO: Stars awarded indicator */}
      <button onClick={() => { /* TODO: navigate to /home */ }}>Continue</button>
    </div>
  );
}
