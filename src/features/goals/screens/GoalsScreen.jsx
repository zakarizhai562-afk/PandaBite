import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import FeatureLoadingScreen from '../../../core/components/FeatureLoadingScreen';
import MascotBubble from '../../../core/components/MascotBubble';
import GoalCard from '../components/GoalCard';
import FoodChoiceTray from '../components/FoodChoiceTray';
import PandaFeedTarget from '../components/PandaFeedTarget';
import HintButton from '../components/HintButton';
import { goals, getGoalById, getGoalFoodChoices } from '../models/goal';
import { createFeedingRound, feedFood, getFeedReaction, getHintClue } from '../services/goalFeedingService';
import foodDatabase from '../../../data/foodDatabase.json';

const GOAL_ROUND_COMPLETE = {
  my: 'ဂုဏ်ယူပါတယ်! အစားအစာအားလုံးကို ကျွေးပြီးပါပြီ!',
  en: 'Congratulations! You fed all the foods!',
};

function FoodDragOverlay({ foodId }) {
  const food = foodDatabase.foods.find((item) => item.id === foodId);
  if (!food) return null;

  return (
    <div className="goals-drag-overlay">
      <img src={food.image} alt={food.name.en} draggable="false" />
      <span>{food.name.en}</span>
    </div>
  );
}

export default function GoalsScreen() {
  const navigate = useNavigate();
  const { goalId: routeGoalId } = useParams();
  const routeSelectedGoal = useMemo(() => goals.some((goal) => goal.id === routeGoalId) ? routeGoalId : null, [routeGoalId]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState(routeSelectedGoal);
  const [round, setRound] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [completedGoalId, setCompletedGoalId] = useState(null);
  const [activeFoodId, setActiveFoodId] = useState(null);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleLoadingDone = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!routeSelectedGoal) {
      setSelectedGoal(null);
      setRound(null);
      setReaction(null);
      setAnimating(false);
      setCompletedGoalId(null);
      setActiveFoodId(null);
      return;
    }

    const choices = getGoalFoodChoices(routeSelectedGoal);
    setSelectedGoal(routeSelectedGoal);
    setRound(createFeedingRound(routeSelectedGoal, choices));
    setReaction(null);
    setAnimating(false);
    setCompletedGoalId(null);
    setActiveFoodId(null);
  }, [routeSelectedGoal]);

  const handleSelectGoal = useCallback((goalId) => {
    navigate('/goals/' + goalId);
    const choices = getGoalFoodChoices(goalId);
    setSelectedGoal(goalId);
    setRound(createFeedingRound(goalId, choices));
    setReaction(null);
    setAnimating(false);
    setCompletedGoalId(null);
    setActiveFoodId(null);
  }, [navigate]);

  const handleDragStart = useCallback((event) => {
    setActiveFoodId(event.active.data.current?.foodId || null);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { over, active } = event;
    setActiveFoodId(null);

    if (!over || over.id !== 'panda-feed-target' || !round) return;

    const foodId = active.data.current?.foodId;
    if (!foodId) return;

    const result = feedFood(round, foodId);
    setRound(result.round);

    if (result.isCorrect) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 500);
    }

    const reactionLine = getFeedReaction(round.goalId, result.isCorrect);
    setReaction({ text: reactionLine, isCorrect: result.isCorrect });

    if (result.round.allResolved) {
      setTimeout(() => {
        setReaction({ text: GOAL_ROUND_COMPLETE, isCorrect: true });
        setCompletedGoalId(round.goalId);
      }, 1000);
    }
  }, [round]);

  const handleDragCancel = useCallback(() => {
    setActiveFoodId(null);
  }, []);

  const handleClue = useCallback((foodId, goalId) => {
    const clueLine = getHintClue(goalId);
    setReaction({ text: clueLine, isCorrect: null });
  }, []);

  const handleBack = useCallback(() => {
    navigate('/goals');
    setSelectedGoal(null);
    setRound(null);
    setReaction(null);
    setCompletedGoalId(null);
  }, [navigate]);

  const handleSeeTips = useCallback(() => {
    navigate('/goals/tips', { state: { goalId: completedGoalId } });
  }, [navigate, completedGoalId]);

  if (loading) {
    return (
      <FeatureLoadingScreen
        image="/world_art/loading_goals.png"
        label="Goals"
        onDone={handleLoadingDone}
      />
    );
  }

  const goal = selectedGoal ? getGoalById(selectedGoal) : null;
  const resolvedFoods = round
    ? round.choices.filter((f) => round.results[f]?.resolved)
    : [];

  const themedReactionPrefix = selectedGoal === 'grow-taller'
    ? 'tall-reaction'
    : selectedGoal === 'clear-skin'
    ? 'skin-reaction'
    : selectedGoal === 'more-energy'
    ? 'energy-reaction'
    : null;
  const reactionState = completedGoalId === selectedGoal
    ? 'complete'
    : reaction?.isCorrect === true
    ? 'correct'
    : reaction?.isCorrect === false
    ? 'wrong'
    : 'idle';
  const reactionWrapClass = themedReactionPrefix && reaction
    ? ` ${themedReactionPrefix}--${reaction.isCorrect === true ? 'correct' : reaction.isCorrect === false ? 'wrong' : 'neutral'}`
    : '';

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className={`goals-screen${selectedGoal ? ' goals-screen--detail' : ''}`}>
        <div className="page-container">
          <div className="goals-header">
            <button
              className="daily-log-back-btn goals-back-btn"
              onClick={() => (selectedGoal ? handleBack() : navigate('/home'))}
              aria-label={selectedGoal ? 'Back to goals' : 'Back to World Map'}
            >
              <span className="visually-hidden">Back</span>
            </button>
            <h2 className="visually-hidden">{selectedGoal ? goal?.name.en : 'Goals'}</h2>
            <div className="goals-header-spacer" />
          </div>

          {!selectedGoal ? (
            <div className="goals-grid">
              {goals.map((g) => (
                <GoalCard key={g.id} goal={g} onSelect={handleSelectGoal} />
              ))}
            </div>
          ) : (
            <div className="goals-game">
              <PandaFeedTarget isAnimating={animating} goalId={selectedGoal} reactionState={reactionState} />

              <div
                className={`goals-reaction-wrap${reaction ? reactionWrapClass : ' goals-reaction-wrap--empty'}`}
                aria-hidden={reaction ? undefined : 'true'}
              >
                {reaction && (
                  <MascotBubble text={reaction.text} />
                )}
              </div>

              {round && !completedGoalId && (
                <HintButton
                  foodId={round.choices.find((f) => !round.results[f]?.resolved)}
                  goalId={selectedGoal}
                  onClue={handleClue}
                />
              )}

              {round && (
                <FoodChoiceTray
                  foodChoices={round.choices}
                  resolvedFoods={resolvedFoods}
                  goalId={selectedGoal}
                  results={round.results}
                />
              )}

              {completedGoalId && (
                <div className="goals-actions">
                  <button className="btn-primary goals-btn-tips" onClick={handleSeeTips}>
                    See Tips
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeFoodId ? <FoodDragOverlay foodId={activeFoodId} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
