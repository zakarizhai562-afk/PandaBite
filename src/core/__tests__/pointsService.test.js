import { describe, it, expect, vi, beforeEach } from 'vitest';
import { awardStars } from '../../core/services/starAwardService';
import { spendPoints, HINT_COST } from '../../core/services/spendPointsService';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = String(value); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    _reset: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('starAwardService', () => {
  beforeEach(() => {
    localStorageMock._reset();
    vi.clearAllMocks();
  });

  it('increments the total correctly from 0', () => {
    const newTotal = awardStars(5, 'test');
    expect(newTotal).toBe(5);
  });

  it('accumulates multiple awards', () => {
    awardStars(3, 'test');
    const total = awardStars(7, 'test');
    expect(total).toBe(10);
  });

  it('does not double-count — calling twice for same event still adds twice (caller responsibility)', () => {
    // Per spec: "Callers must ensure they don't call this twice for the same event."
    // The service itself is additive — it doesn't track event IDs.
    const t1 = awardStars(3, 'daily-log');
    const t2 = awardStars(3, 'daily-log');
    expect(t2).toBe(6);
  });

  it('defaults to 0 when no stored data exists', () => {
    const total = awardStars(1, 'test');
    expect(total).toBe(1);
  });

  it('rejects invalid amounts', () => {
    const total = awardStars(-5, 'test');
    expect(total).toBe(0);
  });
});

describe('spendPointsService', () => {
  beforeEach(() => {
    localStorageMock._reset();
    vi.clearAllMocks();
  });

  it('deducts Clue cost (2 points) correctly when total is sufficient', () => {
    awardStars(10, 'test');
    const result = spendPoints(HINT_COST.CLUE, 'puzzle');
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(8);
  });

  it('deducts Reveal cost (5 points) correctly when total is sufficient', () => {
    awardStars(10, 'test');
    const result = spendPoints(HINT_COST.REVEAL, 'goals');
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(5);
  });

  it('returns "not enough points" and makes no change when total is insufficient', () => {
    awardStars(3, 'test');
    const result = spendPoints(5, 'puzzle');
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(3);
    expect(result.message).toBeDefined();
  });

  it('defaults to 0 points when no stored data — spend returns not enough', () => {
    const result = spendPoints(2, 'test');
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('never lets total go negative', () => {
    awardStars(1, 'test');
    const result = spendPoints(5, 'test');
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(1);
  });
});
