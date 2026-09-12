// Panda animation frames for the "Clear Skin" goal, extracted from the
// pandaClearskin.png reference sheet (a waving-hello row and a blushing/
// glowing-cheeks row, each with a few near-duplicate variants). Follows the
// same { mood: [frames] } shape as pandaTallFrames.js / puzzleGame's
// pandaFrames.js so usePandaSkinFrame can cycle them the same way.
const IMAGE_BASE = '/panda/skin';

export const PANDA_SKIN_FRAMES = {
  idle: [`${IMAGE_BASE}/wave_1.png`, `${IMAGE_BASE}/wave_2.png`],
  correct: [`${IMAGE_BASE}/glow_1.png`, `${IMAGE_BASE}/glow_2.png`],
  // The sheet has no "sad/worried" pose, so the wrong-choice reaction keeps
  // the existing worried-panda art instead of a sheet-extracted frame.
  wrong: ['/panda/panda_nudge.png'],
  complete: [`${IMAGE_BASE}/glow_big_1.png`, `${IMAGE_BASE}/glow_big_2.png`],
};

export const PANDA_SKIN_FRAME_DURATION_MS = 450;
