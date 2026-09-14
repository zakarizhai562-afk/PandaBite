// Panda animation frames for the "Grow Taller" goal. The growth-chart
// sequence (small -> tallest, used for the round-complete celebration) is
// extracted from pandatall3.png -- see usePandaTallFrame for the one-shot
// playback that replaces the usual infinite 2-frame loop for that mood.
// Frames were isolated with connected-component analysis so the flanking
// arrow/sparkle decorations in that sheet never bleed into the cropped
// character art. The idle wave and wrong-choice worry frames reuse the same
// shared pandaClearskin.png / pandathinking.png crops as the Clear Skin and
// Have More Energy goals (rather than pandatall3.png's own wave row) so all
// three goals share one consistent art style for those two moods.
const IMAGE_BASE = '/panda/tall3';
const SKIN_IMAGE_BASE = '/panda/skin';
const WORRY_IMAGE_BASE = '/panda/worry';

const GROWTH_1 = `${IMAGE_BASE}/growth_1.png`;
const GROWTH_2 = `${IMAGE_BASE}/growth_2.png`;
const GROWTH_3 = `${IMAGE_BASE}/growth_3.png`;
const GROWTH_4 = `${IMAGE_BASE}/growth_4.png`;
const GROWTH_5 = `${IMAGE_BASE}/growth_5.png`;

export const PANDA_TALL_FRAMES = {
  idle: [`${SKIN_IMAGE_BASE}/wave_1.png`, `${SKIN_IMAGE_BASE}/wave_2.png`],
  // Reuses the first two (shortest) growth stages as a modest "growing a
  // little" hint after each correct food.
  correct: [GROWTH_1, GROWTH_2],
  wrong: [`${WORRY_IMAGE_BASE}/worry_1.png`, `${WORRY_IMAGE_BASE}/worry_2.png`],
  // Played once, in order, then held on the last (tallest) frame -- the full
  // small-to-tall growth-chart sequence.
  complete: [GROWTH_1, GROWTH_2, GROWTH_3, GROWTH_4, GROWTH_5],
};

export const PANDA_TALL_FRAME_DURATION_MS = 450;
export const PANDA_TALL_GROWTH_STEP_MS = 260;
