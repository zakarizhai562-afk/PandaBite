import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../core/prolog/prologEngine', () => ({
  runPrologQuery: vi.fn(),
}));

import { calculateDailyBalance } from '../services/dailyBalanceService';
import { runPrologQuery } from '../../../core/prolog/prologEngine';

describe('dailyBalanceService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns all 3 groups covered + isBalanced: true', async () => {
    runPrologQuery.mockResolvedValue({
      Groups: ['carbs', 'protein', 'vitamins'],
      WhoaCount: '0',
      IsBalanced: 'true',
    });

    const result = await calculateDailyBalance(['rice', 'egg', 'mango']);
    expect(result.isBalanced).toBe(true);
    expect(result.missingGroups).toEqual([]);
    expect(result.coveredGroups).toEqual(['carbs', 'protein', 'vitamins']);
    expect(result.whoaCount).toBe(0);
    expect(result.score).toBe(3);
    expect(result.starsEarned).toBe(3);
    expect(result.tierCounts).toEqual({ go: 3, slow: 0, whoa: 0 });
  });

  it('returns missingGroups with exactly the missing group', async () => {
    runPrologQuery.mockResolvedValue({
      Groups: ['carbs', 'protein'],
      WhoaCount: '0',
      IsBalanced: 'false',
    });

    const result = await calculateDailyBalance(['rice', 'egg']);
    expect(result.isBalanced).toBe(false);
    expect(result.missingGroups).toEqual(['vitamins']);
    expect(result.coveredGroups).toEqual(['carbs', 'protein']);
    expect(result.score).toBe(2);
    expect(result.starsEarned).toBe(2);
  });

  it('returns isBalanced: false when 2+ Whoa items on plate', async () => {
    runPrologQuery.mockResolvedValue({
      Groups: ['carbs', 'protein'],
      WhoaCount: '2',
      IsBalanced: 'false',
    });

    const result = await calculateDailyBalance(['rice', 'egg', 'candy', 'soda']);
    expect(result.isBalanced).toBe(false);
    expect(result.whoaCount).toBe(2);
    expect(result.score).toBe(1);
    expect(result.starsEarned).toBe(1);
  });

  it('skips unknown/invalid food IDs without throwing', async () => {
    runPrologQuery.mockResolvedValue({
      Groups: ['carbs'],
      WhoaCount: '0',
      IsBalanced: 'false',
    });

    await expect(calculateDailyBalance(['nonexistent_food', 'rice'])).resolves.toBeDefined();
    const result = await calculateDailyBalance(['nonexistent_food', 'rice']);
    expect(result.selectedFoodIds).toEqual(['rice']);
    expect(result.invalidFoodIds).toEqual(['nonexistent_food']);
  });

  it('deduplicates repeated food IDs before scoring', async () => {
    runPrologQuery.mockResolvedValue({
      Groups: ['carbs'],
      WhoaCount: '0',
      IsBalanced: 'false',
    });

    const result = await calculateDailyBalance(['rice', 'rice', 'rice']);
    expect(result.selectedFoodIds).toEqual(['rice']);
    expect(result.duplicateFoodIds).toEqual(['rice', 'rice']);
    expect(result.score).toBe(1);
  });

  it('returns empty groups on an empty plate', async () => {
    runPrologQuery.mockResolvedValue({
      Groups: [],
      WhoaCount: '0',
      IsBalanced: 'false',
    });

    const result = await calculateDailyBalance([]);
    expect(result.coveredGroups).toEqual([]);
    expect(result.missingGroups).toEqual(['carbs', 'protein', 'vitamins']);
    expect(result.isBalanced).toBe(false);
    expect(result.whoaCount).toBe(0);
    expect(result.score).toBe(0);
    expect(result.starsEarned).toBe(0);
  });

  it('falls back to plain-JS when Prolog engine throws', async () => {
    runPrologQuery.mockRejectedValue(new Error('Prolog engine crashed'));

    const result = await calculateDailyBalance(['rice', 'egg', 'mango']);
    expect(result.isBalanced).toBe(true);
    expect(result.missingGroups).toEqual([]);
    expect(result.coveredGroups).toContain('carbs');
    expect(result.coveredGroups).toContain('protein');
    expect(result.coveredGroups).toContain('vitamins');
  });

  it('JS fallback correctly identifies missing group', async () => {
    runPrologQuery.mockRejectedValue(new Error('Prolog failure'));

    const result = await calculateDailyBalance(['rice', 'egg']);
    expect(result.isBalanced).toBe(false);
    expect(result.missingGroups).toEqual(['vitamins']);
  });

  it('JS fallback correctly counts Whoa items', async () => {
    runPrologQuery.mockRejectedValue(new Error('Prolog failure'));

    const result = await calculateDailyBalance(['rice', 'candy', 'soda']);
    expect(result.whoaCount).toBe(2);
    expect(result.isBalanced).toBe(false);
  });
});
