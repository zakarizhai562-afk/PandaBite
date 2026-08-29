import { useDraggable } from '@dnd-kit/core';

// Draggable food card — uses @dnd-kit/core useDraggable
export default function FoodEntryCard({ food, onRemove, isOnPlate = false }) {
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

  if (isOnPlate) {
    return (
      <div
        className="plate-item"
        onClick={onRemove}
        title="Tap to remove"
      >
        <img src={food.image} alt={food.name.en} />
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
      <img src={food.image} alt={food.name.en} />
      <span className="food-name">{food.name.en}</span>
      <span className={`food-tier tier-${food.tier.toLowerCase()}`}>{food.tier}</span>
    </div>
  );
}
