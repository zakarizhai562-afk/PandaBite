import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from '../../features/loading/screens/LoadingScreen';
import LandingScreen from '../../features/landing/screens/LandingScreen';
import OnboardingScreen from '../../features/onboarding/screens/OnboardingScreen';
import HomeIslandsScreen from '../../features/homeIslands/screens/HomeIslandsScreen';
import DailyLogScreen from '../../features/dailyLog/screens/DailyLogScreen';
import DailyResultScreen from '../../features/dailyLog/screens/DailyResultScreen';
import GoalsScreen from '../../features/goals/screens/GoalsScreen';
import GoalTipsScreen from '../../features/goals/screens/GoalTipsScreen';
import PuzzleScreen from '../../features/puzzleGame/screens/PuzzleScreen';

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoadingScreen />} />
        <Route path="/landing" element={<LandingScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />

        {/* Home / Food Islands — route: /home */}
        <Route path="/home" element={<HomeIslandsScreen />} />

        {/* Daily Log — route: /daily-log */}
        <Route path="/daily-log" element={<DailyLogScreen />} />

        {/* Daily Result — route: /daily-log/result */}
        <Route path="/daily-log/result" element={<DailyResultScreen />} />

        {/* Goals — route: /goals */}
        <Route path="/goals" element={<GoalsScreen />} />
        <Route path="/goals/tips" element={<GoalTipsScreen />} />
        <Route path="/puzzle" element={<PuzzleScreen />} />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
