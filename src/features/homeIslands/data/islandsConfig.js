// Data-driven island configuration for the World Map.
// `route` reuses the project's existing routes exactly — no new routes are introduced here.
// `image` is left null because no separate transparent island cutout PNGs exist yet
// (see WorldMapScreen notes); Island.jsx falls back to the shared map background when absent.
export const islands = [
  {
    id: 'daily-balance',
    title: 'Daily Balance',
    route: '/daily-log',
    image: null,
    position: { left: '23%', top: '7%', width: '25%', height: '46%' },
  },
  {
    id: 'goal-bites',
    title: 'Goal Bites',
    route: '/goals',
    image: null,
    position: { left: '51%', top: '7%', width: '30%', height: '40%' },
  },
  {
    id: 'food-rain',
    title: 'Food Rain',
    route: '/puzzle',
    image: null,
    position: { left: '23%', top: '53%', width: '24%', height: '43%' },
  },
  {
    id: 'yum-or-yuck',
    title: 'Yum or Yuck?',
    route: '/combo',
    image: null,
    position: { left: '51%', top: '53%', width: '30%', height: '43%' },
  },
];
