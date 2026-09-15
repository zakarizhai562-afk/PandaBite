import { describe, expect, it } from 'vitest';
import { getDragFoodReaction } from '../services/feedbackLibrary';

describe('drag food reactions', () => {
  it('labels Go foods with friendly encouragement', () => {
    const reaction = getDragFoodReaction({ id: 'rice', tier: 'Go' });

    expect(reaction.label).toBe('Nice pick');
    expect(reaction.text.my).toBeTruthy();
    expect(reaction.text.en).toContain('Nice pick');
    expect(reaction.text.en).toContain('Rice');
  });

  it('labels Whoa foods with a gentle caution', () => {
    const reaction = getDragFoodReaction({ id: 'soda', tier: 'Whoa' });

    expect(reaction.label).toBe('Let\u0027s keep this small');
    expect(reaction.text.my).toBeTruthy();
    expect(reaction.text.en).toContain('Let\u0027s keep this small');
  });

  it('uses natural fallback text for Slow foods without custom copy', () => {
    const reaction = getDragFoodReaction({ id: 'pancakes', tier: 'Slow' });

    expect(reaction.label).toBe('A little is okay');
    expect(reaction.text.my).toBeTruthy();
    expect(reaction.text.en).toContain('small portion');
  });
});