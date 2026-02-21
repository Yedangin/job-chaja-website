import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

// Props for the CharacterAvatar component
// CharacterAvatar 컴포넌트의 props
interface CharacterAvatarProps {
  level: number;
  photo?: string | null;
}

const equipment = {
  1: '/assets/wizard/hat.svg', // 모자
  2: '/assets/wizard/shirt.svg', // 셔츠
  3: '/assets/wizard/gloves.svg', // 장갑
  4: '/assets/wizard/pants.svg', // 바지
  5: '/assets/wizard/boots.svg', // 부츠
  6: '/assets/wizard/sword.svg', // 검
  7: '/assets/wizard/shield.svg', // 방패
  8: '/assets/wizard/cape.svg', // 망토
};

const itemVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
};

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ level, photo }) => {
  return (
    <div className="relative w-20 h-20">
      <Avatar className="w-full h-full border-4 border-amber-300 shadow-md">
        <AvatarImage src={photo || ''} alt="User Avatar" className="object-cover" />
        <AvatarFallback className="bg-gray-700 text-gray-400">
          <User className="w-10 h-10" />
        </AvatarFallback>
      </Avatar>

      {/* Equipment overlay */}
      {/* 장비 오버레이 */}
      <AnimatePresence>
        {Object.entries(equipment).map(([itemLevel, src]) =>
          level >= parseInt(itemLevel) ? (
            <motion.img
              key={src}
              src={src}
              alt={`Equipment item ${itemLevel}`}
              className="absolute top-0 left-0 w-full h-full object-contain"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            />
          ) : null
        )}
      </AnimatePresence>
      
      {/* Placeholder for assets - we will need to create these SVG files */}
      {/* 자원들을 위한 플레이스홀더 - 이 SVG 파일들을 생성해야 합니다. */}
    </div>
  );
};

export default CharacterAvatar;

// Note: This component assumes the existence of SVG files in `public/assets/wizard/`.
// These files need to be created for the equipment to show up.
// 참고: 이 컴포넌트는 `public/assets/wizard/` 경로에 SVG 파일이 있다고 가정합니다.
// 장비가 표시되려면 해당 파일들을 생성해야 합니다.
