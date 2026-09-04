import { useNavigate } from 'react-router-dom';

export default function PuzzlePlaceholder() {
  const navigate = useNavigate();
  return (
    <div className="page-container" style={{ padding: '60px 16px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <h2>Puzzle Game</h2>
      <p style={{ color: '#5B6B61' }}>Coming soon — Person 4 is building this island.</p>
      <button className="btn-secondary" onClick={() => navigate('/home')}>Back Home</button>
    </div>
  );
}
