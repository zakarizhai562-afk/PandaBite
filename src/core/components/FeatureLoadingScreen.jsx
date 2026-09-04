import { useState, useEffect } from 'react';

// Shared feature loading transition — brief themed splash before a feature renders
// Owned by Person 2. Each feature screen renders this on mount, then swaps to real content.

export default function FeatureLoadingScreen({
  image,
  label,
  durationMs = 600,
  onDone,
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onDone) onDone();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [durationMs, onDone]);

  return (
    <div className="feature-loading">
      {!imgError && (
        <img
          src={image}
          alt={label || 'Loading...'}
          onError={() => setImgError(true)}
        />
      )}
      {imgError && (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#EAF4EE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="loading-spinner" />
        </div>
      )}
      <div className="loading-spinner" />
    </div>
  );
}
