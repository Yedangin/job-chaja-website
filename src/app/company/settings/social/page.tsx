'use client';

/**
 * 기업회원 소셜 계정 연결 페이지 / Company member social account connection page
 * - Google / Kakao 연결 상태 카드 표시
 * - 각 소셜 공급자 아이콘, 이름, 연결됨/미연결 상태 뱃지
 * - 연결/해제 버튼 (Coming Soon UI)
 * - 현재 연결 상태를 GET /auth/my/profile API에서 로드
 * Shows Google/Kakao connection cards with status badges and Coming Soon connect/disconnect buttons
 */

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Circle, Info, LinkIcon, Unlink } from 'lucide-react';
import { toast } from 'sonner';

// 소셜 공급자 키 타입 / Social provider key type
type SocialProviderKey = 'GOOGLE' | 'KAKAO';

// 소셜 공급자 설정 / Social provider configuration
interface SocialProviderConfig {
  key: SocialProviderKey;
  name: string;          // 표시 이름 / Display name
  nameEn: string;        // 영문 이름 / English name
  description: string;   // 설명 / Description
  iconBg: string;        // 아이콘 배경색 / Icon background
  iconColor: string;     // 아이콘 색상 / Icon color
  badgeConnected: string;   // 연결됨 배지 스타일 / Connected badge style
  badgeDisconnected: string; // 미연결 배지 스타일 / Disconnected badge style
}

// 지원 소셜 공급자 목록 / Supported social providers list
const SOCIAL_PROVIDERS: SocialProviderConfig[] = [
  {
    key: 'GOOGLE',
    name: 'Google',
    nameEn: 'Google',
    description: 'Google 계정으로 간편하게 로그인할 수 있습니다.',
    iconBg: 'bg-white border border-gray-200',
    iconColor: 'text-gray-700',
    badgeConnected: 'bg-green-100 text-green-700',
    badgeDisconnected: 'bg-gray-100 text-gray-500',
  },
  {
    key: 'KAKAO',
    name: '카카오',
    nameEn: 'Kakao',
    description: '카카오 계정으로 간편하게 로그인할 수 있습니다.',
    iconBg: 'bg-yellow-400',
    iconColor: 'text-yellow-900',
    badgeConnected: 'bg-green-100 text-green-700',
    badgeDisconnected: 'bg-gray-100 text-gray-500',
  },
];

// Google G 아이콘 SVG / Google G icon SVG
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
        fill="#FFC107"
      />
      <path
        d="M3.15332 7.3455L6.43882 9.755C7.32782 7.554 9.48082 6 12.0003 6C13.5298 6 14.9213 6.577 15.9808 7.5195L18.8093 4.691C17.0233 3.0265 14.6343 2 12.0003 2C8.15932 2 4.82832 4.1685 3.15332 7.3455Z"
        fill="#FF3D00"
      />
      <path
        d="M12.0002 22C14.5832 22 16.9302 21.0115 18.7047 19.404L15.6097 16.785C14.5719 17.5742 13.3039 18.001 12.0002 18C9.39916 18 7.19066 16.3415 6.35866 14.027L3.09766 16.5395C4.75266 19.778 8.11366 22 12.0002 22Z"
        fill="#4CAF50"
      />
      <path
        d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
        fill="#1976D2"
      />
    </svg>
  );
}

// 카카오 K 아이콘 SVG / Kakao K icon SVG
function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3C6.477 3 2 6.477 2 11C2 13.975 3.678 16.59 6.25 18.135L5.25 21.5L8.875 19.25C9.882 19.498 10.929 19.623 12 19.62C17.523 19.62 22 16.143 22 11C22 6.477 17.523 3 12 3ZM9.5 13.5H8V9H9.5V13.5ZM11.75 13.5H10.25V9H11.75V13.5ZM14 13.5H12.5V9H14V13.5Z" />
    </svg>
  );
}

// 소셜 공급자 아이콘 컴포넌트 / Social provider icon component
function SocialIcon({ provider }: { provider: SocialProviderKey }) {
  if (provider === 'GOOGLE') {
    return <GoogleIcon className="w-5 h-5" />;
  }
  return <KakaoIcon className="w-5 h-5 text-yellow-900" />;
}

// 소셜 카드 컴포넌트 / Social account card component
interface SocialCardProps {
  config: SocialProviderConfig;
  isConnected: boolean;
}

function SocialCard({ config, isConnected }: SocialCardProps) {
  // 연결/해제 클릭 핸들러 (Coming Soon) / Connect/disconnect handler (Coming Soon)
  const handleAction = () => {
    toast.info(
      isConnected
        ? `${config.name} 계정 연결 해제 기능은 곧 제공됩니다.`
        : `${config.name} 계정 연결 기능은 곧 제공됩니다.`,
      { description: 'Coming Soon' }
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 transition">
      <div className="flex items-center gap-4">
        {/* 소셜 공급자 아이콘 / Social provider icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.iconBg}`}
        >
          <SocialIcon provider={config.key} />
        </div>

        {/* 정보 영역 / Info area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-bold text-gray-900">{config.name}</p>
            <span className="text-xs text-gray-400">{config.nameEn}</span>
            {/* 연결 상태 뱃지 / Connection status badge */}
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                isConnected ? config.badgeConnected : config.badgeDisconnected
              }`}
            >
              {isConnected ? (
                <><CheckCircle2 className="w-3 h-3" /> 연결됨</>
              ) : (
                <><Circle className="w-3 h-3" /> 미연결</>
              )}
            </span>
          </div>
          <p className="text-xs text-gray-400">{config.description}</p>
        </div>

        {/* 연결/해제 버튼 (Coming Soon) / Connect/disconnect button (Coming Soon) */}
        <button
          type="button"
          onClick={handleAction}
          className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border transition ${
            isConnected
              ? 'border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50'
              : 'border-blue-200 text-blue-600 hover:bg-blue-50'
          }`}
        >
          {isConnected ? (
            <><Unlink className="w-3.5 h-3.5" /> 연결 해제</>
          ) : (
            <><LinkIcon className="w-3.5 h-3.5" /> 연결하기</>
          )}
        </button>
      </div>

      {/* 연결됨 상태 추가 정보 / Additional info when connected */}
      {isConnected && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            이 소셜 계정으로 간편 로그인이 활성화되어 있습니다.
            {/* Simple login is enabled via this social account. */}
          </p>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 메인 페이지 컴포넌트 / Main page component
// ══════════════════════════════════════════════════════════════════════════════
export default function CompanySocialPage() {
  // 연결된 소셜 공급자 목록 / Connected social providers set
  const [connectedProviders, setConnectedProviders] = useState<Set<SocialProviderKey>>(new Set());
  // 로딩 상태 / Loading state
  const [loading, setLoading] = useState(true);

  // 프로필에서 소셜 연결 상태 로드 / Load social connection status from profile
  useEffect(() => {
    const load = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        const res = await fetch('/api/auth/my/profile', {
          headers: sessionId ? { Authorization: `Bearer ${sessionId}` } : {},
        });
        if (res.ok) {
          const data = await res.json();

          const connected = new Set<SocialProviderKey>();

          // socialProvider 단일 필드 처리 / Handle single socialProvider field
          if (
            data.socialProvider &&
            data.socialProvider !== 'NONE' &&
            (data.socialProvider === 'GOOGLE' || data.socialProvider === 'KAKAO')
          ) {
            connected.add(data.socialProvider as SocialProviderKey);
          }

          // socialAccounts 배열 처리 (있을 경우) / Handle socialAccounts array if present
          if (Array.isArray(data.socialAccounts)) {
            (data.socialAccounts as Array<{ provider: string }>) .forEach((acc) => {
              if (acc.provider === 'GOOGLE' || acc.provider === 'KAKAO') {
                connected.add(acc.provider as SocialProviderKey);
              }
            });
          }

          setConnectedProviders(connected);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // 로딩 스켈레톤 / Loading skeleton
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-44 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-100 rounded-2xl" />
          <div className="h-24 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">소셜 계정 연결</h1>
        <p className="text-sm text-gray-500 mt-0.5">Connected Social Accounts</p>
      </div>

      {/* 안내 배너 / Guide banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl mb-5">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-800 mb-0.5">
            소셜 계정을 연결하면 간편하게 로그인할 수 있습니다
          </p>
          <p className="text-xs text-blue-600">
            소셜 계정 연결 및 해제 기능은 현재 개발 중이며 곧 제공될 예정입니다.
            {/* Social account connect/disconnect feature is under development and coming soon. */}
          </p>
        </div>
      </div>

      {/* 소셜 카드 목록 / Social provider cards */}
      <div className="space-y-3 mb-6">
        {SOCIAL_PROVIDERS.map((provider) => (
          <SocialCard
            key={provider.key}
            config={provider}
            isConnected={connectedProviders.has(provider.key)}
          />
        ))}
      </div>

      {/* Coming Soon 섹션 안내 / Coming Soon section notice */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Loader2 className="w-4 h-4 text-gray-400" />
          <p className="text-sm font-semibold text-gray-600">준비 중인 소셜 로그인</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* 향후 지원 예정 공급자 / Future supported providers */}
          {['Apple', 'Facebook', 'Naver'].map((name) => (
            <span
              key={name}
              className="inline-flex items-center text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full font-medium"
            >
              {name} · 준비 중
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          더 많은 소셜 로그인 연동을 준비하고 있습니다.
          {/* More social login integrations are being prepared. */}
        </p>
      </div>
    </div>
  );
}
