import { useEffect, useState } from 'react';
import { PANDA_FRAMES, PANDA_FRAME_DURATION_MS } from '../data/pandaFrames';

// Cycles between the 2 frames of the current mood, matching the Python
// reference's Panda.update() (old/game/panda.py) -- swap frame every
// PANDA_FRAME_DURATION_MS, restarting at frame 0 whenever the mood changes.
export function usePandaFrame(mood) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(0);
  }, [mood]);

  useEffect(() => {
    const frames = PANDA_FRAMES[mood] || PANDA_FRAMES.idle;
    if (frames.length <= 1) return undefined;
    const id = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, PANDA_FRAME_DURATION_MS);
    return () => clearInterval(id);
  }, [mood]);

  const frames = PANDA_FRAMES[mood] || PANDA_FRAMES.idle;
  return frames[frameIndex % frames.length];
}
