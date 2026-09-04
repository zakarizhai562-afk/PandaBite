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
  validateFoodData,
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
import { PUZZLE_FOODS, BASKETS, getFoodById, getRandomFood, validatePuzzleFoods } from '../services/puzzleData';

describe('puzzleData', () => {
  it('has 3 baskets with correct groups', () => {
    expect(BASKETS).toHaveLength(3);
    expect(BASKETS.map((b) => b.id)).toEqual(['energy', 'body', 'protective']);
    expect(BASKETS.map((b) => b.group)).toEqual(['carbs', 'protein', 'vitamins']);
  });

  it('PUZZLE_FOODS validates and has no duplicates', () => {
    expect(() => validatePuzzleFoods()).not.toThrow();
    expect(() => validateFoodData(PUZZLE_FOODS)).not.toThrow();
    const ids = PUZZLE_FOODS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('contains migrated python foods', () => {
    const ids = PUZZLE_FOODS.map((f) => f.id);
    expect(ids).toContain('corn');
    expect(ids).toContain('potato');
    expect(ids).toContain('broccoli');
    expect(ids).toContain('apple');
    expect(ids).toContain('rice');
  });

  it('getFoodById and getRandomFood work', () => {
    expect(getFoodById('rice')?.name.en).toBe('Rice');
    expect(getFoodById('nonexistent')).toBeNull();
    const f = getRandomFood();
    expect(f).toBeDefined();
    expect(f.id).toBeDefined();
    const f2 = getRandomFood(f.id);
    expect(f2.id).not.toBe(f.id);
  });
});

describe('puzzleService gameState', () => {
  it('creates initial state', () => {
    const s = createInitialState();
    expect(s.score).toBe(0);
    expect(s.lives).toBe(STARTING_LIVES);
    expect(s.level).toBe(1);
    expect(s.state).toBe(PLAYING);
  });

  it('addScore increments and triggers level complete', () => {
    let s = createInitialState();
    s = { ...s, score: 90 };
    s = addScore(s, POINTS_PER_CORRECT);
    expect(s.score).toBe(100);
    expect(s.state).toBe(LEVEL_COMPLETE);
  });

  it('addScore triggers game complete at max level', () => {
    let s = { ...createInitialState(), level: MAX_LEVEL, score: 90 };
    s = addScore(s);
    expect(s.state).toBe(GAME_COMPLETE);
  });

  it('loseLife decrements and triggers game over', () => {
    let s = { ...createInitialState(), lives: 1 };
    s = loseLife(s);
    expect(s.lives).toBe(0);
    expect(s.state).toBe(GAME_OVER);
    expect(s.mistakesThisLevel).toBe(1);
  });

  it('starRating reflects mistakes', () => {
    expect(starRating(0)).toBe(3);
    expect(starRating(1)).toBe(2);
    expect(starRating(2)).toBe(2);
    expect(starRating(3)).toBe(1);
  });

  it('togglePause switches', () => {
    let s = createInitialState();
    s = togglePause(s);
    expect(s.state).toBe(PAUSED);
    s = togglePause(s);
    expect(s.state).toBe(PLAYING);
    s = { ...s, state: GAME_OVER };
    expect(togglePause(s).state).toBe(GAME_OVER);
  });

  it('nextLevel and resetGame', () => {
    let s = { ...createInitialState(), score: 100, mistakesThisLevel: 2, level: 1, state: LEVEL_COMPLETE };
    s = nextLevel(s);
    expect(s.level).toBe(2);
    expect(s.score).toBe(0);
    expect(s.state).toBe(PLAYING);
    s = resetGame();
    expect(s.level).toBe(1);
    expect(s.score).toBe(0);
  });

  it('checkAnswer validates correct and wrong', () => {
    const rice = PUZZLE_FOODS.find((f) => f.id === 'rice');
    expect(rice.groups[0]).toBe('carbs');
    let res = checkAnswer('rice', 'energy');
    expect(res.isCorrect).toBe(true);
    res = checkAnswer('rice', 'body');
    expect(res.isCorrect).toBe(false);
    expect(res.correctBasket.id).toBe('energy');
    res = checkAnswer('chicken', 'body');
    expect(res.isCorrect).toBe(true);
  });
});
