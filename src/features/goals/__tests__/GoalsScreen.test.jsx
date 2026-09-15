import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import GoalsScreen from '../screens/GoalsScreen';

function renderGoals() {
  return render(
    <HashRouter>
      <GoalsScreen />
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
    expect(await screen.findByText('Drag the food to me!')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('Hint button shows the clue on one click', async () => {
    renderGoals();
    await screen.findByText('Goals', {}, { timeout: 2000 });
    fireEvent.click(screen.getByText('Grow Taller').closest('.goal-card'));
    await screen.findByText('Drag the food to me!');
    const hintBtn = screen.getByText('Hint');
    fireEvent.click(hintBtn);
    expect(await screen.findByText(/Does this have protein/)).toBeInTheDocument();
    expect(screen.queryByText('Clue')).not.toBeInTheDocument();
    expect(screen.queryByText('Reveal')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('See Tips only appears once every food choice is resolved', async () => {
    renderGoals();
    await screen.findByText('Goals', {}, { timeout: 2000 });
    expect(screen.queryByText('See Tips')).not.toBeInTheDocument();
  });

  it('keeps Hint as the only clue control', async () => {
    renderGoals();
    await screen.findByText('Goals', {}, { timeout: 2000 });
    fireEvent.click(screen.getByText('Grow Taller').closest('.goal-card'));
    await screen.findByText('Drag the food to me!');
    fireEvent.click(screen.getByText('Hint'));
    expect(await screen.findByText(/Does this have protein/)).toBeInTheDocument();
    expect(screen.queryByText('Clue')).not.toBeInTheDocument();
    expect(screen.queryByText('Reveal')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });
});
