import { useEffect, useState } from 'react';
import { PANDA_ENERGY_FRAMES, PANDA_ENERGY_FRAME_DURATION_MS } from '../data/pandaEnergyFrames';

// Cycles between the frames of the current mood (mirrors usePandaTallFrame /
// usePandaSkinFrame) -- swap frame every PANDA_ENERGY_FRAME_DURATION_MS,
// restarting at frame 0 whenever the mood changes.
export function usePandaEnergyFrame(mood) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(0);
  }, [mood]);

  useEffect(() => {
    const frames = PANDA_ENERGY_FRAMES[mood] || PANDA_ENERGY_FRAMES.idle;
    if (frames.length <= 1) return undefined;
    const id = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, PANDA_ENERGY_FRAME_DURATION_MS);
    return () => clearInterval(id);
  }, [mood]);

  const frames = PANDA_ENERGY_FRAMES[mood] || PANDA_ENERGY_FRAMES.idle;
  return frames[frameIndex % frames.length];
}
