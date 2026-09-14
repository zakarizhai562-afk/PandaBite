// Panda animation frames for the "Clear Skin" goal, extracted from the
// pandaClearskin.png reference sheet (a waving-hello row and a blushing/
// glowing-cheeks row, each with a few near-duplicate variants). Follows the
// same { mood: [frames] } shape as pandaTallFrames.js / puzzleGame's
// pandaFrames.js so usePandaSkinFrame can cycle them the same way. The
// wrong-choice worry frames (cropped from pandathinking.png) are shared
// with the other two goals -- see public/panda/worry/.
const IMAGE_BASE = '/panda/skin';
const WORRY_IMAGE_BASE = '/panda/worry';

export const PANDA_SKIN_FRAMES = {
  idle: [`${IMAGE_BASE}/wave_1.png`, `${IMAGE_BASE}/wave_2.png`],
  correct: [`${IMAGE_BASE}/glow_1.png`, `${IMAGE_BASE}/glow_2.png`],
  wrong: [`${WORRY_IMAGE_BASE}/worry_1.png`, `${WORRY_IMAGE_BASE}/worry_2.png`],
  complete: [`${IMAGE_BASE}/glow_big_1.png`, `${IMAGE_BASE}/glow_big_2.png`],
};

export const PANDA_SKIN_FRAME_DURATION_MS = 450;
