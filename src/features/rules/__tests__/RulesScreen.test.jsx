import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import RulesScreen from '../screens/RulesScreen';

describe('RulesScreen', () => {
  it('renders one food rule page at a time with the excited panda', () => {
    render(
      <HashRouter>
        <RulesScreen />
      </HashRouter>
    );

    expect(screen.getByRole('heading', { name: 'Go Foods' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Slow Foods' })).not.toBeInTheDocument();
    expect(screen.getByAltText('Excited panda')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('heading', { name: 'Slow Foods' })).toBeInTheDocument();
  });
});
