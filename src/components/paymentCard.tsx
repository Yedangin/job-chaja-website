'use client'

import PortOne from '@portone/browser-sdk/v2'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export default function PaymentCard() {
  const handlePayment = async () => {
    await PortOne.requestPayment({
      storeId: 'store-e4038486-8d83-41a5-acf1-844a009e0d94',
      channelKey: 'channel-key-ebe7daa6-4fe4-41bd-b17d-3495264399b5',
      paymentId: crypto.randomUUID(),
      orderName: 'JobChaja 프리미엄 서비스',
      totalAmount: 50000,
      currency: 'KRW',
      payMethod: 'CARD',
    })
  }

  return (
    <Card className="max-w-md mx-auto rounded-2xl shadow-lg">
      <CardHeader className="space-y-2">
        <Badge className="w-fit">프리미엄</Badge>
        <CardTitle className="text-2xl font-bold">
          JobChaja 프리미엄 서비스
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          공정한 면접 · 안전한 보증 · 빠른 매칭
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>서비스 이용료</span>
          <span>₩50,000</span>
        </div>

        {/* <Separator /> */}

        <div className="flex justify-between text-lg font-bold">
          <span>총 결제 금액</span>
          <span>₩50,000</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handlePayment}
          className="w-full h-12 text-base font-bold rounded-xl"
        >
          ₩50,000 결제하기
        </Button>
      </CardFooter>
    </Card>
  )
}
