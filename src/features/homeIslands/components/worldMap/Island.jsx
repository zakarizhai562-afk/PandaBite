import { useCallback, useState } from 'react';
import IslandLabel from './IslandLabel';

// Staggered idle-float timing per island slot so they never bob in sync.
const IDLE_TIMING = [
  { duration: '5.6s', delay: '0s' },
  { duration: '6.4s', delay: '1.1s' },
  { duration: '6.8s', delay: '2.3s' },
  { duration: '6.1s', delay: '0.6s' },
];

// A single interactive island. Native <button> semantics give us keyboard
// focus, Enter/Space activation, and a screen-reader label for free.
//
// `image` is optional: when a transparent island cutout PNG is supplied it
// renders (and truly lifts/scales) as its own layer; without one, the
// island renders as an invisible hotspot over the shared map background and
// the "coming forward" feeling is carried by the glow + soft shadow instead.
export default function Island({ id, title, image, position, index = 0, onActivate }) {
  const [isClicking, setIsClicking] = useState(false);
  const timing = IDLE_TIMING[index % IDLE_TIMING.length];

  const handleClick = useCallback(() => {
    setIsClicking(true);
    window.setTimeout(() => {
      onActivate();
    }, 190);
  }, [onActivate]);

  return (
    <button
      type="button"
      className={`wm-island${isClicking ? ' wm-island--clicking' : ''}`}
      style={position}
      onClick={handleClick}
      aria-label={`Play ${title}`}
      data-island-id={id}
    >
      <span
        className="wm-island-idle"
        style={{ animationDuration: timing.duration, animationDelay: timing.delay }}
      >
        <span className="wm-island-body">
          {image ? (
            <img src={image} alt="" className="wm-island-art" draggable="false" />
          ) : (
            <span className="wm-island-glow" aria-hidden="true" />
          )}
        </span>
      </span>
      <IslandLabel title={title} />
    </button>
  );
}
