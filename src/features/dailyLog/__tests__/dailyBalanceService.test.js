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
  });

  it('returns isBalanced: false when 2+ Whoa items on plate', async () => {
    runPrologQuery.mockResolvedValue({
      Groups: ['carbs', 'protein', 'vitamins'],
      WhoaCount: '2',
      IsBalanced: 'false',
    });

    const result = await calculateDailyBalance(['rice', 'egg', 'candy', 'soda']);
    expect(result.isBalanced).toBe(false);
    expect(result.whoaCount).toBe(2);
  });

  it('skips unknown/invalid food IDs without throwing', async () => {
    runPrologQuery.mockResolvedValue({
      Groups: ['carbs'],
      WhoaCount: '0',
      IsBalanced: 'false',
    });

    await expect(calculateDailyBalance(['nonexistent_food', 'rice'])).resolves.toBeDefined();
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
