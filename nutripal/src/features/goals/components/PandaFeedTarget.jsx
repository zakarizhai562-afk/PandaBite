import { useDroppable } from '@dnd-kit/core';
import { useState } from 'react';

export default function PandaFeedTarget({ isAnimating }) {
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
          src="/panda/panda_happy.svg"
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
          &#128060;
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
