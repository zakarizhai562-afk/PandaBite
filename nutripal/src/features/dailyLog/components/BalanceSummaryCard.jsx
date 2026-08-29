// Balance summary card shown on Daily Result screen
// Shows checkmarks for covered groups, flags for missing groups

const GROUPS = [
  { key: 'carbs', label: 'Energy', emoji: '⚡' },
  { key: 'protein', label: 'Growth', emoji: '💪' },
  { key: 'vitamins', label: 'Health', emoji: '🌿' },
];

export default function BalanceSummaryCard({ result }) {
  return (
    <div className="balance-summary">
      {GROUPS.map(({ key, label, emoji }) => {
        const covered = result.coveredGroups.includes(key);
        return (
          <div key={key} className={`balance-row ${covered ? 'covered' : 'missing'}`}>
            <span>{covered ? '✓' : '✗'}</span>
            <span>{emoji} {label}</span>
          </div>
        );
      })}
      {result.whoaCount > 0 && (
        <div className="balance-row missing">
          <span>⚠</span>
          <span>Treats: {result.whoaCount}</span>
        </div>
      )}
    </div>
  );
}
