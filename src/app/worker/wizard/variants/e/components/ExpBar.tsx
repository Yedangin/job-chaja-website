import React from 'react';
import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';
import CharacterAvatar from './CharacterAvatar';

// Props for the ExpBar component
// ExpBar 컴포넌트의 props
interface ExpBarProps {
  level: number;
  experiencePoints: number; // 0 to 100
}

const ExpBar: React.FC<ExpBarProps> = ({ level, experiencePoints }) => {
  const MAX_LEVEL = 8;

  return (
    <div className="sticky top-4 z-50 w-full bg-black/50 backdrop-blur-sm p-3 rounded-2xl border-2 border-amber-400/50 shadow-lg shadow-amber-500/10">
      <div className="flex items-center justify-between gap-4">
        {/* Character Avatar */}
        {/* 캐릭터 아바타 */}
        <div className="flex-shrink-0">
          <CharacterAvatar level={level} />
        </div>

        {/* Level and EXP Bar */}
        {/* 레벨 및 경험치 바 */}
        <div className="flex-grow flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              Lv.
            </span>
            <span className="text-3xl font-extrabold text-white tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              {level}
            </span>
          </div>

          <div className="w-full">
            <div className="text-sm text-amber-200 mb-1 text-center font-mono">
              {Math.floor(experiencePoints)}%
            </div>
            <div className="h-6 w-full bg-gray-800/80 rounded-full border-2 border-gray-600 relative overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]"
                style={{
                  width: `${experiencePoints}%`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${experiencePoints}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                <div className="absolute inset-0 w-full h-full bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)] animate-pulse"></div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Next Level Gem */}
        {/* 다음 레벨 보석 */}
        <div className="flex flex-col items-center">
          <span className="font-bold text-lg text-gray-500">Lv.</span>
          <span className="text-3xl font-extrabold text-gray-600">
            {level < MAX_LEVEL ? level + 1 : <Gem className="w-8 h-8 text-amber-400" />}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExpBar;
