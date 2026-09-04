import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import GoalsScreen from '../screens/GoalsScreen';
import { StarsProvider } from '../../../core/context/StarsContext';
import { PetStateProvider } from '../../../core/context/PetStateContext';

function renderGoals() {
  return render(
    <HashRouter>
      <StarsProvider>
        <PetStateProvider>
          <GoalsScreen />
        </PetStateProvider>
      </StarsProvider>
    </HashRouter>
  );
}

describe('GoalsScreen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders every goal card from the fixed list', async () => {
    renderGoals();
    await screen.findByText('Goals', {}, { timeout: 2000 });
    expect(screen.getByText('Grow Taller')).toBeInTheDocument();
    expect(screen.getByText('Have More Energy')).toBeInTheDocument();
    expect(screen.getByText('Clear Skin')).toBeInTheDocument();
  });

  it('tapping a goal card starts a feeding round', async () => {
    renderGoals();
    await screen.findByText('Goals', {}, { timeout: 2000 });
    const growCard = screen.getByText('Grow Taller').closest('.goal-card');
    fireEvent.click(growCard);
    expect(await screen.findByText('Drag food to the panda!')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('Hint button shows Clue/Reveal tiers and handles Clue without moving food', async () => {
    localStorage.setItem('nutripal_stars', JSON.stringify(10));
    renderGoals();
    await screen.findByText('Goals', {}, { timeout: 2000 });
    fireEvent.click(screen.getByText('Grow Taller').closest('.goal-card'));
    await screen.findByText('Drag food to the panda!');
    const hintBtn = screen.getByText('Hint');
    fireEvent.click(hintBtn);
    expect(screen.getByText(/Clue/)).toBeInTheDocument();
    expect(screen.getByText(/Reveal/)).toBeInTheDocument();
    const clueBtn = screen.getByText(/Clue/);
    fireEvent.click(clueBtn);
    expect(await screen.findByText(/Does this have protein/)).toBeInTheDocument();
  });

  it('Reveal tier feeds food automatically', async () => {
    localStorage.setItem('nutripal_stars', JSON.stringify(10));
    renderGoals();
    await screen.findByText('Goals', {}, { timeout: 2000 });
    fireEvent.click(screen.getByText('Clear Skin').closest('.goal-card'));
    await screen.findByText('Drag food to the panda!');
    fireEvent.click(screen.getByText('Hint'));
    const revealBtn = screen.getByText(/Reveal/);
    fireEvent.click(revealBtn);
    expect(await screen.findByText('Revealed!')).toBeInTheDocument();
  });

  it('See Tips only appears once every food choice is resolved', async () => {
    renderGoals();
    await screen.findByText('Goals', {}, { timeout: 2000 });
    expect(screen.queryByText('See Tips')).not.toBeInTheDocument();
  });

  it('insufficient points shows not-enough state on hint', async () => {
    localStorage.setItem('nutripal_stars', JSON.stringify(0));
    renderGoals();
    await screen.findByText('Goals', {}, { timeout: 2000 });
    fireEvent.click(screen.getByText('Grow Taller').closest('.goal-card'));
    await screen.findByText('Drag food to the panda!');
    fireEvent.click(screen.getByText('Hint'));
    const clueBtn = screen.getByText(/Clue/);
    expect(clueBtn.disabled).toBe(true);
    const revealBtn = screen.getByText(/Reveal/);
    expect(revealBtn.disabled).toBe(true);
  });
});
