import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import WorldMapScreen from '../screens/WorldMapScreen';
import { StarsProvider } from '../../../core/context/StarsContext';
import { PetStateProvider } from '../../../core/context/PetStateContext';

function renderWorldMap() {
  return render(
    <HashRouter>
      <StarsProvider>
        <PetStateProvider>
          <WorldMapScreen />
        </PetStateProvider>
      </StarsProvider>
    </HashRouter>
  );
}

describe('WorldMapScreen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the world map background image', () => {
    renderWorldMap();
    expect(screen.getByAltText(/PandaBite World Map/i)).toBeInTheDocument();
  });

  it('renders a focusable button for each of the four islands', () => {
    renderWorldMap();
    for (const name of ['Daily Balance', 'Goal Bites', 'Food Rain', 'Yum or Yuck?']) {
      const btn = screen.getByRole('button', { name: `Play ${name}` });
      expect(btn).toBeInTheDocument();
      expect(btn.tagName).toBe('BUTTON');
    }
  });

  it('has a help button to replay onboarding', () => {
    renderWorldMap();
    expect(screen.getByRole('button', { name: 'Replay tutorial' })).toBeInTheDocument();
  });

  it('has a menu button to go back', () => {
    renderWorldMap();
    expect(screen.getByRole('button', { name: 'Back to menu' })).toBeInTheDocument();
  });
});
