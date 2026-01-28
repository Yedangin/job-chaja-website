'use client'

import { Button } from '@/components/ui/button'
import { CreditCard } from 'lucide-react'
import { useRouter } from 'next/navigation'

// window.IMP အတွက် TypeScript Error မတက်စေရန်
declare global {
  interface Window {
    IMP: any;
  }
}

export default function PaymentCard() {
  const router = useRouter()

  const handlePayment = () => {
    const { IMP } = window;
    
    // Client ဆီက ရထားတဲ့ 가맹점 식별코드 (User Code) ဖြစ်ပါတယ်။
    // သင့် Client ပေးထားတဲ့ Code (imp05203088) ကို ဤနေရာတွင် သုံးပါ။
    IMP.init('imp05203088'); 

    const paymentData = {
      pg: 'html5_inicis',         // KG 이니시스 window ခေါ်ရန်
      pay_method: 'card',
      merchant_uid: `jobchaja_biz_${Date.now()}`,
      name: 'JobChaja 프리미엄 공고',
      amount: 50000,
      buyer_email: 'admin@yedangin.com',
      buyer_name: '최운아',
      buyer_tel: '010-7209-7488',
      buyer_addr: '경기도 안산시 상록구 조구나리 1길 58',
      buyer_postcode: '15585'
    };

    // V1 Request Pay function
    IMP.request_pay(paymentData, (rsp: any) => {
      if (rsp.success) {
        // ငွေပေးချေမှု အောင်မြင်လျှင်
        alert('결제가 성공하였습니다! 공고가 등록됩니다.');
        router.push('/jobs');
      } else {
        // ငွေပေးချေမှု ကျရှုံးလျှင် (သို့မဟုတ်) ပိတ်လိုက်လျှင်
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
          <span className="font-semibold text-slate-800">
            JobChaja 프리미엄 공고
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-600">
          <span>결제 금액</span>
          <span className="text-2xl font-bold text-sky-600">50,000원</span>
        </div>
        <p className="text-xs text-slate-400 text-right mt-1">
          (VAT 포함)
        </p>
      </div>

      <Button
        onClick={handlePayment}
        className="w-full h-14 bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2"
      >
        <CreditCard className="w-5 h-5" />
        결제하기
      </Button>
    </div>
  )
}