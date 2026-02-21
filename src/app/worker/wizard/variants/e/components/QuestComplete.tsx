import React from 'react';
import { motion } from 'framer-motion';
import { Crown, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CharacterAvatar from './CharacterAvatar';
import BadgeItem from './BadgeItem';

const QuestComplete: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-gray-900 to-black flex items-center justify-center p-4 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'backOut' }}
        className="w-full max-w-2xl text-center p-8 bg-black/50 backdrop-blur-xl rounded-3xl border-4 border-amber-400 shadow-2xl shadow-amber-500/30"
      >
        <motion.div
            initial={{ y: -50, opacity: 0}}
            animate={{ y: 0, opacity: 1}}
            transition={{ delay: 0.5, type: 'spring' }}
        >
            <Crown className="w-24 h-24 text-amber-300 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(252,211,77,0.8)]" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-200 mb-2">
          Quest Complete!
        </h1>
        <p className="text-lg text-amber-100 mb-8">
          취업 모험 준비 완료! (Ready for the Job Adventure!)
        </p>

        <motion.div 
            className="my-8 flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 150}}
        >
            <CharacterAvatar level={8} />
        </motion.div>

        <div className="mb-8">
            <h3 className="text-xl font-bold text-amber-200 mb-4">획득한 뱃지 (Badges Acquired)</h3>
            <div className="flex flex-wrap justify-center gap-4">
                <BadgeItem name="Profile" status="verified" icon="profile" />
                <BadgeItem name="Identity" status="verified" icon="identity" />
                <BadgeItem name="Education" status="verified" icon="education" />
                <BadgeItem name="Korean" status="verified" icon="korean" />
                <BadgeItem name="Employable" status="unlocked" icon="employable" />
            </div>
        </div>

        <p className="text-gray-300 max-w-md mx-auto mb-8">
            You've successfully filled out your profile. You are now ready to explore job opportunities on JobChaja.
            <br />
            (프로필 작성을 성공적으로 마쳤습니다. 이제 잡차자에서 새로운 기회를 탐색할 준비가 되었습니다.)
        </p>

        <motion.div
            initial={{ y: 50, opacity: 0}}
            animate={{ y: 0, opacity: 1}}
            transition={{ delay: 1, type: 'spring' }}
        >
            <Button
                size="lg"
                className="w-full max-w-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xl py-8 rounded-lg shadow-lg"
            >
                <CheckCircle2 className="mr-3 h-6 w-6" />
                Go to Dashboard (대시보드로 가기)
            </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuestComplete;
