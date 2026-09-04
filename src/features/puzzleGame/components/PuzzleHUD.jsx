import { STARTING_LIVES, SCORE_TO_LEVEL_COMPLETE, MAX_LEVEL } from '../services/puzzleService';

function Heart({ filled }) {
  return (
    <span
      className={`puzzle-hud__heart ${filled ? 'puzzle-hud__heart--filled' : 'puzzle-hud__heart--empty'}`}
      aria-hidden
    >
      ♥
    </span>
  );
}

export default function PuzzleHUD({ gameState }) {
  const progress = Math.min(gameState.score / SCORE_TO_LEVEL_COMPLETE, 1);

  return (
    <div className="puzzle-hud">
      <div className="puzzle-hud__panel">
        <div className="puzzle-hud__title">PandaBite</div>

        <div className="puzzle-hud__hearts" aria-label={`Lives ${gameState.lives} of ${STARTING_LIVES}`}>
          {Array.from({ length: STARTING_LIVES }).map((_, i) => (
            <Heart key={i} filled={i < gameState.lives} />
          ))}
        </div>

        <div className="puzzle-hud__score-area">
          <div className="puzzle-hud__score-row">
            <span className="puzzle-hud__star">⭐</span>
            <span className="puzzle-hud__score-text">
              {gameState.score} / {SCORE_TO_LEVEL_COMPLETE}
            </span>
          </div>
          <div className="puzzle-hud__progress-bg">
            <div className="puzzle-hud__progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        <div className="puzzle-hud__level">
          LEVEL {gameState.level} / {MAX_LEVEL}
        </div>
      </div>
    </div>
  );
}
