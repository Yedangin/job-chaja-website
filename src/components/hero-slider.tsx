'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
      bgColor: 'bg-slate-900',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: '첫 취업 성공 축하금\n최대 30만원 지원',
      description: '잡차자를 통해 취업하고 3개월 근속 시 축하금을 드립니다.',
      type: 'EVENT',
      buttonText: '이벤트 참여하기',
      bgColor: 'bg-[#0284c7]',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="lg:col-span-2 relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-soft group">
      <div
        className="slider-track flex h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`min-w-full h-full ${slide.bgColor} relative flex flex-col justify-center px-10 text-white overflow-hidden`}
          >
            {slide.image && (
              <Image 
                src={slide.image} 
                alt={slide.title} 
                fill 
                className="object-cover"
                priority={idx === 0}
              />
            )}
            {slide.image && <div className="absolute inset-0 bg-black/40"></div>}
            <div className="relative z-10 max-w-lg">
              <span
                className={`inline-block py-1 px-3 rounded-full text-xs font-bold mb-4 ${
                  slide.type === 'NOTICE'
                    ? 'bg-[#0ea5e9]/20 border border-[#0ea5e9]/50 text-blue-200'
                    : 'bg-white/20 text-white'
                }`}
              >
                {slide.type}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight whitespace-pre-line">
                {slide.title}
              </h2>
              <p
                className={`mb-6 ${
                  slide.type === 'NOTICE' ? 'text-slate-300' : 'text-blue-100'
                }`}
              >
                {slide.description}
              </p>
              <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm">
                {slide.buttonText}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 right-6 flex gap-2 z-20">
        <Button
          onClick={prevSlide}
          size="icon"
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 text-white border-0"
        >
          <ChevronLeft size={20} />
        </Button>
        <Button
          onClick={nextSlide}
          size="icon"
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 text-white border-0"
        >
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
}
