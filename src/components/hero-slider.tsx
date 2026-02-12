'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: '외국인 채용 박람회\n현장 면접 사전 접수',
      description: '3월 20일 수원컨벤션센터. 이력서만 있으면 누구나 참여 가능합니다.',
      type: 'NOTICE',
      buttonText: '자세히 보기',
      bgColor: 'bg-gray-900',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: '첫 취업 성공 축하금\n최대 30만원 지원',
      description: '잡차자를 통해 취업하고 3개월 근속 시 축하금을 드립니다.',
      type: 'EVENT',
      buttonText: '이벤트 참여하기',
      bgColor: 'bg-blue-900',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="lg:col-span-2 relative h-56 md:h-72 rounded-lg overflow-hidden group">
      <div
        className="slider-track flex h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`min-w-full h-full ${slide.bgColor} relative flex flex-col justify-center px-8 md:px-10 text-white overflow-hidden`}
          >
            {slide.image && (
              <Image src={slide.image} alt={slide.title} fill className="object-cover" priority={idx === 0} />
            )}
            {slide.image && <div className="absolute inset-0 bg-black/45"></div>}
            <div className="relative z-10 max-w-lg">
              <span className="inline-block py-0.5 px-2.5 rounded text-[11px] font-semibold mb-3 bg-white/20 border border-white/15">
                {slide.type}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight whitespace-pre-line">
                {slide.title}
              </h2>
              <p className="text-gray-300 text-sm mb-4">{slide.description}</p>
              <button className="bg-white text-gray-900 hover:bg-gray-100 font-semibold text-sm px-5 py-2 rounded-md transition">
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 flex gap-1.5 z-20">
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="w-8 h-8 rounded bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="w-8 h-8 rounded bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
