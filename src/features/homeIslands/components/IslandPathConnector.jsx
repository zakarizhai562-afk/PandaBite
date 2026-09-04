export default function IslandPathConnector() {
  return (
    <svg
      viewBox="0 0 300 600"
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <path
        d="M 150 80 C 80 160, 220 240, 150 320 C 80 400, 220 480, 150 520"
        fill="none"
        stroke="#FF8C42"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="16 8"
        opacity="0.6"
      />
      <path
        d="M 150 80 C 80 160, 220 240, 150 320 C 80 400, 220 480, 150 520"
        fill="none"
        stroke="#FFF3E0"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="8 12"
        opacity="0.8"
      />
    </svg>
  );
}
