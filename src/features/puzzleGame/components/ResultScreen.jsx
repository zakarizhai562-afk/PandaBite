import { usePandaFrame } from '../hooks/usePandaFrame';

// Shared layout for the 3 end-of-round screens (Game Over, Level Complete,
// Game Complete), matching the Python reference's draw_result_card() (old/
// main.py): a centered card with the title, the panda, a subtitle, the
// score, and exactly one action button.
export default function ResultScreen({
  variant,
  pandaMood,
  subtitleText,
  scoreText,
  buttonLabel,
  onButtonClick,
  secondaryButtonLabel,
  onSecondaryButtonClick,
}) {
  const frameSrc = usePandaFrame(pandaMood);

  return (
    <div className={`puzzle-result-screen puzzle-result-screen--${variant}`}>
      <div className="puzzle-result-card">
        <h1 className="puzzle-result-title">PandaBite</h1>
        <img src={frameSrc} alt="Panda" className="puzzle-result-panda" />
        <h2 className="puzzle-result-subtitle">{subtitleText}</h2>
        <p className="puzzle-result-score">{scoreText}</p>
        {secondaryButtonLabel ? (
          <div className="puzzle-result-btn-row">
            <button className="btn-secondary puzzle-result-btn" onClick={onSecondaryButtonClick}>
              {secondaryButtonLabel}
            </button>
            <button className="btn-primary puzzle-result-btn" onClick={onButtonClick}>
              {buttonLabel}
            </button>
          </div>
        ) : (
          <button className="btn-primary puzzle-result-btn" onClick={onButtonClick}>
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
