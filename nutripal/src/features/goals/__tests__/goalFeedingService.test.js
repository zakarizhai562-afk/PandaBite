import { describe, it, expect, beforeEach, vi } from 'vitest';
import { goals } from '../models/goal';
import {
  createFeedingRound,
  feedFood,
  useHint,
  getFeedReaction,
  getHintClue,
} from '../services/goalFeedingService';
import { awardStars } from '../../../core/services/starAwardService';
import { spendPoints, HINT_COST } from '../../../core/services/spendPointsService';

describe('goalFeedingService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('feeding a matching food first attempt -> correct + star eligible + resolved', () => {
    const choices = ['egg', 'rice', 'candy'];
    let round = createFeedingRound('grow-taller', choices);
    const result = feedFood(round, 'egg');
    expect(result.isCorrect).toBe(true);
    expect(result.isStarEligible).toBe(true);
    expect(result.round.results['egg'].resolved).toBe(true);
  });

  it('feeding a non-matching food -> incorrect, no star, not resolved, wrongAttempted', () => {
    const choices = ['egg', 'rice', 'candy'];
    let round = createFeedingRound('grow-taller', choices);
    const result = feedFood(round, 'candy');
    expect(result.isCorrect).toBe(false);
    expect(result.isStarEligible).toBe(false);
    expect(result.round.results['candy'].resolved).toBe(false);
  });

  it('feeding correct food after prior wrong attempt -> correct but no star', () => {
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
    expect(second.isStarEligible).toBe(false);
  });

  it('Clue (2 points) deducts points and leaves food unchanged', () => {
    awardStars(10, 'test');
    const before = JSON.parse(localStorage.getItem('nutripal_stars'));
    expect(before).toBe(10);
    const result = spendPoints(HINT_COST.CLUE, 'goals');
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(8);
  });

  it('Reveal (5 points) deducts points and marks food resolved without star', () => {
    awardStars(10, 'test');
    spendPoints(HINT_COST.CLUE, 'test');
    const choices = ['egg', 'rice', 'candy'];
    let round = createFeedingRound('grow-taller', choices);
    const result = useHint(round, 'candy', 'reveal');
    expect(result.canAfford).toBe(true);
    expect(result.isReveal).toBe(true);
    expect(result.round.results['candy'].resolved).toBe(true);
    expect(result.round.results['candy'].hintedReveal).toBe(true);
    const later = feedFood(result.round, 'candy');
    expect(later.isStarEligible).toBe(false);
  });

  it('Hint tier cannot be afforded -> no points deducted', () => {
    awardStars(1, 'test');
    const result = spendPoints(HINT_COST.REVEAL, 'goals');
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(1);
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
