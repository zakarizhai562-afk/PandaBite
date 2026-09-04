import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function IslandStop({ image, label, route }) {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  const fallbackColors = {
    '/daily-log': '#2D6A4F',
    '/puzzle': '#FF8C42',
    '/goals': '#C9673A',
  };

  return (
    <div
      className="island-stop tarot-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <div className="tarot-card-art">
        {!imgError ? (
          <img src={image} alt={label.en} onError={() => setImgError(true)} />
        ) : (
          <div className="island-stop-fallback" style={{ backgroundColor: fallbackColors[route] || '#2D6A4F' }}>
            {label.en}
          </div>
        )}
      </div>
      <div className="island-label">
        <span className="island-label-my">{label.my}</span>
        <br />
        <span className="island-label-en">{label.en}</span>
      </div>
    </div>
  );
}
