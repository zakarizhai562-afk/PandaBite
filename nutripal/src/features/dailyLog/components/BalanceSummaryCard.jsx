// Balance summary card shown on Daily Result screen
// Shows checkmarks for covered groups, flags for missing groups

export default function BalanceSummaryCard({ result }) {
  const groups = [
    { key: 'carbs', label: 'Energy' },
    { key: 'protein', label: 'Growth' },
    { key: 'vitamins', label: 'Health' },
  ];

  return (
    <div className="balance-summary">
      {groups.map(({ key, label }) => {
        const covered = result.coveredGroups.includes(key);
        return (
          <div key={key} className={covered ? 'covered' : 'missing'}>
            {covered ? '✓' : '✗'} {label}
          </div>
        );
      })}
    </div>
  );
}
