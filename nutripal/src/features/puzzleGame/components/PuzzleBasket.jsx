import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function PuzzleBasket({ basket, isCorrectTarget, isHinted }) {
  const [imgError, setImgError] = useState(false);
  const { isOver, setNodeRef } = useDroppable({ id: basket.id });

  const isOverCorrect = isOver && isCorrectTarget;
  const isOverWrong = isOver && !isCorrectTarget;

  let containerClass = 'puzzle-basket';
  let borderStyle = {};
  let scaleStyle = {};

  if (isOverCorrect) {
    containerClass += ' puzzle-basket--correct-over';
    borderStyle = { borderColor: '#46C35A', boxShadow: '0 0 20px rgba(70,195,90,0.5)' };
    scaleStyle = { transform: 'scale(1.06)' };
  } else if (isOverWrong) {
    containerClass += ' puzzle-basket--over';
    borderStyle = { borderColor: '#FFD700', boxShadow: '0 0 16px rgba(255,215,0,0.4)' };
    scaleStyle = { transform: 'scale(1.03)' };
  } else if (isHinted) {
    containerClass += ' puzzle-basket--hint';
    borderStyle = { borderColor: '#BEDCFF', boxShadow: '0 0 14px rgba(190,220,255,0.6)' };
  }

  return (
    <div
      ref={setNodeRef}
      className={containerClass}
      style={borderStyle}
      data-testid={`basket-${basket.id}`}
    >
      {isOver && <div className="puzzle-basket__drop-hint">Drop Here!</div>}

      <div className="puzzle-basket__image-wrap" style={scaleStyle}>
        {!imgError ? (
          <img
            src={basket.image}
            alt={basket.fullName}
            className="puzzle-basket__image"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="puzzle-basket__fallback"
            style={{ backgroundColor: basket.fallbackColor }}
          >
            {basket.shortLabel}
          </div>
        )}
        {isOverCorrect && (
          <>
            <span className="puzzle-basket__sparkle puzzle-basket__sparkle--tl">✦</span>
            <span className="puzzle-basket__sparkle puzzle-basket__sparkle--tr">✦</span>
          </>
        )}
      </div>

      <div
        className={`puzzle-basket__label ${isOver ? 'puzzle-basket__label--emphasize' : ''} ${isOverCorrect ? 'puzzle-basket__label--correct' : ''}`}
        style={{ borderColor: basket.themeColor, color: basket.themeColor }}
      >
        <div className="puzzle-basket__label-title">{basket.shortLabel}</div>
        <div className="puzzle-basket__label-sub">{basket.subtitle}</div>
      </div>
    </div>
  );
}
