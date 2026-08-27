import { useStars } from '../../../core/context/StarsContext';
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

  return (
    <div
      className="home-islands-screen"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #EAF4EE 0%, #d4edda 50%, #EAF4EE 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative clouds */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '10%',
        width: '80px',
        height: '40px',
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: '20px',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '15%',
        width: '60px',
        height: '30px',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: '15px',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        top: '45%',
        left: '5%',
        width: '70px',
        height: '35px',
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: '18px',
        zIndex: 0,
      }} />

      {/* Stars counter */}
      <div
        className="stars-counter"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '12px 20px',
          backgroundColor: 'rgba(234, 244, 238, 0.9)',
          backdropFilter: 'blur(8px)',
          borderBottom: '2px solid rgba(45, 106, 79, 0.2)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#FFF3E0',
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <span style={{ fontSize: '20px' }}>&#11088;</span>
          <span
            style={{
              fontFamily: 'Cambria, Georgia, serif',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#1B2B22',
            }}
          >
            {stars ?? 0}
          </span>
        </div>
      </div>

      {/* Island path with stops */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 20px 80px',
          minHeight: 'calc(100vh - 60px)',
        }}
      >
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
