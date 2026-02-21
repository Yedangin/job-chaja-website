'use client';

/**
 * 채팅 말풍선 컴포넌트 / Chat bubble component
 * 봇(왼쪽)과 사용자(오른쪽) 메시지를 표시합니다.
 * Displays bot (left) and user (right) messages.
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { ChatMessageRole } from '../types';

interface ChatBubbleProps {
  /** 발신자 역할 / Sender role */
  role: ChatMessageRole;
  /** 메시지 텍스트 / Message text */
  text: string;
  /** 부가 텍스트 / Sub text */
  subText?: string;
  /** 타이핑 애니메이션 적용 / Apply typing animation */
  animate?: boolean;
  /** 애니메이션 완료 콜백 / Animation complete callback */
  onAnimationComplete?: () => void;
  /** 자식 요소 (입력 필드 등) / Children (input fields etc.) */
  children?: React.ReactNode;
  /** 추가 CSS 클래스 / Additional CSS classes */
  className?: string;
}

export default function ChatBubble({
  role,
  text,
  subText,
  animate = true,
  onAnimationComplete,
  children,
  className,
}: ChatBubbleProps) {
  // 표시 상태 / Display state
  const [isVisible, setIsVisible] = useState(!animate);
  // 타이핑 애니메이션 텍스트 / Typing animation text
  const [displayText, setDisplayText] = useState(animate ? '' : text);
  // 타이핑 완료 여부 / Typing complete flag
  const [isTypingDone, setIsTypingDone] = useState(!animate);

  // 타이핑 애니메이션 효과 / Typing animation effect
  useEffect(() => {
    if (!animate) return;

    // 페이드인 딜레이 / Fade-in delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // 타이핑 효과 (봇 메시지만) / Typing effect (bot messages only)
    if (role === 'bot') {
      const chars = text.split('');
      let currentIndex = 0;

      const typeTimer = setInterval(() => {
        if (currentIndex < chars.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeTimer);
          setIsTypingDone(true);
          onAnimationComplete?.();
        }
      }, 20);

      return () => {
        clearTimeout(showTimer);
        clearInterval(typeTimer);
      };
    } else {
      // 사용자 메시지는 바로 표시 / User messages show immediately
      setDisplayText(text);
      setIsTypingDone(true);
      onAnimationComplete?.();
    }

    return () => clearTimeout(showTimer);
  }, [animate, text, role, onAnimationComplete]);

  const isBot = role === 'bot';

  return (
    <div
      className={cn(
        'flex w-full gap-3 transition-all duration-500',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        isBot ? 'justify-start' : 'justify-end',
        className
      )}
    >
      {/* 봇 아바타 / Bot avatar */}
      {isBot && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg shadow-md">
            <span role="img" aria-label="bot">🤖</span>
          </div>
        </div>
      )}

      {/* 메시지 영역 / Message area */}
      <div
        className={cn(
          'max-w-[85%] md:max-w-[70%]',
          isBot ? 'items-start' : 'items-end',
          'flex flex-col gap-2'
        )}
      >
        {/* 말풍선 / Bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm',
            isBot
              ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
              : 'bg-blue-500 text-white rounded-tr-sm'
          )}
        >
          <p className="whitespace-pre-wrap">{displayText}</p>
          {/* 부가 텍스트 / Sub text */}
          {subText && isTypingDone && (
            <p className={cn(
              'mt-1.5 text-[13px]',
              isBot ? 'text-gray-500' : 'text-blue-100'
            )}>
              {subText}
            </p>
          )}
        </div>

        {/* 입력 영역 (봇 메시지 아래, 타이핑 완료 후) / Input area (below bot message, after typing) */}
        {isBot && isTypingDone && children && (
          <div className="w-full animate-in fade-in-0 slide-in-from-bottom-2 duration-300 mt-1">
            {children}
          </div>
        )}
      </div>

      {/* 사용자 아바타 (선택적) / User avatar (optional) */}
      {!isBot && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
            <span role="img" aria-label="user">👤</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 타이핑 인디케이터 컴포넌트 / Typing indicator component
 * 봇이 메시지를 입력 중일 때 표시합니다.
 * Shows when bot is typing a message.
 */
export function TypingIndicator() {
  return (
    <div className="flex w-full gap-3 justify-start">
      <div className="flex-shrink-0 mt-1">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg shadow-md">
          <span role="img" aria-label="bot">🤖</span>
        </div>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
