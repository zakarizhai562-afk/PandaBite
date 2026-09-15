import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PuzzleScreen from '../screens/PuzzleScreen';

describe('PuzzleScreen', () => {
  it('renders the board after the loading splash without breaking hook order', async () => {
    render(
      <MemoryRouter>
        <PuzzleScreen />
      </MemoryRouter>
    );
    await screen.findByText('Hint', {}, { timeout: 8000 });
  });
});
