import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItem } from '../../../core/utils/storage';

export default function LandingScreen() {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleStart = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  return (
    <div className="landing-screen">
      {!imgError && (
        <img
          src="/world_art/landing_page.png"
          alt="PandaBite"
          className="landing-bg"
          onError={() => setImgError(true)}
        />
      )}
      {imgError && <div className="landing-fallback" />}
      <div className="landing-content">
        {/* <div className="landing-tagline">
          <span className="landing-tagline-text">Eat Smart, Grow Strong!</span>
        </div> */}
        <button className="landing-start-btn" onClick={handleStart}>
          Start
        </button>
      </div>
    </div>
  );
}
