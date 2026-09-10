// Game state machine + scoring, migrated 1:1 from the Python reference
// (old/game/game_state.py GameState, old/main.py handle_correct_sort /
// handle_wrong_sort). Values, transitions, and feedback text match exactly.
import { getBasketByGroup } from '../data/basketData';

export const STARTING_LIVES = 3;
export const POINTS_PER_CORRECT = 10;
export const SCORE_TO_LEVEL_COMPLETE = 100;
export const MAX_LEVEL = 3;

export const PLAYING = 'PLAYING';
export const PAUSED = 'PAUSED';
export const LEVEL_COMPLETE = 'LEVEL_COMPLETE';
export const GAME_COMPLETE = 'GAME_COMPLETE';
export const GAME_OVER = 'GAME_OVER';

// How long the feedback card ("Great Job!" / "Try Again!") stays on screen,
// and the basket hint highlight duration -- both from settings.py.
export const FEEDBACK_DURATION_MS = 1600;
export const BASKET_HINT_DURATION_MS = 1000;
export const TUTORIAL_HINT_DURATION_MS = 3000;

// Fall speed in actual pixels/second (not a duration or a percentage), used
// directly by the requestAnimationFrame-driven fall loop: position advances
// by `fallSpeed * deltaTime` every frame, same physics regardless of the
// screen's refresh rate.
//
// Calibrated against this layout's real food-area travel distance (~130px
// at a typical 1280x720 window, after food size + spawn/bottom margins --
// see useFallingFood.js), not picked in the abstract: at that distance
// these values give ~2.9s/2.2s/1.7s falls for levels 1-3, enough time to
// see, grab, drag, and drop before a miss. A flat 100+ px/s (a reasonable-
// sounding number in isolation) crosses that same ~130px in about a
// second -- nowhere near enough reaction time -- so don't restore a bare
// "100" here without re-deriving it against the actual travel distance.
export const FALL_SPEED_PX_PER_SEC_BY_LEVEL = { 1: 45, 2: 60, 3: 75 };

export function createInitialState() {
  return {
    score: 0,
    lives: STARTING_LIVES,
    level: 1,
    state: PLAYING,
    mistakesThisLevel: 0,
  };
}

export function addScore(state, points = POINTS_PER_CORRECT) {
  const next = { ...state, score: state.score + points };
  if (next.score >= SCORE_TO_LEVEL_COMPLETE) {
    next.state = next.level >= MAX_LEVEL ? GAME_COMPLETE : LEVEL_COMPLETE;
  }
  return next;
}

export function loseLife(state) {
  const next = {
    ...state,
    lives: Math.max(0, state.lives - 1),
    mistakesThisLevel: state.mistakesThisLevel + 1,
  };
  if (next.lives <= 0) {
    next.state = GAME_OVER;
  }
  return next;
}

export function starRating(mistakesThisLevel) {
  if (mistakesThisLevel === 0) return 3;
  if (mistakesThisLevel <= 2) return 2;
  return 1;
}

export function togglePause(state) {
  if (state.state === PLAYING) return { ...state, state: PAUSED };
  if (state.state === PAUSED) return { ...state, state: PLAYING };
  return state;
}

export function nextLevel(state) {
  return { ...state, level: state.level + 1, score: 0, mistakesThisLevel: 0, state: PLAYING };
}

export function resetGame() {
  return createInitialState();
}

export function isPlaying(state) {
  return state.state === PLAYING;
}

export function checkAnswer(foodGroup, basketId) {
  const basket = getBasketByGroup(foodGroup);
  return { isCorrect: basket?.id === basketId, correctBasket: basket };
}

export function getFeedbackForCorrect() {
  return { title: 'Great Job!', detail: `+${POINTS_PER_CORRECT} Points`, isCorrect: true };
}

// Same message shape for a wrong-basket drop AND a food that fell past the
// baskets uncaught -- the Python reference's handle_wrong_sort() is the one
// function used for both cases, so both read identically here too.
export function getFeedbackForWrong(food, correctBasket) {
  const detail = correctBasket ? `${food.name} → ${correctBasket.name}` : food.name;
  return { title: 'Try Again!', detail, isCorrect: false };
}
