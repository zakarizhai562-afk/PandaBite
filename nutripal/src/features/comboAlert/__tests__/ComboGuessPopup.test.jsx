import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import ComboGuessPopup from '../components/ComboGuessPopup';
import { StarsProvider } from '../../../core/context/StarsContext';
import * as starAward from '../../../core/services/starAwardService';

const mockPairBad = {
  foodA: 'candy',
  foodB: 'rice',
  type: 'bad',
  reactions: {
    badCorrect: { my: 'မှန်ပါတယ်!', en: 'Correct! Bad pair.' },
    badIncorrect: { my: 'မှားပါတယ်!', en: 'Hmm, eating these together might give you a tummy ache!' },
    goodCorrect: { my: 'ကောင်းပါတယ်!', en: 'Good!' },
    goodIncorrect: { my: 'မကောင်းပါ!', en: 'Not great!' },
  },
};

const mockPairGood = {
  foodA: 'egg',
  foodB: 'rice',
  type: 'good',
  reactions: {
    badCorrect: { my: '', en: '' },
    badIncorrect: { my: '', en: '' },
    goodCorrect: { my: 'ကောင်းပါတယ်!', en: "Yes, it's delicious!" },
    goodIncorrect: { my: 'ထင်သလောက်မကောင်းပါ!', en: 'Actually great!' },
  },
};

const foodAData = { id: 'candy', name: { en: 'Candy', my: 'အချိုမုန်' }, image: '/images/food/candy.png' };
const foodBData = { id: 'rice', name: { en: 'Rice', my: 'ထမင်း' }, image: '/images/food/rice.png' };

function renderPopup(pair = mockPairBad, props = {}) {
  return render(
    <HashRouter>
      <StarsProvider>
        <ComboGuessPopup
          pair={pair}
          foodAData={foodAData}
          foodBData={foodBData}
          triggerId="candy-rice-2026-01-01"
          onDismiss={vi.fn()}
          {...props}
        />
      </StarsProvider>
    </HashRouter>
  );
}

describe('ComboGuessPopup', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders both food images and the Yes/No question', () => {
    renderPopup();
    expect(screen.getByText('Would you eat these two together?')).toBeInTheDocument();
    expect(screen.getByText('Yes, I would!')).toBeInTheDocument();
    expect(screen.getByText("No, I wouldn't")).toBeInTheDocument();
    expect(screen.getByAltText('Candy')).toBeInTheDocument();
    expect(screen.getByAltText('Rice')).toBeInTheDocument();
  });

  it('tapping No on a bad pair shows correct praise and awards a star', () => {
    const spy = vi.spyOn(starAward, 'awardStars');
    renderPopup();
    fireEvent.click(screen.getByText("No, I wouldn't"));
    expect(screen.getByText('Great instinct!')).toBeInTheDocument();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1, 'comboAlert', expect.any(Function));
    spy.mockRestore();
  });

  it('tapping Yes on a bad pair shows incorrect explanation and no star', () => {
    const spy = vi.spyOn(starAward, 'awardStars');
    renderPopup();
    fireEvent.click(screen.getByText('Yes, I would!'));
    expect(screen.getByText('Good try!')).toBeInTheDocument();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('tapping Yes on a good pair is correct and awards star', () => {
    const spy = vi.spyOn(starAward, 'awardStars');
    renderPopup(mockPairGood, {
      foodAData: { id: 'egg', name: { en: 'Egg' }, image: '/images/food/egg.png' },
      foodBData: { id: 'rice', name: { en: 'Rice' }, image: '/images/food/rice.png' },
    });
    fireEvent.click(screen.getByText('Yes, I would!'));
    expect(screen.getByText('Great instinct!')).toBeInTheDocument();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('tapping No on a good pair is incorrect and no star', () => {
    const spy = vi.spyOn(starAward, 'awardStars');
    renderPopup(mockPairGood, {
      foodAData: { id: 'egg', name: { en: 'Egg' }, image: '/images/food/egg.png' },
      foodBData: { id: 'rice', name: { en: 'Rice' }, image: '/images/food/rice.png' },
    });
    fireEvent.click(screen.getByText("No, I wouldn't"));
    expect(screen.getByText('Good try!')).toBeInTheDocument();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('missing food image falls back to colored card with food name', () => {
    renderPopup();
    const img = screen.getByAltText('Candy');
    fireEvent.error(img);
    expect(screen.getByText('Candy')).toBeInTheDocument();
  });

  it('Got it! dismisses the popup via onDismiss', () => {
    const onDismiss = vi.fn();
    renderPopup(mockPairBad, { onDismiss });
    fireEvent.click(screen.getByText("No, I wouldn't"));
    const btn = screen.getByText('Got it!');
    fireEvent.click(btn);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
