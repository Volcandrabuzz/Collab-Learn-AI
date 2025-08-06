import React, { useState } from 'react';
import { useCourse } from '../context/CourseContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Package, ArrowRight, RotateCcw, Star, Trophy, Zap } from 'lucide-react';
import QuizComponent from '../components/QuizComponent';

const CoursePage: React.FC = () => {
  const { course, updateCourse, updateProgress, userProgress } = useCourse();
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFinalQuiz, setShowFinalQuiz] = useState(false);
  const [showXPGain, setShowXPGain] = useState<{ amount: number; reason: string } | null>(null);

  if (!course) {
    navigate('/generate');
    return null;
  }

  const currentSubtopic = course.subtopics[course.currentSubtopic];
  const allSubtopicsCompleted = course.subtopics.every(s => s.completed && s.quizPassed);

  const handleQuizPass = (score: number) => {
    if (showFinalQuiz) {
      // Course completion
      updateProgress('complete_course');
      updateProgress('pass_quiz', { score });
      updateCourse({
        ...course,
        finalQuizCompleted: true
      });
      setShowFinalQuiz(false);
      return;
    }

    // Quiz pass
    updateProgress('pass_quiz', { score });
    
    const updatedSubtopics = [...course.subtopics];
    updatedSubtopics[course.currentSubtopic] = {
      ...updatedSubtopics[course.currentSubtopic],
      quizPassed: true
    };

    updateCourse({
      ...course,
      subtopics: updatedSubtopics
    });
    setShowQuiz(false);
  };

  const handleQuizFail = () => {
    setShowQuiz(false);
  };

  const handleNextSubtopic = () => {
    if (course.currentSubtopic < course.subtopics.length - 1) {
      updateCourse({
        ...course,
        currentSubtopic: course.currentSubtopic + 1
      });
    }
  };

  const markSubtopicComplete = () => {
    // Subtopic completion
    updateProgress('complete_subtopic');
    setShowXPGain({ amount: 50, reason: 'Subtopic Completed!' });
    
    const updatedSubtopics = [...course.subtopics];
    updatedSubtopics[course.currentSubtopic] = {
      ...updatedSubtopics[course.currentSubtopic],
      completed: true
    };

    updateCourse({
      ...course,
      subtopics: updatedSubtopics
    });
    setShowQuiz(true);
    
    // Hide XP gain after 3 seconds
    setTimeout(() => {
      setShowXPGain(null);
    }, 3000);
  };

  const handleLearnMore = () => {
    navigate('/generate');
  };

  if (course.finalQuizCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* XP Gain Notification */}
        {showXPGain && (
          <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span className="font-semibold">+{showXPGain.amount} XP - {showXPGain.reason}</span>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
          
          {/* Achievement Banner */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <h2 className="text-2xl font-bold text-yellow-800">Course Completed!</h2>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="text-orange-700 font-medium">+200 XP Earned</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-yellow-700 font-medium">Level {userProgress.level}</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Congratulations! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            You've successfully completed the course on {course.topic}!
          </p>
          <button
            onClick={handleLearnMore}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
          >
            <span>Let's Learn More</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  if (showFinalQuiz) {
    return (
      <QuizComponent
        questions={course.finalQuiz}
        onPass={handleQuizPass}
        onFail={handleQuizFail}
        passingScore={15}
        title={`Final Quiz: ${course.topic}`}
        showRetakeOption={true}
      />
    );
  }

  if (showQuiz) {
    return (
      <QuizComponent
        questions={currentSubtopic.quiz}
        onPass={handleQuizPass}
        onFail={handleQuizFail}
        passingScore={8}
        title={`Quiz: ${currentSubtopic.name}`}
        showRetakeOption={true}
        allowRelearn={() => {
          setShowQuiz(false);
        }}
      />
    );
  }

  if (allSubtopicsCompleted && !course.finalQuizCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ready for the Final Challenge?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            You've completed all subtopics! Time for the final comprehensive quiz.
          </p>
          <button
            onClick={() => setShowFinalQuiz(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300"
          >
            <span>Take Final Quiz</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* XP Gain Notification */}
      {showXPGain && (
        <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span className="font-semibold">+{showXPGain.amount} XP - {showXPGain.reason}</span>
          </div>
        </div>
      )}
      
      {/* Topic Introduction */}
      {course.currentSubtopic === 0 && (
        <>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 mb-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Package className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Course Introduction</h2>
            </div>
            <p className="text-lg leading-relaxed opacity-90">
              {course.topicIntro}
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-3xl p-8 mb-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <GraduationCap className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Real-Life Example</h2>
            </div>
            <p className="text-lg leading-relaxed opacity-90">
              {course.realLifeExample}
            </p>
          </div>
        </>
      )}

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Progress</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>🎯 {course.subtopics.filter(s => s.completed && s.quizPassed).length}/{course.subtopics.length} sections</span>
              <span>⚡ {userProgress.xp} XP total</span>
              <span>🏆 Level {userProgress.level}</span>
            </div>
          </div>
          <div className="text-4xl">🚀</div>
        </div>
      </div>

      {/* Current Subtopic */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            {currentSubtopic.name}
          </h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {course.currentSubtopic + 1} of {course.subtopics.length}
          </span>
        </div>
        
        <div className="prose prose-lg max-w-none mb-8">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: currentSubtopic.explanation }}
          />
        </div>

        {!currentSubtopic.completed ? (
          <button
            onClick={markSubtopicComplete}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Complete Section & Take Quiz (+50 XP)</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        ) : currentSubtopic.quizPassed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <span className="font-semibold text-lg">Section Completed!</span>
            </div>
            
            {course.currentSubtopic < course.subtopics.length - 1 && (
              <button
                onClick={handleNextSubtopic}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Next Section</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowQuiz(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Retake Quiz</span>
            </button>
            <div className="text-center">
              <span className="text-red-600 font-medium">Quiz not passed</span>
              <p className="text-sm text-gray-500">Need 8/10 correct to proceed</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Course Progress</span>
          <span className="text-sm text-gray-500">
            {course.subtopics.filter(s => s.completed && s.quizPassed).length} / {course.subtopics.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${(course.subtopics.filter(s => s.completed && s.quizPassed).length / course.subtopics.length) * 100}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;