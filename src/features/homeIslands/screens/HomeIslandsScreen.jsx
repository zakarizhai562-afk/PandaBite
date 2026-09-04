import { useNavigate } from 'react-router-dom';
import { useStars } from '../../../core/context/StarsContext';
import { usePetState } from '../../../core/context/PetStateContext';
import IslandStop from '../components/IslandStop';
import IslandPathConnector from '../components/IslandPathConnector';

const islands = [
  {
    image: '/world_art/island_daily_log.png',
    label: { my: 'နေ့စဉ်မှတ်တမ်း', en: 'Daily Log' },
    route: '/daily-log',
    position: 'left',
  },
  {
    image: '/world_art/island_puzzle.png',
    label: { my: 'ဇာတ်ကောင်ဂိမ်း', en: 'Puzzle Game' },
    route: '/puzzle',
    position: 'right',
  },
  {
    image: '/world_art/island_goals.png',
    label: { my: 'ရည်မှန်းချက်များ', en: 'Goals' },
    route: '/goals',
    position: 'left',
  },
];

export default function HomeIslandsScreen() {
  const { stars } = useStars();
  const { growthStage, growthLabel } = usePetState();
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
          <span className="stars-pill-growth">· {growthLabel.en} {growthStage}/3</span>
        </div>
        <button className="btn-ghost stars-replay-btn" onClick={() => navigate('/onboarding')}>
          ?
        </button>
      </div>

      <div className="home-path">
        <IslandPathConnector />

        {islands.map((island) => (
          <IslandStop
            key={island.route}
            image={island.image}
            label={island.label}
            route={island.route}
            position={island.position}
          />
        ))}
      </div>
    </div>
  );
}
