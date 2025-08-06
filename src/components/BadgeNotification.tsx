import React, { useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt?: number;
}

interface BadgeNotificationProps {
  badge: Badge;
  onClose: () => void;
}

const BadgeNotification: React.FC<BadgeNotificationProps> = ({ badge, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-24 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-2xl max-w-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Trophy className="h-6 w-6" />
            <span className="font-bold text-lg">Badge Unlocked!</span>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{badge.emoji}</div>
          <div>
            <div className="font-bold text-xl">{badge.name}</div>
            <div className="text-yellow-100">{badge.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeNotification;