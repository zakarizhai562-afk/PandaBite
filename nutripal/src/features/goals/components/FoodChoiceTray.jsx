import { useDraggable } from '@dnd-kit/core';
import { useState } from 'react';
import foodDatabase from '../../../data/foodDatabase.json';

function DraggableFoodChoice({ foodId, disabled }) {
  const [imgError, setImgError] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `food-${foodId}`,
    data: { foodId },
    disabled,
  });

  const food = foodDatabase.foods.find((f) => f.id === foodId);
  if (!food) return null;

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
    cursor: disabled ? 'not-allowed' : 'grab',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="draggable-food"
    >
      {!imgError ? (
        <img
          src={food.image}
          alt={food.name.en}
          onError={() => setImgError(true)}
          style={{
            width: '72px',
            height: '72px',
            objectFit: 'contain',
            borderRadius: '12px',
            border: '2px solid #FFF3E0',
            backgroundColor: '#fff',
          }}
        />
      ) : (
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '12px',
            backgroundColor: '#2D6A4F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: '#FFF3E0',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '4px',
          }}
        >
          {food.name.en}
        </div>
      )}
      <p
        style={{
          fontSize: '11px',
          color: '#1B2B22',
          marginTop: '4px',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {food.name.en}
      </p>
    </div>
  );
}

export default function FoodChoiceTray({ foodChoices, resolvedFoods }) {
  return (
    <div
      className="food-choice-tray"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '12px',
        padding: '16px',
      }}
    >
      {foodChoices.map((foodId) => (
        <DraggableFoodChoice
          key={foodId}
          foodId={foodId}
          disabled={resolvedFoods.includes(foodId)}
        />
      ))}
    </div>
  );
}
