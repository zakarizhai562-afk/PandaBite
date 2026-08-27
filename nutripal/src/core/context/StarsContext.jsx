import { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem } from '../utils/storage';

// Shared points (Stars) context — owned by Person 2
// Every feature calls starAwardService to add points and spendPointsService to deduct.
// Points are persisted to localStorage.

const StarsContext = createContext(null);

const STORAGE_KEY = 'nutripal_stars';

export function StarsProvider({ children }) {
  const [stars, setStars] = useState(() => {
    const stored = getItem(STORAGE_KEY);
    return typeof stored === 'number' ? stored : 0;
  });

  useEffect(() => {
    setItem(STORAGE_KEY, stars);
  }, [stars]);

  return (
    <StarsContext.Provider value={{ stars, setStars }}>
      {children}
    </StarsContext.Provider>
  );
}

export function useStars() {
  return useContext(StarsContext);
}
