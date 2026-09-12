// Panda animation frames for the "Have More Energy" goal, extracted from the
// pandaMuscle.png reference sheet (a waving-hello row and a strength-progress
// row that goes from a happy fists-up pose to a fully flexed, muscular pose).
// Follows the same { mood: [frames] } shape as pandaTallFrames.js /
// pandaSkinFrames.js so usePandaEnergyFrame can cycle them the same way.
const IMAGE_BASE = '/panda/energy';

export const PANDA_ENERGY_FRAMES = {
  idle: [`${IMAGE_BASE}/wave_1.png`, `${IMAGE_BASE}/wave_2.png`],
  correct: [`${IMAGE_BASE}/power_1.png`, `${IMAGE_BASE}/power_2.png`],
  // The sheet has no "sad/worried" pose, so the wrong-choice reaction keeps
  // the existing worried-panda art instead of a sheet-extracted frame.
  wrong: ['/panda/panda_nudge.png'],
  complete: [`${IMAGE_BASE}/power_big_1.png`, `${IMAGE_BASE}/power_big_2.png`],
};

export const PANDA_ENERGY_FRAME_DURATION_MS = 450;
