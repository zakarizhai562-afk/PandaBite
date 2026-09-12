import { useEffect, useState } from 'react';
import { PANDA_SKIN_FRAMES, PANDA_SKIN_FRAME_DURATION_MS } from '../data/pandaSkinFrames';

// Cycles between the frames of the current mood (mirrors usePandaTallFrame /
// puzzleGame's usePandaFrame) -- swap frame every
// PANDA_SKIN_FRAME_DURATION_MS, restarting at frame 0 whenever the mood
// changes.
export function usePandaSkinFrame(mood) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(0);
  }, [mood]);

  useEffect(() => {
    const frames = PANDA_SKIN_FRAMES[mood] || PANDA_SKIN_FRAMES.idle;
    if (frames.length <= 1) return undefined;
    const id = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, PANDA_SKIN_FRAME_DURATION_MS);
    return () => clearInterval(id);
  }, [mood]);

  const frames = PANDA_SKIN_FRAMES[mood] || PANDA_SKIN_FRAMES.idle;
  return frames[frameIndex % frames.length];
}
