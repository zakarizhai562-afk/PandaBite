import { useNavigate } from 'react-router-dom';
import MapBackground from '../components/worldMap/MapBackground';
import LeafLayer from '../components/worldMap/LeafLayer';
import WaterEffects from '../components/worldMap/WaterEffects';
import Island from '../components/worldMap/Island';
import { islands } from '../data/islandsConfig';

// Layered World Map: background -> water -> leaves -> islands -> top UI.
// This replaces HomeIslandsScreen as the routed "/home" screen; the old
// screen and its IslandHotspot component are left in place, unused but
// intact, as a fallback (see AppRouter.jsx).
export default function WorldMapScreen() {
  const navigate = useNavigate();

  return (
    <div className="wm-screen">
      <div className="wm-stage">
        <MapBackground
          src="/world_art/world_map.png"
          alt="PandaBite World Map — four islands with red panda characters, connected by bridges over a sunny sea"
        />

        <WaterEffects />
        <LeafLayer />

        {islands.map((island, index) => (
          <Island
            key={island.id}
            id={island.id}
            title={island.title}
            image={island.image}
            position={island.position}
            index={index}
            onActivate={() => navigate(island.route)}
          />
        ))}

        <header className="wm-header">
          <button
            type="button"
            className="wm-icon-btn wm-icon-btn--left"
            onClick={() => navigate('/')}
            aria-label="Back to menu"
          >
            ←
          </button>

          <div className="wm-brand" aria-hidden="true">
            <span className="wm-brand-title">PandaBite</span>
            <span className="wm-brand-tagline">Choose Your Adventure!</span>
          </div>

          <button
            type="button"
            className="wm-icon-btn wm-icon-btn--right"
            onClick={() => navigate('/onboarding')}
            aria-label="Replay tutorial"
          >
            ?
          </button>
        </header>
      </div>
    </div>
  );
}
