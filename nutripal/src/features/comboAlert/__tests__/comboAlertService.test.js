import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getComboType,
  findMatchingCombo,
  hasAlertBeenShown,
  markAlertShown,
  buildTriggerId,
} from '../services/comboAlertService';

describe('comboAlertService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('returns bad for known bad pair via Prolog or fallback', async () => {
    const type = await getComboType('candy', 'rice');
    expect(type).toBe('bad');
  });

  it('returns good for known good pair', async () => {
    const type = await getComboType('egg', 'rice');
    expect(type).toBe('good');
  });

  it('returns null for unknown pair', async () => {
    const type = await getComboType('rice', 'fish');
    expect(type).toBe(null);
  });

  it('returns null for same food twice', async () => {
    const type = await getComboType('rice', 'rice');
    expect(type).toBe(null);
  });

  it('is order-independent', async () => {
    const a = await getComboType('rice', 'candy');
    const b = await getComboType('candy', 'rice');
    expect(a).toBe('bad');
    expect(b).toBe('bad');
  });

  it('findMatchingCombo finds a match among logged foods', async () => {
    const match = await findMatchingCombo(['candy', 'rice', 'fish']);
    expect(match).not.toBeNull();
    expect(match.pair.type).toBe('bad');
  });

  it('findMatchingCombo returns null when no pair matches', async () => {
    const match = await findMatchingCombo(['fish', 'carrot']);
    expect(match).toBeNull();
  });

  it('returns null for less than 2 foods', async () => {
    const match = await findMatchingCombo(['candy']);
    expect(match).toBeNull();
  });

  it('hasAlertBeenShown / markAlertShown tracking works', () => {
    const id = buildTriggerId('candy', 'rice');
    expect(hasAlertBeenShown(id)).toBe(false);
    markAlertShown(id);
    expect(hasAlertBeenShown(id)).toBe(true);
  });

  it('same trigger id never fires twice (shown-alert tracking)', () => {
    const id = buildTriggerId('egg', 'rice');
    markAlertShown(id);
    expect(hasAlertBeenShown(id)).toBe(true);
    const id2 = buildTriggerId('rice', 'egg');
    expect(hasAlertBeenShown(id2)).toBe(true);
  });

  it('buildTriggerId is date-scoped and sorted', () => {
    const a = buildTriggerId('rice', 'candy');
    const b = buildTriggerId('candy', 'rice');
    expect(a).toBe(b);
    expect(a).toMatch(/\d{4}-\d{2}-\d{2}$/);
  });

  it('falls back to plain-JS when Prolog engine throws', async () => {
    const mod = await import('../../../core/prolog/prologEngine');
    const spy = vi.spyOn(mod, 'runPrologQuery').mockRejectedValueOnce(new Error('Prolog crash'));
    const type = await getComboType('candy', 'rice');
    expect(type).toBe('bad');
    spy.mockRestore();
  });
});
