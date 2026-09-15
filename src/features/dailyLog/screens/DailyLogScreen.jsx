import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import FeatureLoadingScreen from '../../../core/components/FeatureLoadingScreen';
import FoodEntryCard from '../components/FoodEntryCard';
import PlateDropTarget from '../components/PlateDropTarget';
import DailyLogDoneBar from '../components/DailyLogDoneBar';
import { useDailyLog } from '../hooks/useDailyLog';
import { getDragFoodReaction } from '../services/feedbackLibrary';
import foodDatabase from '../../../data/foodDatabase.json';

const DEFAULT_MASCOT_TEXT = {
  my: 'á€¡á€„á€ºá€¡á€¬á€¸áŠ á€€á€¼á€®á€¸á€‘á€½á€¬á€¸á€™á€¾á€¯á€”á€²á€· á€€á€»á€”á€ºá€¸á€™á€¬á€›á€±á€¸á€¡á€á€½á€€á€º á€€á€±á€¬á€„á€ºá€¸á€á€²á€·á€¡á€…á€¬á€¸á€¡á€…á€¬á€á€½á€±á€€á€­á€¯ á€›á€½á€±á€¸á€•á€«á‹',
  en: 'Choose foods that give you energy, help you grow, and keep you healthy!',
};
const DEFAULT_PANDA_IMAGE = '/images/combobox/excited.png';

export default function DailyLogScreen() {
  const location = useLocation();
  const [loading, setLoading] = useState(() => !location.state?.skipLoading);
  const [plate, setPlate] = useState([]);
  const [mascotText, setMascotText] = useState(DEFAULT_MASCOT_TEXT);
  const [mascotImage, setMascotImage] = useState(DEFAULT_PANDA_IMAGE);
  const [activeDragFood, setActiveDragFood] = useState(null);
  const { calculateResult, saveEntry } = useDailyLog();
  const navigate = useNavigate();

  useEffect(() => {
    setMascotText({
      my: 'ပြန်လာတာ ကြိုဆိုပါတယ်။ အစားအစာတွေကို ပန်းကန်ထဲ ဆွဲထည့်ပြီး မင်းရဲ့နေ့စဉ်အာဟာရကို စစ်ကြည့်ရအောင်။',
      en: 'Welcome back! Drag foods to the plate and check your meal.',
    });
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragStart = useCallback((event) => {
    const food = event.active?.data.current?.food || null;
    setActiveDragFood(food);
    if (food) {
      const reaction = getDragFoodReaction(food);
      setMascotText(reaction.text);
      setMascotImage(reaction.image);
    }
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveDragFood(null);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    setActiveDragFood(null);
    if (!active || !over) return;

    const food = active.data.current?.food;
    const isOnPlate = active.data.current?.isOnPlate;

    if (over.id === 'plate-drop-target') {
      if (isOnPlate) return;
      setPlate((prev) => [...prev, food]);
      const reaction = getDragFoodReaction(food);
      setMascotText(reaction.text);
      setMascotImage(reaction.image);
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
    const entryId = `${today}-${Date.now()}`;
    const entryResult = {
      ...result,
      date: today,
      entryId,
    };
    saveEntry({
      id: entryId,
      date: today,
      foodIds: result.selectedFoodIds,
      ...entryResult,
    });
    navigate('/daily-log/result', {
      state: {
        result: entryResult,
        foodIds: result.selectedFoodIds,
      },
    });
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
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <div className="daily-log-screen">
        <button
          className="daily-log-back-btn"
          onClick={() => navigate('/home')}
          aria-label="Back to World Map"
        />

        <div className="daily-log-bubble">
          <span className="daily-log-bubble-my">
            အစားအစာတွေကို ပန်းကန်ပေါ် ဆွဲတင်ပြီး ကျန်းမာတဲ့အစားအစာတစ်ပွဲ ပြုလုပ်ကြရအောင်။
          </span>
          <span className="daily-log-bubble-en">
            Drag the <span className="highlight-red">food</span> onto the plate to build a healthy meal!
          </span>
        </div>

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
            <DailyLogDoneBar itemCount={plate.length} onDone={handleDone} />
          </div>

          <div className="daily-log-right">
            <div className="daily-log-panda">
              <img
                src={mascotImage}
                alt="Red Panda"
                className="panda-img"
              />
            </div>
            <div className="daily-log-help-text">
              <span className="daily-log-help-my daily-log-help-my-live">{mascotText.my}</span>
              <span className="daily-log-help-my">
                အင်အား၊ ကြီးထွားမှုနဲ့ ကျန်းမာရေးအတွက် ကောင်းတဲ့အစားအစာတွေကို ရွေးပါ။
              </span>
              <span className="daily-log-help-en">
                {mascotText.en}
              </span>
            </div>
            <div className="food-box">
              {allFoods.map((food) => (
                <FoodEntryCard key={food.id} food={food} />
              ))}
            </div>
          </div>
        </div>

      </div>
      <DragOverlay dropAnimation={null} zIndex={9999}>
        {activeDragFood ? (
          <div className="food-card daily-log-drag-overlay">
            <img src={activeDragFood.image} alt={activeDragFood.name.en} />
            <span className="food-name">{activeDragFood.name.en}</span>
            <span className={`food-go-btn food-tier tier-${(activeDragFood.tier || 'Go').toLowerCase()}`}>
              {activeDragFood.tier || 'Go'}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
