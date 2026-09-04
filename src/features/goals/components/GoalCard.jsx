import BilingualText from '../../../core/components/BilingualText';

const GOAL_ICONS = {
  'grow-taller': '🌱',
  'more-energy': '⚡',
};

export default function GoalCard({ goal, onSelect }) {
  return (
    <div
      className="goal-card tarot-card"
      onClick={() => onSelect(goal.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(goal.id); }}
    >
      <div className="tarot-card-art">
        <span className="goal-card-icon">{GOAL_ICONS[goal.id] || '✨'}</span>
      </div>
      <BilingualText my={goal.name.my} en={goal.name.en} />
    </div>
  );
}
