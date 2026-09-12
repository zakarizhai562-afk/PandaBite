import { useNavigate } from 'react-router-dom';
import IslandHotspot from '../components/IslandHotspot';

const islands = [
  {
    id: 'daily-balance',
    name: 'Daily Balance',
    route: '/daily-log',
    area: { left: '23%', top: '7%', width: '25%', height: '46%' },
  },
  {
    id: 'goal-bites',
    name: 'Goal Bites',
    route: '/goals',
    area: { left: '51%', top: '7%', width: '30%', height: '40%' },
  },
  {
    id: 'food-rain',
    name: 'Food Rain',
    route: '/puzzle',
    area: { left: '23%', top: '53%', width: '24%', height: '43%' },
  },
  {
    id: 'yum-or-yuck',
    name: 'Yum or Yuck?',
    route: '/combo',
    area: { left: '51%', top: '53%', width: '30%', height: '43%' },
  },
];

export default function HomeIslandsScreen() {
  const navigate = useNavigate();

  return (
    <div className="world-map-screen">
      <div className="world-map-stage">
        <img
          src="/world_art/world_map.png"
          alt="PandaBite World Map — four islands with red panda characters, connected by bridges over a sunny sea"
          className="world-map-bg"
        />

        <div className="world-map-cloud world-map-cloud--1" aria-hidden="true" />
        <div className="world-map-cloud world-map-cloud--2" aria-hidden="true" />
        <div className="world-map-cloud world-map-cloud--3" aria-hidden="true" />

        <div className="world-map-bird world-map-bird--1" aria-hidden="true">🕊️</div>
        <div className="world-map-bird world-map-bird--2" aria-hidden="true">🕊️</div>

        <div className="world-map-leaf world-map-leaf--1" aria-hidden="true">🍃</div>
        <div className="world-map-leaf world-map-leaf--2" aria-hidden="true">🍃</div>
        <div className="world-map-leaf world-map-leaf--3" aria-hidden="true">🍃</div>
        <div className="world-map-leaf world-map-leaf--4" aria-hidden="true">🍃</div>
        <div className="world-map-leaf world-map-leaf--5" aria-hidden="true">🍃</div>
        <div className="world-map-leaf world-map-leaf--6" aria-hidden="true">🍃</div>

        <div className="world-map-sparkle world-map-sparkle--1" aria-hidden="true" />
        <div className="world-map-sparkle world-map-sparkle--2" aria-hidden="true" />
        <div className="world-map-sparkle world-map-sparkle--3" aria-hidden="true" />

        <div className="world-map-water-shimmer world-map-water-shimmer--1" aria-hidden="true" />
        <div className="world-map-water-shimmer world-map-water-shimmer--2" aria-hidden="true" />
        <div className="world-map-water-ripple world-map-water-ripple--1" aria-hidden="true" />
        <div className="world-map-water-ripple world-map-water-ripple--2" aria-hidden="true" />

        {islands.map((island) => (
          <IslandHotspot
            key={island.id}
            name={island.name}
            area={island.area}
            onActivate={() => navigate(island.route)}
          />
        ))}

        <div className="world-map-brand" aria-hidden="true">
          <span className="world-map-brand-title">PandaBite</span>
          <span className="world-map-brand-tagline">Choose Your Adventure!</span>
        </div>

        <button
          type="button"
          className="world-map-menu-btn"
          onClick={() => navigate('/')}
          aria-label="Back to menu"
        >
          ←
        </button>

        <button
          type="button"
          className="world-map-help-btn"
          onClick={() => navigate('/onboarding')}
          aria-label="Replay tutorial"
        >
          ?
        </button>
      </div>
    </div>
  );
}
