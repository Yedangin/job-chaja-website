'use client'

import { useState } from 'react'
import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Heart, X, MapPin, Clock, Star, Eye, EyeOff, Briefcase } from 'lucide-react'

const designInfo = {
  id: 'g-051',
  name: '틴더×블라인드 (Tinder×Blind)',
  category: 'interactive',
  reference: 'Tinder swipe UI + Blind anonymous forum',
  description: 'Swipeable job cards with hidden company names, match percentage, and anonymous rating system. Features card stack effect and hover-to-reveal interactions.',
  author: 'Gemini'
}

export default function G051Page() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealedCompanies, setRevealedCompanies] = useState<Set<number>>(new Set())
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  const currentJob = sampleJobsV2[currentIndex]
  const isRevealed = revealedCompanies.has(currentIndex)

  // Calculate match percentage (mock algorithm based on job attributes)
  // 매칭 퍼센티지 계산 (직무 속성 기반 모의 알고리즘)
  const calculateMatch = (job: MockJobPostingV2): number => {
    let score = 50 // base score
    if ((job.matchedVisas ?? job.allowedVisas ?? []).length > 3) score += 15
    if (job.urgent ?? job.isUrgent) score += 10
    if (job.featured ?? job.isFeatured) score += 10
    if ((job.salary?.min ?? job.salaryMin ?? 0) >= 3500) score += 15
    return Math.min(score, 99)
  }

  // Handle swipe action / 스와이프 액션 처리
  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction)
    setTimeout(() => {
      setSwipeDirection(null)
      setCurrentIndex((prev) => (prev + 1) % sampleJobsV2.length)
      setRevealedCompanies(new Set()) // reset reveals
    }, 400)
  }

  // Toggle company name reveal / 기업명 공개 토글
  const toggleReveal = () => {
    const newRevealed = new Set(revealedCompanies)
    if (isRevealed) {
      newRevealed.delete(currentIndex)
    } else {
      newRevealed.add(currentIndex)
    }
    setRevealedCompanies(newRevealed)
  }

  const matchPercentage = calculateMatch(currentJob)
  const dDay = getDDay(currentJob.closingDate)
  const salary = formatSalary(currentJob)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-purple-600 p-6">
      {/* Design Info Header / 디자인 정보 헤더 */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-xl p-3">
              <Heart className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{designInfo.name}</h1>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                  {designInfo.category}
                </span>
              </div>
              <p className="text-white/80 mb-3">{designInfo.description}</p>
              <div className="flex items-center gap-6 text-sm text-white/70">
                <span>🎨 {designInfo.reference}</span>
                <span>👤 {designInfo.author}</span>
                <span>🆔 {designInfo.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content / 메인 컨텐츠 */}
      <div className="max-w-5xl mx-auto">
        {/* Card Stack Container / 카드 스택 컨테이너 */}
        <div className="relative h-[650px] flex items-center justify-center">
          {/* Background Cards (Stack Effect) / 배경 카드들 (스택 효과) */}
          {[2, 1].map((offset) => {
            const bgIndex = (currentIndex + offset) % sampleJobsV2.length
            return (
              <div
                key={bgIndex}
                className="absolute bg-white rounded-3xl shadow-2xl"
                style={{
                  width: `${440 - offset * 20}px`,
                  height: `${600 - offset * 20}px`,
                  transform: `translateY(${offset * 15}px) scale(${1 - offset * 0.05})`,
                  zIndex: 10 - offset,
                  opacity: 0.5 - offset * 0.2
                }}
              />
            )
          })}

          {/* Active Card / 활성 카드 */}
          <div
            className={`relative bg-white rounded-3xl shadow-2xl w-[440px] transition-all duration-400 ${
              swipeDirection === 'left' ? '-translate-x-[800px] rotate-[-30deg] opacity-0' :
              swipeDirection === 'right' ? 'translate-x-[800px] rotate-[30deg] opacity-0' : ''
            }`}
            style={{ zIndex: 20, height: '600px' }}
          >
            {/* Match Percentage Badge / 매칭 퍼센티지 배지 */}
            <div className="absolute top-6 right-6 z-10">
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-2xl font-bold">{matchPercentage}%</span>
                </div>
                <div className="text-xs text-center mt-1 opacity-90">Match</div>
              </div>
            </div>

            {/* D-Day Badge / 마감일 배지 */}
            {dDay && dDay !== '상시모집' && (
              <div className="absolute top-6 left-6 z-10">
                <div className={`px-4 py-2 rounded-full font-bold shadow-lg ${
                  dDay === '마감' ? 'bg-gray-400 text-white' : 'bg-red-500 text-white'
                }`}>
                  {dDay}
                </div>
              </div>
            )}

            {/* Company Logo / 기업 로고 */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-3xl flex items-center justify-center overflow-hidden">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentJob.company)}&background=635BFF&color=fff&size=128`}
                alt={currentJob.company}
                className="w-28 h-28 object-contain"
              />
              {currentJob.featured && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  추천
                </div>
              )}
            </div>

            {/* Card Content / 카드 컨텐츠 */}
            <div className="p-6">
              {/* Company Name (Blurred/Revealed) / 기업명 (블러/공개) */}
              <div className="mb-4">
                <button
                  onClick={toggleReveal}
                  className="group flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {isRevealed ? (
                    <>
                      <h2 className="text-xl font-bold text-gray-900">{currentJob.company}</h2>
                      <Eye className="w-5 h-5 text-pink-500" />
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-gray-900 blur-sm select-none">
                        {currentJob.company}
                      </h2>
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    </>
                  )}
                </button>
                {!isRevealed && (
                  <p className="text-xs text-gray-500 mt-1">클릭하여 기업명 공개</p>
                )}
              </div>

              {/* Job Title / 공고 제목 */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                {currentJob.title}
              </h3>

              {/* Job Details / 공고 상세 정보 */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Briefcase className="w-5 h-5 text-pink-500" />
                  <span className="font-medium">{currentJob.employmentType}</span>
                  <span className="text-gray-400">•</span>
                  <span>{currentJob.experience}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-pink-500" />
                  <span>{currentJob.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5 text-pink-500" />
                  <span className="font-semibold text-lg text-pink-600">{salary}</span>
                </div>
              </div>

              {/* Anonymous Rating (Blind-style) / 익명 평가 (블라인드 스타일) */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">익명 직원 평가</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>복지/급여</span>
                    <span className="font-semibold">4.5/5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>워라밸</span>
                    <span className="font-semibold">4.2/5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>승진 기회</span>
                    <span className="font-semibold">4.0/5.0</span>
                  </div>
                </div>
              </div>

              {/* Visa Chips / 비자 칩 */}
              <div className="flex flex-wrap gap-2">
                {currentJob.matchedVisas.slice(0, 4).map((visa, idx) => {
                  const colors = getVisaColor(visa)
                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-medium`}
                    >
                      {visa}
                    </span>
                  )
                })}
                {currentJob.matchedVisas.length > 4 && (
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                    +{currentJob.matchedVisas.length - 4}
                  </span>
                )}
              </div>
            </div>

            {/* Swipe Action Buttons (Appear on hover) / 스와이프 액션 버튼 (호버 시 나타남) */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 opacity-0 hover:opacity-100 transition-opacity group">
              <button
                onClick={() => handleSwipe('left')}
                className="w-16 h-16 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:border-red-500 hover:scale-110 transition-all"
                aria-label="Pass"
              >
                <X className="w-8 h-8 text-red-500" />
              </button>
              <button
                onClick={() => handleSwipe('right')}
                className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                aria-label="Apply"
              >
                <Heart className="w-8 h-8 text-white fill-current" />
              </button>
            </div>
          </div>

          {/* Swipe Direction Indicators / 스와이프 방향 표시 */}
          {swipeDirection === 'left' && (
            <div className="absolute left-20 top-1/2 -translate-y-1/2 z-30">
              <div className="bg-red-500 text-white px-8 py-4 rounded-2xl font-bold text-2xl rotate-[-20deg] shadow-2xl">
                PASS
              </div>
            </div>
          )}
          {swipeDirection === 'right' && (
            <div className="absolute right-20 top-1/2 -translate-y-1/2 z-30">
              <div className="bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-2xl rotate-[20deg] shadow-2xl">
                LIKE
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator / 진행 표시 */}
        <div className="mt-8 text-center text-white">
          <p className="text-lg font-medium mb-2">
            {currentIndex + 1} / {sampleJobsV2.length}
          </p>
          <div className="flex gap-2 justify-center">
            {sampleJobsV2.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white w-8' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Instructions / 사용 방법 */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-white">
          <h3 className="font-bold text-lg mb-3">💡 사용 방법</h3>
          <ul className="space-y-2 text-sm text-white/90">
            <li>• 카드에 호버하면 스와이프 버튼이 나타납니다</li>
            <li>• ❌ 버튼: 관심 없음 (Pass)</li>
            <li>• ❤️ 버튼: 지원하기 (Like)</li>
            <li>• 기업명 클릭: 블러 처리된 회사명 공개/숨김</li>
            <li>• 매칭 퍼센티지와 익명 직원 평가를 확인하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
