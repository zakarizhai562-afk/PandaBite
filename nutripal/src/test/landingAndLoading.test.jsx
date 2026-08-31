import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingScreen from '../features/landing/screens/LandingScreen';
import FeatureLoadingScreen from '../core/components/FeatureLoadingScreen';

describe('LandingScreen', () => {
  it('displays the Start button', () => {
    render(
      <MemoryRouter>
        <LandingScreen />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
  });

  it('displays the app title', () => {
    render(
      <MemoryRouter>
        <LandingScreen />
      </MemoryRouter>
    );
    expect(screen.getByText('NutriPal')).toBeInTheDocument();
  });

  it('renders without crashing on direct route load', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <LandingScreen />
      </MemoryRouter>
    );
    expect(screen.getByText('NutriPal')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
  });
});

describe('FeatureLoadingScreen', () => {
  it('fires onDone after its fixed duration', async () => {
    const onDone = vi.fn();
    render(
      <FeatureLoadingScreen
        image="/world_art/loading_daily_log.png"
        label="Daily Log"
        durationMs={100}
        onDone={onDone}
      />
    );
    expect(onDone).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(onDone).toHaveBeenCalledTimes(1);
    }, { timeout: 300 });
  });

  it('displays the image when provided', () => {
    render(
      <FeatureLoadingScreen
        image="/world_art/loading_daily_log.png"
        label="Daily Log"
        onDone={() => {}}
      />
    );
    const img = screen.getByAltText('Daily Log');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/world_art/loading_daily_log.png');
  });

  it('falls back to plain background when image fails to load', () => {
    render(
      <FeatureLoadingScreen
        image="/bad/path.png"
        label="Broken"
        onDone={() => {}}
      />
    );
    const img = screen.getByAltText('Broken');
    // Simulate image load error
    fireEvent.error(img);
    expect(screen.queryByAltText('Broken')).not.toBeInTheDocument();
  });
});
