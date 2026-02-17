'use client';

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, getIndustryColor, getTimeAgo } from '../../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../../_mock/job-mock-data-v2';
import { Heart, Star, ChevronLeft, ChevronRight, MapPin, Award, Users, Eye } from 'lucide-react';
import { useState } from 'react';

// Design metadata / 디자인 메타데이터
const designInfo = {
  id: 'g-024',
  name: 'Airbnb Stay',
  description: 'Airbnb listing-style with image carousel, ratings, superhost badge, and price per month',
  category: 'interactive',
  features: [
    'Image carousel with navigation',
    'Star ratings from match score',
    'Superhost badge for featured jobs',
    'Price per month display',
    'Heart favorite button',
    'Grid layout',
    'Coral accent color'
  ],
  usesIndustryImage: true,
  usesCompanyLogo: true,
  reference: 'Airbnb',
  colors: {
    primary: '#FF5A5F', // Airbnb coral
    secondary: '#00A699',
    background: '#FFFFFF',
    text: '#484848',
    textLight: '#767676'
  }
};

// Image carousel component / 이미지 캐러셀 컴포넌트
function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="relative group">
      {/* Image / 이미지 */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={alt}
          className="w-full h-full object-cover"
        />

        {/* Navigation buttons / 네비게이션 버튼 */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-gray-800" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-gray-800" />
            </button>
          </>
        )}

        {/* Dots indicator / 점 인디케이터 */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-2'
                    : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Heart button / 하트 버튼 */}
      <button
        onClick={toggleFavorite}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:scale-110 transition-transform"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          className={`w-6 h-6 ${
            isFavorite
              ? 'fill-[#FF5A5F] text-[#FF5A5F]'
              : 'fill-black/20 text-white stroke-[2]'
          }`}
        />
      </button>
    </div>
  );
}

// Job card component / 채용공고 카드 컴포넌트
function JobCard({ job }: { job: MockJobPostingV2 }) {
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const rating = (job.matchScore || 0) / 20; // Convert 0-100 to 0-5 / 0-100을 0-5로 변환

  // Create image array (3 copies of industryImage for carousel demo) / 이미지 배열 생성 (캐러셀 데모용 3장)
  const images = job.industryImage
    ? [job.industryImage, job.industryImage, job.industryImage]
    : ['https://placehold.co/600x450/e5e7eb/6b7280?text=No+Image'];

  return (
    <div className="group cursor-pointer">
      {/* Image carousel / 이미지 캐러셀 */}
      <ImageCarousel images={images} alt={job.title} />

      {/* Content / 콘텐츠 */}
      <div className="mt-3 space-y-1">
        {/* Location and superhost badge / 위치 및 슈퍼호스트 배지 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[#484848] font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm">{job.location}</span>
          </div>
          {job.isFeatured && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-[#FFF8F6] border border-[#FF5A5F]/20 rounded-md">
              <Award className="w-3 h-3 text-[#FF5A5F]" />
              <span className="text-xs font-medium text-[#FF5A5F]">슈퍼호스트</span>
            </div>
          )}
        </div>

        {/* Job title / 채용공고 제목 */}
        <h3 className="text-[#484848] font-normal text-sm line-clamp-1 group-hover:underline">
          {job.title}
        </h3>

        {/* Company / 회사명 */}
        <p className="text-[#767676] text-sm">
          {job.company}
        </p>

        {/* Experience and work hours / 경력 및 근무시간 */}
        <p className="text-[#767676] text-sm">
          {job.experienceRequired} · {job.workHours}
        </p>

        {/* Rating and price / 평점 및 가격 */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-[#484848] text-[#484848]" />
            <span className="text-sm font-medium text-[#484848]">
              {rating.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-[#484848] font-semibold">{salary}</span>
            <span className="text-[#767676] text-sm"> / 월</span>
          </div>
        </div>

        {/* Visa badges / 비자 배지 */}
        {job.allowedVisas && job.allowedVisas.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {job.allowedVisas.slice(0, 3).map((visa, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700"
              >
                {visa}
              </span>
            ))}
            {job.allowedVisas.length > 3 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                +{job.allowedVisas.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats / 통계 */}
        <div className="flex items-center gap-3 text-xs text-[#767676] pt-1">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{job.applicantCount}명 지원</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{job.viewCount}회</span>
          </div>
          {dDay && (
            <span className="font-medium text-[#FF5A5F]">{dDay}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Main component / 메인 컴포넌트
export default function G024AirbnbStay() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header / 헤더 */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-[#484848]">{designInfo.name}</h1>
              <span className="px-3 py-1 bg-[#FFF8F6] text-[#FF5A5F] rounded-full text-sm font-medium border border-[#FF5A5F]/20">
                {designInfo.category}
              </span>
            </div>
            <p className="text-[#767676]">{designInfo.description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {designInfo.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-[#484848] rounded-full text-xs"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job grid / 채용공고 그리드 */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {sampleJobsV2.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* Design info footer / 디자인 정보 푸터 */}
      <div className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-200">
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="font-semibold text-[#484848] mb-4">Design System</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-[#767676] mb-1">Primary</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF5A5F]"></div>
                <span className="text-[#484848] font-mono text-xs">#FF5A5F</span>
              </div>
            </div>
            <div>
              <div className="text-[#767676] mb-1">Secondary</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#00A699]"></div>
                <span className="text-[#484848] font-mono text-xs">#00A699</span>
              </div>
            </div>
            <div>
              <div className="text-[#767676] mb-1">Text</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#484848]"></div>
                <span className="text-[#484848] font-mono text-xs">#484848</span>
              </div>
            </div>
            <div>
              <div className="text-[#767676] mb-1">Text Light</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#767676]"></div>
                <span className="text-[#484848] font-mono text-xs">#767676</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-[#767676]">
            Reference: {designInfo.reference} | Uses Industry Image: {designInfo.usesIndustryImage ? 'Yes' : 'No'} | Uses Company Logo: {designInfo.usesCompanyLogo ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
    </div>
  );
}
