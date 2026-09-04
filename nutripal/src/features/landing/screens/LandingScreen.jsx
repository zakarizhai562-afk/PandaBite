import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItem } from '../../../core/utils/storage';

export default function LandingScreen() {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleStart = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  const handleReplayOnboarding = useCallback(() => {
    navigate('/onboarding');
  }, [navigate]);

  const hasSeen = !!getItem('hasSeenOnboarding');

  return (
    <div className="landing-screen">
      {!imgError && (
        <img
          src="/world_art/landing_page.png"
          alt="NutriPal"
          className="landing-bg"
          onError={() => setImgError(true)}
        />
      )}
      {imgError && <div className="landing-fallback" />}
      <div className="landing-content">
        <h1>NutriPal</h1>
        <p className="landing-subtitle">Healthy fun with Red Panda</p>
        <button className="btn-primary landing-start" onClick={handleStart}>
          Start
        </button>
        {hasSeen && (
          <button className="btn-ghost landing-replay" onClick={handleReplayOnboarding}>
            How to play?
          </button>
        )}
      </div>
    </div>
  );
}
