import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';

// Props for the QuestCard component
// QuestCard 컴포넌트의 props
interface QuestCardProps {
  questName: string;
  children: ReactNode;
}

const QuestCard: React.FC<QuestCardProps> = ({ questName, children }) => {
  return (
    <div className="border-2 border-amber-400/60 bg-black/30 rounded-xl shadow-2xl shadow-amber-500/10 backdrop-blur-md">
      {/* Card Header */}
      {/* 카드 헤더 */}
      <div className="px-6 py-4 border-b-2 border-amber-400/60 flex items-center gap-4 bg-gradient-to-b from-amber-950/50 to-transparent">
        <ScrollText className="w-8 h-8 text-amber-300" />
        <h2 className="text-2xl font-bold text-amber-200 tracking-wide drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)]">
          {questName}
        </h2>
      </div>

      {/* Card Content */}
      {/* 카드 콘텐츠 */}
      <div className="p-6 md:p-8">
        {children}
      </div>
    </div>
  );
};

export default QuestCard;
