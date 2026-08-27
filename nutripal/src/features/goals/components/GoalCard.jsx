import BilingualText from '../../../core/components/BilingualText';

export default function GoalCard({ goal, onSelect }) {
  return (
    <div
      className="goal-card"
      onClick={() => onSelect(goal.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(goal.id); }}
      style={{
        backgroundColor: '#FFF3E0',
        borderRadius: '20px',
        padding: '20px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '3px solid transparent',
        transition: 'border-color 0.2s, transform 0.2s',
        minHeight: '44px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#FF8C42';
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#2D6A4F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px',
        }}
      >
        <span style={{ fontSize: '28px' }}>
          {goal.id === 'grow-taller' ? '&#127794;' : goal.id === 'more-energy' ? '&#9889;' : '&#128156;'}
        </span>
      </div>
      <BilingualText my={goal.name.my} en={goal.name.en} />
    </div>
  );
}
