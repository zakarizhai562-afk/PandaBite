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
      <div
        className="goals-screen"
        style={{
          minHeight: '100vh',
          backgroundColor: '#EAF4EE',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Header */}
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <button
            onClick={() => selectedGoal ? handleBack() : navigate('/home')}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#2D6A4F',
              color: '#FFF3E0',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            {selectedGoal ? 'Back' : 'Home'}
          </button>
          <h2
            style={{
              fontFamily: 'Cambria, Georgia, serif',
              fontSize: '20px',
              color: '#1B2B22',
              margin: 0,
            }}
          >
            {selectedGoal ? goal?.name.en : 'Goals'}
          </h2>
          <div style={{ width: '80px' }} />
        </div>

        {/* Mascot reaction */}
        {reaction && (
          <div style={{ width: '100%', maxWidth: '400px', marginBottom: '16px' }}>
            <MascotBubble text={reaction.text} />
          </div>
        )}

        {/* Content */}
        {!selectedGoal ? (
          /* Goal selection */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            {goals.map((g) => (
              <GoalCard key={g.id} goal={g} onSelect={handleSelectGoal} />
            ))}
          </div>
        ) : (
          /* Feeding mini-game */
          <div
            style={{
              width: '100%',
              maxWidth: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            {/* Panda drop target */}
            <PandaFeedTarget isAnimating={animating} />

            {/* Hint button for first unresolved food */}
            {round && !completedGoalId && (
              <HintButton
                foodId={round.choices.find((f) => !round.results[f]?.resolved)}
                goalId={selectedGoal}
                onClue={handleClue}
                onReveal={handleReveal}
              />
            )}

            {/* Food choice tray */}
            {round && (
              <FoodChoiceTray
                foodChoices={round.choices}
                resolvedFoods={resolvedFoods}
              />
            )}

            {/* Round complete actions */}
            {completedGoalId && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  onClick={handleSeeTips}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#FF8C42',
                    color: '#FFF3E0',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    minHeight: '44px',
                  }}
                >
                  See Tips
                </button>
                <button
                  onClick={handleBack}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#2D6A4F',
                    color: '#FFF3E0',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    minHeight: '44px',
                  }}
                >
                  Back to Goals
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DndContext>
  );
}
