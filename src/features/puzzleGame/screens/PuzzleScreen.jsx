import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import FeatureLoadingScreen from '../../../core/components/FeatureLoadingScreen';
import MascotBubble from '../../../core/components/MascotBubble';
import { useStars } from '../../../core/context/StarsContext';
import { awardStars } from '../../../core/services/starAwardService';
import { spendPoints, HINT_COST } from '../../../core/services/spendPointsService';
import PuzzleHUD from '../components/PuzzleHUD';
import PuzzleBasket from '../components/PuzzleBasket';
import PuzzleFoodCard from '../components/PuzzleFoodCard';
import { BASKETS, getRandomFood } from '../services/puzzleData';
import {
  createInitialState,
  addScore,
  loseLife,
  nextLevel,
  resetGame,
  togglePause,
  PLAYING,
  PAUSED,
  LEVEL_COMPLETE,
  GAME_COMPLETE,
  GAME_OVER,
  POINTS_PER_CORRECT,
  starRating,
  checkAnswer,
  pickRandomMessage,
  MESSAGE_TEXTS_IDLE,
  MESSAGE_TEXTS_HAPPY,
  MESSAGE_TEXTS_SAD,
  TUTORIAL_HINT_TEXT,
  FEEDBACK_DURATION_MS,
  HINT_DURATION_MS,
} from '../services/puzzleService';

export default function PuzzleScreen() {
  const navigate = useNavigate();
  const { setStars } = useStars();
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState(() => createInitialState());
  const [currentFood, setCurrentFood] = useState(() => getRandomFood());
  const [feedback, setFeedback] = useState(null);
  const [pandaMood, setPandaMood] = useState('idle');
  const [pandaMessage, setPandaMessage] = useState(() => pickRandomMessage(MESSAGE_TEXTS_IDLE));
  const [floatingScore, setFloatingScore] = useState(null);
  const [hintedBasketId, setHintedBasketId] = useState(null);
  const [tutorialDismissed, setTutorialDismissed] = useState(() => false);
  const [showHintPicker, setShowHintPicker] = useState(false);
  const [draggedFoodGroup, setDraggedFoodGroup] = useState(null);
  const [activeFood, setActiveFood] = useState(null);
  const feedbackTimerRef = useRef(null);
  const hintTimerRef = useRef(null);

  const isLevelOne = gameState.level === 1;

  useEffect(() => {
    if (isLevelOne && !tutorialDismissed) {
      const timer = setTimeout(() => {
        setTutorialDismissed(true);
        setPandaMessage((prev) => pickRandomMessage(MESSAGE_TEXTS_IDLE, prev));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLevelOne, tutorialDismissed]);

  useEffect(() => {
    if (!tutorialDismissed && isLevelOne) {
      setPandaMessage(TUTORIAL_HINT_TEXT);
    }
  }, [tutorialDismissed, isLevelOne]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } })
  );

  const clearFeedbackLater = useCallback(() => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null);
      setPandaMood('idle');
      setPandaMessage((prev) => pickRandomMessage(MESSAGE_TEXTS_IDLE, prev));
    }, FEEDBACK_DURATION_MS);
  }, []);

  const spawnNextFood = useCallback(() => {
    setCurrentFood((prev) => getRandomFood(prev?.id));
    setDraggedFoodGroup(null);
  }, []);

  const handleCorrect = useCallback(
    (food) => {
      const next = addScore(gameState);
      const isLevelUp = next.state === LEVEL_COMPLETE || next.state === GAME_COMPLETE;
      setGameState(next);
      awardStars(1, 'puzzle-game', setStars);
      setPandaMood('happy');
      setPandaMessage((prev) => pickRandomMessage(MESSAGE_TEXTS_HAPPY, prev));
      setFeedback({ title: 'Great Job!', detail: `+${POINTS_PER_CORRECT} Points`, isCorrect: true });
      setFloatingScore({ id: Date.now(), pos: 'center' });
      setTimeout(() => setFloatingScore(null), 700);
      clearFeedbackLater();
      if (!isLevelUp) {
        setTimeout(spawnNextFood, 500);
      }
    },
    [gameState, setStars, clearFeedbackLater, spawnNextFood]
  );

  const handleWrong = useCallback(
    (food, correctBasket) => {
      const next = loseLife(gameState);
      setGameState(next);
      setPandaMood('sad');
      setPandaMessage((prev) => pickRandomMessage(MESSAGE_TEXTS_SAD, prev));
      const detail = correctBasket ? `${food.name.en} → ${correctBasket.fullName}` : food.name.en;
      setFeedback({ title: 'Try Again!', detail, isCorrect: false });
      if (correctBasket) {
        setHintedBasketId(correctBasket.id);
        if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
        hintTimerRef.current = setTimeout(() => setHintedBasketId(null), HINT_DURATION_MS);
      }
      clearFeedbackLater();
    },
    [gameState, clearFeedbackLater]
  );

  const handleDragStart = useCallback(
    (event) => {
      const food = event.active?.data?.current?.food;
      if (food) {
        setDraggedFoodGroup(food.groups[0]);
        setActiveFood(food);
        if (!tutorialDismissed) {
          setTutorialDismissed(true);
          setPandaMessage((prev) => pickRandomMessage(MESSAGE_TEXTS_IDLE, prev));
        }
      }
    },
    [tutorialDismissed]
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setDraggedFoodGroup(null);
      setActiveFood(null);
      if (gameState.state !== PLAYING || !active || !over) return;
      const food = active.data.current?.food;
      if (!food) return;
      const basketId = over.id;
      const basket = BASKETS.find((b) => b.id === basketId);
      if (!basket) return;

      const { isCorrect, correctBasket } = checkAnswer(food.id, basketId);

      if (isCorrect) {
        handleCorrect(food);
      } else {
        handleWrong(food, correctBasket);
      }
    },
    [gameState.state, handleCorrect, handleWrong]
  );

  const handleNextLevel = useCallback(() => {
    setGameState((prev) => nextLevel(prev));
    setFeedback(null);
    setPandaMood('idle');
    setPandaMessage((prev) => pickRandomMessage(MESSAGE_TEXTS_IDLE, prev));
    spawnNextFood();
  }, [spawnNextFood]);

  const handlePlayAgain = useCallback(() => {
    setGameState(resetGame());
    setFeedback(null);
    setPandaMood('idle');
    setPandaMessage(pickRandomMessage(MESSAGE_TEXTS_IDLE));
    setTutorialDismissed(false);
    setHintedBasketId(null);
    spawnNextFood();
  }, [spawnNextFood]);

  const handleClue = useCallback(() => {
    if (!currentFood) return;
    const result = spendPoints(HINT_COST.CLUE, 'puzzle-hint');
    if (!result.success) {
      setFeedback({ title: 'Not enough points yet', detail: `Need ${HINT_COST.CLUE} ⭐ for a clue`, isCorrect: false });
      clearFeedbackLater();
      setShowHintPicker(false);
      return;
    }
    setStars(result.remaining);
    const correct = BASKETS.find((b) => b.group === currentFood.groups[0]);
    if (correct) {
      setHintedBasketId(correct.id);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      hintTimerRef.current = setTimeout(() => setHintedBasketId(null), 1500);
      setFeedback({ title: 'Clue!', detail: `Try the ${correct.shortLabel} basket`, isCorrect: true });
      clearFeedbackLater();
    }
    setShowHintPicker(false);
  }, [currentFood, setStars, clearFeedbackLater]);

  const handleReveal = useCallback(() => {
    if (!currentFood) return;
    const result = spendPoints(HINT_COST.REVEAL, 'puzzle-hint');
    if (!result.success) {
      setFeedback({ title: 'Not enough points yet', detail: `Need ${HINT_COST.REVEAL} ⭐ to reveal`, isCorrect: false });
      clearFeedbackLater();
      setShowHintPicker(false);
      return;
    }
    setStars(result.remaining);
    setFeedback({ title: 'Revealed!', detail: `${currentFood.name.en} sorted!`, isCorrect: true });
    clearFeedbackLater();
    setTimeout(spawnNextFood, 600);
    setShowHintPicker(false);
  }, [currentFood, setStars, clearFeedbackLater, spawnNextFood]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setGameState((prev) => togglePause(prev));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, []);

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
      <div className="puzzle-result-screen puzzle-result-screen--over">
        <div className="puzzle-result-card">
          <h1 className="puzzle-result-title">PandaBite</h1>
          <div className="puzzle-result-panda">🐼</div>
          <h2 className="puzzle-result-subtitle">Great Try!</h2>
          <p className="puzzle-result-score">Your Score: {gameState.score}</p>
          <button className="btn-primary puzzle-result-btn" onClick={handlePlayAgain}>
            PLAY AGAIN
          </button>
          <button className="btn-ghost puzzle-result-back" onClick={() => navigate('/home')}>
            Back Home
          </button>
        </div>
      </div>
    );
  }

  if (gameState.state === LEVEL_COMPLETE) {
    return (
      <div className="puzzle-result-screen puzzle-result-screen--level">
        <div className="puzzle-result-card">
          <h1 className="puzzle-result-title">PandaBite</h1>
          <div className="puzzle-result-panda">🎉</div>
          <h2 className="puzzle-result-subtitle">Level Complete!</h2>
          <p className="puzzle-result-score">
            Level {gameState.level} Score: {gameState.score}
          </p>
          <div className="puzzle-result-stars" aria-label={`Rating ${starRating(gameState.mistakesThisLevel)} of 3`}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={i < starRating(gameState.mistakesThisLevel) ? 'star-filled' : 'star-empty'}>
                ★
              </span>
            ))}
          </div>
          <button className="btn-primary puzzle-result-btn" onClick={handleNextLevel}>
            NEXT LEVEL
          </button>
        </div>
      </div>
    );
  }

  if (gameState.state === GAME_COMPLETE) {
    return (
      <div className="puzzle-result-screen puzzle-result-screen--complete">
        <div className="puzzle-result-card">
          <h1 className="puzzle-result-title">PandaBite</h1>
          <div className="puzzle-result-panda">🏆</div>
          <h2 className="puzzle-result-subtitle">You Win!</h2>
          <p className="puzzle-result-score">Final Score: {gameState.score}</p>
          <div className="puzzle-result-stars">
            {[0, 1, 2].map((i) => (
              <span key={i} className={i < starRating(gameState.mistakesThisLevel) ? 'star-filled' : 'star-empty'}>
                ★
              </span>
            ))}
          </div>
          <button className="btn-primary puzzle-result-btn" onClick={handlePlayAgain}>
            PLAY AGAIN
          </button>
          <button className="btn-ghost puzzle-result-back" onClick={() => navigate('/home')}>
            Back Home
          </button>
        </div>
      </div>
    );
  }

  const handleDragCancel = useCallback(() => {
    setDraggedFoodGroup(null);
    setActiveFood(null);
  }, []);

  const showTutorialArrow = !tutorialDismissed && isLevelOne && gameState.state === PLAYING && !feedback;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
      <div className="puzzle-screen">
        <PuzzleHUD gameState={gameState} />

        <div className="puzzle-top-row">
          <div className="puzzle-panda-wrap">
            <div className={`puzzle-panda puzzle-panda--${pandaMood}`}>
              <img
                src={
                  pandaMood === 'happy'
                    ? '/panda/panda_celebrating.svg'
                    : pandaMood === 'sad'
                      ? '/panda/panda_nudge.svg'
                      : '/panda/panda_encouraging.svg'
                }
                alt="Panda"
                className="puzzle-panda__img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="puzzle-panda__fallback" style={{ display: 'none' }}>
                🐼
              </div>
            </div>
          </div>

          <div className="puzzle-message-box">
            {feedback ? (
              <div className={`puzzle-feedback ${feedback.isCorrect ? 'puzzle-feedback--correct' : 'puzzle-feedback--wrong'}`}>
                <span className="puzzle-feedback__icon">{feedback.isCorrect ? '★' : '✕'}</span>
                <div className="puzzle-feedback__text">
                  <span className="puzzle-feedback__title">{feedback.title}</span>
                  <span className="puzzle-feedback__detail">{feedback.detail}</span>
                </div>
              </div>
            ) : (
              <div className="puzzle-idle-text">
                <span className="puzzle-idle-text__en">{pandaMessage.en}</span>
                {pandaMessage.my && pandaMessage.my !== pandaMessage.en && (
                  <span className="puzzle-idle-text__my">{pandaMessage.my}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="puzzle-food-area">
          <div className="puzzle-food-area__decor">
            <span className="puzzle-decor-dot puzzle-decor-dot--1" />
            <span className="puzzle-decor-dot puzzle-decor-dot--2" />
            <span className="puzzle-decor-dot puzzle-decor-dot--3" />
            <span className="puzzle-decor-dot puzzle-decor-dot--4" />
          </div>

          {gameState.state === PLAYING && currentFood && (
            <div className="puzzle-food-slot">
              <PuzzleFoodCard food={currentFood} />
              {floatingScore && <div className="puzzle-floating-score">+10 ⭐</div>}
              {showTutorialArrow && <div className="puzzle-tutorial-arrow">⬇ Drag me to a basket!</div>}
            </div>
          )}

          {gameState.state === PAUSED && (
            <div className="puzzle-paused-overlay">
              <h2>PAUSED</h2>
              <p>Press ESC to Resume</p>
            </div>
          )}
        </div>

        <div className="puzzle-baskets-row">
          {BASKETS.map((basket) => {
            const isCorrectTarget = draggedFoodGroup ? basket.group === draggedFoodGroup : false;
            return (
              <PuzzleBasket
                key={basket.id}
                basket={basket}
                isCorrectTarget={isCorrectTarget}
                isHinted={hintedBasketId === basket.id}
              />
            );
          })}
        </div>

        <div className="puzzle-controls">
          <button className="btn-ghost" onClick={() => navigate('/home')}>
            Home
          </button>
          <button className="btn-ghost" onClick={() => setGameState((prev) => togglePause(prev))}>
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

        <MascotBubble text={feedback ? { en: `${feedback.title} ${feedback.detail}`, my: feedback.title } : pandaMessage} />
      </div>
      <DragOverlay dropAnimation={null}>
        {activeFood ? (
          <div className="puzzle-food puzzle-food--overlay">
            <div className="puzzle-food__shadow" />
            <div className="puzzle-food__image-wrap">
              <img src={activeFood.image} alt={activeFood.name.en} className="puzzle-food__image" draggable={false} />
            </div>
            <div className="puzzle-food__name">{activeFood.name.en}</div>
            {activeFood.tier && <div className={`puzzle-food__tier tier-${activeFood.tier.toLowerCase()}`}>{activeFood.tier}</div>}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
