"use client";

export default function Footer() {
  return (
    <footer>
      {/* Top Section */}
      <div className="bg-[#0369a1] text-white padding-responsive-md p-20">
        <div className="container-responsive">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                Jobchaja
              </h3>
              <p className="text-sm sm:text-base text-white text-opacity-80 leading-relaxed">
                공정한 취업 면접과 안전한 보증금
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                플랫폼
              </h4>
              <ul className="space-y-2 text-sm sm:text-base text-white text-opacity-90">
                <li><a href="#" className="hover:underline">작동 방식</a></li>
                <li><a href="#" className="hover:underline">예치금 시스템</a></li>
                <li><a href="#" className="hover:underline">정책</a></li>
                <li><a href="#" className="hover:underline">앱 다운로드</a></li>
              </ul>
            </div>

            {/* Deposit Info */}
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                예치금 정보
              </h4>
              <ul className="space-y-2 text-sm sm:text-base text-white text-opacity-90">
                <li><a href="#" className="hover:underline">구직자를 위한</a></li>
                <li><a href="#" className="hover:underline">기업을 위한</a></li>
                <li><a href="#" className="hover:underline">환불 정책</a></li>
                <li><a href="#" className="hover:underline">보너스 시스템</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                지원
              </h4>
              <ul className="space-y-2 text-sm sm:text-base text-white text-opacity-90">
                <li><a href="#" className="hover:underline">도움말 센터</a></li>
                <li><a href="#" className="hover:underline">지원팀 문의</a></li>
                <li><a href="#" className="hover:underline">FAQ</a></li>
                <li>전화: +82 2 1234 5678</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-[#0369a1] border-opacity-20 bg-[#f0f9ff] text-[#0c4a6e] py-4 sm:py-6">
        <div className="container-responsive">
          <div className="text-center space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-opacity-70 leading-relaxed max-w-4xl mx-auto">
              <span className="font-medium">주식회사 : 예당인</span> <br />
              대표자 성명: 최운아 <br />
              경기도 안산시 상록구 조구나리 1길 58, 2층 201호 <br />
              사업자등록번호: 187-81-03467 | 연락처: +82-10-7209-7488
            </p>

            <p className="text-xs sm:text-sm text-opacity-80">
              © {new Date().getFullYear()} Jobchaja. All rights reserved. | Design by Jobchaja
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
