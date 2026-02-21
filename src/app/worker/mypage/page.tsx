'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
  User,
  FileText,
  Shield,
  Briefcase,
  Bell,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit,
} from 'lucide-react';

/**
 * 개인회원 MY 페이지 / Worker MY page
 * 이력서, 비자 인증, 지원 내역, 설정 메뉴
 */
export default function WorkerMyPage() {
  const { user, logout } = useAuth();

  const menuSections = [
    {
      title: '프로필 관리',
      items: [
        { icon: Edit, label: '프로필 작성/수정', href: '/worker/wizard/variants/a', highlight: true },
        { icon: FileText, label: '이력서 관리', href: '/worker/resume' },
        { icon: Shield, label: '비자 인증', href: '/worker/visa-verification' },
      ],
    },
    {
      title: '활동',
      items: [
        { icon: Briefcase, label: '지원 내역', href: '/worker/mypage/applications' },
      ],
    },
    {
      title: '설정',
      items: [
        { icon: Bell, label: '알림 설정', href: '/worker/mypage/notifications' },
        { icon: Globe, label: '언어 설정', href: '/worker/mypage/language' },
        { icon: HelpCircle, label: '고객지원', href: '/worker/mypage/support' },
        { icon: FileText, label: '서비스 이용약관', href: '/terms-and-conditions' },
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 프로필 카드 / Profile card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-7 h-7 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-900">{user?.fullName || '사용자'}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* 메뉴 / Menu sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
            {section.title}
          </h3>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition ${
                  'highlight' in item && item.highlight
                    ? 'bg-blue-50 hover:bg-blue-100'
                    : ''
                }`}
              >
                <item.icon className={`w-5 h-5 ${
                  'highlight' in item && item.highlight ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <span className={`flex-1 text-sm ${
                  'highlight' in item && item.highlight
                    ? 'text-blue-700 font-medium'
                    : 'text-gray-700'
                }`}>
                  {item.label}
                </span>
                {('highlight' in item && item.highlight) && (
                  <span className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded-full">
                    추천
                  </span>
                )}
                <ChevronRight className={`w-4 h-4 ${
                  'highlight' in item && item.highlight ? 'text-blue-400' : 'text-gray-300'
                }`} />
              </Link>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border border-gray-200 hover:bg-red-50 transition text-red-600"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">로그아웃</span>
      </button>
    </div>
  );
}
