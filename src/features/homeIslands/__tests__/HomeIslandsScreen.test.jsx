import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import HomeIslandsScreen from '../screens/HomeIslandsScreen';

function renderHome() {
  return render(
    <HashRouter>
      <HomeIslandsScreen />
    </HashRouter>
  );
}

describe('HomeIslandsScreen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the world map background image', () => {
    renderHome();
    expect(screen.getByAltText(/PandaBite World Map/i)).toBeInTheDocument();
  });

  it('renders a hotspot button for each of the four islands', () => {
    renderHome();
    expect(screen.getByRole('button', { name: 'Play Daily Balance' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play Goal Bites' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play Food Rain' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play Yum or Yuck?' })).toBeInTheDocument();
  });

  it('island hotspots are focusable buttons', () => {
    renderHome();
    const dailyBalance = screen.getByRole('button', { name: 'Play Daily Balance' });
    expect(dailyBalance.tagName).toBe('BUTTON');
  });

  it('has a help button to replay onboarding', () => {
    renderHome();
    expect(screen.getByRole('button', { name: 'Replay tutorial' })).toBeInTheDocument();
  });

  it('has a menu button to go back', () => {
    renderHome();
    expect(screen.getByRole('button', { name: 'Back to menu' })).toBeInTheDocument();
  });
});
