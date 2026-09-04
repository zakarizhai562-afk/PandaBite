import { useState, useEffect } from 'react';

// Shared feature loading transition — brief themed splash before a feature renders
// Owned by Person 2. Each feature screen renders this on mount, then swaps to real content.

export default function FeatureLoadingScreen({
  image,
  label,
  durationMs = 1100,
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
      {!imgError ? (
        <img
          src={image}
          alt={label || 'Loading...'}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="feature-loading-fallback" />
      )}

      <div className="loading-bar" role="progressbar" aria-label={`Loading ${label || ''}`.trim()}>
        <div className="loading-bar-track">
          <div className="loading-bar-fill" style={{ animationDuration: `${durationMs}ms` }} />
        </div>
      </div>
    </div>
  );
}
