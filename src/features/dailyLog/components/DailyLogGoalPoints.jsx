import { useStars } from '../../../core/context/StarsContext';

export default function DailyLogGoalPoints() {
  const { stars = 0 } = useStars() || {};

  return (
    <div className="daily-log-goal-points">
      <div className="daily-log-goal-points-title">Goal Point</div>
      <div className="daily-log-goal-points-value">
        <span className="daily-log-goal-star">★</span>
        <span>{stars}</span>
      </div>
    </div>
  );
}
