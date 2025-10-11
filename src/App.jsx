import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import Background from './components/Background';
import { AnimatePresence } from 'framer-motion';

// Test Pages (only imported in development)
import TestPage from './pages/TestPage';
import TestQuestionPage from './pages/test/TestQuestion';
import TestLeaderboardPage from './pages/test/TestLeaderboard';
import TestGameEndPage from './pages/test/TestGameEnd';
import TestMultiplayerPage from './pages/test/TestMultiplayer';

function App() {
  const location = useLocation();

  return (
    <>
      <Background />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Main App Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/lobby/:gamePin" element={<LobbyPage />} />
          <Route path="/game/:gamePin" element={<GamePage />} />

          {/* Development-only Test Routes */}
          {import.meta.env.DEV && (
            <>
              <Route path="/test" element={<TestPage />} />
              <Route path="/test/multiplayer" element={<TestMultiplayerPage />} />
              <Route path="/test/question" element={<TestQuestionPage />} />
              <Route path="/test/leaderboard" element={<TestLeaderboardPage />} />
              <Route path="/test/game-end" element={<TestGameEndPage />} />
            </>
          )}
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
