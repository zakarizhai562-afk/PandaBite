import { useEffect, useState } from 'react';
import {
  PANDA_TALL_FRAMES,
  PANDA_TALL_FRAME_DURATION_MS,
  PANDA_TALL_GROWTH_STEP_MS,
} from '../data/pandaTallFrames';

// Cycles between the frames of the current mood, restarting at frame 0
// whenever the mood changes (mirrors usePandaSkinFrame / usePandaEnergyFrame).
// The "complete" mood is special-cased: instead of looping forever, it plays
// through the growth-chart sequence once and holds on the final frame, since
// that sequence tells a one-time "you grew taller" story rather than a
// repeating idle animation.
export function usePandaTallFrame(mood) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(0);
  }, [mood]);

  useEffect(() => {
    const frames = PANDA_TALL_FRAMES[mood] || PANDA_TALL_FRAMES.idle;
    if (frames.length <= 1) return undefined;

    if (mood === 'complete') {
      let i = 0;
      const id = setInterval(() => {
        i += 1;
        if (i >= frames.length) {
          clearInterval(id);
          return;
        }
        setFrameIndex(i);
      }, PANDA_TALL_GROWTH_STEP_MS);
      return () => clearInterval(id);
    }

    const id = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, PANDA_TALL_FRAME_DURATION_MS);
    return () => clearInterval(id);
  }, [mood]);

  const frames = PANDA_TALL_FRAMES[mood] || PANDA_TALL_FRAMES.idle;
  return frames[Math.min(frameIndex, frames.length - 1)];
}
