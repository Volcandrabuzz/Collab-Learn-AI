import React from 'react';
import { useCourse } from '../context/CourseContext';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Award, AlertCircle, Trophy, Star, Zap } from 'lucide-react';
import ScoreChart from '../components/ScoreChart';

const QuizScoresPage: React.FC = () => {
  const { course, allCourses, quizAttempts, userProgress, badges } = useCourse();
  const navigate = useNavigate();

  const unlockedBadges = badges.filter(b => b.unlockedAt);
  const recentBadges = unlockedBadges
    .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0))
    .slice(0, 3);

  if (allCourses.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">No Quiz Data Available</h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete some quizzes to see your performance analytics here.
          </p>
          <button
            onClick={() => navigate('/generate')}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            <span>Start Learning</span>
          </button>
        </div>
      </div>
    );
  }

  const getOverallStats = () => {
    const allSubtopics = allCourses.flatMap(c => c.subtopics);
    const completedQuizzes = allSubtopics.filter(s => s.quizPassed).length;
    const totalQuizzes = allSubtopics.length + allCourses.filter(c => c.finalQuizCompleted).length;
    const averageScore = quizAttempts.length > 0 
      ? quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / quizAttempts.length 
      : 0;

    return {
      completedQuizzes,
      totalQuizzes,
      averageScore: Math.round(averageScore),
      totalAttempts: quizAttempts.length
    };
  };

  const stats = getOverallStats();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz Scores & Analytics</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track your progress and identify areas for improvement across all your courses.
        </p>
      </div>

      {/* Gamification Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-2xl text-white">
          <div className="flex items-center space-x-3 mb-2">
            <Zap className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">{userProgress.xp} XP</div>
              <div className="text-yellow-100">Level {userProgress.level}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-2xl text-white">
          <div className="flex items-center space-x-3 mb-2">
            <div className="text-2xl">🔥</div>
            <div>
              <div className="text-2xl font-bold">{userProgress.currentStreak}</div>
              <div className="text-orange-100">Day Streak</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl text-white">
          <div className="flex items-center space-x-3 mb-2">
            <Trophy className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">{unlockedBadges.length}</div>
              <div className="text-purple-100">Badges Earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Badges */}
      {recentBadges.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span>Recent Achievements</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {recentBadges.map((badge) => (
              <div key={badge.id} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                <div className="text-3xl">{badge.emoji}</div>
                <div>
                  <div className="font-semibold text-gray-900">{badge.name}</div>
                  <div className="text-sm text-gray-600">{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Award className="h-6 w-6 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Completed</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.completedQuizzes}/{stats.totalQuizzes}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Average Score</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.averageScore}%
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 className="h-6 w-6 text-purple-500" />
            <span className="text-sm font-medium text-gray-600">Total Attempts</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalAttempts}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-3 mb-2">
            <AlertCircle className="h-6 w-6 text-orange-500" />
            <span className="text-sm font-medium text-gray-600">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalQuizzes > 0 ? Math.round((stats.completedQuizzes / stats.totalQuizzes) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Course Performance */}
      <div className="space-y-8 mb-8">
        {allCourses.map((courseItem) => (
          <div key={courseItem.id} className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{courseItem.topic} - Performance</h3>
            <ScoreChart
              data={courseItem.subtopics.map((subtopic, index) => ({
                name: subtopic.name,
                passed: subtopic.quizPassed,
                attempts: quizAttempts.filter(a => a.courseId === courseItem.id && a.subtopicIndex === index).length
              }))}
            />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-1 gap-8 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Attempts</h3>
          <div className="space-y-4">
            {quizAttempts.slice(-5).reverse().map((attempt, index) => {
              const attemptCourse = allCourses.find(c => c.id === attempt.courseId);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <span className="font-medium text-gray-900">
                      {attempt.subtopicIndex !== undefined 
                        ? attemptCourse?.subtopics[attempt.subtopicIndex]?.name 
                        : 'Final Quiz'}
                    </span>
                    <p className="text-sm text-gray-500">
                      {attemptCourse?.topic} - {' '}
                      {new Date(attempt.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    attempt.passed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {attempt.score}% {attempt.passed ? '✓' : '✗'}
                  </div>
                </div>
              );
            })}
            
            {quizAttempts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No quiz attempts yet. Complete some quizzes to see your history!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Incorrect Questions Review */}
      {quizAttempts.some(a => a.incorrectQuestions && a.incorrectQuestions.length > 0) && (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Review Incorrect Questions</h3>
          <div className="space-y-6">
            {quizAttempts
              .filter(a => a.incorrectQuestions && a.incorrectQuestions.length > 0)
              .slice(-3)
              .map((attempt, attemptIndex) => {
                const attemptCourse = allCourses.find(c => c.id === attempt.courseId);
                return (
                  <div key={attemptIndex}>
                    <h4 className="font-semibold text-gray-800 mb-4">
                      {attempt.subtopicIndex !== undefined 
                        ? attemptCourse?.subtopics[attempt.subtopicIndex]?.name 
                        : 'Final Quiz'}
                    </h4>
                    <div className="text-sm text-gray-500 mb-1">
                      {attemptCourse?.topic || 'Unknown Course'}
                    </div>
                    <div className="space-y-4">
                      {attempt.incorrectQuestions?.map((q, qIndex) => (
                        <div key={qIndex} className="p-4 bg-red-50 rounded-xl border-l-4 border-red-400">
                          <p className="font-medium text-gray-900 mb-2">{q.question}</p>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-red-600 font-medium">Your Answer: </span>
                              <span className="text-red-700">{q.userAnswer}</span>
                            </div>
                            <div>
                              <span className="text-green-600 font-medium">Correct Answer: </span>
                              <span className="text-green-700">{q.correctAnswer}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizScoresPage;