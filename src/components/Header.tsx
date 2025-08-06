import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Brain, BarChart3, Trophy, Zap } from 'lucide-react';
import { useCourse } from '../context/CourseContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { userProgress, badges } = useCourse();
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) return null;

  const unlockedBadges = badges.filter(b => b.unlockedAt);
  const currentLevelXP = userProgress.xp - (userProgress.level > 1 ? (userProgress.level - 1) * 100 : 0);
  const nextLevelXP = 100;
  const progressPercentage = (currentLevelXP / nextLevelXP) * 100;

  const LEVEL_NAMES = [
    'Beginner Explorer', 'Curious Learner', 'Knowledge Seeker', 'Study Enthusiast', 'Learning Champion',
    'Wisdom Gatherer', 'Master Student', 'Academic Warrior', 'Knowledge Sage', 'Learning Legend'
  ];

  const navItems = [
    { path: '/generate', label: 'Generate Course', icon: BookOpen },
    { path: '/flashcards', label: 'Memory Flashcards', icon: Brain },
    { path: '/scores', label: 'Quiz Scores', icon: BarChart3 },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LearnAI
            </span>
          </Link>
          
          {/* User Progress Section */}
          <div className="flex items-center space-x-6">
            {/* Level & XP */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  Level {userProgress.level}
                </span>
              </div>
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">
                {currentLevelXP}/{nextLevelXP} XP
              </span>
            </div>

            {/* Streak */}
            {userProgress.currentStreak > 0 && (
              <div className="flex items-center space-x-1 bg-orange-100 px-3 py-1 rounded-full">
                <span className="text-orange-600 text-sm">🔥</span>
                <span className="text-orange-700 text-sm font-medium">
                  {userProgress.currentStreak} day{userProgress.currentStreak !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="flex items-center space-x-1">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">
                {unlockedBadges.length}
              </span>
            </div>
          </div>

          <nav className="flex space-x-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Level Name */}
        <div className="text-center pb-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {LEVEL_NAMES[Math.min(userProgress.level - 1, LEVEL_NAMES.length - 1)]} 🚀
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;