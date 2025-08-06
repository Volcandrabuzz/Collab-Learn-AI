import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BadgeNotification from './components/BadgeNotification';
import LandingPage from './pages/LandingPage';
import GenerateCoursePage from './pages/GenerateCoursePage';
import CoursePage from './pages/CoursePage';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizScoresPage from './pages/QuizScoresPage';
import { CourseProvider, useCourse } from './context/CourseContext';
import './index.css';

const AppContent: React.FC = () => {
  const { badges } = useCourse();
  const [newBadges, setNewBadges] = useState<any[]>([]);

  useEffect(() => {
    const recentBadges = badges.filter(b => 
      b.unlockedAt && 
      Date.now() - b.unlockedAt < 5000 && // Within last 5 seconds
      !newBadges.find(nb => nb.id === b.id)
    );
    
    if (recentBadges.length > 0) {
      setNewBadges(prev => [...prev, ...recentBadges]);
    }
  }, [badges]);

  const handleCloseBadge = (badgeId: string) => {
    setNewBadges(prev => prev.filter(b => b.id !== badgeId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate" element={<GenerateCoursePage />} />
        <Route path="/course" element={<CoursePage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/scores" element={<QuizScoresPage />} />
      </Routes>
      
      {/* Badge Notifications */}
      {newBadges.map((badge, index) => (
        <div key={badge.id} style={{ top: `${6 + index * 8}rem` }} className="fixed right-4 z-50">
          <BadgeNotification
            badge={badge}
            onClose={() => handleCloseBadge(badge.id)}
          />
        </div>
      ))}
    </div>
  );
};

function App() {
  return (
    <CourseProvider>
      <Router>
        <AppContent />
      </Router>
    </CourseProvider>
  );
}

export default App;