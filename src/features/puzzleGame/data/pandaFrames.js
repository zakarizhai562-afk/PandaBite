// Panda animation frames, cropped from the foodrain.png sprite sheet
// (row 1 = idle, row 2 = happy, row 3 = sad -- 5 pose variants per mood).
const IMAGE_BASE = '/puzzle-classic/images';

export const PANDA_FRAMES = {
  idle: [1, 2, 3, 4, 5].map((n) => `${IMAGE_BASE}/panda_idle_${n}.png`),
  happy: [1, 2, 3, 4, 5].map((n) => `${IMAGE_BASE}/panda_happy_${n}.png`),
  sad: [1, 2, 3, 4, 5].map((n) => `${IMAGE_BASE}/panda_sad_${n}.png`),
};

export const PANDA_FRAME_DURATION_MS = 400;
