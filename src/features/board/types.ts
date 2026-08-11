export const INFO_BOARD_CATEGORIES = [
  'VISA_INFO',
  'EDUCATION',
  'EXAM',
  'TRAINING',
  'EVENTS',
  'LIVING_TIPS',
  'POLICY_LAW',
  'ANNOUNCEMENTS',
] as const;

export const INFO_BOARD_STATUSES = [
  'DRAFT',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
] as const;

export const INFO_BOARD_AUDIENCES = ['ALL', 'WORKER', 'COMPANY'] as const;
export const INFO_BOARD_LOCALES = ['ko', 'en', 'vi', 'th', 'fil'] as const;
export const INFO_BOARD_BANNER_THEMES = [
  'BRAND',
  'CHARCOAL',
  'GREEN',
  'AMBER',
  'RED',
] as const;

export type InfoBoardCategory = (typeof INFO_BOARD_CATEGORIES)[number];
export type InfoBoardStatus = (typeof INFO_BOARD_STATUSES)[number];
export type InfoBoardAudience = (typeof INFO_BOARD_AUDIENCES)[number];
export type InfoBoardLocale = (typeof INFO_BOARD_LOCALES)[number];
export type InfoBoardBannerTheme = (typeof INFO_BOARD_BANNER_THEMES)[number];

export type InfoBoardTranslation = {
  title: string;
  summary: string;
  content: string;
};

export type InfoBoardAttachment = {
  id: string;
  name: string;
  url?: string;
  mimeType?: string;
  size?: number;
};

export type InfoBoardPost = {
  id: number;
  category: InfoBoardCategory;
  status: InfoBoardStatus;
  audience: InfoBoardAudience;
  isPinned: boolean;
  isFeatured: boolean;
  featuredOrder?: number;
  bannerTheme: InfoBoardBannerTheme;
  featuredStartAt?: string;
  featuredEndAt?: string;
  bannerAssetId?: number;
  bannerImage?: string;
  bannerAssetIds: Partial<Record<InfoBoardLocale, number>>;
  bannerImages: Partial<Record<InfoBoardLocale, string>>;
  translations: Partial<Record<InfoBoardLocale, InfoBoardTranslation>>;
  fallbackTitle: string;
  fallbackContent: string;
  thumbnail?: string;
  attachments: InfoBoardAttachment[];
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
  version?: number;
  isLegacyContract: boolean;
};

export type InfoBoardListResult = {
  items: InfoBoardPost[];
  total: number;
  page: number;
  limit: number;
  isLegacyContract: boolean;
};

export type InfoBoardBaseQuery = {
  search?: string;
  category?: InfoBoardCategory | '';
  locale?: InfoBoardLocale;
  page?: number;
  limit?: number;
};

export type PublicInfoBoardQuery = InfoBoardBaseQuery;
export type CompanyInfoBoardQuery = InfoBoardBaseQuery;
export type WorkerInfoBoardQuery = InfoBoardBaseQuery;

export type AdminInfoBoardQuery = InfoBoardBaseQuery & {
  audience?: InfoBoardAudience;
  status?: InfoBoardStatus;
  includeDeleted?: boolean;
};

export type InfoBoardMutation = {
  category: InfoBoardCategory;
  status: InfoBoardStatus;
  audience: InfoBoardAudience;
  isPinned: boolean;
  isFeatured: boolean;
  featuredOrder?: number;
  bannerTheme: InfoBoardBannerTheme;
  featuredStartAt?: string;
  featuredEndAt?: string;
  bannerAssetId?: number;
  bannerAssetIds?: Partial<Record<InfoBoardLocale, number>>;
  scheduledAt?: string;
  thumbnail?: string;
  attachments: InfoBoardAttachment[];
  translations: Record<InfoBoardLocale, InfoBoardTranslation>;
};

export type InfoBoardFeaturedAudit = {
  id: number;
  postId: number | null;
  postTitle?: string | null;
  action: 'ADDED' | 'UPDATED' | 'REORDERED' | 'REMOVED' | string;
  previousState?: Record<string, unknown> | null;
  nextState?: Record<string, unknown> | null;
  actorId: string;
  createdAt: string;
};

export type ConfigureFeaturedInfoBoardInput = {
  expectedVersion: number;
  featuredOrder: number;
  bannerTheme: InfoBoardBannerTheme;
  bannerAssets: Array<{ locale: InfoBoardLocale; assetId: number }>;
  featuredStartAt?: string;
  featuredEndAt?: string;
};

export type TranslateInfoBoardInput = {
  sourceLocale: InfoBoardLocale;
  targetLocales: InfoBoardLocale[];
  title: string;
  summary?: string;
  content: string;
};
