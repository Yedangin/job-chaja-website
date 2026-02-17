'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 인재 열람권 구매 페이지 / Talent viewing credit purchase page
 */
const PACKAGES = [
  { code: 'VIEW_1', name: '단건', credits: 1, price: 3000, discount: null },
  { code: 'VIEW_10', name: '라이트', credits: 10, price: 25000, discount: '17% 할인' },
  { code: 'VIEW_30', name: '스탠다드', credits: 30, price: 60000, discount: '33% 할인' },
  { code: 'VIEW_100', name: '프로', credits: 100, price: 150000, discount: '50% 할인', popular: true },
];

export default function CreditsPurchasePage() {
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const [selected, setSelected] = useState('VIEW_30');

  // 현재 잔여 열람권 조회 / Load current balance
  useEffect(() => {
    fetch('/api/payments/viewing-credits/balance')
      .then((r) => r.json())
      .then((data) => {
        if (data.totalRemaining !== undefined) {
          setBalance(data.totalRemaining);
        }
      })
      .catch(() => {});
  }, []);

  const handlePurchase = (code: string) => {
    router.push(`/company/payments/checkout?productCode=${code}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">인재 열람권 구매</h1>
        <p className="text-gray-500 mb-6">
          열람권으로 인재의 상세 이력서와 연락처를 확인하세요.
        </p>

        {/* 현재 잔여 / Current balance */}
        {balance !== null && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center justify-between">
            <span className="text-blue-700 font-medium">남은 열람권</span>
            <span className="text-2xl font-bold text-blue-600">{balance}건</span>
          </div>
        )}

        {/* 패키지 선택 / Package selection */}
        <div className="grid gap-4">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.code}
              onClick={() => setSelected(pkg.code)}
              className={`bg-white rounded-xl p-5 cursor-pointer border-2 transition-all ${
                selected === pkg.code
                  ? 'border-blue-500 shadow-md'
                  : 'border-transparent shadow-sm hover:border-gray-200'
              } ${pkg.popular ? 'relative' : ''}`}
            >
              {pkg.popular && (
                <span className="absolute -top-2 right-4 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  인기
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {pkg.name} ({pkg.credits}건)
                  </h3>
                  {pkg.discount && (
                    <span className="text-sm text-green-600">{pkg.discount}</span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">
                    {pkg.price.toLocaleString()}원
                  </div>
                  <div className="text-xs text-gray-400">
                    건당 {Math.round(pkg.price / pkg.credits).toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 구매 버튼 / Purchase button */}
        <button
          onClick={() => handlePurchase(selected)}
          className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700"
        >
          {PACKAGES.find((p) => p.code === selected)?.price.toLocaleString()}원
          구매하기
        </button>

        <button
          onClick={() => router.back()}
          className="w-full mt-3 text-gray-500 py-2 text-sm hover:text-gray-700"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}
