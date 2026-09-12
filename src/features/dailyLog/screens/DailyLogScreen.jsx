import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import FeatureLoadingScreen from '../../../core/components/FeatureLoadingScreen';
import MascotBubble from '../../../core/components/MascotBubble';
import FoodEntryCard from '../components/FoodEntryCard';
import PlateDropTarget from '../components/PlateDropTarget';
import DailyLogDoneBar from '../components/DailyLogDoneBar';
import DailyLogGoalPoints from '../components/DailyLogGoalPoints';
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

  useEffect(() => {
    setMascotText({
      my: 'Daily Log အင်္ကျ မေ့ Zawmor sore! သင်ပြန်လာတဲ့ အတွက် ကျermainya မေ့ စားချွuye ဤစောင်ရွက်ကို ကာဗိုဟိုက်ဒရိတ်။',
      en: 'Welcome back! Drag foods to build a healthy meal and check your balance.',
    });
  }, []);

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
      if (isOnPlate) return;
      setPlate((prev) => [...prev, food]);
      const reaction = getPerItemReaction(food.id);
      setMascotText(reaction.text);
    } else if (isOnPlate) {
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
        <button
          className="daily-log-back-btn"
          onClick={() => navigate('/home')}
          aria-label="Back to World Map"
        />

        <div className="daily-log-bubble">
          Drag the <span className="highlight-red">food</span> onto the plate to build a healthy meal!
        </div>

        <DailyLogGoalPoints />

        <div className="daily-log-layout">
          <div className="daily-log-left">
            <div className="plate-platform">
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
            </div>
          </div>

          <div className="daily-log-right">
            <div className="daily-log-panda">
              <img
                src="/panda/panda_encouraging.png"
                alt="Red Panda"
                className="panda-img"
              />
            </div>
            <div className="daily-log-help-text">
              Choose foods that give you <span className="highlight-orange">energy</span>, help you <span className="highlight-green">grow</span>, and keep you <span className="highlight-blue">healthy</span>!
            </div>
            <div className="food-box">
              {allFoods.map((food) => (
                <FoodEntryCard key={food.id} food={food} />
              ))}
            </div>
          </div>
        </div>

        <DailyLogDoneBar itemCount={plate.length} onDone={handleDone} />

        {mascotText && (
          <MascotBubble text={mascotText} />
        )}
      </div>
    </DndContext>
  );
}
