import { useNavigate, useLocation } from 'react-router-dom';
import MascotBubble from '../../../core/components/MascotBubble';
import { getGoalById } from '../models/goal';

export default function GoalTipsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const goalId = location.state?.goalId;
  const goal = goalId ? getGoalById(goalId) : null;

  if (!goal) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Goal not found.</p>
        <button onClick={() => navigate('/goals')}>Back to Goals</button>
      </div>
    );
  }

  return (
    <div
      className="goal-tips-screen"
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
          onClick={() => navigate('/goals')}
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
          Back
        </button>
        <h2
          style={{
            fontFamily: 'Cambria, Georgia, serif',
            fontSize: '18px',
            color: '#1B2B22',
            margin: 0,
          }}
        >
          Tips for {goal.name.en}
        </h2>
        <div style={{ width: '80px' }} />
      </div>

      {/* Mascot */}
      <div style={{ width: '100%', maxWidth: '400px', marginBottom: '20px' }}>
        <MascotBubble
          text={{
            my: 'ဒီအကြံဉာဏ်တွေက မှတ်ဉာဏ်ထားပါ!',
            en: 'Remember these tips for next time!',
          }}
        />
      </div>

      {/* Tips list */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {goal.tips.map((tip, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#FFF3E0',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#2D6A4F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF3E0',
                fontSize: '14px',
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              {index + 1}
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'Cambria, Georgia, serif',
                  fontSize: '14px',
                  color: '#1B2B22',
                  lineHeight: '1.4',
                }}
              >
                {tip.my}
              </p>
              <p
                style={{
                  margin: '4px 0 0',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: '13px',
                  color: '#5B6B61',
                  lineHeight: '1.4',
                }}
              >
                {tip.en}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/goals')}
        style={{
          marginTop: '24px',
          padding: '12px 32px',
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
  );
}
