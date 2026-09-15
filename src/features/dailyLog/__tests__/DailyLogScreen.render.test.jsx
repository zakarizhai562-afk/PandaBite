import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import DailyLogScreen from '../screens/DailyLogScreen';

describe('DailyLogScreen render', () => {
  it('renders the daily log food choices after skipping loading', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/daily-log', state: { skipLoading: true } }]}>
        <DailyLogScreen />
      </MemoryRouter>
    );

    expect(screen.getByText('Rice')).toBeInTheDocument();
  });
});
