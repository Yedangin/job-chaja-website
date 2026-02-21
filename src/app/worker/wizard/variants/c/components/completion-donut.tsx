'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * 완성도 도넛 차트 / Completion donut chart
 * SVG 기반 원형 프로그레스 차트. 0%~100% 애니메이션 포함.
 * SVG-based circular progress chart with 0%-100% animation.
 */

interface CompletionDonutProps {
  /** 완성도 퍼센트 (0~100) / Completion percentage */
  percent: number;
  /** 차트 크기 px / Chart size in px */
  size?: number;
  /** 선 두께 px / Stroke width in px */
  strokeWidth?: number;
  /** 추가 클래스 / Additional class */
  className?: string;
}

export default function CompletionDonut({
  percent,
  size = 180,
  strokeWidth = 14,
  className,
}: CompletionDonutProps) {
  // 애니메이션 상태 / Animation state
  const [animatedPercent, setAnimatedPercent] = useState(0);

  // 마운트 시 애니메이션 / Animate on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercent(percent);
    }, 100);
    return () => clearTimeout(timer);
  }, [percent]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (circumference * animatedPercent) / 100;
  const center = size / 2;

  // 완성도에 따른 색상 / Color based on completion
  const getColor = (pct: number): string => {
    if (pct >= 80) return '#22c55e';  // green-500 — 거의 완료 / Nearly complete
    if (pct >= 50) return '#3b82f6';  // blue-500 — 진행 중 / In progress
    if (pct >= 25) return '#f59e0b';  // amber-500 — 시작됨 / Started
    return '#94a3b8';                  // slate-400 — 미시작 / Not started
  };

  // 완성도에 따른 배경 색상 / Background color based on completion
  const getBgColor = (pct: number): string => {
    if (pct >= 80) return '#dcfce7';  // green-100
    if (pct >= 50) return '#dbeafe';  // blue-100
    if (pct >= 25) return '#fef3c7';  // amber-100
    return '#f1f5f9';                  // slate-100
  };

  const strokeColor = getColor(animatedPercent);
  const bgGlow = getBgColor(animatedPercent);

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`프로필 완성도 ${percent}% / Profile completion ${percent}%`}
    >
      {/* 배경 글로우 효과 / Background glow effect */}
      <div
        className="absolute rounded-full blur-xl opacity-40 transition-colors duration-700"
        style={{
          width: size * 0.8,
          height: size * 0.8,
          backgroundColor: bgGlow,
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* 배경 원 / Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          className="opacity-60"
        />

        {/* 진행 원 / Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* 중앙 퍼센트 텍스트 / Center percentage text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-extrabold tabular-nums tracking-tight transition-colors duration-700"
          style={{ color: strokeColor }}
        >
          {animatedPercent}
          <span className="text-lg font-bold">%</span>
        </span>
        <span className="text-xs text-gray-400 mt-0.5">
          {/* 프로필 완성도 / Profile Completion */}
          프로필 완성도
        </span>
      </div>
    </div>
  );
}
