import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';

export default function PuzzleFoodCard({ food, disabled = false, isFloatingScore = false }) {
  const [imgError, setImgError] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `puzzle-food-${food.id}`,
    data: { food },
    disabled,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 500,
      }
    : undefined;

  const fallback = (
    <div className="puzzle-food__fallback" aria-label={food.name.en}>
      {food.name.en.slice(0, 2).toUpperCase()}
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      className={`puzzle-food ${isDragging ? 'puzzle-food--dragging' : ''} ${disabled ? 'puzzle-food--disabled' : ''}`}
      style={style}
      {...(disabled ? {} : listeners)}
      {...(disabled ? {} : attributes)}
      data-testid="puzzle-food"
    >
      <div className="puzzle-food__shadow" />
      <div className={`puzzle-food__image-wrap ${!isDragging && !disabled ? 'puzzle-food__wobble' : ''}`}>
        {!imgError ? (
          <img
            src={food.image}
            alt={food.name.en}
            className="puzzle-food__image"
            onError={() => setImgError(true)}
            draggable={false}
          />
        ) : (
          fallback
        )}
      </div>
      <div className="puzzle-food__name">{food.name.en}</div>
      {food.tier && <div className={`puzzle-food__tier tier-${food.tier.toLowerCase()}`}>{food.tier}</div>}
      {isFloatingScore && <div className="puzzle-food__floating-score">+10 ⭐</div>}
    </div>
  );
}
