import { useNavigate } from 'react-router-dom';
import { useStars } from '../../../core/context/StarsContext';
import IslandStop from '../components/IslandStop';

const islands = [
  {
    image: '/world_art/island_daily_log.png',
    label: { my: 'နေ့စဉ်မှတ်တမ်း', en: 'Daily Log' },
    route: '/daily-log',
  },
  {
    image: '/world_art/island_puzzle.png',
    label: { my: 'ဇာတ်ကောင်ဂိမ်း', en: 'Puzzle Game' },
    route: '/puzzle',
  },
  {
    image: '/world_art/island_goals.png',
    label: { my: 'ရည်မှန်းချက်များ', en: 'Goals' },
    route: '/goals',
  },
];

export default function HomeIslandsScreen() {
  const { stars } = useStars();
  const navigate = useNavigate();

  return (
    <div className="home-islands-screen">
      <div className="home-cloud home-cloud--1" />
      <div className="home-cloud home-cloud--2" />
      <div className="home-cloud home-cloud--3" />

      <div className="stars-counter">
        <div className="stars-pill">
          <span className="stars-pill-icon">&#11088;</span>
          <span className="stars-pill-value">{stars ?? 0}</span>
        </div>
        <button className="btn-ghost stars-replay-btn" onClick={() => navigate('/onboarding')}>
          ?
        </button>
      </div>

      <div className="home-path">
        <div className="tarot-row">
        {islands.map((island) => (
          <IslandStop
            key={island.route}
            image={island.image}
            label={island.label}
            route={island.route}
          />
        ))}
        </div>
      </div>
    </div>
  );
}
