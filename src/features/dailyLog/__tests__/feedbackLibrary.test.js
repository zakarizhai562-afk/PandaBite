import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPerItemReaction, selectBalanceFeedback } from '../services/feedbackLibrary';

describe('feedbackLibrary — per-item reactions', () => {
  it('returns DL_ITEM_GO reaction for a Go-tier food (rice)', () => {
    const reaction = getPerItemReaction('rice');
    expect(reaction).toHaveProperty('my');
    expect(reaction).toHaveProperty('en');
    expect(reaction.en).toContain('energy');
  });

  it('returns DL_ITEM_SLOW reaction for a Slow-tier food (fries)', () => {
    const reaction = getPerItemReaction('fries');
    expect(reaction).toHaveProperty('my');
    expect(reaction).toHaveProperty('en');
    expect(reaction.en).toContain('sometimes');
  });

  it('returns DL_ITEM_WHOA reaction for a Whoa-tier food (candy)', () => {
    const reaction = getPerItemReaction('candy');
    expect(reaction).toHaveProperty('my');
    expect(reaction).toHaveProperty('en');
    expect(reaction.en).toContain('little');
  });

  it('returns default reaction for unknown food ID', () => {
    const reaction = getPerItemReaction('nonexistent_food');
    expect(reaction).toHaveProperty('my');
    expect(reaction).toHaveProperty('en');
  });
});

describe('feedbackLibrary — selectBalanceFeedback', () => {
  it('selects a balanced feedback line when all groups covered and 0 Whoa', () => {
    const result = selectBalanceFeedback({
      coveredGroups: ['carbs', 'protein', 'vitamins'],
      missingGroups: [],
      whoaCount: 0,
      isBalanced: true,
    });
    expect(['BAL_01', 'BAL_02', 'BAL_03']).toContain(result.key);
  });

  it('selects BAL_04 when balanced but includes Whoa food', () => {
    const result = selectBalanceFeedback({
      coveredGroups: ['carbs', 'protein', 'vitamins'],
      missingGroups: [],
      whoaCount: 1,
      isBalanced: true,
    });
    expect(result.key).toBe('BAL_04');
  });

  it('selects DEF_C01 when missing carbs', () => {
    const result = selectBalanceFeedback({
      coveredGroups: ['protein', 'vitamins'],
      missingGroups: ['carbs'],
      whoaCount: 0,
      isBalanced: false,
    });
    expect(result.key).toBe('DEF_C01');
  });

  it('selects WARN_W02 when Whoa-heavy and unbalanced', () => {
    const result = selectBalanceFeedback({
      coveredGroups: ['carbs'],
      missingGroups: ['protein', 'vitamins'],
      whoaCount: 3,
      isBalanced: false,
    });
    expect(result.key).toBe('WARN_W02');
  });

  it('selects FALLBACK when no exact match', () => {
    const result = selectBalanceFeedback({
      coveredGroups: [],
      missingGroups: ['carbs', 'protein', 'vitamins'],
      whoaCount: 0,
      isBalanced: false,
    });
    expect(result.key).toBe('FALLBACK');
  });
});
