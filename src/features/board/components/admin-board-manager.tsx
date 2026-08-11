'use client';

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Archive,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FilePlus2,
  FileText,
  Languages,
  Loader2,
  MonitorUp,
  Paperclip,
  Pencil,
  Pin,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  INFO_BOARD_AUDIENCES,
  INFO_BOARD_CATEGORIES,
  INFO_BOARD_LOCALES,
  INFO_BOARD_STATUSES,
  type InfoBoardAttachment,
  type InfoBoardLocale,
  type InfoBoardMutation,
  type InfoBoardPost,
  type InfoBoardTranslation,
} from '../types';
import { useLanguage } from '@/i18n/LanguageProvider';
import {
  ADMIN_BOARD_COPY,
  BOARD_COPY,
  BOARD_LABELS,
  getBoardErrorMessage,
  resolveBoardLocale,
} from '../copy';
import {
  createAdminInfoBoardPost,
  deleteAdminInfoBoardAttachment,
  deleteAdminInfoBoardPost,
  getAdminInfoBoardPost,
  listAdminInfoBoard,
  translateAdminInfoBoardDraft,
  updateAdminInfoBoardPost,
  uploadAdminInfoBoardAttachment,
} from '@/lib/info-board-client';

const PAGE_SIZE = 20;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const FEATURED_COPY = {
  ko: {
    section: '메인 슬라이더', help: '게시 완료된 전체 공개 공지만 메인에 표시됩니다.',
    enabled: '메인 슬라이더에 노출', order: '노출 순서', theme: '색상 테마',
    summary: '슬라이더 요약', summaryPlaceholder: '메인에서 제목 아래에 표시할 짧은 설명',
    imageUrl: '대표 이미지 URL', imageHelp: 'HTTPS 이미지 URL 또는 첫 번째로 첨부한 이미지를 사용합니다.',
    audienceError: '메인 슬라이더 공지는 공개 대상을 전체로 설정해야 합니다.', preview: '메인 슬라이더 미리보기',
  },
  en: {
    section: 'Home slider', help: 'Only published notices available to everyone appear on the home page.',
    enabled: 'Show in the home slider', order: 'Display order', theme: 'Color theme',
    summary: 'Slider summary', summaryPlaceholder: 'A short description shown below the title',
    imageUrl: 'Cover image URL', imageHelp: 'Use an HTTPS image URL or the first attached image.',
    audienceError: 'A home slider notice must be available to everyone.', preview: 'Home slider preview',
  },
  vi: {
    section: 'Thanh trượt trang chủ', help: 'Chỉ thông báo đã đăng và công khai cho mọi người mới xuất hiện.',
    enabled: 'Hiển thị trên trang chủ', order: 'Thứ tự hiển thị', theme: 'Màu hiển thị',
    summary: 'Tóm tắt', summaryPlaceholder: 'Mô tả ngắn hiển thị dưới tiêu đề',
    imageUrl: 'URL ảnh đại diện', imageHelp: 'Dùng URL ảnh HTTPS hoặc ảnh đính kèm đầu tiên.',
    audienceError: 'Thông báo trên trang chủ phải công khai cho mọi người.', preview: 'Xem trước thanh trượt',
  },
  th: {
    section: 'สไลด์หน้าแรก', help: 'แสดงเฉพาะประกาศที่เผยแพร่และเปิดให้ทุกคนเห็น',
    enabled: 'แสดงในสไลด์หน้าแรก', order: 'ลำดับการแสดง', theme: 'ธีมสี',
    summary: 'ข้อความสรุป', summaryPlaceholder: 'คำอธิบายสั้นใต้ชื่อเรื่อง',
    imageUrl: 'URL รูปภาพปก', imageHelp: 'ใช้ URL รูปภาพ HTTPS หรือรูปแนบรูปแรก',
    audienceError: 'ประกาศหน้าแรกต้องเปิดให้ทุกคนเห็น', preview: 'ตัวอย่างสไลด์หน้าแรก',
  },
  fil: {
    section: 'Home slider', help: 'Published notices for everyone lamang ang lalabas sa home page.',
    enabled: 'Ipakita sa home slider', order: 'Display order', theme: 'Color theme',
    summary: 'Slider summary', summaryPlaceholder: 'Maikling paglalarawan sa ilalim ng title',
    imageUrl: 'Cover image URL', imageHelp: 'Gumamit ng HTTPS image URL o unang attached image.',
    audienceError: 'Dapat available sa lahat ang home slider notice.', preview: 'Home slider preview',
  },
} as const;

const AUTO_TRANSLATE_COPY = {
  ko: { action: '나머지 언어 자동 번역', working: '번역 중', help: '현재 언어를 원문으로 빈 언어를 채운 뒤 각 탭에서 직접 교정할 수 있습니다.', sourceRequired: '현재 언어의 제목과 본문을 먼저 입력하세요.', complete: '나머지 언어를 자동 번역했습니다. 언어별로 검수해 주세요.', nothing: '이미 5개 언어가 모두 입력되어 있습니다.' },
  en: { action: 'Auto-translate others', working: 'Translating', help: 'Fill missing languages from the current source, then review each tab manually.', sourceRequired: 'Enter the title and content in the current language first.', complete: 'The other languages were translated. Review each tab before saving.', nothing: 'All five languages are already filled.' },
  vi: { action: 'Tự động dịch ngôn ngữ khác', working: 'Đang dịch', help: 'Dùng ngôn ngữ hiện tại làm nguồn, sau đó kiểm tra từng tab.', sourceRequired: 'Nhập tiêu đề và nội dung bằng ngôn ngữ hiện tại trước.', complete: 'Các ngôn ngữ khác đã được dịch. Hãy kiểm tra từng tab.', nothing: 'Cả năm ngôn ngữ đã được nhập.' },
  th: { action: 'แปลภาษาอื่นอัตโนมัติ', working: 'กำลังแปล', help: 'ใช้ภาษาปัจจุบันเป็นต้นฉบับ แล้วตรวจแก้แต่ละแท็บได้', sourceRequired: 'กรอกชื่อเรื่องและเนื้อหาในภาษาปัจจุบันก่อน', complete: 'แปลภาษาอื่นแล้ว กรุณาตรวจแต่ละแท็บ', nothing: 'กรอกครบทั้งห้าภาษาแล้ว' },
  fil: { action: 'I-auto-translate ang iba', working: 'Nagsasalin', help: 'Gamitin ang kasalukuyang wika bilang source, pagkatapos ay i-review ang bawat tab.', sourceRequired: 'Ilagay muna ang title at content sa kasalukuyang wika.', complete: 'Naisalin ang ibang wika. Suriin ang bawat tab bago i-save.', nothing: 'Kumpleto na ang limang wika.' },
} as const;

const EMPTY_TRANSLATIONS = (): Record<InfoBoardLocale, InfoBoardTranslation> => ({
  ko: { title: '', summary: '', content: '' },
  en: { title: '', summary: '', content: '' },
  vi: { title: '', summary: '', content: '' },
  th: { title: '', summary: '', content: '' },
  fil: { title: '', summary: '', content: '' },
});

const EMPTY_FORM = (): InfoBoardMutation => ({
  category: 'ANNOUNCEMENTS',
  status: 'DRAFT',
  audience: 'ALL',
  isPinned: false,
  isFeatured: false,
  featuredOrder: 1,
  bannerTheme: 'BRAND',
  featuredStartAt: '',
  featuredEndAt: '',
  bannerAssetId: undefined,
  bannerAssetIds: {},
  scheduledAt: '',
  thumbnail: '',
  attachments: [],
  translations: EMPTY_TRANSLATIONS(),
});

function postToForm(post: InfoBoardPost): InfoBoardMutation {
  const translations = EMPTY_TRANSLATIONS();
  for (const locale of INFO_BOARD_LOCALES) {
    const source = post.translations[locale];
    if (source) translations[locale] = { ...source };
  }
  if (!translations.ko.title && !translations.en.title) {
    translations.ko = { title: post.fallbackTitle, summary: '', content: post.fallbackContent };
  }
  return {
    category: post.category,
    status: post.status,
    audience: post.audience,
    isPinned: post.isPinned,
    isFeatured: post.isFeatured,
    featuredOrder: post.featuredOrder || 1,
    bannerTheme: post.bannerTheme,
    featuredStartAt: post.featuredStartAt ? post.featuredStartAt.slice(0, 16) : '',
    featuredEndAt: post.featuredEndAt ? post.featuredEndAt.slice(0, 16) : '',
    bannerAssetId: post.bannerAssetId,
    bannerAssetIds: post.bannerAssetIds,
    scheduledAt: post.scheduledAt ? post.scheduledAt.slice(0, 16) : '',
    thumbnail: post.thumbnail || '',
    attachments: post.attachments,
    translations,
  };
}

function formatBytes(value?: number) {
  if (!value) return '';
  if (value < 1024 * 1024) return `${Math.ceil(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function isEditConflict(reason: unknown) {
  return (
    typeof reason === 'object' &&
    reason !== null &&
    (('code' in reason && reason.code === 'EDIT_CONFLICT') ||
      ('status' in reason && Number(reason.status) === 409))
  );
}

export function AdminBoardManager() {
  const { lang } = useLanguage();
  const locale = resolveBoardLocale(lang);
  const boardCopy = BOARD_COPY[locale];
  const copy = ADMIN_BOARD_COPY[locale];
  const featuredCopy = FEATURED_COPY[locale];
  const translateCopy = AUTO_TRANSLATE_COPY[locale];
  const labels = BOARD_LABELS[locale];
  const [posts, setPosts] = useState<InfoBoardPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loadedVersion, setLoadedVersion] = useState<number | null>(null);
  const [conflictId, setConflictId] = useState<number | null>(null);
  const [editingLoading, setEditingLoading] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [activeLocale, setActiveLocale] = useState<InfoBoardLocale>('ko');
  const [form, setForm] = useState<InfoBoardMutation>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [legacyWarning, setLegacyWarning] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [deletingAttachment, setDeletingAttachment] = useState<string | null>(null);
  const [persistedAttachmentIds, setPersistedAttachmentIds] = useState<string[]>([]);
  const [reloadKey, setReloadKey] = useState(0);
  const uploadAbortRef = useRef<(() => void) | null>(null);

  const loadPosts = useCallback(() => {
    const controller = new AbortController();
    listAdminInfoBoard({ locale, page, limit: PAGE_SIZE }, controller.signal)
      .then((result) => {
        setPosts(result.items);
        setTotal(result.total);
        setLegacyWarning(
          result.isLegacyContract
            ? copy.legacyListWarning
            : '',
        );
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setPosts([]);
          setTotal(0);
          setError(getBoardErrorMessage(reason, boardCopy));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return controller;
  }, [boardCopy, copy.legacyListWarning, locale, page]);

  useEffect(() => {
    const controller = loadPosts();
    return () => controller.abort();
  }, [loadPosts, reloadKey]);

  useEffect(() => () => uploadAbortRef.current?.(), []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentTranslation = form.translations[activeLocale];
  const previewTranslation = useMemo(() => {
    const requested = form.translations[activeLocale];
    if (requested.title || requested.content) return requested;
    return form.translations.ko.title ? form.translations.ko : form.translations.en;
  }, [activeLocale, form.translations]);

  const setTranslation = (key: keyof InfoBoardTranslation, value: string) => {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [activeLocale]: { ...current.translations[activeLocale], [key]: value },
      },
    }));
  };

  const autoTranslateMissing = async () => {
    const source = form.translations[activeLocale];
    if (!source.title.trim() || !source.content.trim()) {
      setError(translateCopy.sourceRequired);
      return;
    }
    const targetLocales = INFO_BOARD_LOCALES.filter((itemLocale) => {
      if (itemLocale === activeLocale) return false;
      const target = form.translations[itemLocale];
      return !target.title.trim() || !target.summary.trim() || !target.content.trim();
    });
    if (targetLocales.length === 0) {
      setSuccess(translateCopy.nothing);
      return;
    }

    const sourceSummary = source.summary.trim()
      || source.content.replace(/\s+/g, ' ').trim().slice(0, 180);
    setTranslating(true);
    setError('');
    setSuccess('');
    try {
      const translated = await translateAdminInfoBoardDraft({
        sourceLocale: activeLocale,
        targetLocales,
        title: source.title.trim(),
        summary: sourceSummary,
        content: source.content.trim(),
      });
      setForm((current) => {
        const translations = { ...current.translations };
        translations[activeLocale] = {
          ...translations[activeLocale],
          summary: translations[activeLocale].summary.trim() || sourceSummary,
        };
        for (const itemLocale of targetLocales) {
          const result = translated[itemLocale];
          if (!result) continue;
          const existing = translations[itemLocale];
          translations[itemLocale] = {
            title: existing.title.trim() || result.title,
            summary: existing.summary.trim() || result.summary,
            content: existing.content.trim() || result.content,
          };
        }
        return { ...current, translations };
      });
      setSuccess(translateCopy.complete);
    } catch (reason) {
      setError(getBoardErrorMessage(reason, boardCopy));
    } finally {
      setTranslating(false);
    }
  };

  const resetForm = () => {
    uploadAbortRef.current?.();
    uploadAbortRef.current = null;
    setEditingId(null);
    setLoadedVersion(null);
    setConflictId(null);
    setForm(EMPTY_FORM());
    setActiveLocale('ko');
    setUploadProgress(null);
    setUploadName('');
    setUploadError('');
    setPersistedAttachmentIds([]);
    setError('');
  };

  const loadEditor = async (postId: number, scrollToEditor: boolean) => {
    setEditingLoading(postId);
    setError('');
    setSuccess('');
    try {
      const detail = await getAdminInfoBoardPost(postId, locale);
      setEditingId(postId);
      setLoadedVersion(detail.version ?? null);
      setConflictId(null);
      setForm(postToForm(detail));
      setPersistedAttachmentIds(detail.attachments.map((attachment) => attachment.id));
      setActiveLocale(detail.translations.ko ? 'ko' : 'en');
      if (scrollToEditor) window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (reason) {
      setError(getBoardErrorMessage(reason, boardCopy));
    } finally {
      setEditingLoading(null);
    }
  };

  const startEdit = (post: InfoBoardPost) => loadEditor(post.id, true);

  const validateForm = () => {
    const hasPrimary = [form.translations.ko, form.translations.en].some(
      (translation) => translation.title.trim() && translation.content.trim(),
    );
    if (!hasPrimary) return copy.primaryRequired;
    if (form.status === 'SCHEDULED' && !form.scheduledAt) return copy.scheduleRequired;
    if (form.isFeatured && form.audience !== 'ALL') return featuredCopy.audienceError;
    return '';
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (editingId !== null && loadedVersion === null) {
      setError(copy.versionRequired);
      setConflictId(editingId);
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const saved = editingId !== null
        ? await updateAdminInfoBoardPost(editingId, form, loadedVersion as number)
        : await createAdminInfoBoardPost(form);
      if (saved.isLegacyContract) {
        setLegacyWarning(
          copy.legacySaveWarning,
        );
        setSuccess(copy.legacySaved);
      } else {
        setSuccess(editingId ? copy.updated : copy.created);
      }
      resetForm();
      setLoading(true);
      setReloadKey((key) => key + 1);
    } catch (reason) {
      if (editingId !== null && isEditConflict(reason)) {
        setConflictId(editingId);
        setError(copy.concurrentConflict);
      } else {
        setError(getBoardErrorMessage(reason, boardCopy));
      }
    } finally {
      setSaving(false);
    }
  };

  const removePost = async (post: InfoBoardPost) => {
    if (!window.confirm(copy.deleteConfirm.replace('{title}', post.fallbackTitle))) return;
    setDeletingId(post.id);
    setError('');
    setSuccess('');
    try {
      await deleteAdminInfoBoardPost(post.id);
      setSuccess(copy.deleted);
      if (editingId === post.id) resetForm();
      setLoading(true);
      setReloadKey((key) => key + 1);
    } catch (reason) {
      setError(getBoardErrorMessage(reason, boardCopy));
    } finally {
      setDeletingId(null);
    }
  };

  const uploadAttachment = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploadError('');
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setUploadError(copy.invalidFileType);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(copy.fileTooLarge);
      return;
    }

    setUploadName(file.name);
    setUploadProgress(0);
    const task = uploadAdminInfoBoardAttachment(file, setUploadProgress);
    uploadAbortRef.current = task.abort;
    task.promise
      .then((attachment) => {
        setForm((current) => ({
          ...current,
          attachments: [...current.attachments, attachment],
        }));
        setUploadProgress(null);
        setUploadName('');
      })
      .catch((reason: unknown) => {
        setUploadProgress(null);
        setUploadError(getBoardErrorMessage(reason, boardCopy, boardCopy.uploadFailed));
      })
      .finally(() => {
        uploadAbortRef.current = null;
      });
  };

  const removeAttachment = async (attachment: InfoBoardAttachment) => {
    if (persistedAttachmentIds.includes(attachment.id)) {
      setForm((current) => ({
        ...current,
        attachments: current.attachments.filter((item) => item.id !== attachment.id),
      }));
      return;
    }
    setDeletingAttachment(attachment.id);
    setUploadError('');
    try {
      await deleteAdminInfoBoardAttachment(attachment.id);
      setForm((current) => ({
        ...current,
        attachments: current.attachments.filter((item) => item.id !== attachment.id),
      }));
    } catch (reason) {
      setUploadError(getBoardErrorMessage(reason, boardCopy));
    } finally {
      setDeletingAttachment(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 text-[#191F28] sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E5E8EB] pb-5">
        <div>
          <p className="text-sm font-semibold text-[#0066FF]">{copy.eyebrow}</p>
          <h1 className="mt-1 text-2xl font-bold">{copy.title}</h1>
          <p className="mt-2 text-sm text-[#6B7684]">{copy.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/slider"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0066FF] px-3 text-sm font-semibold text-white"
          >
            <MonitorUp className="h-4 w-4" /> {featuredCopy.section}
          </Link>
          <Link
            href="/notice"
            target="_blank"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D1D6DB] bg-white px-3 text-sm font-semibold text-[#333D4B]"
          >
            <ExternalLink className="h-4 w-4" /> {copy.publicView}
          </Link>
        </div>
      </header>

      {legacyWarning && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">{copy.contractTitle}</p>
            <p>{legacyWarning}</p>
          </div>
        </div>
      )}
      {error && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="min-w-0 flex-1">{error}</span>
          {conflictId !== null && (
            <button
              type="button"
              onClick={() => loadEditor(conflictId, false)}
              disabled={editingLoading === conflictId}
              className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-2 font-semibold disabled:opacity-50"
            >
              {editingLoading === conflictId ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {copy.reloadLatest}
            </button>
          )}
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-[#EAF2FF] p-3 text-sm text-[#0056D6]">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {success}
        </div>
      )}

      <form onSubmit={submit} className="rounded-lg border border-[#E5E8EB] bg-white">
        <div className="flex items-center justify-between border-b border-[#E5E8EB] px-4 py-4 sm:px-5">
          <h2 className="flex items-center gap-2 text-base font-bold">
            {editingId ? <Pencil className="h-4 w-4 text-[#0066FF]" /> : <FilePlus2 className="h-4 w-4 text-[#0066FF]" />}
            {editingId ? copy.formEdit.replace('{id}', String(editingId)) : copy.formCreate}
          </h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-lg p-2 text-[#6B7684] hover:bg-[#F2F4F6]" aria-label={copy.cancelEdit}>
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-4">
          <label className="text-sm font-semibold text-[#333D4B]">
            {copy.category}
            <select
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as InfoBoardMutation['category'] }))}
              className="mt-2 h-10 w-full rounded-lg border border-[#D1D6DB] bg-white px-3 font-normal outline-none focus:border-[#0066FF]"
            >
              {INFO_BOARD_CATEGORIES.map((value) => <option key={value} value={value}>{labels.categories[value]}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-[#333D4B]">
            {copy.status}
            <select
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as InfoBoardMutation['status'] }))}
              className="mt-2 h-10 w-full rounded-lg border border-[#D1D6DB] bg-white px-3 font-normal outline-none focus:border-[#0066FF]"
            >
              {INFO_BOARD_STATUSES.map((value) => <option key={value} value={value}>{labels.statuses[value]}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-[#333D4B]">
            {copy.audience}
            <select
              value={form.audience}
              onChange={(event) => setForm((current) => {
                const audience = event.target.value as InfoBoardMutation['audience'];
                return { ...current, audience, isFeatured: audience === 'ALL' ? current.isFeatured : false };
              })}
              className="mt-2 h-10 w-full rounded-lg border border-[#D1D6DB] bg-white px-3 font-normal outline-none focus:border-[#0066FF]"
            >
              {INFO_BOARD_AUDIENCES.map((value) => <option key={value} value={value}>{labels.audiences[value]}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 self-end rounded-lg border border-[#D1D6DB] px-3 py-2.5 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.isPinned}
              onChange={(event) => setForm((current) => ({ ...current, isPinned: event.target.checked }))}
              className="h-4 w-4 accent-[#0066FF]"
            />
            <Pin className="h-4 w-4 text-[#0066FF]" /> {copy.pinned}
          </label>
        </div>

        {form.status === 'SCHEDULED' && (
          <div className="border-t border-[#E5E8EB] px-4 py-4 sm:px-5">
            <label className="block max-w-sm text-sm font-semibold text-[#333D4B]">
              {copy.scheduleTime}
              <span className="relative mt-2 block">
                <CalendarClock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B95A1]" />
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(event) => setForm((current) => ({ ...current, scheduledAt: event.target.value }))}
                  className="h-10 w-full rounded-lg border border-[#D1D6DB] pl-10 pr-3 font-normal outline-none focus:border-[#0066FF]"
                />
              </span>
            </label>
          </div>
        )}

        <div className="border-t border-[#E5E8EB] px-4 py-5 sm:px-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[#333D4B]">{copy.translationLanguages}</p>
              <p className="mt-1 text-xs text-[#6B7684]">
                {translateCopy.help}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void autoTranslateMissing()}
              disabled={translating}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#0066FF] bg-white px-3 text-sm font-semibold text-[#0066FF] hover:bg-[#EAF2FF] disabled:opacity-50"
            >
              {translating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
              {translating ? translateCopy.working : translateCopy.action}
            </button>
          </div>
          <div className="flex gap-1 overflow-x-auto border-b border-[#E5E8EB]" role="tablist" aria-label={copy.translationLanguages}>
            {INFO_BOARD_LOCALES.map((locale) => {
              const complete = form.translations[locale].title.trim() && form.translations[locale].content.trim();
              return (
                <button
                  key={locale}
                  type="button"
                  role="tab"
                  aria-selected={activeLocale === locale}
                  onClick={() => setActiveLocale(locale)}
                  className={`flex h-10 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-semibold ${
                    activeLocale === locale
                      ? 'border-[#0066FF] text-[#0066FF]'
                      : 'border-transparent text-[#6B7684] hover:text-[#333D4B]'
                  }`}
                >
                  {labels.locales[locale]}
                  {complete && <CheckCircle2 className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[#333D4B]">
                {copy.titleField} ({labels.locales[activeLocale]})
                <input
                  value={currentTranslation.title}
                  onChange={(event) => setTranslation('title', event.target.value)}
                  maxLength={200}
                  className="mt-2 h-11 w-full rounded-lg border border-[#D1D6DB] px-3 font-normal outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10"
                  placeholder={copy.titlePlaceholder}
                />
              </label>
              <label className="block text-sm font-semibold text-[#333D4B]">
                {featuredCopy.summary} ({labels.locales[activeLocale]})
                <textarea
                  value={currentTranslation.summary}
                  onChange={(event) => setTranslation('summary', event.target.value)}
                  maxLength={500}
                  rows={3}
                  className="mt-2 w-full resize-y rounded-lg border border-[#D1D6DB] p-3 font-normal leading-6 outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10"
                  placeholder={featuredCopy.summaryPlaceholder}
                />
              </label>
              <label className="block text-sm font-semibold text-[#333D4B]">
                {copy.contentField} ({labels.locales[activeLocale]})
                <textarea
                  value={currentTranslation.content}
                  onChange={(event) => setTranslation('content', event.target.value)}
                  rows={12}
                  className="mt-2 w-full resize-y rounded-lg border border-[#D1D6DB] p-3 font-normal leading-6 outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10"
                  placeholder={copy.contentPlaceholder}
                />
              </label>
            </div>
            <section className="rounded-lg border border-[#E5E8EB] bg-[#F9FAFB] p-4" aria-label={copy.previewAria}>
              <p className="text-xs font-bold uppercase text-[#8B95A1]">{copy.previewLabel}</p>
              <h3 className="mt-3 break-words text-lg font-bold">{previewTranslation.title || copy.previewTitle}</h3>
              <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-[#4E5968]">
                {previewTranslation.content || copy.previewContent}
              </p>
            </section>
          </div>
        </div>

        <div className="border-t border-[#E5E8EB] px-4 py-5 sm:px-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold"><Paperclip className="h-4 w-4 text-[#0066FF]" /> {copy.attachments}</h3>
              <p className="mt-1 text-xs leading-5 text-[#6B7684]">{copy.attachmentHelp}</p>
            </div>
            <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#0066FF] bg-white px-3 text-sm font-semibold text-[#0066FF] hover:bg-[#EAF2FF]">
              <Upload className="h-4 w-4" /> {copy.selectFile}
              <input
                type="file"
                className="sr-only"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={uploadAttachment}
                disabled={uploadProgress !== null}
              />
            </label>
          </div>

          {uploadProgress !== null && (
            <div className="mt-4 rounded-lg border border-[#E5E8EB] p-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate font-medium">{uploadName}</span>
                <button type="button" onClick={() => uploadAbortRef.current?.()} className="rounded p-1 text-[#6B7684]" aria-label={copy.cancelUpload}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded bg-[#E5E8EB]">
                <div className="h-full bg-[#0066FF] transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="mt-1 text-right text-xs text-[#6B7684]">{uploadProgress}%</p>
            </div>
          )}
          {uploadError && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{copy.attachmentError}: {uploadError}</span>
            </div>
          )}
          {form.attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {form.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center gap-3 rounded-lg border border-[#E5E8EB] px-3 py-2.5">
                  <FileText className="h-4 w-4 shrink-0 text-[#0066FF]" />
                  <span className="min-w-0 flex-1 truncate text-sm">{attachment.name}</span>
                  <span className="text-xs text-[#8B95A1]">{formatBytes(attachment.size)}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(attachment)}
                    disabled={deletingAttachment === attachment.id}
                    className="rounded p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50"
                    aria-label={copy.deleteAttachment.replace('{name}', attachment.name)}
                  >
                    {deletingAttachment === attachment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-[#E5E8EB] bg-[#F9FAFB] px-4 py-4 sm:px-5">
          <button type="button" onClick={resetForm} className="h-10 rounded-lg border border-[#D1D6DB] bg-white px-4 text-sm font-semibold text-[#4E5968]">
            {copy.reset}
          </button>
          <button
            type="submit"
            disabled={saving || uploadProgress !== null}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0066FF] px-4 text-sm font-semibold text-white hover:bg-[#0056D6] disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {editingId ? copy.saveEdit : copy.saveCreate}
          </button>
        </div>
      </form>

      <section className="rounded-lg border border-[#E5E8EB] bg-white">
        <div className="flex items-center justify-between border-b border-[#E5E8EB] px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-base font-bold">{copy.registered}</h2>
            <p className="mt-1 text-xs text-[#6B7684]">{copy.total.replace('{count}', String(total))}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError('');
              setReloadKey((key) => key + 1);
            }}
            className="rounded-lg p-2 text-[#6B7684] hover:bg-[#F2F4F6]"
            aria-label={copy.refresh}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="py-14 text-center text-sm text-[#6B7684]"><Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-[#0066FF]" />{boardCopy.loading}</div>
        ) : posts.length === 0 ? (
          <div className="py-14 text-center text-sm text-[#6B7684]"><Archive className="mx-auto mb-2 h-7 w-7 text-[#B0B8C1]" />{copy.empty}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-[#F9FAFB] text-xs text-[#6B7684]">
                <tr>
                  <th className="px-4 py-3 font-semibold">{copy.tableTitle}</th>
                  <th className="px-3 py-3 font-semibold">{copy.tableCategory}</th>
                  <th className="px-3 py-3 font-semibold">{copy.tableStatus}</th>
                  <th className="px-3 py-3 font-semibold">{copy.tableAudience}</th>
                  <th className="px-3 py-3 font-semibold">{copy.tableLanguages}</th>
                  <th className="px-4 py-3 text-right font-semibold">{copy.tableActions}</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-t border-[#E5E8EB] hover:bg-[#F9FAFB]">
                    <td className="max-w-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        {post.isPinned && <Pin className="h-3.5 w-3.5 shrink-0 text-[#0066FF]" />}
                        {post.isFeatured && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded bg-[#EAF2FF] px-1.5 py-0.5 text-[10px] font-bold text-[#0056D6]">
                            <MonitorUp className="h-3 w-3" /> {post.featuredOrder || 1}
                          </span>
                        )}
                        <span className="truncate font-semibold">{post.translations.ko?.title || post.translations.en?.title || post.fallbackTitle}</span>
                      </div>
                      <p className="mt-1 text-xs text-[#8B95A1]">#{post.id} · {new Date(post.createdAt).toLocaleDateString(locale === 'fil' ? 'fil-PH' : locale)}</p>
                    </td>
                    <td className="px-3 py-3 text-[#4E5968]">{labels.categories[post.category]}</td>
                    <td className="px-3 py-3"><span className="rounded bg-[#F2F4F6] px-2 py-1 text-xs font-semibold">{labels.statuses[post.status]}</span></td>
                    <td className="px-3 py-3 text-[#4E5968]">{labels.audiences[post.audience]}</td>
                    <td className="px-3 py-3 text-xs text-[#6B7684]">{INFO_BOARD_LOCALES.filter((locale) => post.translations[locale]?.title).map((locale) => locale.toUpperCase()).join(', ') || 'KO'}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(post)}
                          disabled={editingLoading === post.id}
                          className="rounded-lg p-2 text-[#0066FF] hover:bg-[#EAF2FF] disabled:opacity-50"
                          aria-label={copy.edit}
                        >
                          {editingLoading === post.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => removePost(post)}
                          disabled={deletingId === post.id}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                          aria-label={copy.delete}
                        >
                          {deletingId === post.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-3 border-t border-[#E5E8EB] px-4 py-4" aria-label={copy.pagination}>
            <button type="button" disabled={page <= 1} onClick={() => { setLoading(true); setError(''); setPage((value) => value - 1); }} className="rounded-lg border border-[#D1D6DB] p-2 disabled:opacity-40" aria-label={boardCopy.previous}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold">{page} / {totalPages}</span>
            <button type="button" disabled={page >= totalPages} onClick={() => { setLoading(true); setError(''); setPage((value) => value + 1); }} className="rounded-lg border border-[#D1D6DB] p-2 disabled:opacity-40" aria-label={boardCopy.next}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}
