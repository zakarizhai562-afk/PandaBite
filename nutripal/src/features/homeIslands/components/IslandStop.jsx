import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function IslandStop({ image, label, route, position }) {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  const positionStyles = {
    left: { alignSelf: 'flex-start', marginLeft: '8%' },
    right: { alignSelf: 'flex-end', marginRight: '8%' },
  };

  const fallbackColors = {
    '/daily-log': '#2D6A4F',
    '/puzzle': '#FF8C42',
    '/goals': '#C9673A',
  };

  return (
    <div
      className="island-stop"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      style={{
        ...positionStyles[position],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        margin: '16px 0',
        minWidth: '140px',
        minHeight: '44px',
      }}
    >
      {!imgError ? (
        <img
          src={image}
          alt={label.en}
          onError={() => setImgError(true)}
          style={{
            width: '140px',
            height: '140px',
            objectFit: 'contain',
            borderRadius: '50%',
            border: '4px solid #FFF3E0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        />
      ) : (
        <div
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            backgroundColor: fallbackColors[route] || '#2D6A4F',
            border: '4px solid #FFF3E0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: '#FFF3E0',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '8px',
          }}
        >
          {label.en}
        </div>
      )}
      <div
        style={{
          marginTop: '8px',
          padding: '6px 16px',
          backgroundColor: '#FFF3E0',
          borderRadius: '20px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}
      >
        <span style={{
          fontFamily: 'Cambria, Georgia, serif',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#1B2B22',
        }}>
          {label.my}
        </span>
        <br />
        <span style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '12px',
          color: '#5B6B61',
        }}>
          {label.en}
        </span>
      </div>
    </div>
  );
}
