'use client'

import { Button } from '@/components/ui/button'
import { CreditCard, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    IMP: any;
  }
}

export default function PaymentCard() {
  const router = useRouter()

  const handlePayment = () => {
    if (!window.IMP) {
      alert('결제 모듈을 로드하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const { IMP } = window;
    
    /** * [အရေးကြီး] User Code ကိုသာ သုံးပါ 
     * store-a29e... (Store ID) ကို ဤနေရာတွင် မသုံးပါနှင့်။
     * Client ဆီမှရသော 'imp05203088' ကို သုံးထားသည်။
     */
    IMP.init('imp05203088'); 

    const paymentData = {
      pg: 'html5_inicis',
      pay_method: 'card',
      merchant_uid: `jobchaja_biz_${Date.now()}`,
      name: 'JobChaja 프리미엄 공고',
      amount: 50000, // လက်တွေ့ပမာဏ
      buyer_email: 'admin@yedangin.com',
      buyer_name: '최운아',
      buyer_tel: '010-7209-7488',
      buyer_addr: '경기도 안산시 상록구 조구나리 1길 58',
      buyer_postcode: '15585'
    };

    IMP.request_pay(paymentData, (rsp: any) => {
      if (rsp.success) {
        alert('결제가 성공하였습니다! 공고가 등록됩니다.');
        router.push('/jobs');
      } else {
        alert(`결제 실패: ${rsp.error_msg}`);
      }
    });
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">결제하기</h1>
        <p className="text-slate-500 mt-2">
          JobChaja 서비스를 이용해주셔서 감사합니다.
        </p>
      </div>

      <div className="bg-slate-100 rounded-xl p-6 mb-8 border border-slate-200">
        <div className="flex justify-between items-center text-slate-600 mb-4">
          <span>서비스명</span>
          <span className="font-semibold text-slate-800">JobChaja 프리미엄 공고</span>
        </div>
        <div className="flex justify-between items-center text-slate-600">
          <span>결제 금액</span>
          <span className="text-2xl font-bold text-sky-600">50,000원</span>
        </div>
      </div>

      <Button
        onClick={handlePayment}
        className="w-full h-14 bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2"
      >
        <CreditCard className="w-5 h-5" />
        결제하기
      </Button>

      <div className="text-center mt-6 text-xs text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-green-500" />
        <span>이 결제는 PortOne을 통해 안전하게 처리됩니다.</span>
      </div>
    </div>
  )
}