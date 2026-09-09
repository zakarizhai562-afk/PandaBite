import { useDroppable } from '@dnd-kit/core';

// A basket drop target. Matches the Python reference's Basket.draw()
// (old/game/basket.py): a stronger "yes!" glow+scale+sparkles when the food
// currently being dragged is over the CORRECT basket, a neutral gold glow
// when hovered but not correct, and a soft pale-blue hint glow briefly shown
// on the correct basket after a wrong answer.
export default function PuzzleBasket({ basket, isCorrectDragTarget, isHinted }) {
  const { isOver, setNodeRef } = useDroppable({ id: basket.id });

  let stateClass = '';
  if (isOver && isCorrectDragTarget) stateClass = 'puzzle-basket--correct-over';
  else if (isOver) stateClass = 'puzzle-basket--over';
  else if (isHinted) stateClass = 'puzzle-basket--hint';

  return (
    <div ref={setNodeRef} className={`puzzle-basket ${stateClass}`} data-testid={`basket-${basket.id}`}>
      {isOver && <div className="puzzle-basket__drop-hint">Drop Here!</div>}

      <div className="puzzle-basket__image-wrap">
        <img src={basket.image} alt={basket.name} className="puzzle-basket__image" draggable={false} />
        {isOver && isCorrectDragTarget && (
          <>
            <span className="puzzle-basket__sparkle puzzle-basket__sparkle--tl">✦</span>
            <span className="puzzle-basket__sparkle puzzle-basket__sparkle--tr">✦</span>
          </>
        )}
      </div>

      <div
        className={`puzzle-basket__label ${isOver ? 'puzzle-basket__label--emphasize' : ''} ${isOver && isCorrectDragTarget ? 'puzzle-basket__label--correct' : ''}`}
        style={{ borderColor: basket.themeColor, color: basket.themeColor }}
      >
        <div className="puzzle-basket__label-title">{basket.shortLabel.toUpperCase()}</div>
        <div className="puzzle-basket__label-sub">{basket.subtitle}</div>
      </div>
    </div>
  );
}
