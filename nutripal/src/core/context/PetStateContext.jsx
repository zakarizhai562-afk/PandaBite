import { createContext, useContext, useMemo } from 'react';
import { useStars } from './StarsContext';
import { getGrowthStage, getGrowthStageLabel } from '../../features/petGrowth/services/growthStageCalculator';

const PetStateContext = createContext(null);

export function PetStateProvider({ children }) {
  const { stars } = useStars();

  const value = useMemo(() => {
    const stage = getGrowthStage(stars);
    return {
      growthStage: stage,
      growthLabel: getGrowthStageLabel(stage),
      stars,
    };
  }, [stars]);

  return <PetStateContext.Provider value={value}>{children}</PetStateContext.Provider>;
}

export function usePetState() {
  const ctx = useContext(PetStateContext);
  if (!ctx) throw new Error('usePetState must be used within PetStateProvider');
  return ctx;
}
