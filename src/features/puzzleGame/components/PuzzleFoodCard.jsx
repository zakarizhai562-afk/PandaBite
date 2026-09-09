import { useDraggable } from '@dnd-kit/core';

// The falling/draggable food sprite. Matches the Python reference's
// Food.draw() (old/game/food.py): just the bare image with a soft shadow,
// a gentle side-to-side wobble + vertical bob while falling, and a slight
// "lift" scale (no wobble) while being dragged -- no card, no name label,
// no tier badge, same as the Python art.
export default function PuzzleFoodCard({ food, disabled = false }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: 'puzzle-food',
    data: { food },
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      className={`puzzle-food ${isDragging ? 'puzzle-food--dragging' : ''}`}
      {...(disabled ? {} : listeners)}
      {...(disabled ? {} : attributes)}
      data-testid="puzzle-food"
    >
      <div className="puzzle-food__shadow" />
      <div className={`puzzle-food__image-wrap ${!isDragging && !disabled ? 'puzzle-food__bob' : ''}`}>
        <div className={!isDragging && !disabled ? 'puzzle-food__wobble' : ''}>
          <img src={food.image} alt={food.name} className="puzzle-food__image" draggable={false} />
        </div>
      </div>
    </div>
  );
}
