import { HashRouter, Routes, Route } from 'react-router-dom';

// TODO: Import screen components as they are built
// import LandingScreen from '../../features/landing/screens/LandingScreen';
// import DailyLogScreen from '../../features/dailyLog/screens/DailyLogScreen';
// import DailyResultScreen from '../../features/dailyLog/screens/DailyResultScreen';
// import HomeIslandsScreen from '../../features/homeIslands/screens/HomeIslandsScreen';
// import PuzzleScreen from '../../features/puzzleGame/screens/PuzzleScreen';
// import GoalsScreen from '../../features/goals/screens/GoalsScreen';

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        {/* Person 2: Landing — route: / */}
        {/* <Route path="/" element={<LandingScreen />} /> */}

        {/* Person 3: Home / Food Islands — route: /home */}
        {/* <Route path="/home" element={<HomeIslandsScreen />} /> */}

        {/* Person 2: Daily Log — route: /daily-log */}
        {/* <Route path="/daily-log" element={<DailyLogScreen />} /> */}

        {/* Person 2: Daily Result — route: /daily-log/result */}
        {/* <Route path="/daily-log/result" element={<DailyResultScreen />} /> */}

        {/* Person 4: Puzzle Game — route: /puzzle */}
        {/* <Route path="/puzzle" element={<PuzzleScreen />} /> */}

        {/* Person 3: Goals — route: /goals */}
        {/* <Route path="/goals" element={<GoalsScreen />} /> */}
      </Routes>
    </HashRouter>
  );
}
