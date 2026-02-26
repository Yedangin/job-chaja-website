'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import {
  Building2, MapPin, Users, ShieldCheck, Globe, Briefcase,
  Home, Languages, ChevronRight, Edit3, Loader2,
} from 'lucide-react';

interface CompanyProfile {
  companyNameOfficial: string;
  ceoName: string;
  bizRegNumber: string;
  industry: string;
  companySize: string;
  address: string;
  descriptionKo: string;
  descriptionEn: string;
  foreignWorkerCount: number;
  supportDormitory: boolean;
  supportInterpreter: boolean;
  supportVisaSponsorship: boolean;
  benefits: string[];
  logoUrl: string | null;
  coverImageUrl: string | null;
}

/**
 * 기업 프로필 (외부 노출용) / Company profile (public view)
 * 구직자가 보는 기업 페이지
 */
export default function CompanyProfilePage() {
  const { user, verificationStatus } = useAuth();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [descLang, setDescLang] = useState<'ko' | 'en'>('ko');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await fetch('/api/auth/corporate-verify', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile({
            companyNameOfficial: data.companyNameOfficial || user?.companyName || '',
            ceoName: data.ceoName || '',
            bizRegNumber: data.bizRegNumber || '',
            industry: data.industry || '',
            companySize: data.companySize || '',
            address: data.address || '',
            descriptionKo: data.descriptionKo || '',
            descriptionEn: data.descriptionEn || '',
            foreignWorkerCount: data.foreignWorkerCount || 0,
            supportDormitory: data.supportDormitory || false,
            supportInterpreter: data.supportInterpreter || false,
            supportVisaSponsorship: data.supportVisaSponsorship || false,
            benefits: data.benefits || [],
            logoUrl: data.logoUrl || null,
            coverImageUrl: data.coverImageUrl || null,
          });
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [user?.companyName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // 외국인 채용 지원 항목 / Foreign worker support items
  const supportItems = [
    { label: '기숙사 제공', enabled: profile?.supportDormitory, icon: Home },
    { label: '통역 지원', enabled: profile?.supportInterpreter, icon: Languages },
    { label: '비자 발급 지원', enabled: profile?.supportVisaSponsorship, icon: ShieldCheck },
  ];

  const defaultBenefits = ['4대보험', '퇴직금', '연차'];
  const allBenefits = profile?.benefits?.length ? profile.benefits : defaultBenefits;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 프로필 헤더 / Profile header */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
          {profile?.coverImageUrl && (
            <img src={profile.coverImageUrl} alt="cover" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="p-6 -mt-12">
          <div className="flex items-end gap-4 mb-4">
            <div className="w-20 h-20 bg-white rounded-xl border-4 border-white shadow flex items-center justify-center shrink-0">
              {profile?.logoUrl ? (
                <img src={profile.logoUrl} alt="logo" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Building2 className="w-10 h-10 text-blue-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900 truncate">
                  {profile?.companyNameOfficial || user?.companyName || '기업명'}
                </h1>
                {verificationStatus === 'APPROVED' && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    <ShieldCheck className="w-3 h-3" /> 인증기업
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-500">
                {profile?.industry && (
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {profile.industry}</span>
                )}
                {profile?.companySize && (
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {profile.companySize}</span>
                )}
                {profile?.address && (
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.address}</span>
                )}
              </div>
            </div>
            <Link href="/company/profile/edit"
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Edit3 className="w-3.5 h-3.5" /> 수정
            </Link>
          </div>
        </div>
      </div>

      {/* 기업 소개 / Company description */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">기업 소개</h2>
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button onClick={() => setDescLang('ko')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${descLang === 'ko' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              한국어
            </button>
            <button onClick={() => setDescLang('en')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${descLang === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              English
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
          {descLang === 'ko'
            ? (profile?.descriptionKo || '기업 소개가 아직 등록되지 않았습니다.')
            : (profile?.descriptionEn || 'No company description available.')}
        </p>
      </div>

      {/* 외국인 채용 지원 / Foreign worker support */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">외국인 채용 지원</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {supportItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <item.icon className={`w-5 h-5 ${item.enabled ? 'text-green-600' : 'text-gray-300'}`} />
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className={`ml-auto text-xs font-bold ${item.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                {item.enabled ? '제공' : '미제공'}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <Globe className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-700">외국인 근로자 수</span>
            <span className="ml-auto text-sm font-bold text-gray-900">{profile?.foreignWorkerCount || 0}명</span>
          </div>
        </div>
      </div>

      {/* 복리후생 / Benefits */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">복리후생</h2>
        <div className="flex flex-wrap gap-2">
          {allBenefits.map((benefit) => (
            <span key={benefit} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full font-medium">
              {benefit}
            </span>
          ))}
        </div>
      </div>

      {/* 채용 중인 공고 / Active job postings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">채용 중인 공고</h2>
          <Link href="/company/jobs" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            전체보기 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <p className="text-sm text-gray-400 text-center py-8">
          현재 채용 중인 공고가 없습니다.
        </p>
      </div>
    </div>
  );
}
