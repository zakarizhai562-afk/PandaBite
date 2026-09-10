const GOAL_IMAGES = {
  'grow-taller': '/world_art/grow_taller.png',
  'more-energy': '/world_art/gain_more_energy.png',
  'clear-skin': '/world_art/clear_skin.png',
};

export default function GoalCard({ goal, onSelect }) {
  return (
    <button
      type="button"
      className="goal-card goal-image-card"
      onClick={() => onSelect(goal.id)}
      aria-label={goal.name.en}
    >
      <img
        src={GOAL_IMAGES[goal.id]}
        alt=""
        className="goal-image-card__image"
        draggable="false"
      />
      <span className="goal-image-card__label">
        <span>{goal.name.my}</span>
        <span>{goal.name.en}</span>
      </span>
    </button>
  );
}
