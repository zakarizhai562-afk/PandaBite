// Panda animation frames for the "Have More Energy" goal, extracted from the
// pandaMuscle.png reference sheet (a waving-hello row and a strength-progress
// row that goes from a happy fists-up pose to a fully flexed, muscular pose).
// Follows the same { mood: [frames] } shape as pandaTallFrames.js /
// pandaSkinFrames.js so usePandaEnergyFrame can cycle them the same way. The
// wrong-choice worry frames (cropped from pandathinking.png) are shared
// with the other two goals -- see public/panda/worry/.
const IMAGE_BASE = '/panda/energy';
const WORRY_IMAGE_BASE = '/panda/worry';

export const PANDA_ENERGY_FRAMES = {
  idle: [`${IMAGE_BASE}/wave_1.png`, `${IMAGE_BASE}/wave_2.png`],
  correct: [`${IMAGE_BASE}/power_1.png`, `${IMAGE_BASE}/power_2.png`],
  wrong: [`${WORRY_IMAGE_BASE}/worry_1.png`, `${WORRY_IMAGE_BASE}/worry_2.png`],
  complete: [`${IMAGE_BASE}/power_big_1.png`, `${IMAGE_BASE}/power_big_2.png`],
};

export const PANDA_ENERGY_FRAME_DURATION_MS = 450;
