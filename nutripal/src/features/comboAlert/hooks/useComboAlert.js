import { useState, useCallback } from 'react';
import { findMatchingCombo, buildTriggerId, hasAlertBeenShown } from '../services/comboAlertService';
import foodDatabase from '../../../data/foodDatabase.json';

/**
 * Hook to manage the combo alert trigger after Daily Log save.
 * @returns {{ checkForComboAlert, comboAlertData, clearComboAlert }}
 */
export function useComboAlert() {
  const [comboAlertData, setComboAlertData] = useState(null);

  const checkForComboAlert = useCallback((loggedFoodIds) => {
    if (!loggedFoodIds || loggedFoodIds.length < 2) return;

    const match = findMatchingCombo(loggedFoodIds);
    if (!match) return;

    const triggerId = buildTriggerId(match.foodA, match.foodB);
    if (hasAlertBeenShown(triggerId)) return;

    const foodAData = foodDatabase.foods.find((f) => f.id === match.foodA);
    const foodBData = foodDatabase.foods.find((f) => f.id === match.foodB);

    if (!foodAData || !foodBData) return;

    setComboAlertData({
      pair: match.pair,
      foodAData,
      foodBData,
      triggerId,
    });
  }, []);

  const clearComboAlert = useCallback(() => {
    setComboAlertData(null);
  }, []);

  return { checkForComboAlert, comboAlertData, clearComboAlert };
}
