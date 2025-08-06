import React, { createContext, useContext, useState, useEffect } from 'react';

interface Question {
  id: number;
  type: 'mcq' | 'text';
  question: string;
  options?: string[];
  answer: string;
}

interface Subtopic {
  id: number;
  name: string;
  explanation: string;
  flashcardPoints: string[];
  quiz: Question[];
  completed: boolean;
  quizPassed: boolean;
}

interface Course {
  id: string;
  topic: string;
  topicIntro: string;
  realLifeExample: string;
  subtopics: Subtopic[];
  finalQuiz: Question[];
  currentSubtopic: number;
  finalQuizCompleted: boolean;
  createdAt: number;
}

interface QuizAttempt {
  courseId: string;
  subtopicIndex?: number; // undefined for final quiz
  score: number;
  passed: boolean;
  timestamp: number;
  incorrectQuestions?: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
  }>;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  criteria: string;
  unlockedAt?: number;
}

interface UserProgress {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string;
  totalSubtopicsCompleted: number;
  totalQuizzesPassed: number;
  totalFlashcardsReviewed: number;
  perfectQuizzes: number;
  coursesCompleted: number;
}

interface CourseContextType {
  course: Course | null;
  allCourses: Course[];
  setCourse: (course: Course | null) => void;
  updateCourse: (course: Course) => void;
  quizAttempts: QuizAttempt[];
  addQuizAttempt: (attempt: QuizAttempt) => void;
  clearCourse: () => void;
  userProgress: UserProgress;
  badges: Badge[];
  updateProgress: (action: string, data?: any) => void;
  checkAndUnlockBadges: () => void;
  getXPForLevel: (level: number) => number;
  switchToCourse: (courseId: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

const BADGES: Badge[] = [
  {
    id: 'first-step',
    name: 'First Step',
    description: 'Completed your first subtopic',
    emoji: '📘',
    criteria: 'Complete 1 subtopic'
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: '5-day learning streak',
    emoji: '🔥',
    criteria: 'Maintain a 5-day learning streak'
  },
  {
    id: 'quiz-ace',
    name: 'Quiz Ace',
    description: 'Scored 100% on any quiz',
    emoji: '💯',
    criteria: 'Score 100% on any quiz'
  },
  {
    id: 'memory-king',
    name: 'Memory King',
    description: 'Reviewed 50 flashcards',
    emoji: '🧠',
    criteria: 'Review 50 flashcards'
  },
  {
    id: 'course-conqueror',
    name: 'Course Conqueror',
    description: 'Completed entire course + final quiz',
    emoji: '🏅',
    criteria: 'Complete a full course'
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Scored 100% on 5 quizzes',
    emoji: '⭐',
    criteria: 'Score 100% on 5 different quizzes'
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Completed 3 courses',
    emoji: '🎓',
    criteria: 'Complete 3 full courses'
  },
  {
    id: 'dedication',
    name: 'Dedication',
    description: '10-day learning streak',
    emoji: '💪',
    criteria: 'Maintain a 10-day learning streak'
  }
];

const LEVEL_NAMES = [
  'Beginner Explorer', 'Curious Learner', 'Knowledge Seeker', 'Study Enthusiast', 'Learning Champion',
  'Wisdom Gatherer', 'Master Student', 'Academic Warrior', 'Knowledge Sage', 'Learning Legend'
];

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [course, setCourseState] = useState<Course | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    lastLoginDate: '',
    totalSubtopicsCompleted: 0,
    totalQuizzesPassed: 0,
    totalFlashcardsReviewed: 0,
    perfectQuizzes: 0,
    coursesCompleted: 0
  });
  const [badges, setBadges] = useState<Badge[]>(BADGES);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCourse = localStorage.getItem('learnai-current-course');
    const savedCourses = localStorage.getItem('learnai-all-courses');
    const savedAttempts = localStorage.getItem('learnai-quiz-attempts');
    const savedProgress = localStorage.getItem('learnai-user-progress');
    const savedBadges = localStorage.getItem('learnai-badges');
    
    if (savedCourse) {
      try {
        setCourseState(JSON.parse(savedCourse));
      } catch (error) {
        console.error('Failed to load current course from localStorage:', error);
      }
    }

    if (savedCourses) {
      try {
        setAllCourses(JSON.parse(savedCourses));
      } catch (error) {
        console.error('Failed to load courses from localStorage:', error);
      }
    }
    
    if (savedAttempts) {
      try {
        setQuizAttempts(JSON.parse(savedAttempts));
      } catch (error) {
        console.error('Failed to load quiz attempts from localStorage:', error);
      }
    }

    if (savedProgress) {
      try {
        setUserProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Failed to load user progress from localStorage:', error);
      }
    }

    if (savedBadges) {
      try {
        setBadges(JSON.parse(savedBadges));
      } catch (error) {
        console.error('Failed to load badges from localStorage:', error);
        setBadges(BADGES);
      }
    }

    // Update streak on app load
    updateStreak();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (course) {
      localStorage.setItem('learnai-current-course', JSON.stringify(course));
    } else {
      localStorage.removeItem('learnai-current-course');
    }
  }, [course]);

  useEffect(() => {
    localStorage.setItem('learnai-all-courses', JSON.stringify(allCourses));
  }, [allCourses]);

  useEffect(() => {
    localStorage.setItem('learnai-quiz-attempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  useEffect(() => {
    localStorage.setItem('learnai-user-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem('learnai-badges', JSON.stringify(badges));
  }, [badges]);

  const updateStreak = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    setUserProgress(prev => {
      if (prev.lastLoginDate === today) {
        return prev; // Already logged in today
      }
      
      if (prev.lastLoginDate === yesterday) {
        // Continue streak
        return {
          ...prev,
          currentStreak: prev.currentStreak + 1,
          longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
          lastLoginDate: today
        };
      } else {
        // Reset streak
        return {
          ...prev,
          currentStreak: 1,
          lastLoginDate: today
        };
      }
    });
  };

  const getXPForLevel = (level: number): number => {
    return level * 100; // 100 XP per level
  };

  const updateProgress = (action: string, data?: any) => {
    setUserProgress(prev => {
      let newProgress = { ...prev };
      let xpGained = 0;

      switch (action) {
        case 'complete_subtopic':
          newProgress.totalSubtopicsCompleted += 1;
          xpGained = 50;
          break;
        case 'pass_quiz':
          newProgress.totalQuizzesPassed += 1;
          xpGained = data?.score === 100 ? 100 : 75;
          if (data?.score === 100) {
            newProgress.perfectQuizzes += 1;
          }
          break;
        case 'complete_course':
          newProgress.coursesCompleted += 1;
          xpGained = 200;
          break;
        case 'review_flashcard':
          newProgress.totalFlashcardsReviewed += 1;
          xpGained = 5;
          break;
        case 'streak_bonus':
          xpGained = newProgress.currentStreak * 10;
          break;
      }

      newProgress.xp += xpGained;
      
      // Calculate new level
      let newLevel = 1;
      while (newProgress.xp >= getXPForLevel(newLevel)) {
        newLevel++;
      }
      newProgress.level = newLevel - 1;

      return newProgress;
    });
  };

  const checkAndUnlockBadges = () => {
    setBadges(prev => {
      return prev.map(badge => {
        if (badge.unlockedAt) return badge; // Already unlocked

        let shouldUnlock = false;
        
        switch (badge.id) {
          case 'first-step':
            shouldUnlock = userProgress.totalSubtopicsCompleted >= 1;
            break;
          case 'streak-master':
            shouldUnlock = userProgress.currentStreak >= 5;
            break;
          case 'quiz-ace':
            shouldUnlock = userProgress.perfectQuizzes >= 1;
            break;
          case 'memory-king':
            shouldUnlock = userProgress.totalFlashcardsReviewed >= 50;
            break;
          case 'course-conqueror':
            shouldUnlock = userProgress.coursesCompleted >= 1;
            break;
          case 'perfectionist':
            shouldUnlock = userProgress.perfectQuizzes >= 5;
            break;
          case 'scholar':
            shouldUnlock = userProgress.coursesCompleted >= 3;
            break;
          case 'dedication':
            shouldUnlock = userProgress.currentStreak >= 10;
            break;
        }

        if (shouldUnlock) {
          return { ...badge, unlockedAt: Date.now() };
        }
        return badge;
      });
    });
  };

  const setCourse = (newCourse: Course | null) => {
    setCourseState(newCourse);
    if (newCourse) {
      // Add to all courses if not already there
      setAllCourses(prev => {
        const exists = prev.find(c => c.id === newCourse.id);
        if (!exists) {
          return [...prev, newCourse];
        }
        return prev.map(c => c.id === newCourse.id ? newCourse : c);
      });
    }
  };

  const updateCourse = (updatedCourse: Course) => {
    setCourseState(updatedCourse);
    setAllCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const addQuizAttempt = (attempt: QuizAttempt) => {
    setQuizAttempts(prev => [...prev, attempt]);
  };

  const switchToCourse = (courseId: string) => {
    const targetCourse = allCourses.find(c => c.id === courseId);
    if (targetCourse) {
      setCourseState(targetCourse);
    }
  };

  const clearCourse = () => {
    setCourseState(null);
    // Don't clear all courses and progress, just current course
  };

  // Check for badge unlocks whenever progress changes
  useEffect(() => {
    checkAndUnlockBadges();
  }, [userProgress]);

  return (
    <CourseContext.Provider value={{
      course,
      allCourses,
      setCourse,
      updateCourse,
      quizAttempts,
      addQuizAttempt,
      clearCourse,
      userProgress,
      badges,
      updateProgress,
      checkAndUnlockBadges,
      getXPForLevel,
      switchToCourse
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};