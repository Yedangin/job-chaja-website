'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

/**
 * 결제 성공 페이지 / Payment success page
 */
export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const productCode = searchParams.get('productCode') || '';
  const productName = searchParams.get('productName') || '상품';

  // 상품별 성공 메시지 / Product-specific success message
  const getMessage = () => {
    if (productCode.startsWith('PREMIUM_')) {
      const days = productCode.replace('PREMIUM_', '').replace('D', '');
      return `공고가 ${days}일간 상위노출됩니다!`;
    }
    if (productCode === 'JOB_PREMIUM') {
      return '공고가 프리미엄으로 업그레이드되었습니다!';
    }
    if (productCode === 'JOB_EXTENSION') {
      return '공고 노출 기간이 연장되었습니다!';
    }
    if (productCode.startsWith('VIEW_')) {
      const credits = productCode.replace('VIEW_', '');
      return `인재 열람권 ${credits}건이 추가되었습니다!`;
    }
    return `${productName} 결제가 완료되었습니다!`;
  };

  const getNextAction = () => {
    if (
      productCode.startsWith('PREMIUM_') ||
      productCode === 'JOB_PREMIUM' ||
      productCode === 'JOB_EXTENSION'
    ) {
      return { label: '내 공고 관리', href: '/company/jobs' };
    }
    if (productCode.startsWith('VIEW_')) {
      return { label: '인재 검색하기', href: '/company/talents' };
    }
    return { label: '홈으로', href: '/' };
  };

  const action = getNextAction();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* 성공 아이콘 / Success icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold mb-2">결제 완료</h1>
          <p className="text-gray-600 mb-6">{getMessage()}</p>

          <Link
            href={action.href}
            className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 mb-3"
          >
            {action.label}
          </Link>

          <Link
            href="/"
            className="block text-gray-500 text-sm hover:text-gray-700"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
