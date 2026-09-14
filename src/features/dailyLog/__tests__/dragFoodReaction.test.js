import { describe, expect, it } from 'vitest';
import { getDragFoodReaction } from '../services/feedbackLibrary';

describe('drag food reactions', () => {
  it('labels Go foods as good choices', () => {
    const reaction = getDragFoodReaction({ id: 'rice', tier: 'Go' });

    expect(reaction.label).toBe('Good choice');
    expect(reaction.text.en).toContain('Good choice');
    expect(reaction.text.en).toContain('Rice');
  });

  it('labels Whoa foods as bad everyday choices', () => {
    const reaction = getDragFoodReaction({ id: 'soda', tier: 'Whoa' });

    expect(reaction.label).toBe('Bad everyday choice');
    expect(reaction.text.en).toContain('Bad everyday choice');
  });

  it('uses tier fallback text for foods without custom copy', () => {
    const reaction = getDragFoodReaction({ id: 'pancakes', tier: 'Slow' });

    expect(reaction.label).toBe('Sometimes choice');
    expect(reaction.text.en).toContain('keep the portion small');
  });
});
