import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from '../../features/loading/screens/LoadingScreen';
import LandingScreen from '../../features/landing/screens/LandingScreen';
import OnboardingScreen from '../../features/onboarding/screens/OnboardingScreen';
import WorldMapScreen from '../../features/homeIslands/screens/WorldMapScreen';
// Note: HomeIslandsScreen + IslandHotspot (the earlier World Map
// implementation) are intentionally left in place, unused, as a fallback —
// see src/features/homeIslands/screens/HomeIslandsScreen.jsx.
import DailyLogScreen from '../../features/dailyLog/screens/DailyLogScreen';
import DailyResultScreen from '../../features/dailyLog/screens/DailyResultScreen';
import GoalsScreen from '../../features/goals/screens/GoalsScreen';
import GoalTipsScreen from '../../features/goals/screens/GoalTipsScreen';
import PuzzleScreen from '../../features/puzzleGame/screens/PuzzleScreen';
import ComboAlertScreen from '../../features/comboAlert/screens/ComboAlertScreen';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoadingScreen />} />
        <Route path="/landing" element={<LandingScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />

        {/* Home / World Map — route: /home */}
        <Route path="/home" element={<WorldMapScreen />} />

        {/* Daily Log — route: /daily-log */}
        <Route path="/daily-log" element={<DailyLogScreen />} />

        {/* Daily Result — route: /daily-log/result */}
        <Route path="/daily-log/result" element={<DailyResultScreen />} />

        {/* Goals — route: /goals */}
        <Route path="/goals" element={<GoalsScreen />} />
        <Route path="/goals/tips" element={<GoalTipsScreen />} />
        <Route path="/puzzle" element={<PuzzleScreen />} />

        {/* Combo Alert — route: /combo */}
        <Route path="/combo" element={<ComboAlertScreen />} />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
