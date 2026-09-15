import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import DailyResultScreen from '../screens/DailyResultScreen';

describe('DailyResultScreen render', () => {
  it('renders clean Burmese text in the panda note', () => {
    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/daily-log/result',
          state: {
            result: {
              selectedFoodIds: ['rice', 'egg', 'mango'],
              coveredGroups: ['carbs', 'protein', 'vitamins'],
              missingGroups: [],
              whoaCount: 0,
              tierCounts: { go: 3, slow: 0, whoa: 0 },
              score: 3,
              isBalanced: true,
            },
          },
        }]}
      >
        <DailyResultScreen />
      </MemoryRouter>
    );

    expect(screen.getByText('အာဟာရအုပ်စု သုံးမျိုးလုံး ပါတဲ့ အစားအစာပါ။ အရမ်းကောင်းပါတယ်!')).toBeInTheDocument();
  });
});
