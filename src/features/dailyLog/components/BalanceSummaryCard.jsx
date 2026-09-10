const GROUPS = [
  { key: 'carbs', label: 'Energy', my: 'အင်အား' },
  { key: 'protein', label: 'Growth', my: 'ကြီးထွားမှု' },
  { key: 'vitamins', label: 'Health', my: 'ကျန်းမာရေး' },
];

export default function BalanceSummaryCard({ result }) {
  return (
    <div className="balance-summary">
      {GROUPS.map(({ key, label, my }) => {
        const covered = result.coveredGroups.includes(key);
        return (
          <div key={key} className={`balance-row ${covered ? 'covered' : 'missing'}`}>
            <span className="balance-row-icon">{covered ? '✓' : '!'}</span>
            <span className="balance-row-text">
              <span>{my}</span>
              <span>{label}</span>
            </span>
          </div>
        );
      })}
      {result.whoaCount > 0 && (
        <div className="balance-row missing">
          <span className="balance-row-icon">!</span>
          <span className="balance-row-text">
            <span>အချို/မုန့်</span>
            <span>Whoa foods: {result.whoaCount}</span>
          </span>
        </div>
      )}
    </div>
  );
}
