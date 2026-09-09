import { usePandaFrame } from '../hooks/usePandaFrame';

// The single combined message system: a big, friendly panda beside a
// speech-bubble box, showing either the idle prompt or the active
// correct/wrong feedback -- matching the Python reference's
// draw_top_message_box(). There is only ever one message box on screen.
export default function PandaMessage({ mood, message, feedback }) {
  const frameSrc = usePandaFrame(mood);

  return (
    <div className="puzzle-top-row">
      <div className="puzzle-panda-wrap">
        <div className={`puzzle-panda puzzle-panda--${mood}`}>
          <img src={frameSrc} alt="Panda" className="puzzle-panda__img" draggable={false} />
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
            <span className="puzzle-idle-text__en">{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
