'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import {
  ArrowLeft, Upload, Loader2, Save, X, Eye,
  Home, Languages, ShieldCheck, Image,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProfileForm {
  industry: string;
  companySize: string;
  address: string;
  descriptionKo: string;
  descriptionEn: string;
  foreignWorkerCount: string;
  supportDormitory: boolean;
  supportInterpreter: boolean;
  supportVisaSponsorship: boolean;
  benefits: string[];
  customBenefit: string;
}

const BENEFIT_OPTIONS = [
  '4대보험', '퇴직금', '연차', '식사 제공', '교통비 지원',
  '기숙사', '성과급', '야근수당', '의료보험', '교육/연수',
  '통역 지원', '비자 발급 지원', '자녀 학비', '명절 보너스',
];

/**
 * 기업 프로필 수정 / Company profile edit page
 * 로고, 대표이미지, 기업소개, 복리후생, 외국인 채용 지원 편집
 */
export default function CompanyProfileEditPage() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [form, setForm] = useState<ProfileForm>({
    industry: '',
    companySize: '',
    address: '',
    descriptionKo: '',
    descriptionEn: '',
    foreignWorkerCount: '0',
    supportDormitory: false,
    supportInterpreter: false,
    supportVisaSponsorship: false,
    benefits: [],
    customBenefit: '',
  });

  // 기존 데이터 불러오기 / Load existing data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        const res = await fetch('/api/auth/corporate-verify', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionId}` },
        });
        if (res.ok) {
          const data = await res.json();
          setForm(prev => ({
            ...prev,
            industry: data.industry || '',
            companySize: data.companySize || '',
            address: data.address || '',
            descriptionKo: data.descriptionKo || '',
            descriptionEn: data.descriptionEn || '',
            foreignWorkerCount: String(data.foreignWorkerCount || 0),
            supportDormitory: data.supportDormitory || false,
            supportInterpreter: data.supportInterpreter || false,
            supportVisaSponsorship: data.supportVisaSponsorship || false,
            benefits: data.benefits || [],
          }));
          if (data.logoUrl) setLogoPreview(data.logoUrl);
          if (data.coverImageUrl) setCoverPreview(data.coverImageUrl);
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleBenefit = (benefit: string) => {
    setForm(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit],
    }));
  };

  const addCustomBenefit = () => {
    const trimmed = form.customBenefit.trim();
    if (trimmed && !form.benefits.includes(trimmed)) {
      setForm(prev => ({ ...prev, benefits: [...prev.benefits, trimmed], customBenefit: '' }));
    }
  };

  // 저장 / Save
  const handleSave = async () => {
    setSaving(true);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const res = await fetch('/api/auth/corporate-verify', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionId}` },
        body: JSON.stringify({
          industry: form.industry,
          companySize: form.companySize,
          address: form.address,
          descriptionKo: form.descriptionKo,
          descriptionEn: form.descriptionEn,
          foreignWorkerCount: parseInt(form.foreignWorkerCount) || 0,
          supportDormitory: form.supportDormitory,
          supportInterpreter: form.supportInterpreter,
          supportVisaSponsorship: form.supportVisaSponsorship,
          benefits: form.benefits,
        }),
      });
      if (res.ok) {
        toast.success('기업 프로필이 저장되었습니다.');
        await refreshAuth();
        router.push('/company/profile');
      } else {
        const data = await res.json();
        toast.error(data.message || '저장에 실패했습니다.');
      }
    } catch {
      toast.error('네트워크 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/company/profile" className="p-2 text-gray-500 hover:text-gray-700 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">기업정보 수정</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/company/profile"
            className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Eye className="w-3.5 h-3.5" /> 미리보기
          </Link>
          <Button onClick={handleSave} disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
            저장
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* 이미지 업로드 / Image uploads */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">이미지</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">기업 로고</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition">
                {logoPreview ? (
                  <div className="relative w-full h-full">
                    <img src={logoPreview} alt="logo" className="w-full h-full object-contain p-2" />
                    <button type="button" onClick={(e) => { e.preventDefault(); setLogoPreview(null); }}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">로고 업로드</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setLogoPreview(URL.createObjectURL(f)); }} />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">대표 이미지</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition">
                {coverPreview ? (
                  <div className="relative w-full h-full">
                    <img src={coverPreview} alt="cover" className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={(e) => { e.preventDefault(); setCoverPreview(null); }}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Image className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">대표 이미지 업로드</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setCoverPreview(URL.createObjectURL(f)); }} />
              </label>
            </div>
          </div>
        </div>

        {/* 기업 기본 정보 / Company basic info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">기업 정보</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">업종</label>
                <select name="industry" value={form.industry} onChange={handleTextChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">선택하세요</option>
                  <option value="제조업">제조업</option>
                  <option value="건설업">건설업</option>
                  <option value="숙박/음식점업">숙박/음식점업</option>
                  <option value="농업/임업/어업">농업/임업/어업</option>
                  <option value="IT/소프트웨어">IT/소프트웨어</option>
                  <option value="도소매업">도소매업</option>
                  <option value="운수/창고업">운수/창고업</option>
                  <option value="교육서비스업">교육서비스업</option>
                  <option value="보건/사회복지">보건/사회복지</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">기업 규모</label>
                <select name="companySize" value={form.companySize} onChange={handleTextChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">선택하세요</option>
                  <option value="1~4인">1~4인</option>
                  <option value="5~9인">5~9인</option>
                  <option value="10~49인">10~49인</option>
                  <option value="50~99인">50~99인</option>
                  <option value="100~299인">100~299인</option>
                  <option value="300인 이상">300인 이상</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">주소</label>
              <Input name="address" value={form.address} onChange={handleTextChange}
                placeholder="예: 서울시 강남구 역삼동 123-45" />
            </div>
          </div>
        </div>

        {/* 기업 소개 / Company description */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">기업 소개</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">한국어</label>
              <textarea name="descriptionKo" value={form.descriptionKo} onChange={handleTextChange}
                rows={4} placeholder="기업 소개를 작성해주세요"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">English</label>
              <textarea name="descriptionEn" value={form.descriptionEn} onChange={handleTextChange}
                rows={4} placeholder="Write company description in English"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" />
            </div>
          </div>
        </div>

        {/* 외국인 채용 지원 / Foreign worker support */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">외국인 채용 지원</h2>
          <div className="space-y-4">
            <div className="space-y-3">
              {[
                { key: 'supportDormitory' as const, label: '기숙사 제공', icon: Home },
                { key: 'supportInterpreter' as const, label: '통역 지원', icon: Languages },
                { key: 'supportVisaSponsorship' as const, label: '비자 발급 지원', icon: ShieldCheck },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition">
                  <Checkbox checked={form[item.key]}
                    onCheckedChange={(checked) => setForm(prev => ({ ...prev, [item.key]: checked as boolean }))} />
                  <item.icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">외국인 근로자 수</label>
              <Input type="number" name="foreignWorkerCount"
                value={form.foreignWorkerCount} onChange={handleTextChange} min="0" placeholder="0" />
            </div>
          </div>
        </div>

        {/* 복리후생 / Benefits */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">복리후생</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {BENEFIT_OPTIONS.map((benefit) => (
              <button key={benefit} type="button" onClick={() => toggleBenefit(benefit)}
                className={`px-3 py-1.5 text-sm rounded-full border transition ${
                  form.benefits.includes(benefit)
                    ? 'bg-blue-50 text-blue-700 border-blue-300 font-medium'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}>
                {benefit}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={form.customBenefit}
              onChange={(e) => setForm(prev => ({ ...prev, customBenefit: e.target.value }))}
              placeholder="직접 입력 (예: 자녀학자금)"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomBenefit(); } }} />
            <Button type="button" onClick={addCustomBenefit} variant="outline" className="shrink-0 px-4 text-sm">추가</Button>
          </div>
          {form.benefits.filter(b => !BENEFIT_OPTIONS.includes(b)).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.benefits.filter(b => !BENEFIT_OPTIONS.includes(b)).map(b => (
                <span key={b} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                  {b}
                  <button type="button" onClick={() => toggleBenefit(b)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 하단 저장 / Bottom save */}
        <div className="flex justify-end gap-3 pt-2">
          <Link href="/company/profile"
            className="px-6 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            취소
          </Link>
          <Button onClick={handleSave} disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-medium">
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
            저장하기
          </Button>
        </div>
      </div>
    </div>
  );
}
