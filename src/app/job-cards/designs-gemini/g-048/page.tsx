'use client'

import { Heart, Repeat2, Share2, MessageCircle, Clock, MapPin, DollarSign, Hash, TrendingUp, Eye } from 'lucide-react'
import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { useState } from 'react'

// Design metadata / 디자인 메타데이터
const designInfo = {
  id: 'g-048',
  name: 'Twitter×TikTok',
  category: 'Platform-Inspired',
  reference: 'Twitter/X feed + TikTok engagement mechanics',
  description: 'Social feed-style job cards with hashtag navigation, viral engagement metrics (likes/retweets/shares), and TikTok-inspired vertical scroll UX. Twitter blue meets TikTok dark theme.',
  author: 'Gemini Design System'
}

export default function G048TwitterTikTokJobCards() {
  const [likedJobs, setLikedJobs] = useState<Set<string>>(new Set())
  const [retweetedJobs, setRetweetedJobs] = useState<Set<string>>(new Set())

  const handleLike = (jobId: string) => {
    setLikedJobs(prev => {
      const next = new Set(prev)
      if (next.has(jobId)) {
        next.delete(jobId)
      } else {
        next.add(jobId)
      }
      return next
    })
  }

  const handleRetweet = (jobId: string) => {
    setRetweetedJobs(prev => {
      const next = new Set(prev)
      if (next.has(jobId)) {
        next.delete(jobId)
      } else {
        next.add(jobId)
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      {/* Header with Twitter/TikTok branding / 헤더 */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#0f1419]/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#fe2c55] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">JobFeed</h1>
                <p className="text-xs text-gray-400">Trending Jobs</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] rounded-full text-sm font-bold transition-colors">
              Post Job
            </button>
          </div>
        </div>
      </header>

      {/* Design info banner / 디자인 정보 배너 */}
      <div className="bg-gradient-to-r from-[#1DA1F2]/20 via-[#fe2c55]/20 to-[#25f4ee]/20 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1DA1F2] to-[#fe2c55] flex items-center justify-center flex-shrink-0">
              <Hash className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{designInfo.name}</h2>
                <span className="px-3 py-1 bg-[#1DA1F2] rounded-full text-xs font-semibold">
                  {designInfo.id}
                </span>
                <span className="px-3 py-1 bg-gray-800 rounded-full text-xs">
                  {designInfo.category}
                </span>
              </div>
              <p className="text-gray-300 mb-2">{designInfo.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {designInfo.reference}
                </span>
                <span>•</span>
                <span>{designInfo.author}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main feed content / 메인 피드 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-3">
          {sampleJobsV2.map((job) => {
            const dday = getDDay(job.closingDate)
            const isLiked = likedJobs.has(job.id)
            const isRetweeted = retweetedJobs.has(job.id)

            // Mock engagement metrics / 모킹된 참여 지표
            const baseLikes = parseInt(job.id, 36) % 500 + 50
            const baseRetweets = parseInt(job.id, 36) % 200 + 20
            const baseComments = parseInt(job.id, 36) % 100 + 5
            const baseViews = parseInt(job.id, 36) % 5000 + 1000

            const likes = isLiked ? baseLikes + 1 : baseLikes
            const retweets = isRetweeted ? baseRetweets + 1 : baseRetweets

            return (
              <article
                key={job.id}
                className="group bg-[#16181c] border border-gray-800 hover:border-[#1DA1F2]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#1DA1F2]/20"
              >
                <div className="flex gap-3 p-4">
                  {/* Company avatar / 회사 아바타 */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full border-2 border-[#1DA1F2] overflow-hidden bg-gray-800">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.companyName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1DA1F2] to-[#fe2c55] text-white font-bold">
                          {job.companyName.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tweet-style content / 트윗 스타일 콘텐츠 */}
                  <div className="flex-1 min-w-0">
                    {/* Header: company name + verified + time / 헤더 */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-white hover:underline cursor-pointer">
                        {job.companyName}
                      </span>
                      {job.isPremium && (
                        <div className="w-5 h-5 rounded-full bg-[#1DA1F2] flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        </div>
                      )}
                      <span className="text-gray-500 text-sm">
                        @{job.companyName.toLowerCase().replace(/\s+/g, '')}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500 text-sm">{dday || '진행중'}</span>
                    </div>

                    {/* Job title (tweet text) / 채용 제목 */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#1DA1F2] transition-colors cursor-pointer">
                      {job.title}
                    </h3>

                    {/* Job details / 채용 세부정보 */}
                    <div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatSalary(job)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.employmentType ?? job.boardType}
                      </span>
                    </div>

                    {/* Hashtag-style tags / 해시태그 스타일 태그 */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.visaTypes.slice(0, 3).map((visa) => {
                        const colors = getVisaColor(visa)
                        return (
                          <button
                            key={visa}
                            className="flex items-center gap-1 px-3 py-1 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-full text-xs font-semibold transition-colors"
                          >
                            <Hash className="w-3 h-3" />
                            {visa}
                          </button>
                        )
                      })}
                      {(job.skills ?? job.techStack ?? []).slice(0, 2).map((skill) => (
                        <button
                          key={skill}
                          className="flex items-center gap-1 px-3 py-1 bg-[#fe2c55]/10 hover:bg-[#fe2c55]/20 text-[#fe2c55] rounded-full text-xs font-semibold transition-colors"
                        >
                          <Hash className="w-3 h-3" />
                          {skill}
                        </button>
                      ))}
                      <button className="flex items-center gap-1 px-3 py-1 bg-[#25f4ee]/10 hover:bg-[#25f4ee]/20 text-[#25f4ee] rounded-full text-xs font-semibold transition-colors">
                        <Hash className="w-3 h-3" />
                        {job.industry}
                      </button>
                    </div>

                    {/* Featured image (if available) / 대표 이미지 */}
                    {job.industryImage && (
                      <div className="mb-3 rounded-2xl overflow-hidden border border-gray-800">
                        <img
                          src={job.industryImage}
                          alt={job.title}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* Engagement metrics (Twitter + TikTok style) / 참여 지표 */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                      <div className="flex items-center gap-6">
                        {/* Comments / 댓글 */}
                        <button className="flex items-center gap-2 text-gray-500 hover:text-[#1DA1F2] transition-colors group/btn">
                          <div className="p-2 rounded-full group-hover/btn:bg-[#1DA1F2]/10 transition-colors">
                            <MessageCircle className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-medium">{baseComments}</span>
                        </button>

                        {/* Retweets / 리트윗 */}
                        <button
                          onClick={() => handleRetweet(job.id)}
                          className={`flex items-center gap-2 transition-colors group/btn ${
                            isRetweeted ? 'text-[#00ba7c]' : 'text-gray-500 hover:text-[#00ba7c]'
                          }`}
                        >
                          <div className="p-2 rounded-full group-hover/btn:bg-[#00ba7c]/10 transition-colors">
                            <Repeat2 className={`w-5 h-5 ${isRetweeted ? 'animate-pulse' : ''}`} />
                          </div>
                          <span className="text-sm font-medium">{retweets}</span>
                        </button>

                        {/* Likes / 좋아요 */}
                        <button
                          onClick={() => handleLike(job.id)}
                          className={`flex items-center gap-2 transition-colors group/btn ${
                            isLiked ? 'text-[#fe2c55]' : 'text-gray-500 hover:text-[#fe2c55]'
                          }`}
                        >
                          <div className="p-2 rounded-full group-hover/btn:bg-[#fe2c55]/10 transition-colors">
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current animate-bounce' : ''}`} />
                          </div>
                          <span className="text-sm font-medium">{likes}</span>
                        </button>

                        {/* Views (TikTok style) / 조회수 */}
                        <div className="flex items-center gap-2 text-gray-500">
                          <div className="p-2">
                            <Eye className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-medium">{baseViews.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Share button / 공유 버튼 */}
                      <button className="p-2 rounded-full text-gray-500 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* TikTok-style trending indicator / TikTok 스타일 트렌딩 표시 */}
                    {job.isPremium && (
                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#fe2c55] to-[#25f4ee] rounded-full text-white font-bold">
                          <TrendingUp className="w-3 h-3" />
                          <span>Trending</span>
                        </div>
                        <span className="text-gray-500">
                          {likes + retweets + baseComments} engagements
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Load more (TikTok infinite scroll indicator) / 더보기 표시 */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1DA1F2] to-[#fe2c55] rounded-full text-white font-bold cursor-pointer hover:shadow-lg hover:shadow-[#1DA1F2]/50 transition-all">
            <TrendingUp className="w-5 h-5 animate-bounce" />
            <span>Scroll for more jobs</span>
          </div>
        </div>
      </main>

      {/* Footer with design credits / 푸터 */}
      <footer className="border-t border-gray-800 bg-[#0f1419] mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Design: {designInfo.name} ({designInfo.id})
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {designInfo.author} • {designInfo.category}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1DA1F2] flex items-center justify-center">
                <Hash className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#fe2c55] flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
