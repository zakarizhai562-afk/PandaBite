import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import HomeIslandsScreen from '../screens/HomeIslandsScreen';
import { StarsProvider } from '../../../core/context/StarsContext';
import { PetStateProvider } from '../../../core/context/PetStateContext';

function renderHome(stars = 0) {
  if (stars !== null) localStorage.setItem('nutripal_stars', JSON.stringify(stars));
  return render(
    <HashRouter>
      <StarsProvider>
        <PetStateProvider>
          <HomeIslandsScreen />
        </PetStateProvider>
      </StarsProvider>
    </HashRouter>
  );
}

describe('HomeIslandsScreen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders all 3 island stops along the path', () => {
    renderHome();
    expect(screen.getByText('Daily Log')).toBeInTheDocument();
    expect(screen.getByText('Puzzle Game')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
  });

  it('islands are tappable (have role button)', () => {
    renderHome();
    const dailyLog = screen.getByText('Daily Log').closest('.island-stop');
    expect(dailyLog).toHaveAttribute('role', 'button');
    expect(dailyLog).toHaveAttribute('tabIndex', '0');
  });

  it('stars counter reflects shared-state value', () => {
    renderHome(42);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('stars counter defaults to 0 when no stored data', () => {
    localStorage.clear();
    renderHome(null);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('missing island image falls back to plain colored card', () => {
    renderHome();
    const img = screen.getByAltText('Daily Log');
    fireEvent.error(img);
    expect(screen.getAllByText('Daily Log').length).toBeGreaterThan(1);
  });

  it('has replay onboarding button (?)', () => {
    renderHome();
    expect(screen.getByText('?')).toBeInTheDocument();
  });
});
