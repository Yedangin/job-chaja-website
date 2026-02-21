import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Shield, Star, Gem, Award } from 'lucide-react';

// Props for the BadgeItem component
// BadgeItem 컴포넌트의 props
interface BadgeItemProps {
  name: string;
  status: 'locked' | 'unlocked' | 'verified';
  icon: 'profile' | 'identity' | 'education' | 'korean' | 'employable';
}

const badgeConfig = {
  profile: {
    Icon: BadgeCheck,
    color: 'bg-green-500/20 text-green-400 border-green-500',
    shadow: 'shadow-green-500/50',
  },
  identity: {
    Icon: Shield,
    color: 'bg-blue-500/20 text-blue-400 border-blue-500',
    shadow: 'shadow-blue-500/50',
  },
  education: {
    Icon: Award,
    color: 'bg-purple-500/20 text-purple-400 border-purple-500',
    shadow: 'shadow-purple-500/50',
  },
  korean: {
    Icon: Star,
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
    shadow: 'shadow-yellow-500/50',
  },
  employable: {
    Icon: Gem,
    color: 'bg-red-500/20 text-red-400 border-red-500',
    shadow: 'shadow-red-500/50',
  },
};

const BadgeItem: React.FC<BadgeItemProps> = ({ name, status, icon }) => {
  const { Icon, color, shadow } = badgeConfig[icon];
  const isLocked = status === 'locked';

  return (
    <motion.div
      className={`relative flex flex-col items-center justify-center w-28 h-32 rounded-lg p-4 transition-all duration-300
        ${isLocked
          ? 'bg-gray-800/50 border border-dashed border-gray-600'
          : `bg-gradient-to-br from-gray-900 to-black border ${color} ${shadow} shadow-lg`
        }
      `}
      whileHover={{ scale: isLocked ? 1.05 : 1.1, y: -5 }}
    >
      <div className={`absolute top-2 right-2 px-2 py-0.5 text-xs rounded-full ${
        isLocked ? 'bg-gray-600 text-gray-300' : 
        status === 'unlocked' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
      }`}>
        {isLocked ? 'Locked' : status === 'unlocked' ? 'Pending' : 'Verified'}
      </div>

      <div className={`flex-grow flex items-center justify-center ${isLocked ? 'text-gray-500' : ''}`}>
        <Icon className={`w-12 h-12 transition-colors duration-300 ${isLocked ? '' : color}`} />
      </div>
      
      <p className={`w-full text-center text-xs font-semibold truncate ${isLocked ? 'text-gray-400' : 'text-white'}`}>
        {name}
      </p>

      {isLocked && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
          <p className="text-gray-400 text-sm font-bold">???</p>
        </div>
      )}
    </motion.div>
  );
};

export default BadgeItem;
