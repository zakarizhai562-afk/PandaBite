import { useDroppable } from '@dnd-kit/core';
import { useState } from 'react';
import { usePandaTallFrame } from '../hooks/usePandaTallFrame';
import { usePandaSkinFrame } from '../hooks/usePandaSkinFrame';
import { usePandaEnergyFrame } from '../hooks/usePandaEnergyFrame';

function TallPandaFeedTarget({ isAnimating, reactionState }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'panda-feed-target' });
  const showGrowth = reactionState === 'correct' || reactionState === 'complete';
  const frameSrc = usePandaTallFrame(reactionState);

  return (
    <div
      ref={setNodeRef}
      className={`tall-panda-target${isOver ? ' tall-panda-target--over' : ''}`}
    >
      <div className="tall-panda-stage">
        {showGrowth && (
          <div className="tall-growth-badge">
            <span className="tall-growth-arrow">▲</span>
            <span>+ Taller!</span>
          </div>
        )}
        <img
          key={reactionState}
          src={frameSrc}
          alt="Red Panda"
          className={`tall-panda-img${isAnimating ? ' tall-panda-img--bounce' : ''}${reactionState === 'complete' ? ' tall-panda-img--big' : ''}`}
        />
        <div className="tall-panda-ground" />
      </div>
      <div className="tall-panda-speech">
        {isOver ? 'Drop here!' : 'Drag the food to me!'}
      </div>
    </div>
  );
}

function SkinPandaFeedTarget({ isAnimating, reactionState }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'panda-feed-target' });
  const showGlow = reactionState === 'correct' || reactionState === 'complete';
  const frameSrc = usePandaSkinFrame(reactionState);

  return (
    <div
      ref={setNodeRef}
      className={`skin-panda-target${isOver ? ' skin-panda-target--over' : ''}`}
    >
      <div className="skin-panda-stage">
        {showGlow && (
          <div className="skin-glow-badge">
            <span className="skin-glow-sparkle">✨</span>
            <span>Glowing!</span>
          </div>
        )}
        <img
          key={reactionState}
          src={frameSrc}
          alt="Red Panda"
          className={`skin-panda-img${isAnimating ? ' skin-panda-img--bounce' : ''}${reactionState === 'complete' ? ' skin-panda-img--big' : ''}`}
        />
        <div className="skin-panda-ground" />
      </div>
      <div className="skin-panda-speech">
        {isOver ? 'Drop here!' : 'Drag the food to me!'}
      </div>
    </div>
  );
}

function EnergyPandaFeedTarget({ isAnimating, reactionState }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'panda-feed-target' });
  const showBoost = reactionState === 'correct' || reactionState === 'complete';
  const frameSrc = usePandaEnergyFrame(reactionState);

  return (
    <div
      ref={setNodeRef}
      className={`energy-panda-target${isOver ? ' energy-panda-target--over' : ''}`}
    >
      <div className="energy-panda-stage">
        {showBoost && (
          <div className="energy-boost-badge">
            <span className="energy-boost-bolt">⚡</span>
            <span>Energized!</span>
          </div>
        )}
        <img
          key={reactionState}
          src={frameSrc}
          alt="Red Panda"
          className={`energy-panda-img${isAnimating ? ' energy-panda-img--bounce' : ''}${reactionState === 'complete' ? ' energy-panda-img--big' : ''}`}
        />
        <div className="energy-panda-ground" />
      </div>
      <div className="energy-panda-speech">
        {isOver ? 'Drop here!' : 'Drag the food to me!'}
      </div>
    </div>
  );
}

function DefaultPandaFeedTarget({ isAnimating }) {
  const [imgError, setImgError] = useState(false);
  const { isOver, setNodeRef } = useDroppable({ id: 'panda-feed-target' });

  return (
    <div
      ref={setNodeRef}
      className="panda-feed-target"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        transition: 'transform 0.2s',
        transform: isOver ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      {!imgError ? (
        <img
          src="/panda/panda_encouraging.png"
          alt="Red Panda"
          onError={() => setImgError(true)}
          style={{
            width: '160px',
            height: '160px',
            objectFit: 'contain',
            animation: isAnimating ? 'panda-bounce 0.5s ease' : 'none',
          }}
        />
      ) : (
        <div
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            backgroundColor: '#C9673A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            animation: isAnimating ? 'panda-bounce 0.5s ease' : 'none',
          }}
        >
          🐾
        </div>
      )}
      <p
        style={{
          marginTop: '8px',
          fontFamily: 'Cambria, Georgia, serif',
          fontSize: '14px',
          color: '#5B6B61',
        }}
      >
        {isOver ? 'Drop here!' : 'Drag food to the panda!'}
      </p>
      <style>{`
        @keyframes panda-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}

export default function PandaFeedTarget({ isAnimating, goalId, reactionState }) {
  if (goalId === 'grow-taller') {
    return <TallPandaFeedTarget isAnimating={isAnimating} reactionState={reactionState} />;
  }
  if (goalId === 'clear-skin') {
    return <SkinPandaFeedTarget isAnimating={isAnimating} reactionState={reactionState} />;
  }
  if (goalId === 'more-energy') {
    return <EnergyPandaFeedTarget isAnimating={isAnimating} reactionState={reactionState} />;
  }
  return <DefaultPandaFeedTarget isAnimating={isAnimating} />;
}
