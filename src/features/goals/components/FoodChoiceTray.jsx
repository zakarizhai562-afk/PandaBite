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
    opacity: isDragging || disabled ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
    cursor: disabled ? 'not-allowed' : 'grab',
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

function TallDraggableFoodChoice({ foodId, disabled, badge }) {
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
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`tall-food-chip${badge ? ` tall-food-chip--${badge}` : ''}${isDragging ? ' tall-food-chip--dragging' : ''}${disabled ? ' tall-food-chip--disabled' : ''}`}
    >
      {badge && (
        <span className={`tall-food-badge tall-food-badge--${badge}`}>
          {badge === 'correct' ? '✓' : '✕'}
        </span>
      )}
      <div className="tall-food-chip-art">
        {!imgError ? (
          <img src={food.image} alt={food.name.en} onError={() => setImgError(true)} />
        ) : (
          <span className="tall-food-chip-fallback">{food.name.en}</span>
        )}
      </div>
      <p className="tall-food-chip-label">{food.name.en}</p>
    </div>
  );
}

function TallFoodChoiceTray({ foodChoices, resolvedFoods, results }) {
  return (
    <div className="tall-food-frame">
      <div className="tall-food-grid">
        {foodChoices.map((foodId) => {
          const result = results?.[foodId];
          const badge = result?.resolved ? 'correct' : result?.wrongAttempted ? 'wrong' : null;
          return (
            <TallDraggableFoodChoice
              key={foodId}
              foodId={foodId}
              disabled={resolvedFoods.includes(foodId)}
              badge={badge}
            />
          );
        })}
      </div>
    </div>
  );
}

function SkinDraggableFoodChoice({ foodId, disabled, badge }) {
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
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`skin-food-chip${badge ? ` skin-food-chip--${badge}` : ''}${isDragging ? ' skin-food-chip--dragging' : ''}${disabled ? ' skin-food-chip--disabled' : ''}`}
    >
      {badge && (
        <span className={`skin-food-badge skin-food-badge--${badge}`}>
          {badge === 'correct' ? '✓' : '✕'}
        </span>
      )}
      <div className="skin-food-chip-art">
        {!imgError ? (
          <img src={food.image} alt={food.name.en} onError={() => setImgError(true)} />
        ) : (
          <span className="skin-food-chip-fallback">{food.name.en}</span>
        )}
      </div>
      <p className="skin-food-chip-label">{food.name.en}</p>
    </div>
  );
}

function SkinFoodChoiceTray({ foodChoices, resolvedFoods, results }) {
  return (
    <div className="skin-food-frame">
      <div className="skin-food-grid">
        {foodChoices.map((foodId) => {
          const result = results?.[foodId];
          const badge = result?.resolved ? 'correct' : result?.wrongAttempted ? 'wrong' : null;
          return (
            <SkinDraggableFoodChoice
              key={foodId}
              foodId={foodId}
              disabled={resolvedFoods.includes(foodId)}
              badge={badge}
            />
          );
        })}
      </div>
    </div>
  );
}

function EnergyDraggableFoodChoice({ foodId, disabled, badge }) {
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
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`energy-food-chip${badge ? ` energy-food-chip--${badge}` : ''}${isDragging ? ' energy-food-chip--dragging' : ''}${disabled ? ' energy-food-chip--disabled' : ''}`}
    >
      {badge && (
        <span className={`energy-food-badge energy-food-badge--${badge}`}>
          {badge === 'correct' ? '✓' : '✕'}
        </span>
      )}
      <div className="energy-food-chip-art">
        {!imgError ? (
          <img src={food.image} alt={food.name.en} onError={() => setImgError(true)} />
        ) : (
          <span className="energy-food-chip-fallback">{food.name.en}</span>
        )}
      </div>
      <p className="energy-food-chip-label">{food.name.en}</p>
    </div>
  );
}

function EnergyFoodChoiceTray({ foodChoices, resolvedFoods, results }) {
  return (
    <div className="energy-food-frame">
      <div className="energy-food-grid">
        {foodChoices.map((foodId) => {
          const result = results?.[foodId];
          const badge = result?.resolved ? 'correct' : result?.wrongAttempted ? 'wrong' : null;
          return (
            <EnergyDraggableFoodChoice
              key={foodId}
              foodId={foodId}
              disabled={resolvedFoods.includes(foodId)}
              badge={badge}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function FoodChoiceTray({ foodChoices, resolvedFoods, goalId, results }) {
  if (goalId === 'grow-taller') {
    return (
      <TallFoodChoiceTray foodChoices={foodChoices} resolvedFoods={resolvedFoods} results={results} />
    );
  }

  if (goalId === 'clear-skin') {
    return (
      <SkinFoodChoiceTray foodChoices={foodChoices} resolvedFoods={resolvedFoods} results={results} />
    );
  }

  if (goalId === 'more-energy') {
    return (
      <EnergyFoodChoiceTray foodChoices={foodChoices} resolvedFoods={resolvedFoods} results={results} />
    );
  }

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
