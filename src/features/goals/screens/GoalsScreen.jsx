import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import FeatureLoadingScreen from '../../../core/components/FeatureLoadingScreen';
import MascotBubble from '../../../core/components/MascotBubble';
import GoalCard from '../components/GoalCard';
import FoodChoiceTray from '../components/FoodChoiceTray';
import PandaFeedTarget from '../components/PandaFeedTarget';
import HintButton from '../components/HintButton';
import { goals, getGoalById, getGoalFoodChoices } from '../models/goal';
import { createFeedingRound, feedFood, useHint, getFeedReaction, getHintClue } from '../services/goalFeedingService';
import { awardStars } from '../../../core/services/starAwardService';
import { useStars } from '../../../core/context/StarsContext';

const GOAL_ROUND_COMPLETE = {
  my: 'ဂုဏ်ယူပါတယ်! အစားအစာအားလုံးကို ကျွေးပြီးပါပြီ!',
  en: 'Congratulations! You fed all the foods!',
};

const GOAL_HINT_NOT_ENOUGH = {
  my: 'အမှတ်မလုံလောက်သေးပါဘူး!',
  en: 'Not enough points yet — keep playing to earn more!',
};

export default function GoalsScreen() {
  const navigate = useNavigate();
  const { setStars } = useStars();
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [round, setRound] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [completedGoalId, setCompletedGoalId] = useState(null);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleLoadingDone = useCallback(() => {
    setLoading(false);
  }, []);

  const handleSelectGoal = useCallback((goalId) => {
    setSelectedGoal(goalId);
    const choices = getGoalFoodChoices(goalId);
    setRound(createFeedingRound(goalId, choices));
    setReaction(null);
    setCompletedGoalId(null);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { over, active } = event;
    if (!over || over.id !== 'panda-feed-target' || !round) return;

    const foodId = active.data.current?.foodId;
    if (!foodId) return;

    const result = feedFood(round, foodId);
    setRound(result.round);

    if (result.isCorrect) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 500);
      if (result.isStarEligible) {
        awardStars(1, 'goals-feeding', setStars);
      }
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

  const handleClue = useCallback((foodId, goalId) => {
    const clueLine = getHintClue(goalId);
    setReaction({ text: clueLine, isCorrect: null });
  }, []);

  const handleNotEnough = useCallback(() => {
    setReaction({ text: GOAL_HINT_NOT_ENOUGH, isCorrect: null });
  }, []);

  const handleReveal = useCallback((foodId, goalId) => {
    if (!round) return;
    const result = useHint(round, foodId, 'reveal');
    setRound(result.round);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);
    setReaction({ text: { my: 'ဖော်ပြပေးပါပြီ!', en: 'Revealed!' }, isCorrect: null });

    if (result.round.allResolved) {
      setTimeout(() => {
        setReaction({ text: GOAL_ROUND_COMPLETE, isCorrect: true });
        setCompletedGoalId(round.goalId);
      }, 1000);
    }
  }, [round]);

  const handleBack = useCallback(() => {
    setSelectedGoal(null);
    setRound(null);
    setReaction(null);
    setCompletedGoalId(null);
  }, []);

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

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="goals-screen">
        <div className="page-container">
          <div className="goals-header">
            <button className="btn-secondary" onClick={() => (selectedGoal ? handleBack() : navigate('/home'))}>
              {selectedGoal ? 'Back' : 'Home'}
            </button>
            <h2 className="goals-title">{selectedGoal ? goal?.name.en : 'Goals'}</h2>
            <div className="goals-header-spacer" />
          </div>

          {reaction && (
            <div className="goals-reaction-wrap">
              <MascotBubble text={reaction.text} />
            </div>
          )}

          {!selectedGoal ? (
            <div className="goals-grid">
              {goals.map((g) => (
                <GoalCard key={g.id} goal={g} onSelect={handleSelectGoal} />
              ))}
            </div>
          ) : (
            <div className="goals-game">
              <PandaFeedTarget isAnimating={animating} />

              {round && !completedGoalId && (
                <HintButton
                  foodId={round.choices.find((f) => !round.results[f]?.resolved)}
                  goalId={selectedGoal}
                  onClue={handleClue}
                  onReveal={handleReveal}
                  onNotEnough={handleNotEnough}
                />
              )}

              {round && <FoodChoiceTray foodChoices={round.choices} resolvedFoods={resolvedFoods} />}

              {completedGoalId && (
                <div className="goals-actions">
                  <button className="btn-primary goals-btn-tips" onClick={handleSeeTips}>
                    See Tips
                  </button>
                  <button className="btn-secondary goals-btn-back" onClick={handleBack}>
                    Back to Goals
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}
