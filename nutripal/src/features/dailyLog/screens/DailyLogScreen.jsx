import { useState, useCallback } from 'react';
import FeatureLoadingScreen from '../../../core/components/FeatureLoadingScreen';
import MascotBubble from '../../../core/components/MascotBubble';
import FoodEntryCard from '../components/FoodEntryCard';
import BalanceSummaryCard from '../components/BalanceSummaryCard';
import { useDailyLog } from '../hooks/useDailyLog';

export default function DailyLogScreen() {
  const [loading, setLoading] = useState(true);
  const [plate, setPlate] = useState([]);
  const { calculateResult } = useDailyLog();

  const handleDrop = useCallback((foodId) => {
    setPlate((prev) => [...prev, foodId]);
    // TODO: show per-item mascot reaction
  }, []);

  const handleRemove = useCallback((index) => {
    setPlate((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDone = useCallback(() => {
    // TODO: calculate balance, navigate to /daily-log/result
    const result = calculateResult(plate);
    console.log('Daily balance result:', result);
  }, [plate, calculateResult]);

  if (loading) {
    return (
      <FeatureLoadingScreen
        image="/world_art/loading_daily_log.png"
        label="Daily Log"
        onDone={() => setLoading(false)}
      />
    );
  }

  return (
    <div className="daily-log-screen">
      <MascotBubble />
      {/* Plate drop target */}
      <div className="plate-area">
        {/* @dnd-kit useDroppable goes here */}
        {plate.map((foodId, i) => (
          <FoodEntryCard key={`${foodId}-${i}`} foodId={foodId} onRemove={() => handleRemove(i)} />
        ))}
      </div>
      {/* Food box picklist */}
      <div className="food-box">
        {/* TODO: render food cards from foodDatabase.json grouped by category */}
      </div>
      <button onClick={handleDone} disabled={plate.length === 0}>Done</button>
    </div>
  );
}
