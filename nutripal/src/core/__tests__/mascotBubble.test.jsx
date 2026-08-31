import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MascotBubble, { MASCOT_WELCOME_BACK } from '../components/MascotBubble';

describe('MascotBubble', () => {
  it('shows MASCOT_WELCOME_BACK when no text prop is given', () => {
    render(<MascotBubble />);
    expect(screen.getByText(MASCOT_WELCOME_BACK.en)).toBeInTheDocument();
    expect(screen.getByText(MASCOT_WELCOME_BACK.my)).toBeInTheDocument();
  });

  it('shows provided bilingual text when text prop is given', () => {
    const text = { my: 'မြန်မာစာ', en: 'English text' };
    render(<MascotBubble text={text} />);
    expect(screen.getByText('English text')).toBeInTheDocument();
    expect(screen.getByText('မြန်မာစာ')).toBeInTheDocument();
  });

  it('renders the mascot avatar SVG', () => {
    const { container } = render(<MascotBubble />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
