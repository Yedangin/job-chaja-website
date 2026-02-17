'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
  Building2,
  User,
  CreditCard,
  Ticket,
  Bell,
  Globe,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Shield,
} from 'lucide-react';

/**
 * 기업 MY 페이지 / Company MY page
 * 기업정보, 결제, 열람권, 쿠폰, 설정 메뉴
 */
export default function CompanyMyPage() {
  const { user, logout, verificationStatus } = useAuth();

  const menuSections = [
    {
      title: '기업 관리',
      items: [
        { icon: Building2, label: '기업정보 관리', href: '/company/profile/edit' },
        { icon: User, label: '담당자 정보 수정', href: '/company/mypage/manager' },
        { icon: Shield, label: '기업인증', href: '/company/verification', badge: verificationStatus === 'APPROVED' ? '인증완료' : verificationStatus === 'SUBMITTED' ? '심사중' : verificationStatus === 'REJECTED' ? '반려' : undefined },
      ],
    },
    {
      title: '결제/열람권',
      items: [
        { icon: CreditCard, label: '결제 내역', href: '/company/payments' },
        { icon: Ticket, label: '쿠폰함', href: '/company/mypage/coupons' },
      ],
    },
    {
      title: '설정',
      items: [
        { icon: Bell, label: '알림 설정', href: '/company/mypage/notifications' },
        { icon: Globe, label: '언어 설정', href: '/company/mypage/language' },
        { icon: HelpCircle, label: '고객지원', href: '/company/mypage/support' },
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
            <Building2 className="w-7 h-7 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-900">{user?.companyName || '기업'}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <Link href="/company/profile" className="text-sm text-blue-600 font-medium hover:text-blue-700">
            프로필 보기
          </Link>
        </div>
      </div>

      {/* 메뉴 섹션 / Menu sections */}
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
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition"
              >
                <item.icon className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-sm text-gray-700">{item.label}</span>
                {item.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.badge === '인증완료' ? 'bg-green-100 text-green-700' : item.badge === '반려' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* 로그아웃 / Logout */}
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
