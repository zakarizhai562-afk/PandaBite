import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';

export default function FoodEntryCard({ food, onRemove, isOnPlate = false }) {
  const [imgError, setImgError] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `food-${food.id}-${isOnPlate ? 'plate' : 'box'}`,
    data: { food, isOnPlate },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
      }
    : undefined;

  const fallback = (
    <div className="food-img-fallback" aria-label={food.name.en}>
      {food.name.en.slice(0, 2).toUpperCase()}
    </div>
  );

  if (isOnPlate) {
    return (
      <div className="plate-item" onClick={onRemove} title="Tap to remove">
        {!imgError ? (
          <img src={food.image} alt={food.name.en} onError={() => setImgError(true)} />
        ) : (
          fallback
        )}
        <span className="food-name">{food.name.en}</span>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`food-card ${isDragging ? 'dragging' : ''}`}
      style={style}
      {...listeners}
      {...attributes}
    >
      {!imgError ? (
        <img src={food.image} alt={food.name.en} onError={() => setImgError(true)} />
      ) : (
        fallback
      )}
      <span className="food-name">{food.name.en}</span>
      <span className={`food-tier tier-${food.tier.toLowerCase()}`}>{food.tier}</span>
    </div>
  );
}
