'use client';

import { Shield, FileText, Clock, HelpCircle } from 'lucide-react';

/**
 * 비자 센터 / Visa center (placeholder)
 * 비자 자가진단, 만료 알림, 갱신 가이드
 */
export default function WorkerVisaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">비자 센터</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <Shield className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">비자 자가진단</h3>
          <p className="text-sm text-gray-500">내 비자로 어떤 일을 할 수 있는지 확인</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <Clock className="w-8 h-8 text-orange-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">만료 알림</h3>
          <p className="text-sm text-gray-500">비자 만료일 관리 및 알림 설정</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <FileText className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">갱신 가이드</h3>
          <p className="text-sm text-gray-500">비자 갱신/변경 절차 안내</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <HelpCircle className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">행정사 연결</h3>
          <p className="text-sm text-gray-500">전문 행정사 상담 신청</p>
        </div>
      </div>
    </div>
  );
}
