// Panda animation frames migrated 1:1 from the Python reference
// (old/game/settings.py PANDA_*_FRAMES). Both "happy" frames intentionally
// point at the same image (panda_happy_2.png's right paw is clipped in the
// source art), matching the Python comment -- the happy mood instead gets a
// CSS bounce for motion, same as the Python code's happy_anim_ms bounce.
const IMAGE_BASE = '/puzzle-classic/images';

export const PANDA_FRAMES = {
  idle: [`${IMAGE_BASE}/panda_idle_1.png`, `${IMAGE_BASE}/panda_idle_2.png`],
  happy: [`${IMAGE_BASE}/panda_happy_1.png`, `${IMAGE_BASE}/panda_happy_1.png`],
  sad: [`${IMAGE_BASE}/panda_sad_1.png`, `${IMAGE_BASE}/panda_sad_2.png`],
};

export const PANDA_FRAME_DURATION_MS = 400;
