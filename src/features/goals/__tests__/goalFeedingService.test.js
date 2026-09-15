import { describe, it, expect, beforeEach } from 'vitest';
import { goals } from '../models/goal';
import {
  createFeedingRound,
  feedFood,
  getFeedReaction,
  getHintClue,
} from '../services/goalFeedingService';

describe('goalFeedingService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('feeding a matching food resolves the food', () => {
    const choices = ['egg', 'rice', 'candy'];
    let round = createFeedingRound('grow-taller', choices);
    const result = feedFood(round, 'egg');
    expect(result.isCorrect).toBe(true);
    expect(result.round.results['egg'].resolved).toBe(true);
  });

  it('feeding a non-matching food leaves it unresolved and tracks the wrong attempt', () => {
    const choices = ['egg', 'rice', 'candy'];
    let round = createFeedingRound('grow-taller', choices);
    const result = feedFood(round, 'candy');
    expect(result.isCorrect).toBe(false);
    expect(result.round.results['candy'].resolved).toBe(false);
  });

  it('feeding correct food after prior wrong attempt still resolves it', () => {
    const choices = ['egg', 'rice', 'candy'];
    let round = createFeedingRound('grow-taller', choices);
    let r1 = feedFood(round, 'candy');
    round = r1.round;
    let r2 = feedFood(round, 'candy');
    expect(r2.isCorrect).toBe(false);
    round = createFeedingRound('grow-taller', ['egg', 'rice', 'candy']);
    const wrong = feedFood(round, 'candy');
    const withWrong = wrong.round;
    withWrong.results['egg'] = { wrongAttempted: true, resolved: false, firstAttempt: false };
    const second = feedFood(withWrong, 'egg');
    expect(second.isCorrect).toBe(true);
    expect(second.round.results['egg'].resolved).toBe(true);
  });

  it('every goal ID returns a valid round with at least 2 matching and 1 non-matching', () => {
    for (const g of goals) {
      const round = createFeedingRound(g.id, [...g.matchingFoods, ...g.nonMatchingFoods]);
      expect(round.choices.length).toBeGreaterThanOrEqual(3);
      const matchingCount = round.choices.filter((f) => g.matchingFoods.includes(f)).length;
      const nonMatchingCount = round.choices.filter((f) => g.nonMatchingFoods.includes(f)).length;
      expect(matchingCount).toBeGreaterThanOrEqual(2);
      expect(nonMatchingCount).toBeGreaterThanOrEqual(1);
    }
  });

  it('unknown goal ID returns fallback message rather than throw', () => {
    const r = getFeedReaction('unknown-goal', true);
    expect(r).toHaveProperty('en');
    const c = getHintClue('unknown-goal');
    expect(c).toHaveProperty('en');
  });

  it('all food choices resolved -> round-complete flag is true', () => {
    const choices = ['egg', 'rice', 'fish'];
    let round = createFeedingRound('grow-taller', choices);
    for (const f of choices) {
      const res = feedFood(round, f);
      round = res.round;
    }
    expect(round.allResolved).toBe(true);
  });

  it('getFeedReaction returns correct vs wrong lines', () => {
    const correct = getFeedReaction('grow-taller', true);
    const wrong = getFeedReaction('grow-taller', false);
    expect(correct.en).toContain('grow taller');
    expect(wrong.en).toBeDefined();
  });

  it('getHintClue returns a clue for the goal', () => {
    const clue = getHintClue('more-energy');
    expect(clue.en).toBeDefined();
  });
});
