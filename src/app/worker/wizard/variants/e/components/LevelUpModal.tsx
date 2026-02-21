import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowUp, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

// Props for the LevelUpModal component
// LevelUpModal 컴포넌트의 props
interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, onClose, level }) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti when modal opens
      // 모달이 열릴 때 색종이 조각 효과 발생
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          })
        );
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          })
        );
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-amber-400 rounded-2xl shadow-2xl shadow-amber-500/40 w-full max-w-md text-center p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <PartyPopper className="w-16 h-16 text-amber-300 mx-auto mb-4 animate-bounce" />
            
            <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-200 drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)]">
              LEVEL UP!
            </h2>
            
            <div className="flex items-center justify-center gap-4 my-6">
              <span className="text-4xl font-bold text-gray-500">Lv.{level -1}</span>
              <ArrowUp className="w-8 h-8 text-green-400" />
              <span className="text-6xl font-bold text-white">Lv.{level}</span>
            </div>

            <p className="text-amber-200 text-lg mb-8">
              Your profile has grown stronger!
              <br/>
              (프로필이 더 강력해졌습니다!)
            </p>

            <Button
              onClick={onClose}
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg px-8 py-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Continue Quest (퀘스트 계속하기)
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpModal;
