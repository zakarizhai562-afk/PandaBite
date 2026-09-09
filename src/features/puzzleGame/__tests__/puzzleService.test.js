import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  addScore,
  loseLife,
  nextLevel,
  resetGame,
  togglePause,
  starRating,
  checkAnswer,
  getFeedbackForCorrect,
  getFeedbackForWrong,
  STARTING_LIVES,
  POINTS_PER_CORRECT,
  SCORE_TO_LEVEL_COMPLETE,
  MAX_LEVEL,
  PLAYING,
  PAUSED,
  LEVEL_COMPLETE,
  GAME_COMPLETE,
  GAME_OVER,
} from '../services/puzzleService';
import { FOOD_DATA, VALID_GROUPS, validateFoodData, getRandomFood } from '../data/foodData';
import { BASKETS, getBasketByGroup, getBasketById } from '../data/basketData';

describe('foodData (migrated from Python FOOD_DATA)', () => {
  it('has exactly 28 foods: 10 energy, 9 body, 9 protective', () => {
    expect(FOOD_DATA).toHaveLength(28);
    const counts = { energy: 0, body: 0, protective: 0 };
    FOOD_DATA.forEach((f) => counts[f.group]++);
    expect(counts).toEqual({ energy: 10, body: 9, protective: 9 });
  });

  it('validates with no duplicate names and only valid groups', () => {
    expect(() => validateFoodData()).not.toThrow();
    const names = FOOD_DATA.map((f) => f.name);
    expect(new Set(names).size).toBe(names.length);
    FOOD_DATA.forEach((f) => expect(VALID_GROUPS).toContain(f.group));
  });

  it('contains known items from the Python reference in their exact groups', () => {
    const byName = Object.fromEntries(FOOD_DATA.map((f) => [f.name, f.group]));
    expect(byName.Rice).toBe('energy');
    expect(byName.Banana).toBe('energy');
    expect(byName.Chicken).toBe('body');
    expect(byName.Cheese).toBe('body');
    expect(byName.Carrot).toBe('protective');
    expect(byName.Apple).toBe('protective');
  });

  it('getRandomFood excludes the given name when possible', () => {
    const f = getRandomFood();
    expect(f).toBeDefined();
    const f2 = getRandomFood(f.name);
    expect(f2.name).not.toBe(f.name);
  });
});

describe('basketData (migrated from Python create_baskets)', () => {
  it('has 3 baskets with the exact Python names/labels', () => {
    expect(BASKETS).toHaveLength(3);
    expect(BASKETS.map((b) => b.id)).toEqual(['energy', 'body', 'protective']);
    expect(BASKETS.map((b) => b.name)).toEqual([
      'Energy-Giving Foods',
      'Body-Building Foods',
      'Protective Foods',
    ]);
    expect(BASKETS.map((b) => b.shortLabel)).toEqual(['Energy', 'Body', 'Protective']);
  });

  it('getBasketByGroup / getBasketById resolve correctly', () => {
    expect(getBasketByGroup('energy')?.id).toBe('energy');
    expect(getBasketByGroup('nonexistent')).toBeNull();
    expect(getBasketById('body')?.group).toBe('body');
  });
});

describe('puzzleService gameState (migrated from Python GameState)', () => {
  it('creates initial state', () => {
    const s = createInitialState();
    expect(s.score).toBe(0);
    expect(s.lives).toBe(STARTING_LIVES);
    expect(s.level).toBe(1);
    expect(s.state).toBe(PLAYING);
  });

  it('addScore increments and triggers level complete at 100', () => {
    let s = createInitialState();
    s = { ...s, score: 90 };
    s = addScore(s, POINTS_PER_CORRECT);
    expect(s.score).toBe(100);
    expect(s.score).toBe(SCORE_TO_LEVEL_COMPLETE);
    expect(s.state).toBe(LEVEL_COMPLETE);
  });

  it('addScore triggers game complete at max level', () => {
    let s = { ...createInitialState(), level: MAX_LEVEL, score: 90 };
    s = addScore(s);
    expect(s.state).toBe(GAME_COMPLETE);
  });

  it('loseLife decrements and triggers game over at 0', () => {
    let s = { ...createInitialState(), lives: 1 };
    s = loseLife(s);
    expect(s.lives).toBe(0);
    expect(s.state).toBe(GAME_OVER);
    expect(s.mistakesThisLevel).toBe(1);
  });

  it('starRating reflects mistakes (0=3 stars, 1-2=2 stars, 3+=1 star)', () => {
    expect(starRating(0)).toBe(3);
    expect(starRating(1)).toBe(2);
    expect(starRating(2)).toBe(2);
    expect(starRating(3)).toBe(1);
  });

  it('togglePause switches PLAYING<->PAUSED and no-ops elsewhere', () => {
    let s = createInitialState();
    s = togglePause(s);
    expect(s.state).toBe(PAUSED);
    s = togglePause(s);
    expect(s.state).toBe(PLAYING);
    s = { ...s, state: GAME_OVER };
    expect(togglePause(s).state).toBe(GAME_OVER);
  });

  it('nextLevel resets score/mistakes and resetGame restores level 1', () => {
    let s = { ...createInitialState(), score: 100, mistakesThisLevel: 2, level: 1, state: LEVEL_COMPLETE };
    s = nextLevel(s);
    expect(s.level).toBe(2);
    expect(s.score).toBe(0);
    expect(s.state).toBe(PLAYING);
    s = resetGame();
    expect(s.level).toBe(1);
    expect(s.score).toBe(0);
    expect(s.lives).toBe(STARTING_LIVES);
  });

  it('checkAnswer compares the food group against the basket id', () => {
    let res = checkAnswer('energy', 'energy');
    expect(res.isCorrect).toBe(true);
    res = checkAnswer('energy', 'body');
    expect(res.isCorrect).toBe(false);
    expect(res.correctBasket.id).toBe('energy');
  });

  it('feedback text matches the Python reference exactly', () => {
    expect(getFeedbackForCorrect()).toEqual({ title: 'Great Job!', detail: '+10 Points', isCorrect: true });

    const rice = FOOD_DATA.find((f) => f.name === 'Rice');
    const energyBasket = getBasketByGroup('energy');
    const wrong = getFeedbackForWrong(rice, energyBasket);
    expect(wrong.title).toBe('Try Again!');
    expect(wrong.detail).toBe('Rice → Energy-Giving Foods');
    expect(wrong.isCorrect).toBe(false);
  });
});
