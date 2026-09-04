import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PuzzleScreen from '../screens/PuzzleScreen';
import { StarsProvider } from '../../../core/context/StarsContext';
import { PetStateProvider } from '../../../core/context/PetStateContext';

describe('PuzzleScreen', () => {
  it('renders the board after the loading splash without breaking hook order', async () => {
    render(
      <MemoryRouter>
        <StarsProvider>
          <PetStateProvider>
            <PuzzleScreen />
          </PetStateProvider>
        </StarsProvider>
      </MemoryRouter>
    );
    await screen.findByText('Hint', {}, { timeout: 8000 });
  });
});
