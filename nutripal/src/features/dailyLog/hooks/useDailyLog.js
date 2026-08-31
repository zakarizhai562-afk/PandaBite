import { useCallback } from 'react';
import { calculateDailyBalance } from '../services/dailyBalanceService';
import { getItem, setItem } from '../../../core/utils/storage';
import { getTodayKey } from '../../../core/utils/dateUtils';

const HISTORY_KEY = 'nutripal_daily_history';

export function useDailyLog() {
  const calculateResult = useCallback(async (foodIds) => {
    const result = await calculateDailyBalance(foodIds);
    return result;
  }, []);

  const saveEntry = useCallback((entry) => {
    const history = getItem(HISTORY_KEY) || {};
    history[entry.date] = entry;
    setItem(HISTORY_KEY, history);
  }, []);

  const getTodayEntry = useCallback(() => {
    const history = getItem(HISTORY_KEY) || {};
    return history[getTodayKey()] || null;
  }, []);

  return { calculateResult, saveEntry, getTodayEntry };
}
