import { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import FeatureLoadingScreen from '../../../core/components/FeatureLoadingScreen';
import MascotBubble from '../../../core/components/MascotBubble';
import FoodEntryCard from '../components/FoodEntryCard';
import PlateDropTarget from '../components/PlateDropTarget';
import { useDailyLog } from '../hooks/useDailyLog';
import { getPerItemReaction } from '../services/feedbackLibrary';
import foodDatabase from '../../../data/foodDatabase.json';

export default function DailyLogScreen() {
  const location = useLocation();
  const [loading, setLoading] = useState(() => !location.state?.skipLoading);
  const [plate, setPlate] = useState([]);
  const [mascotText, setMascotText] = useState(null);
  const { calculateResult, saveEntry } = useDailyLog();
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (!active || !over) return;

    const food = active.data.current?.food;
    const isOnPlate = active.data.current?.isOnPlate;

    if (over.id === 'plate-drop-target') {
      if (isOnPlate) return; // already on plate
      // Add to plate
      setPlate((prev) => [...prev, food]);
      // Show per-item reaction
      const reaction = getPerItemReaction(food.id);
      setMascotText(reaction.text);
    } else if (isOnPlate) {
      // Dragged off the plate — remove it
      setPlate((prev) => prev.filter((f) => f.id !== food.id));
    }
  }, []);

  const handleRemoveFromPlate = useCallback((foodId) => {
    setPlate((prev) => prev.filter((f) => f.id !== foodId));
  }, []);

  const handleDone = useCallback(async () => {
    if (plate.length === 0) return;
    const foodIds = plate.map((f) => f.id);
    const result = await calculateResult(foodIds);
    const today = new Date().toISOString().split('T')[0];
    saveEntry({
      date: today,
      foodIds,
      ...result,
    });
    navigate('/daily-log/result', { state: { result, foodIds } });
  }, [plate, calculateResult, saveEntry, navigate]);

  if (loading) {
    return (
      <FeatureLoadingScreen
        image="/world_art/loading_daily_log.png"
        label="Daily Log"
        onDone={() => setLoading(false)}
      />
    );
  }

  const allFoods = foodDatabase.foods;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="daily-log-screen">
        <div className="page-container">
          <MascotBubble text={mascotText} />

          <PlateDropTarget hasItems={plate.length > 0}>
            {plate.map((food) => (
              <FoodEntryCard
                key={food.id}
                food={food}
                isOnPlate={true}
                onRemove={() => handleRemoveFromPlate(food.id)}
              />
            ))}
          </PlateDropTarget>

          <div className="food-box">
            {allFoods.map((food) => (
              <FoodEntryCard key={food.id} food={food} />
            ))}
          </div>
        </div>

        <div className="daily-log-done-bar">
          <button className="btn-secondary" onClick={() => navigate('/home')}>
            Back
          </button>
          <button className="btn-primary" onClick={handleDone} disabled={plate.length === 0}>
            Done
          </button>
        </div>
      </div>
    </DndContext>
  );
}
