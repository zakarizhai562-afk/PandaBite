import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import FeatureLoadingScreen from '../../../core/components/FeatureLoadingScreen';
import { useStars } from '../../../core/context/StarsContext';
import { awardStars } from '../../../core/services/starAwardService';
import { spendPoints, HINT_COST } from '../../../core/services/spendPointsService';
import PuzzleHUD from '../components/PuzzleHUD';
import PandaMessage from '../components/PandaMessage';
import PuzzleBasket from '../components/PuzzleBasket';
import PuzzleFoodCard from '../components/PuzzleFoodCard';
import PauseOverlay from '../components/PauseOverlay';
import ResultScreen from '../components/ResultScreen';
import { BASKETS, getBasketByGroup } from '../data/basketData';
import { getRandomFood } from '../data/foodData';
import { MESSAGE_TEXTS_IDLE, MESSAGE_TEXTS_HAPPY, MESSAGE_TEXTS_SAD, TUTORIAL_HINT_TEXT, pickMessage } from '../data/messages';
import { createAudioController } from '../services/audioService';
import { useFallingFood } from '../hooks/useFallingFood';
import {
  createInitialState,
  addScore,
  loseLife,
  nextLevel,
  resetGame,
  togglePause,
  checkAnswer,
  getFeedbackForCorrect,
  getFeedbackForWrong,
  PLAYING,
  PAUSED,
  LEVEL_COMPLETE,
  GAME_COMPLETE,
  GAME_OVER,
  FEEDBACK_DURATION_MS,
  BASKET_HINT_DURATION_MS,
  TUTORIAL_HINT_DURATION_MS,
  FALL_SPEED_PX_PER_SEC_BY_LEVEL,
} from '../services/puzzleService';

export default function PuzzleScreen() {
  const navigate = useNavigate();
  const { setStars } = useStars();
  const audio = useMemo(() => createAudioController(), []);
  // A callback-ref-backed state (not a plain useRef) -- the loading splash
  // renders first, so .puzzle-food-area doesn't exist in the DOM on mount;
  // useFallingFood needs to know the moment it actually attaches, which
  // only a reactive value (not a ref's mutated .current) can trigger.
  const [foodAreaEl, setFoodAreaEl] = useState(null);

  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState(() => createInitialState());
  const [currentFood, setCurrentFood] = useState(() => getRandomFood());
  const [disappearingFood, setDisappearingFood] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [pandaMood, setPandaMood] = useState('idle');
  const [pandaMessage, setPandaMessage] = useState(() => pickMessage(MESSAGE_TEXTS_IDLE));
  const [floatingScore, setFloatingScore] = useState(null);
  const [hintedBasketId, setHintedBasketId] = useState(null);
  const [tutorialDismissed, setTutorialDismissed] = useState(false);
  const [showHintPicker, setShowHintPicker] = useState(false);
  const [draggedFoodGroup, setDraggedFoodGroup] = useState(null);
  const [activeFood, setActiveFood] = useState(null);

  const feedbackTimerRef = useRef(null);
  const feedbackStartedAtRef = useRef(0);
  const feedbackRemainingMsRef = useRef(0);
  const hintTimerRef = useRef(null);

  const isLevelOne = gameState.level === 1;
  const isPlaying = gameState.state === PLAYING;

  // One-time Level-1 tutorial hint, exactly as the Python reference: shown
  // for TUTORIAL_HINT_DURATION_MS or until the player starts their first
  // drag, whichever comes first -- then dismissed for the rest of this
  // session (Play Again / Next Level never bring it back).
  useEffect(() => {
    // Gated on `loading` (not just an empty dep array): all hooks in this
    // component run even while the loading splash is still showing, so an
    // unguarded timer here would start counting down before the player ever
    // sees the game -- same pitfall as the falling-food interval below.
    if (loading || !isLevelOne || tutorialDismissed) return undefined;
    setPandaMessage(TUTORIAL_HINT_TEXT);
    const timer = setTimeout(() => {
      setTutorialDismissed(true);
      setPandaMessage((prev) => pickMessage(MESSAGE_TEXTS_IDLE, prev));
    }, TUTORIAL_HINT_DURATION_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } })
  );

  const clearFeedbackAfter = useCallback((durationMs) => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackStartedAtRef.current = Date.now();
    feedbackRemainingMsRef.current = durationMs;
    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null);
      setPandaMood('idle');
      setPandaMessage((prev) => pickMessage(MESSAGE_TEXTS_IDLE, prev));
    }, durationMs);
  }, []);

  const spawnNextFood = useCallback(() => {
    setCurrentFood((prev) => getRandomFood(prev?.name));
    setDraggedFoodGroup(null);
  }, []);

  const handleReachBottom = useCallback(() => {
    if (!currentFood) return;
    const correctBasket = getBasketByGroup(currentFood.group);
    setGameState((prevState) => loseLife(prevState));
    setPandaMood('sad');
    setPandaMessage((prev) => pickMessage(MESSAGE_TEXTS_SAD, prev));
    setFeedback(getFeedbackForWrong(currentFood, correctBasket));
    audio.playWrong();
    if (correctBasket) {
      setHintedBasketId(correctBasket.id);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      hintTimerRef.current = setTimeout(() => setHintedBasketId(null), BASKET_HINT_DURATION_MS);
    }
    clearFeedbackAfter(FEEDBACK_DURATION_MS);
    // Same food snaps back to the top and keeps falling -- it never
    // disappears/swaps out just because it reached the bottom uncaught,
    // same treatment as a wrong-basket drop.
    resetFall();
    setDraggedFoodGroup(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFood, audio, clearFeedbackAfter]);

  // Falling only ever pauses for dragging, pausing, or the loading splash --
  // NOT for the feedback card. The Python reference calls current_food.fall()
  // every frame regardless of whether "Great Job!"/"Try Again!" is showing,
  // so food must never sit still at the top waiting for feedback to clear.
  const { position: foodPosition, resetFall, foodSize } = useFallingFood({
    areaEl: foodAreaEl,
    active: !loading && isPlaying && !activeFood,
    fallSpeedPxPerSec: FALL_SPEED_PX_PER_SEC_BY_LEVEL[gameState.level] || FALL_SPEED_PX_PER_SEC_BY_LEVEL[1],
    foodKey: currentFood?.name,
    onReachBottom: handleReachBottom,
  });

  const handleCorrect = useCallback(
    (food) => {
      const next = addScore(gameState);
      const isLevelUp = next.state === LEVEL_COMPLETE || next.state === GAME_COMPLETE;
      setGameState(next);
      awardStars(1, 'puzzle-game', setStars);
      audio.playCorrect();
      if (isLevelUp) audio.playLevelComplete();
      setPandaMood('happy');
      setPandaMessage((prev) => pickMessage(MESSAGE_TEXTS_HAPPY, prev));
      setFeedback(getFeedbackForCorrect());
      setFloatingScore({ id: Date.now() });
      setTimeout(() => setFloatingScore(null), 700);
      setDisappearingFood({ image: food.image, name: food.name, id: Date.now() });
      setTimeout(() => setDisappearingFood(null), 300);
      clearFeedbackAfter(FEEDBACK_DURATION_MS);
      if (!isLevelUp) {
        spawnNextFood(); // instant respawn, same as the Python reference
      }
    },
    [gameState, setStars, audio, clearFeedbackAfter, spawnNextFood]
  );

  const handleWrongDrop = useCallback(
    (food, correctBasket) => {
      setGameState((prev) => loseLife(prev));
      setPandaMood('sad');
      setPandaMessage((prev) => pickMessage(MESSAGE_TEXTS_SAD, prev));
      setFeedback(getFeedbackForWrong(food, correctBasket));
      audio.playWrong();
      if (correctBasket) {
        setHintedBasketId(correctBasket.id);
        if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
        hintTimerRef.current = setTimeout(() => setHintedBasketId(null), BASKET_HINT_DURATION_MS);
      }
      clearFeedbackAfter(FEEDBACK_DURATION_MS);
      resetFall(); // same food snaps back to the top and resumes falling
    },
    [audio, clearFeedbackAfter, resetFall]
  );

  const handleDragStart = useCallback(
    (event) => {
      const food = event.active?.data?.current?.food;
      if (food) {
        setFeedback(null);
        setDraggedFoodGroup(food.group);
        setActiveFood(food);
        if (!tutorialDismissed) {
          setTutorialDismissed(true);
          setPandaMessage((prev) => pickMessage(MESSAGE_TEXTS_IDLE, prev));
        }
      }
    },
    [tutorialDismissed]
  );

  const handleDragCancel = useCallback(() => {
    setDraggedFoodGroup(null);
    setActiveFood(null);
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setDraggedFoodGroup(null);
      setActiveFood(null);
      if (!isPlaying || !active) return;
      const food = active.data.current?.food;
      if (!food) return;

      if (!over) {
        // Dropped outside every basket: silently snap back to the top, no
        // penalty -- matches the Python reference exactly.
        resetFall();
        return;
      }

      const { isCorrect, correctBasket } = checkAnswer(food.group, over.id);
      if (isCorrect) {
        handleCorrect(food);
      } else {
        handleWrongDrop(food, correctBasket);
      }
    },
    [isPlaying, handleCorrect, handleWrongDrop, resetFall]
  );

  const handleNextLevel = useCallback(() => {
    audio.playClick();
    setGameState((prev) => nextLevel(prev));
    setFeedback(null);
    setPandaMood('idle');
    setPandaMessage((prev) => pickMessage(MESSAGE_TEXTS_IDLE, prev));
    spawnNextFood();
  }, [audio, spawnNextFood]);

  const handlePlayAgain = useCallback(() => {
    audio.playClick();
    setGameState(resetGame());
    setFeedback(null);
    setPandaMood('idle');
    setPandaMessage((prev) => pickMessage(MESSAGE_TEXTS_IDLE, prev));
    setHintedBasketId(null);
    spawnNextFood();
    // tutorialDismissed is deliberately NOT reset here -- once dismissed it
    // stays dismissed for the rest of this session, same as the Python reference.
  }, [audio, spawnNextFood]);

  const handleClue = useCallback(() => {
    if (!currentFood) return;
    const result = spendPoints(HINT_COST.CLUE, 'puzzle-hint');
    if (!result.success) {
      setFeedback({ title: 'Not enough points yet', detail: `Need ${HINT_COST.CLUE} ⭐ for a clue`, isCorrect: false });
      clearFeedbackAfter(FEEDBACK_DURATION_MS);
      setShowHintPicker(false);
      return;
    }
    setStars(result.remaining);
    const correct = getBasketByGroup(currentFood.group);
    if (correct) {
      setHintedBasketId(correct.id);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      hintTimerRef.current = setTimeout(() => setHintedBasketId(null), 1500);
      setFeedback({ title: 'Clue!', detail: `Try the ${correct.shortLabel} basket`, isCorrect: true });
      clearFeedbackAfter(FEEDBACK_DURATION_MS);
    }
    setShowHintPicker(false);
  }, [currentFood, setStars, clearFeedbackAfter]);

  const handleReveal = useCallback(() => {
    if (!currentFood) return;
    const result = spendPoints(HINT_COST.REVEAL, 'puzzle-hint');
    if (!result.success) {
      setFeedback({ title: 'Not enough points yet', detail: `Need ${HINT_COST.REVEAL} ⭐ to reveal`, isCorrect: false });
      clearFeedbackAfter(FEEDBACK_DURATION_MS);
      setShowHintPicker(false);
      return;
    }
    setStars(result.remaining);
    setFeedback({ title: 'Revealed!', detail: `${currentFood.name} sorted!`, isCorrect: true });
    clearFeedbackAfter(FEEDBACK_DURATION_MS);
    setTimeout(spawnNextFood, 600);
    setShowHintPicker(false);
  }, [currentFood, setStars, clearFeedbackAfter, spawnNextFood]);

  // PLAYING <-> PAUSED. Pausing stops music and (if a feedback card is
  // showing) freezes its remaining display time instead of letting it expire
  // while paused -- both matching the Python reference's main loop. Shared by
  // the ESC key, the Pause/Resume button, and tapping the pause overlay.
  const handleTogglePause = useCallback(() => {
    setGameState((prev) => {
      const next = togglePause(prev);
      if (next.state === PAUSED) {
        audio.pauseBgm();
        if (feedbackTimerRef.current) {
          clearTimeout(feedbackTimerRef.current);
          const elapsed = Date.now() - feedbackStartedAtRef.current;
          feedbackRemainingMsRef.current = Math.max(0, feedbackRemainingMsRef.current - elapsed);
        }
      } else if (next.state === PLAYING) {
        audio.resumeBgm();
        if (feedback && feedbackRemainingMsRef.current > 0) {
          clearFeedbackAfter(feedbackRemainingMsRef.current);
        }
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio, feedback]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleTogglePause();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleTogglePause]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, []);

  // Browsers block audio before a user gesture -- start music on the first tap/click.
  const handleFirstInteraction = useCallback(() => {
    audio.startBgmOnce();
  }, [audio]);

  if (loading) {
    return (
      <FeatureLoadingScreen
        image="/world_art/loading_puzzle.png"
        label="Puzzle Game"
        onDone={() => setLoading(false)}
      />
    );
  }

  if (gameState.state === GAME_OVER) {
    return (
      <ResultScreen
        variant="over"
        pandaMood="sad"
        subtitleText="Great Try!"
        scoreText={`Your Score: ${gameState.score}`}
        buttonLabel="PLAY AGAIN"
        showStars={false}
        onButtonClick={handlePlayAgain}
      />
    );
  }

  if (gameState.state === LEVEL_COMPLETE) {
    return (
      <ResultScreen
        variant="level"
        pandaMood="happy"
        subtitleText="Level Complete!"
        scoreText={`Level ${gameState.level} Score: ${gameState.score}`}
        buttonLabel="NEXT LEVEL"
        showStars
        mistakesThisLevel={gameState.mistakesThisLevel}
        onButtonClick={handleNextLevel}
      />
    );
  }

  if (gameState.state === GAME_COMPLETE) {
    return (
      <ResultScreen
        variant="complete"
        pandaMood="happy"
        subtitleText="You Win!"
        scoreText={`Final Score: ${gameState.score}`}
        buttonLabel="PLAY AGAIN"
        showStars
        mistakesThisLevel={gameState.mistakesThisLevel}
        onButtonClick={handlePlayAgain}
      />
    );
  }

  const showTutorialArrow = !tutorialDismissed && isLevelOne && isPlaying && !feedback;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
      <div className="puzzle-screen" onPointerDown={handleFirstInteraction}>
        <PuzzleHUD gameState={gameState} />

        <PandaMessage mood={pandaMood} message={pandaMessage} feedback={feedback} />

        <div className="puzzle-food-area" ref={setFoodAreaEl}>
          <div className="puzzle-food-area__decor">
            <span className="puzzle-decor-dot puzzle-decor-dot--1" />
            <span className="puzzle-decor-dot puzzle-decor-dot--2" />
            <span className="puzzle-decor-dot puzzle-decor-dot--3" />
            <span className="puzzle-decor-dot puzzle-decor-dot--4" />
          </div>

          {isPlaying && currentFood && (
            <div
              className="puzzle-food-slot"
              style={{ left: `${foodPosition.x}px`, top: `${foodPosition.y}px`, width: `${foodSize}px` }}
            >
              <PuzzleFoodCard key={currentFood.name} food={currentFood} disabled={!isPlaying} />
              {showTutorialArrow && <div className="puzzle-tutorial-arrow">⬇ Drag me to a basket!</div>}
            </div>
          )}

          {floatingScore && (
            <div className="puzzle-floating-score-wrap">
              <div className="puzzle-floating-score">+10 ⭐</div>
            </div>
          )}

          {disappearingFood && (
            <div className="puzzle-food-disappear">
              <img src={disappearingFood.image} alt={disappearingFood.name} />
            </div>
          )}
        </div>

        <div className="puzzle-baskets-row">
          {BASKETS.map((basket) => (
            <PuzzleBasket
              key={basket.id}
              basket={basket}
              isCorrectDragTarget={draggedFoodGroup === basket.group}
              isHinted={hintedBasketId === basket.id}
            />
          ))}
        </div>

        <div className="puzzle-controls">
          <button className="btn-ghost" onClick={() => navigate('/home')}>
            Back to World Map
          </button>
          <button className="btn-ghost" onClick={handleTogglePause}>
            {gameState.state === PAUSED ? 'Resume' : 'Pause'}
          </button>
          <div className="puzzle-hint-wrap">
            <button className="btn-secondary puzzle-hint-btn" onClick={() => setShowHintPicker((v) => !v)}>
              Hint
            </button>
            {showHintPicker && (
              <div className="puzzle-hint-picker">
                <button className="puzzle-hint-option puzzle-hint-option--clue" onClick={handleClue}>
                  Clue (2 ⭐)
                </button>
                <button className="puzzle-hint-option puzzle-hint-option--reveal" onClick={handleReveal}>
                  Reveal (5 ⭐)
                </button>
                <button className="puzzle-hint-option puzzle-hint-option--cancel" onClick={() => setShowHintPicker(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {gameState.state === PAUSED && <PauseOverlay onResume={handleTogglePause} />}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeFood ? (
          <div className="puzzle-food puzzle-food--overlay">
            <div className="puzzle-food__shadow" />
            <div className="puzzle-food__image-wrap">
              <img src={activeFood.image} alt={activeFood.name} className="puzzle-food__image" draggable={false} />
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
