import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItem } from '../../../core/utils/storage';

export default function LoadingScreen() {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const seen = getItem('hasSeenOnboarding');
      if (!seen) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/landing', { replace: true });
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-screen">
      {!imgError ? (
        <img
          src="/world_art/loading_daily_log.png"
          alt=""
          className="loading-bg"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="loading-fallback" />
      )}
      <div className="loading-overlay">
        <div className="loading-brand">
          <span className="loading-brand-panda">🐼</span>
          <h1>NutriPal</h1>
          <p>Healthy fun with Red Panda</p>
        </div>
        <div className="loading-spinner" aria-label="Loading" />
      </div>
    </div>
  );
}
