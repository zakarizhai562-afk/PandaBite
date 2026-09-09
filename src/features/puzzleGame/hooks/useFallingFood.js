import { useEffect, useRef, useState } from 'react';
import { FALL_DURATION_SECONDS_BY_LEVEL } from '../services/puzzleService';

// Drives the falling-food progress (0 = spawn point, 1 = reached the
// baskets), mirroring the Python reference's Food.fall() -- a steady drift
// downward, paused while dragging/paused/not playing, calling onReachBottom
// once if it ever reaches the bottom uncaught (a "miss", same as the Python
// main loop's `current_food.rect.centery >= baskets_top` check).
//
// Uses a fixed-interval timer rather than requestAnimationFrame: same visual
// smoothness for a fall that takes 1.5-3+ seconds, but predictable in both
// the browser and jsdom-based tests (which lack real vsync timing for rAF).
export function useFallingFood({ active, level, foodKey, onReachBottom }) {
  const [fallProgress, setFallProgress] = useState(0);
  const reachedBottomRef = useRef(false);

  // Reset whenever a new food appears.
  useEffect(() => {
    setFallProgress(0);
    reachedBottomRef.current = false;
  }, [foodKey]);

  useEffect(() => {
    if (!active) return undefined;
    const TICK_MS = 50;
    const duration = FALL_DURATION_SECONDS_BY_LEVEL[level] || FALL_DURATION_SECONDS_BY_LEVEL[1];
    const step = TICK_MS / 1000 / duration;
    const id = setInterval(() => {
      setFallProgress((prev) => Math.min(1, prev + step));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [active, level]);

  useEffect(() => {
    if (fallProgress >= 1 && !reachedBottomRef.current) {
      reachedBottomRef.current = true;
      onReachBottom();
    }
  }, [fallProgress, onReachBottom]);

  const resetFall = () => {
    setFallProgress(0);
    reachedBottomRef.current = false;
  };

  return { fallProgress, resetFall };
}
