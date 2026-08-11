'use client';

import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  History,
  ImagePlus,
  Loader2,
  MonitorUp,
  Pencil,
  RefreshCw,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { resolveBoardLocale } from '../copy';
import {
  INFO_BOARD_BANNER_THEMES,
  INFO_BOARD_LOCALES,
  type InfoBoardAttachment,
  type InfoBoardBannerTheme,
  type InfoBoardFeaturedAudit,
  type InfoBoardLocale,
  type InfoBoardPost,
} from '../types';
import {
  configureAdminFeaturedInfoBoard,
  deleteAdminInfoBoardAttachment,
  listAdminFeaturedAudit,
  listAdminFeaturedInfoBoard,
  listAdminInfoBoard,
  removeAdminFeaturedInfoBoard,
  reorderAdminFeaturedInfoBoard,
  uploadAdminInfoBoardAttachment,
} from '@/lib/info-board-client';

const MAX_SLIDES = 8;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const THEME_CLASS: Record<InfoBoardBannerTheme, string> = {
  BRAND: 'bg-[#0066FF]',
  CHARCOAL: 'bg-[#191F28]',
  GREEN: 'bg-[#087A55]',
  AMBER: 'bg-[#9A5B00]',
  RED: 'bg-[#B4232A]',
};

const LOCALE_TAG: Record<InfoBoardLocale, string> = {
  ko: 'ko-KR',
  en: 'en-US',
  vi: 'vi-VN',
  th: 'th-TH',
  fil: 'fil-PH',
};

const COPY = {
  ko: {
    eyebrow: '콘텐츠 운영',
    title: '메인 슬라이더 관리',
    description: '공개 게시글을 전용 이미지와 연결하고 1~8번 노출 순서 및 기간을 관리합니다.',
    refresh: '슬라이더와 변경 이력 새로고침',
    currentTitle: '현재 슬라이더',
    currentHelp: '순서를 바꾸면 즉시 저장됩니다. 빈 슬롯은 메인 화면에 노출되지 않습니다.',
    loading: '슬라이더 정보를 불러오는 중입니다.',
    emptySlot: '비어 있는 슬롯',
    slot: '{order}번 슬롯',
    moveUp: '{title} 위로 이동',
    moveDown: '{title} 아래로 이동',
    edit: '{title} 설정 편집',
    remove: '{title} 즉시 내리기',
    removeLabel: '즉시 내리기',
    removeConfirm: '“{title}”을 메인 슬라이더에서 즉시 내릴까요? 게시글은 삭제되지 않습니다.',
    always: '기간 제한 없음',
    from: '{date}부터',
    until: '{date}까지',
    editorTitle: '슬라이더 설정',
    editorHelp: '게시판 글 하나와 슬라이더 전용 이미지 하나를 연결합니다.',
    post: '연결할 게시글',
    postPlaceholder: '게시글을 선택하세요',
    postHelp: '게시 완료되고 전체 공개된 게시글만 선택할 수 있습니다.',
    order: '노출 순서',
    theme: '브랜드 테마',
    image: '슬라이더 전용 이미지',
    imageHelp: 'JPEG, PNG, WebP · 최대 5MB',
    chooseImage: '이미지 선택',
    replaceImage: '이미지 교체',
    removeImage: '선택한 이미지 제거',
    uploading: '{name} 업로드 중',
    cancelUpload: '이미지 업로드 취소',
    startAt: '노출 시작',
    endAt: '노출 종료',
    optional: '선택 사항',
    preview: '슬라이더 미리보기',
    previewEmpty: '전용 이미지를 업로드하면 미리보기가 표시됩니다.',
    reset: '취소',
    save: '슬라이더 저장',
    saving: '저장 중',
    saved: '슬라이더 설정을 저장했습니다.',
    reordered: '슬라이더 순서를 저장했습니다.',
    removed: '메인 슬라이더에서 내렸습니다.',
    invalidType: 'JPEG, PNG, WebP 이미지만 업로드할 수 있습니다.',
    tooLarge: '이미지는 5MB 이하여야 합니다.',
    uploadFailed: '이미지 업로드에 실패했습니다.',
    postRequired: '연결할 게시글을 선택하세요.',
    imageRequired: '슬라이더 전용 이미지를 업로드하세요.',
    versionRequired: '게시글 버전 정보가 없습니다. 새로고침 후 다시 시도하세요.',
    full: '슬라이더 8개가 모두 사용 중입니다. 기존 항목을 내린 뒤 추가하세요.',
    invalidPeriod: '종료 시각은 시작 시각보다 뒤여야 합니다.',
    expiredPeriod: '종료 시각은 현재보다 뒤여야 합니다.',
    requestFailed: '요청을 처리하지 못했습니다. 잠시 후 다시 시도하세요.',
    conflict: '다른 관리자가 먼저 변경했습니다. 최신 정보를 다시 불러왔습니다.',
    auditTitle: '변경 이력',
    auditHelp: '최근 100건의 슬라이더 설정, 순서 변경, 내리기 기록입니다.',
    auditEmpty: '아직 변경 이력이 없습니다.',
    auditConfigure: '설정 저장',
    auditReorder: '순서 변경',
    auditRemove: '슬라이더 내리기',
    auditBy: '{actor} · {date}',
    unknownActor: '관리자',
    unknownPost: '슬라이더 항목',
    themes: { BRAND: '잡차자 블루', CHARCOAL: '차콜', GREEN: '그린', AMBER: '앰버', RED: '레드' },
  },
  en: {
    eyebrow: 'Content operations',
    title: 'Home slider manager',
    description: 'Connect a public post to a dedicated image and manage its position and display period.',
    refresh: 'Refresh slider and audit history',
    currentTitle: 'Current slider',
    currentHelp: 'Reordering is saved immediately. Empty slots are not shown on the home page.',
    loading: 'Loading slider information.',
    emptySlot: 'Empty slot',
    slot: 'Slot {order}',
    moveUp: 'Move {title} up',
    moveDown: 'Move {title} down',
    edit: 'Edit settings for {title}',
    remove: 'Remove {title} from the slider now',
    removeLabel: 'Remove now',
    removeConfirm: 'Remove “{title}” from the home slider now? The post will not be deleted.',
    always: 'No date limit',
    from: 'From {date}',
    until: 'Until {date}',
    editorTitle: 'Slider settings',
    editorHelp: 'Connect one board post to one dedicated slider image.',
    post: 'Linked post',
    postPlaceholder: 'Select a post',
    postHelp: 'Only published posts available to everyone can be selected.',
    order: 'Display order',
    theme: 'Brand theme',
    image: 'Dedicated slider image',
    imageHelp: 'JPEG, PNG, WebP · up to 5MB',
    chooseImage: 'Choose image',
    replaceImage: 'Replace image',
    removeImage: 'Remove selected image',
    uploading: 'Uploading {name}',
    cancelUpload: 'Cancel image upload',
    startAt: 'Display start',
    endAt: 'Display end',
    optional: 'Optional',
    preview: 'Slider preview',
    previewEmpty: 'Upload a dedicated image to see the preview.',
    reset: 'Cancel',
    save: 'Save slider',
    saving: 'Saving',
    saved: 'Slider settings saved.',
    reordered: 'Slider order saved.',
    removed: 'Removed from the home slider.',
    invalidType: 'Only JPEG, PNG, and WebP images can be uploaded.',
    tooLarge: 'The image must be 5MB or smaller.',
    uploadFailed: 'The image upload failed.',
    postRequired: 'Select a post to link.',
    imageRequired: 'Upload a dedicated slider image.',
    versionRequired: 'The post version is missing. Refresh and try again.',
    full: 'All eight slider slots are in use. Remove an item before adding another.',
    invalidPeriod: 'The end time must be after the start time.',
    expiredPeriod: 'The end time must be in the future.',
    requestFailed: 'The request could not be completed. Please try again.',
    conflict: 'Another administrator changed this first. The latest data has been loaded.',
    auditTitle: 'Change history',
    auditHelp: 'The latest 100 configuration, reorder, and removal events.',
    auditEmpty: 'There is no change history yet.',
    auditConfigure: 'Settings saved',
    auditReorder: 'Order changed',
    auditRemove: 'Removed from slider',
    auditBy: '{actor} · {date}',
    unknownActor: 'Administrator',
    unknownPost: 'Slider item',
    themes: { BRAND: 'Jobchaja blue', CHARCOAL: 'Charcoal', GREEN: 'Green', AMBER: 'Amber', RED: 'Red' },
  },
  vi: {
    eyebrow: 'Quản lý nội dung',
    title: 'Quản lý thanh trượt trang chủ',
    description: 'Liên kết bài viết công khai với ảnh riêng và quản lý vị trí từ 1 đến 8 cùng thời gian hiển thị.',
    refresh: 'Làm mới thanh trượt và lịch sử',
    currentTitle: 'Thanh trượt hiện tại',
    currentHelp: 'Thứ tự mới được lưu ngay. Vị trí trống sẽ không xuất hiện trên trang chủ.',
    loading: 'Đang tải thông tin thanh trượt.',
    emptySlot: 'Vị trí trống',
    slot: 'Vị trí {order}',
    moveUp: 'Di chuyển {title} lên',
    moveDown: 'Di chuyển {title} xuống',
    edit: 'Sửa cài đặt của {title}',
    remove: 'Gỡ {title} khỏi thanh trượt ngay',
    removeLabel: 'Gỡ ngay',
    removeConfirm: 'Gỡ “{title}” khỏi thanh trượt ngay? Bài viết sẽ không bị xóa.',
    always: 'Không giới hạn thời gian',
    from: 'Từ {date}',
    until: 'Đến {date}',
    editorTitle: 'Cài đặt thanh trượt',
    editorHelp: 'Liên kết một bài viết với một ảnh riêng cho thanh trượt.',
    post: 'Bài viết liên kết',
    postPlaceholder: 'Chọn bài viết',
    postHelp: 'Chỉ có thể chọn bài đã đăng và công khai cho mọi người.',
    order: 'Thứ tự hiển thị',
    theme: 'Màu thương hiệu',
    image: 'Ảnh riêng cho thanh trượt',
    imageHelp: 'JPEG, PNG, WebP · tối đa 5MB',
    chooseImage: 'Chọn ảnh',
    replaceImage: 'Đổi ảnh',
    removeImage: 'Bỏ ảnh đã chọn',
    uploading: 'Đang tải lên {name}',
    cancelUpload: 'Hủy tải ảnh',
    startAt: 'Bắt đầu hiển thị',
    endAt: 'Kết thúc hiển thị',
    optional: 'Không bắt buộc',
    preview: 'Xem trước thanh trượt',
    previewEmpty: 'Tải ảnh riêng lên để xem trước.',
    reset: 'Hủy',
    save: 'Lưu thanh trượt',
    saving: 'Đang lưu',
    saved: 'Đã lưu cài đặt thanh trượt.',
    reordered: 'Đã lưu thứ tự thanh trượt.',
    removed: 'Đã gỡ khỏi thanh trượt trang chủ.',
    invalidType: 'Chỉ có thể tải ảnh JPEG, PNG hoặc WebP.',
    tooLarge: 'Ảnh phải có dung lượng từ 5MB trở xuống.',
    uploadFailed: 'Không thể tải ảnh lên.',
    postRequired: 'Hãy chọn bài viết cần liên kết.',
    imageRequired: 'Hãy tải ảnh riêng cho thanh trượt.',
    versionRequired: 'Thiếu phiên bản bài viết. Hãy làm mới và thử lại.',
    full: 'Cả tám vị trí đều đang được dùng. Hãy gỡ một mục trước khi thêm.',
    invalidPeriod: 'Thời gian kết thúc phải sau thời gian bắt đầu.',
    expiredPeriod: 'Thời gian kết thúc phải ở tương lai.',
    requestFailed: 'Không thể xử lý yêu cầu. Vui lòng thử lại.',
    conflict: 'Một quản trị viên khác đã thay đổi trước. Dữ liệu mới nhất đã được tải.',
    auditTitle: 'Lịch sử thay đổi',
    auditHelp: '100 lần cài đặt, đổi thứ tự và gỡ gần nhất.',
    auditEmpty: 'Chưa có lịch sử thay đổi.',
    auditConfigure: 'Đã lưu cài đặt',
    auditReorder: 'Đã đổi thứ tự',
    auditRemove: 'Đã gỡ khỏi thanh trượt',
    auditBy: '{actor} · {date}',
    unknownActor: 'Quản trị viên',
    unknownPost: 'Mục thanh trượt',
    themes: { BRAND: 'Xanh Jobchaja', CHARCOAL: 'Than', GREEN: 'Xanh lá', AMBER: 'Hổ phách', RED: 'Đỏ' },
  },
  th: {
    eyebrow: 'การจัดการเนื้อหา',
    title: 'จัดการสไลด์หน้าแรก',
    description: 'เชื่อมโพสต์สาธารณะกับรูปเฉพาะ และจัดการลำดับ 1 ถึง 8 พร้อมช่วงเวลาที่แสดง',
    refresh: 'รีเฟรชสไลด์และประวัติ',
    currentTitle: 'สไลด์ปัจจุบัน',
    currentHelp: 'การเปลี่ยนลำดับจะบันทึกทันที ช่องว่างจะไม่แสดงบนหน้าแรก',
    loading: 'กำลังโหลดข้อมูลสไลด์',
    emptySlot: 'ช่องว่าง',
    slot: 'ช่องที่ {order}',
    moveUp: 'เลื่อน {title} ขึ้น',
    moveDown: 'เลื่อน {title} ลง',
    edit: 'แก้ไขการตั้งค่า {title}',
    remove: 'นำ {title} ออกจากสไลด์ทันที',
    removeLabel: 'นำออกทันที',
    removeConfirm: 'นำ “{title}” ออกจากสไลด์หน้าแรกทันทีหรือไม่? โพสต์จะไม่ถูกลบ',
    always: 'ไม่จำกัดเวลา',
    from: 'ตั้งแต่ {date}',
    until: 'ถึง {date}',
    editorTitle: 'ตั้งค่าสไลด์',
    editorHelp: 'เชื่อมโพสต์หนึ่งรายการกับรูปสำหรับสไลด์หนึ่งรูป',
    post: 'โพสต์ที่เชื่อม',
    postPlaceholder: 'เลือกโพสต์',
    postHelp: 'เลือกได้เฉพาะโพสต์ที่เผยแพร่และทุกคนมองเห็นได้',
    order: 'ลำดับการแสดง',
    theme: 'ธีมแบรนด์',
    image: 'รูปเฉพาะสำหรับสไลด์',
    imageHelp: 'JPEG, PNG, WebP · สูงสุด 5MB',
    chooseImage: 'เลือกรูป',
    replaceImage: 'เปลี่ยนรูป',
    removeImage: 'นำรูปที่เลือกออก',
    uploading: 'กำลังอัปโหลด {name}',
    cancelUpload: 'ยกเลิกการอัปโหลดรูป',
    startAt: 'เริ่มแสดง',
    endAt: 'สิ้นสุดการแสดง',
    optional: 'ไม่บังคับ',
    preview: 'ตัวอย่างสไลด์',
    previewEmpty: 'อัปโหลดรูปเฉพาะเพื่อดูตัวอย่าง',
    reset: 'ยกเลิก',
    save: 'บันทึกสไลด์',
    saving: 'กำลังบันทึก',
    saved: 'บันทึกการตั้งค่าสไลด์แล้ว',
    reordered: 'บันทึกลำดับสไลด์แล้ว',
    removed: 'นำออกจากสไลด์หน้าแรกแล้ว',
    invalidType: 'อัปโหลดได้เฉพาะรูป JPEG, PNG และ WebP',
    tooLarge: 'รูปต้องมีขนาดไม่เกิน 5MB',
    uploadFailed: 'อัปโหลดรูปไม่สำเร็จ',
    postRequired: 'กรุณาเลือกโพสต์ที่จะเชื่อม',
    imageRequired: 'กรุณาอัปโหลดรูปเฉพาะสำหรับสไลด์',
    versionRequired: 'ไม่พบเวอร์ชันโพสต์ กรุณารีเฟรชแล้วลองอีกครั้ง',
    full: 'ใช้งานครบทั้งแปดช่องแล้ว กรุณานำรายการเดิมออกก่อนเพิ่ม',
    invalidPeriod: 'เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มต้น',
    expiredPeriod: 'เวลาสิ้นสุดต้องอยู่ในอนาคต',
    requestFailed: 'ดำเนินการไม่สำเร็จ กรุณาลองอีกครั้ง',
    conflict: 'ผู้ดูแลคนอื่นแก้ไขก่อน ระบบโหลดข้อมูลล่าสุดแล้ว',
    auditTitle: 'ประวัติการเปลี่ยนแปลง',
    auditHelp: 'การตั้งค่า เปลี่ยนลำดับ และนำออก 100 รายการล่าสุด',
    auditEmpty: 'ยังไม่มีประวัติการเปลี่ยนแปลง',
    auditConfigure: 'บันทึกการตั้งค่า',
    auditReorder: 'เปลี่ยนลำดับ',
    auditRemove: 'นำออกจากสไลด์',
    auditBy: '{actor} · {date}',
    unknownActor: 'ผู้ดูแลระบบ',
    unknownPost: 'รายการสไลด์',
    themes: { BRAND: 'น้ำเงิน Jobchaja', CHARCOAL: 'ชาร์โคล', GREEN: 'เขียว', AMBER: 'อำพัน', RED: 'แดง' },
  },
  fil: {
    eyebrow: 'Pamamahala ng content',
    title: 'Home slider manager',
    description: 'Ikonekta ang public post sa sariling image at ayusin ang puwesto 1 hanggang 8 at display period.',
    refresh: 'I-refresh ang slider at history',
    currentTitle: 'Kasalukuyang slider',
    currentHelp: 'Agad na sine-save ang bagong order. Hindi lalabas sa home page ang bakanteng slot.',
    loading: 'Nilo-load ang slider information.',
    emptySlot: 'Bakanteng slot',
    slot: 'Slot {order}',
    moveUp: 'Itaas ang {title}',
    moveDown: 'Ibaba ang {title}',
    edit: 'I-edit ang settings ng {title}',
    remove: 'Alisin agad ang {title} sa slider',
    removeLabel: 'Alisin ngayon',
    removeConfirm: 'Alisin agad ang “{title}” sa home slider? Hindi mabubura ang post.',
    always: 'Walang date limit',
    from: 'Mula {date}',
    until: 'Hanggang {date}',
    editorTitle: 'Slider settings',
    editorHelp: 'Ikonekta ang isang board post sa isang sariling slider image.',
    post: 'Naka-link na post',
    postPlaceholder: 'Pumili ng post',
    postHelp: 'Published posts na available sa lahat lamang ang maaaring piliin.',
    order: 'Display order',
    theme: 'Brand theme',
    image: 'Sariling slider image',
    imageHelp: 'JPEG, PNG, WebP · hanggang 5MB',
    chooseImage: 'Pumili ng image',
    replaceImage: 'Palitan ang image',
    removeImage: 'Alisin ang napiling image',
    uploading: 'Ina-upload ang {name}',
    cancelUpload: 'Kanselahin ang image upload',
    startAt: 'Simula ng display',
    endAt: 'Dulo ng display',
    optional: 'Opsyonal',
    preview: 'Slider preview',
    previewEmpty: 'Mag-upload ng sariling image para makita ang preview.',
    reset: 'Kanselahin',
    save: 'I-save ang slider',
    saving: 'Sine-save',
    saved: 'Na-save ang slider settings.',
    reordered: 'Na-save ang slider order.',
    removed: 'Inalis sa home slider.',
    invalidType: 'JPEG, PNG, at WebP images lamang ang maaaring i-upload.',
    tooLarge: 'Dapat 5MB o mas maliit ang image.',
    uploadFailed: 'Hindi na-upload ang image.',
    postRequired: 'Pumili ng post na ili-link.',
    imageRequired: 'Mag-upload ng sariling slider image.',
    versionRequired: 'Walang post version. I-refresh at subukan ulit.',
    full: 'Ginagamit na ang lahat ng walong slot. Mag-alis muna bago magdagdag.',
    invalidPeriod: 'Dapat mas huli ang end time kaysa start time.',
    expiredPeriod: 'Dapat nasa hinaharap ang end time.',
    requestFailed: 'Hindi nakumpleto ang request. Subukan ulit.',
    conflict: 'Nauna nang nagbago ang ibang administrator. Ni-load ang pinakabagong data.',
    auditTitle: 'Change history',
    auditHelp: 'Pinakabagong 100 settings, reorder, at removal events.',
    auditEmpty: 'Wala pang change history.',
    auditConfigure: 'Na-save ang settings',
    auditReorder: 'Binago ang order',
    auditRemove: 'Inalis sa slider',
    auditBy: '{actor} · {date}',
    unknownActor: 'Administrator',
    unknownPost: 'Slider item',
    themes: { BRAND: 'Jobchaja blue', CHARCOAL: 'Charcoal', GREEN: 'Green', AMBER: 'Amber', RED: 'Red' },
  },
} as const;

type FeaturedPost = InfoBoardPost & {
  bannerImage?: string;
  bannerAssetId?: number | string;
  featuredStartAt?: string;
  featuredEndAt?: string;
};

type SliderForm = {
  postId: number | null;
  featuredOrder: number;
  bannerTheme: InfoBoardBannerTheme;
  bannerAssetIds: Record<InfoBoardLocale, number | null>;
  featuredStartAt: string;
  featuredEndAt: string;
  bannerImages: Record<InfoBoardLocale, string>;
};

const emptyAssetIds = (): Record<InfoBoardLocale, number | null> => ({
  ko: null,
  en: null,
  vi: null,
  th: null,
  fil: null,
});

const emptyBannerImages = (): Record<InfoBoardLocale, string> => ({
  ko: '',
  en: '',
  vi: '',
  th: '',
  fil: '',
});

const EMPTY_FORM: SliderForm = {
  postId: null,
  featuredOrder: 1,
  bannerTheme: 'BRAND',
  bannerAssetIds: emptyAssetIds(),
  featuredStartAt: '',
  featuredEndAt: '',
  bannerImages: emptyBannerImages(),
};

const LOCALIZED_IMAGE_COPY = {
  ko: {
    languages: '언어별 배너 이미지',
    help: '기본 이미지 1장만 등록하면 모든 언어에 사용됩니다. 필요한 언어만 별도 이미지로 덮어쓸 수 있습니다.',
    imagesRequired: '기본으로 사용할 배너 이미지 1장 이상을 업로드하세요.',
    translationsRequired: '연결할 게시글의 제목, 요약, 본문을 5개 언어로 먼저 작성하세요.',
  },
  en: {
    languages: 'Localized banner images',
    help: 'One base image works for every language. Add locale-specific overrides only when needed.',
    imagesRequired: 'Upload at least one base slider image.',
    translationsRequired: 'Complete the post title, summary, and content in all five languages first.',
  },
  vi: {
    languages: 'Ảnh biểu ngữ theo ngôn ngữ',
    help: 'Một ảnh cơ bản được dùng cho mọi ngôn ngữ. Chỉ thêm ảnh riêng khi cần.',
    imagesRequired: 'Hãy tải ít nhất một ảnh cơ bản.',
    translationsRequired: 'Hãy hoàn thành tiêu đề, tóm tắt và nội dung bằng đủ năm ngôn ngữ trước.',
  },
  th: {
    languages: 'ภาพแบนเนอร์แยกตามภาษา',
    help: 'ภาพหลักหนึ่งภาพใช้ได้กับทุกภาษา เพิ่มภาพเฉพาะภาษาเมื่อจำเป็นเท่านั้น',
    imagesRequired: 'กรุณาอัปโหลดภาพหลักอย่างน้อยหนึ่งภาพ',
    translationsRequired: 'กรุณากรอกชื่อเรื่อง สรุป และเนื้อหาให้ครบทั้งห้าภาษาก่อน',
  },
  fil: {
    languages: 'Localized banner images',
    help: 'Isang base image ang gagamitin sa lahat ng wika. Magdagdag lamang ng override kung kailangan.',
    imagesRequired: 'Mag-upload ng kahit isang base slider image.',
    translationsRequired: 'Kumpletuhin muna ang title, summary, at content sa limang wika.',
  },
} as const;

function replaceToken(value: string, token: string, replacement: string) {
  return value.replace(`{${token}}`, replacement);
}

function localizedTitle(post: InfoBoardPost, locale: InfoBoardLocale) {
  return post.translations[locale]?.title
    || post.translations.en?.title
    || post.translations.ko?.title
    || post.fallbackTitle;
}

function postImage(post: FeaturedPost, locale: InfoBoardLocale) {
  const localized = post.bannerImages?.[locale];
  if (localized) return localized;
  if (typeof post.bannerImage === 'string' && post.bannerImage.trim()) return post.bannerImage;
  const firstLocalized = Object.values(post.bannerImages ?? {}).find(Boolean);
  if (firstLocalized) return firstLocalized;
  const assetId = post.bannerAssetIds?.[locale] ?? post.bannerAssetId;
  return post.attachments.find((attachment) => attachment.id === String(assetId))?.url || '';
}

function hasCompleteTranslations(post: InfoBoardPost) {
  return INFO_BOARD_LOCALES.every((locale) => {
    const translation = post.translations[locale];
    return Boolean(
      translation?.title.trim()
      && translation.summary.trim()
      && translation.content.trim(),
    );
  });
}

function normalizePosts(value: unknown): FeaturedPost[] {
  const items = Array.isArray(value)
    ? value
    : value && typeof value === 'object' && 'items' in value && Array.isArray(value.items)
      ? value.items
      : [];
  return (items as FeaturedPost[]).slice();
}

function normalizeAudits(value: unknown): InfoBoardFeaturedAudit[] {
  const items = Array.isArray(value)
    ? value
    : value && typeof value === 'object' && 'items' in value && Array.isArray(value.items)
      ? value.items
      : [];
  return (items as InfoBoardFeaturedAudit[]).slice(0, 100);
}

function toLocalDateTime(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function toIso(value: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function formatDate(value: string | undefined, locale: InfoBoardLocale) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function errorStatus(reason: unknown) {
  if (!reason || typeof reason !== 'object' || !('status' in reason)) return 0;
  return Number(reason.status) || 0;
}

function firstEmptyOrder(posts: FeaturedPost[]) {
  const occupied = new Set(posts.map((post) => post.featuredOrder));
  return Array.from({ length: MAX_SLIDES }, (_, index) => index + 1)
    .find((order) => !occupied.has(order)) || MAX_SLIDES;
}

function auditView(audit: InfoBoardFeaturedAudit, locale: InfoBoardLocale) {
  const record = audit as unknown as Record<string, unknown>;
  const nestedPost = record.post && typeof record.post === 'object'
    ? record.post as Record<string, unknown>
    : {};
  const nestedActor = record.actor && typeof record.actor === 'object'
    ? record.actor as Record<string, unknown>
    : {};
  const rawAction = String(record.action || record.event || record.type || 'CONFIGURE').toUpperCase();
  const postTitle = String(record.postTitle || record.title || nestedPost.title || '');
  const actor = String(
    record.actorName
      || record.adminName
      || nestedActor.name
      || nestedActor.email
      || record.actorId
      || '',
  );
  const createdAt = String(record.createdAt || record.occurredAt || record.timestamp || '');
  const rawId = record.id || record.auditId || `${rawAction}-${createdAt}-${postTitle}`;
  return {
    id: String(rawId),
    action: rawAction,
    postTitle,
    actor,
    createdAt: formatDate(createdAt, locale),
  };
}

export function AdminFeaturedSliderManager() {
  const { lang } = useLanguage();
  const locale = resolveBoardLocale(lang);
  const copy = COPY[locale];
  const localizedImageCopy = LOCALIZED_IMAGE_COPY[locale];
  const [featured, setFeatured] = useState<FeaturedPost[]>([]);
  const [posts, setPosts] = useState<FeaturedPost[]>([]);
  const [audits, setAudits] = useState<InfoBoardFeaturedAudit[]>([]);
  const [form, setForm] = useState<SliderForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadName, setUploadName] = useState('');
  const [activeImageLocale, setActiveImageLocale] = useState<InfoBoardLocale>('ko');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const uploadAbortRef = useRef<(() => void) | null>(null);
  const uploadSequenceRef = useRef(0);
  const transientAssetRef = useRef<Partial<Record<InfoBoardLocale, number>>>({});
  const objectUrlRef = useRef<Partial<Record<InfoBoardLocale, string>>>({});
  const loadSequenceRef = useRef(0);

  const sortedFeatured = useMemo(
    () => featured.slice().sort((a, b) => (a.featuredOrder || MAX_SLIDES) - (b.featuredOrder || MAX_SLIDES)),
    [featured],
  );

  const selectablePosts = useMemo(() => {
    const byId = new Map<number, FeaturedPost>();
    [...sortedFeatured, ...posts].forEach((post) => byId.set(post.id, post));
    return Array.from(byId.values()).sort((a, b) => b.id - a.id);
  }, [posts, sortedFeatured]);

  const selectedPost = useMemo(
    () => selectablePosts.find((post) => post.id === form.postId),
    [form.postId, selectablePosts],
  );

  const releaseObjectUrl = useCallback((targetLocale?: InfoBoardLocale) => {
    const locales = targetLocale ? [targetLocale] : INFO_BOARD_LOCALES;
    for (const itemLocale of locales) {
      const url = objectUrlRef.current[itemLocale];
      if (url) URL.revokeObjectURL(url);
      delete objectUrlRef.current[itemLocale];
    }
  }, []);

  const discardTransientAsset = useCallback((targetLocale?: InfoBoardLocale) => {
    const locales = targetLocale ? [targetLocale] : INFO_BOARD_LOCALES;
    for (const itemLocale of locales) {
      const id = transientAssetRef.current[itemLocale];
      delete transientAssetRef.current[itemLocale];
      if (id !== undefined) {
        void deleteAdminInfoBoardAttachment(String(id)).catch(() => undefined);
      }
    }
  }, []);

  const loadData = useCallback(async (preserveError = false) => {
    const sequence = ++loadSequenceRef.current;
    setLoading(true);
    if (!preserveError) setError('');
    try {
      const [featuredResult, postResult, auditResult] = await Promise.all([
        listAdminFeaturedInfoBoard(locale),
        listAdminInfoBoard({ locale, page: 1, limit: 50, status: 'PUBLISHED', audience: 'ALL' }),
        listAdminFeaturedAudit(),
      ]);
      if (sequence !== loadSequenceRef.current) return;
      setFeatured(normalizePosts(featuredResult));
      setPosts(normalizePosts(postResult));
      setAudits(normalizeAudits(auditResult));
    } catch (reason) {
      if (sequence === loadSequenceRef.current) {
        setError(errorStatus(reason) === 409 ? copy.conflict : copy.requestFailed);
      }
    } finally {
      if (sequence === loadSequenceRef.current) setLoading(false);
    }
  }, [copy.conflict, copy.requestFailed, locale]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadData(), 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  useEffect(() => () => {
    loadSequenceRef.current += 1;
    uploadSequenceRef.current += 1;
    uploadAbortRef.current?.();
    releaseObjectUrl();
    discardTransientAsset();
  }, [discardTransientAsset, releaseObjectUrl]);

  const resetEditor = useCallback((discardUpload = true) => {
    uploadSequenceRef.current += 1;
    uploadAbortRef.current?.();
    uploadAbortRef.current = null;
    if (discardUpload) discardTransientAsset();
    releaseObjectUrl();
    setForm({ ...EMPTY_FORM, featuredOrder: firstEmptyOrder(featured) });
    setUploadProgress(null);
    setUploadName('');
    setActiveImageLocale('ko');
    setError('');
  }, [discardTransientAsset, featured, releaseObjectUrl]);

  const editPost = (post: FeaturedPost, shouldScroll = true) => {
    uploadSequenceRef.current += 1;
    uploadAbortRef.current?.();
    uploadAbortRef.current = null;
    discardTransientAsset();
    releaseObjectUrl();
    setUploadProgress(null);
    setUploadName('');
    setError('');
    setSuccess('');
    const legacyAssetId = Number(post.bannerAssetId);
    const bannerAssetIds = emptyAssetIds();
    const bannerImages = emptyBannerImages();
    for (const itemLocale of INFO_BOARD_LOCALES) {
      const assetId = Number(post.bannerAssetIds?.[itemLocale]);
      bannerAssetIds[itemLocale] = Number.isInteger(assetId) && assetId > 0
        ? assetId
        : itemLocale === 'ko' && Number.isInteger(legacyAssetId) && legacyAssetId > 0
          ? legacyAssetId
          : null;
      bannerImages[itemLocale] = post.bannerImages?.[itemLocale]
        || (itemLocale === locale ? post.bannerImage || '' : '');
    }
    setForm({
      postId: post.id,
      featuredOrder: post.featuredOrder || firstEmptyOrder(featured),
      bannerTheme: post.bannerTheme || 'BRAND',
      bannerAssetIds,
      featuredStartAt: toLocalDateTime(post.featuredStartAt),
      featuredEndAt: toLocalDateTime(post.featuredEndAt),
      bannerImages,
    });
    setActiveImageLocale(locale);
    if (shouldScroll) {
      requestAnimationFrame(() => editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  };

  const selectPost = (postId: number | null) => {
    if (postId === null) {
      resetEditor();
      return;
    }
    const post = selectablePosts.find((item) => item.id === postId);
    if (!post) return;
    const current = sortedFeatured.find((item) => item.id === postId);
    if (current) {
      editPost(current, false);
      return;
    }
    uploadSequenceRef.current += 1;
    uploadAbortRef.current?.();
    uploadAbortRef.current = null;
    discardTransientAsset();
    releaseObjectUrl();
    setUploadProgress(null);
    setUploadName('');
    setForm({ ...EMPTY_FORM, postId, featuredOrder: firstEmptyOrder(featured) });
    setError('');
    setSuccess('');
  };

  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError('');
    setSuccess('');
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(copy.invalidType);
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError(copy.tooLarge);
      return;
    }

    const uploadLocale = activeImageLocale;
    const previousAssetId = form.bannerAssetIds[uploadLocale];
    const previousImage = form.bannerImages[uploadLocale];
    const uploadSequence = ++uploadSequenceRef.current;
    uploadAbortRef.current?.();
    discardTransientAsset(uploadLocale);
    releaseObjectUrl(uploadLocale);
    const localUrl = URL.createObjectURL(file);
    objectUrlRef.current[uploadLocale] = localUrl;
    setForm((current) => ({
      ...current,
      bannerAssetIds: { ...current.bannerAssetIds, [uploadLocale]: null },
      bannerImages: { ...current.bannerImages, [uploadLocale]: localUrl },
    }));
    setUploadName(file.name);
    setUploadProgress(0);

    const task = uploadAdminInfoBoardAttachment(file, setUploadProgress);
    uploadAbortRef.current = task.abort;
    task.promise
      .then((attachment: InfoBoardAttachment) => {
        if (uploadSequence !== uploadSequenceRef.current) {
          void deleteAdminInfoBoardAttachment(attachment.id).catch(() => undefined);
          return;
        }
        const assetId = Number(attachment.id);
        if (!Number.isInteger(assetId) || assetId <= 0) {
          void deleteAdminInfoBoardAttachment(attachment.id).catch(() => undefined);
          throw new Error('INVALID_ASSET_ID');
        }
        transientAssetRef.current[uploadLocale] = assetId;
        if (attachment.url) releaseObjectUrl(uploadLocale);
        setForm((current) => ({
          ...current,
          bannerAssetIds: { ...current.bannerAssetIds, [uploadLocale]: assetId },
          bannerImages: {
            ...current.bannerImages,
            [uploadLocale]: attachment.url || current.bannerImages[uploadLocale],
          },
        }));
      })
      .catch((reason: unknown) => {
        if (uploadSequence !== uploadSequenceRef.current) return;
        if (!(reason && typeof reason === 'object' && 'code' in reason && reason.code === 'ABORTED')) {
          setError(copy.uploadFailed);
        }
        releaseObjectUrl(uploadLocale);
        setForm((current) => ({
          ...current,
          bannerAssetIds: {
            ...current.bannerAssetIds,
            [uploadLocale]: previousAssetId,
          },
          bannerImages: {
            ...current.bannerImages,
            [uploadLocale]: previousImage,
          },
        }));
      })
      .finally(() => {
        if (uploadSequence !== uploadSequenceRef.current) return;
        uploadAbortRef.current = null;
        setUploadProgress(null);
        setUploadName('');
      });
  };

  const clearImage = () => {
    uploadSequenceRef.current += 1;
    uploadAbortRef.current?.();
    uploadAbortRef.current = null;
    discardTransientAsset(activeImageLocale);
    releaseObjectUrl(activeImageLocale);
    setUploadProgress(null);
    setUploadName('');
    setForm((current) => ({
      ...current,
      bannerAssetIds: { ...current.bannerAssetIds, [activeImageLocale]: null },
      bannerImages: { ...current.bannerImages, [activeImageLocale]: '' },
    }));
  };

  const save = async () => {
    setError('');
    setSuccess('');
    if (!selectedPost) {
      setError(copy.postRequired);
      return;
    }
    if (!hasCompleteTranslations(selectedPost)) {
      setError(localizedImageCopy.translationsRequired);
      return;
    }
    if (!INFO_BOARD_LOCALES.some((itemLocale) => form.bannerAssetIds[itemLocale])) {
      setError(localizedImageCopy.imagesRequired);
      return;
    }
    if (selectedPost.version === undefined) {
      setError(copy.versionRequired);
      return;
    }
    const isExisting = sortedFeatured.some((post) => post.id === selectedPost.id);
    if (!isExisting && sortedFeatured.length >= MAX_SLIDES) {
      setError(copy.full);
      return;
    }

    const startAt = toIso(form.featuredStartAt);
    const endAt = toIso(form.featuredEndAt);
    if (startAt && endAt && new Date(endAt).getTime() <= new Date(startAt).getTime()) {
      setError(copy.invalidPeriod);
      return;
    }
    if (endAt && new Date(endAt).getTime() <= Date.now()) {
      setError(copy.expiredPeriod);
      return;
    }

    setSaving(true);
    try {
      await configureAdminFeaturedInfoBoard(selectedPost.id, {
        expectedVersion: selectedPost.version,
        featuredOrder: Math.min(MAX_SLIDES, Math.max(1, form.featuredOrder)),
        bannerTheme: form.bannerTheme,
        featuredStartAt: startAt,
        featuredEndAt: endAt,
        bannerAssets: INFO_BOARD_LOCALES.flatMap((itemLocale) => {
          const assetId = form.bannerAssetIds[itemLocale];
          return assetId ? [{ locale: itemLocale, assetId }] : [];
        }),
      });
      transientAssetRef.current = {};
      releaseObjectUrl();
      setSuccess(copy.saved);
      setForm(EMPTY_FORM);
      await loadData();
    } catch (reason) {
      if (errorStatus(reason) === 409) {
        setError(copy.conflict);
        await loadData(true);
      } else {
        setError(copy.requestFailed);
      }
    } finally {
      setSaving(false);
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sortedFeatured.length || reordering) return;
    if (sortedFeatured.some((post) => post.version === undefined)) {
      setError(copy.versionRequired);
      return;
    }
    const previous = sortedFeatured;
    const next = sortedFeatured.slice();
    [next[index], next[target]] = [next[target], next[index]];
    const ordered = next.map((post, order) => ({ ...post, featuredOrder: order + 1 }));
    setFeatured(ordered);
    setReordering(true);
    setError('');
    setSuccess('');
    try {
      await reorderAdminFeaturedInfoBoard(ordered.map((post) => ({
        id: post.id,
        order: post.featuredOrder as number,
        expectedVersion: post.version as number,
      })));
      setSuccess(copy.reordered);
      await loadData();
    } catch (reason) {
      setFeatured(previous);
      if (errorStatus(reason) === 409) {
        setError(copy.conflict);
        await loadData(true);
      } else {
        setError(copy.requestFailed);
      }
    } finally {
      setReordering(false);
    }
  };

  const remove = async (post: FeaturedPost) => {
    const title = localizedTitle(post, locale);
    if (!window.confirm(replaceToken(copy.removeConfirm, 'title', title))) return;
    if (post.version === undefined) {
      setError(copy.versionRequired);
      return;
    }
    setRemovingId(post.id);
    setError('');
    setSuccess('');
    try {
      await removeAdminFeaturedInfoBoard(post.id, post.version);
      if (form.postId === post.id) resetEditor();
      setSuccess(copy.removed);
      await loadData();
    } catch (reason) {
      if (errorStatus(reason) === 409) {
        setError(copy.conflict);
        await loadData(true);
      } else {
        setError(copy.requestFailed);
      }
    } finally {
      setRemovingId(null);
    }
  };

  const periodText = (post: FeaturedPost) => {
    const start = formatDate(post.featuredStartAt, locale);
    const end = formatDate(post.featuredEndAt, locale);
    if (!start && !end) return copy.always;
    return [
      start ? replaceToken(copy.from, 'date', start) : '',
      end ? replaceToken(copy.until, 'date', end) : '',
    ].filter(Boolean).join(' · ');
  };

  const auditAction = (action: string) => {
    if (action.includes('REORDER') || action.includes('MOVE')) return copy.auditReorder;
    if (action.includes('REMOVE') || action.includes('UNFEATURE')) return copy.auditRemove;
    return copy.auditConfigure;
  };

  return (
    <section
      className="overflow-hidden rounded-lg border border-[#E5E8EB] bg-white text-[#191F28]"
      aria-labelledby="featured-slider-manager-title"
      aria-busy={loading || saving || reordering}
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E5E8EB] px-4 py-5 sm:px-5">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0066FF]">{copy.eyebrow}</p>
          <h2 id="featured-slider-manager-title" className="mt-1 text-xl font-bold">{copy.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B7684]">{copy.description}</p>
        </div>
        <button
          type="button"
          onClick={() => void loadData()}
          disabled={loading || saving || reordering}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D1D6DB] bg-white px-3 text-sm font-semibold text-[#4E5968] hover:bg-[#F2F4F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] disabled:opacity-50"
          aria-label={copy.refresh}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{copy.refresh}</span>
        </button>
      </header>

      <div className="sr-only" aria-live="polite">
        {loading ? copy.loading : success}
      </div>
      {error && (
        <div role="alert" className="mx-4 mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700 sm:mx-5">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div role="status" className="mx-4 mt-4 flex items-start gap-2 rounded-lg border border-blue-200 bg-[#EAF2FF] p-3 text-sm leading-5 text-[#0056D6] sm:mx-5">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <div className="border-b border-[#E5E8EB] p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold">
              <MonitorUp className="h-4 w-4 text-[#0066FF]" /> {copy.currentTitle}
            </h3>
            <p className="mt-1 text-xs leading-5 text-[#6B7684]">{copy.currentHelp}</p>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-[#6B7684]">
              <Loader2 className="h-5 w-5 animate-spin text-[#0066FF]" /> {copy.loading}
            </div>
          ) : (
            <ol className="mt-4 divide-y divide-[#E5E8EB] border-y border-[#E5E8EB]">
              {Array.from({ length: MAX_SLIDES }, (_, index) => {
                const post = sortedFeatured[index];
                const order = index + 1;
                if (!post) {
                  return (
                    <li key={`empty-${order}`} className="flex min-h-20 items-center gap-3 py-3 text-[#8B95A1]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-dashed border-[#B0B8C1] text-sm font-bold">{order}</span>
                      <span className="text-sm">{copy.emptySlot}</span>
                    </li>
                  );
                }
                const title = localizedTitle(post, locale);
                const image = postImage(post, locale);
                const isBusy = reordering || removingId === post.id;
                return (
                  <li key={post.id} className="grid min-h-24 grid-cols-[36px_minmax(0,1fr)] gap-3 py-3 sm:grid-cols-[36px_96px_minmax(0,1fr)_auto] sm:items-center">
                    <span className="flex h-9 w-9 items-center justify-center rounded bg-[#EAF2FF] text-sm font-bold text-[#0056D6]" aria-label={replaceToken(copy.slot, 'order', String(order))}>
                      {order}
                    </span>
                    <div className={`relative hidden h-16 w-24 overflow-hidden rounded sm:block ${THEME_CLASS[post.bannerTheme || 'BRAND']}`} aria-hidden="true">
                      {image && <Image src={image} alt="" fill sizes="96px" unoptimized className="object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`h-3 w-3 shrink-0 rounded border border-white shadow-sm ${THEME_CLASS[post.bannerTheme || 'BRAND']}`} aria-hidden="true" />
                        <p className="truncate text-sm font-bold">{title}</p>
                      </div>
                      <p className="mt-1 truncate text-xs text-[#6B7684]">#{post.id} · {periodText(post)}</p>
                      <div className="mt-2 flex flex-wrap gap-1 sm:hidden">
                        <button type="button" onClick={() => editPost(post)} className="h-8 rounded border border-[#D1D6DB] px-2 text-xs font-semibold text-[#0066FF]">{copy.editorTitle}</button>
                        <button type="button" onClick={() => void remove(post)} disabled={isBusy} className="h-8 rounded border border-red-200 px-2 text-xs font-semibold text-red-600 disabled:opacity-50">{copy.removeLabel}</button>
                      </div>
                    </div>
                    <div className="col-start-2 flex items-center justify-end gap-1 sm:col-start-auto">
                      <button
                        type="button"
                        onClick={() => void move(index, -1)}
                        disabled={index === 0 || isBusy}
                        className="rounded p-2 text-[#4E5968] hover:bg-[#F2F4F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] disabled:opacity-30"
                        aria-label={replaceToken(copy.moveUp, 'title', title)}
                        title={replaceToken(copy.moveUp, 'title', title)}
                      ><ChevronUp className="h-4 w-4" /></button>
                      <button
                        type="button"
                        onClick={() => void move(index, 1)}
                        disabled={index === sortedFeatured.length - 1 || isBusy}
                        className="rounded p-2 text-[#4E5968] hover:bg-[#F2F4F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] disabled:opacity-30"
                        aria-label={replaceToken(copy.moveDown, 'title', title)}
                        title={replaceToken(copy.moveDown, 'title', title)}
                      ><ChevronDown className="h-4 w-4" /></button>
                      <button
                        type="button"
                        onClick={() => editPost(post)}
                        className="hidden rounded p-2 text-[#0066FF] hover:bg-[#EAF2FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] sm:inline-flex"
                        aria-label={replaceToken(copy.edit, 'title', title)}
                        title={replaceToken(copy.edit, 'title', title)}
                      ><Pencil className="h-4 w-4" /></button>
                      <button
                        type="button"
                        onClick={() => void remove(post)}
                        disabled={isBusy}
                        className="hidden rounded p-2 text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 sm:inline-flex"
                        aria-label={replaceToken(copy.remove, 'title', title)}
                        title={replaceToken(copy.remove, 'title', title)}
                      >{removingId === post.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div ref={editorRef} className="scroll-mt-4 p-4 sm:p-5">
          <h3 className="text-base font-bold">{copy.editorTitle}</h3>
          <p className="mt-1 text-xs leading-5 text-[#6B7684]">{copy.editorHelp}</p>

          <div className="mt-5 space-y-5">
            <label className="block text-sm font-semibold text-[#333D4B]">
              {copy.post}
              <select
                value={form.postId || ''}
                onChange={(event) => selectPost(event.target.value ? Number(event.target.value) : null)}
                className="mt-2 h-11 w-full rounded-lg border border-[#D1D6DB] bg-white px-3 font-normal outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10"
              >
                <option value="">{copy.postPlaceholder}</option>
                {selectablePosts.map((post) => (
                  <option key={post.id} value={post.id} disabled={!hasCompleteTranslations(post)}>
                    #{post.id} {localizedTitle(post, locale)}{hasCompleteTranslations(post) ? '' : ' · i18n incomplete'}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-xs font-normal leading-5 text-[#6B7684]">{copy.postHelp}</span>
            </label>

            <div>
              <div className="mb-3">
                <p className="text-sm font-semibold text-[#333D4B]">{localizedImageCopy.languages}</p>
                <p className="mt-1 text-xs leading-5 text-[#6B7684]">{localizedImageCopy.help}</p>
                <div className="mt-3 flex gap-1 overflow-x-auto border-b border-[#E5E8EB]" role="tablist" aria-label={localizedImageCopy.languages}>
                  {INFO_BOARD_LOCALES.map((itemLocale) => {
                    const complete = Boolean(form.bannerAssetIds[itemLocale]);
                    return (
                      <button
                        key={itemLocale}
                        type="button"
                        role="tab"
                        aria-selected={activeImageLocale === itemLocale}
                        onClick={() => setActiveImageLocale(itemLocale)}
                        className={`flex h-10 shrink-0 items-center gap-1.5 border-b-2 px-3 text-xs font-semibold ${
                          activeImageLocale === itemLocale
                            ? 'border-[#0066FF] text-[#0066FF]'
                            : 'border-transparent text-[#6B7684] hover:text-[#333D4B]'
                        }`}
                      >
                        {itemLocale.toUpperCase()}
                        {complete && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#333D4B]">{copy.image}</p>
                  <p className="mt-1 text-xs text-[#6B7684]">{copy.imageHelp}</p>
                </div>
                <label className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-[#0066FF] bg-white px-3 text-sm font-semibold text-[#0066FF] hover:bg-[#EAF2FF] focus-within:ring-2 focus-within:ring-[#0066FF]">
                  <ImagePlus className="h-4 w-4" /> {form.bannerImages[activeImageLocale] ? copy.replaceImage : copy.chooseImage}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={uploadImage} disabled={uploadProgress !== null} />
                </label>
              </div>

              <div className={`relative mt-3 aspect-[16/7] overflow-hidden rounded-lg ${THEME_CLASS[form.bannerTheme]}`}>
                {form.bannerImages[activeImageLocale] ? (
                  <Image
                    src={form.bannerImages[activeImageLocale]}
                    alt={selectedPost ? localizedTitle(selectedPost, locale) : copy.preview}
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-sm text-white/80">
                    <ImagePlus className="h-6 w-6" /> {copy.previewEmpty}
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded bg-black/60 px-2 py-1 text-xs font-semibold text-white">{copy.preview}</span>
                {form.bannerImages[activeImageLocale] && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute right-2 top-2 rounded bg-white/95 p-2 text-[#4E5968] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
                    aria-label={copy.removeImage}
                    title={copy.removeImage}
                  ><X className="h-4 w-4" /></button>
                )}
              </div>

              {uploadProgress !== null && (
                <div className="mt-3" role="status" aria-live="polite">
                  <div className="flex items-center justify-between gap-3 text-xs text-[#4E5968]">
                    <span className="min-w-0 truncate">{replaceToken(copy.uploading, 'name', uploadName)}</span>
                    <button type="button" onClick={() => uploadAbortRef.current?.()} className="rounded p-1" aria-label={copy.cancelUpload}><X className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded bg-[#E5E8EB]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={uploadProgress}>
                    <div className="h-full bg-[#0066FF] transition-[width]" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>

            <fieldset>
              <legend className="text-sm font-semibold text-[#333D4B]">{copy.theme}</legend>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {INFO_BOARD_BANNER_THEMES.map((theme) => (
                  <label key={theme} className={`flex h-10 cursor-pointer items-center gap-2 rounded-lg border px-2.5 text-xs font-semibold ${form.bannerTheme === theme ? 'border-[#0066FF] bg-[#EAF2FF] text-[#0056D6]' : 'border-[#D1D6DB] text-[#4E5968]'}`}>
                    <input type="radio" name="featured-banner-theme" value={theme} checked={form.bannerTheme === theme} onChange={() => setForm((current) => ({ ...current, bannerTheme: theme }))} className="sr-only" />
                    <span className={`h-4 w-4 shrink-0 rounded border border-white shadow-sm ${THEME_CLASS[theme]}`} aria-hidden="true" />
                    <span className="truncate">{copy.themes[theme]}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block text-sm font-semibold text-[#333D4B]">
              {copy.order}
              <input
                type="number"
                min={1}
                max={MAX_SLIDES}
                value={form.featuredOrder}
                onChange={(event) => setForm((current) => ({ ...current, featuredOrder: Math.min(MAX_SLIDES, Math.max(1, Number(event.target.value) || 1)) }))}
                className="mt-2 h-11 w-full rounded-lg border border-[#D1D6DB] px-3 font-normal outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <label className="block text-sm font-semibold text-[#333D4B]">
                <span className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-[#0066FF]" /> {copy.startAt}</span>
                <input type="datetime-local" value={form.featuredStartAt} onChange={(event) => setForm((current) => ({ ...current, featuredStartAt: event.target.value }))} className="mt-2 h-11 w-full rounded-lg border border-[#D1D6DB] px-3 font-normal outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10" />
                <span className="mt-1 block text-xs font-normal text-[#8B95A1]">{copy.optional}</span>
              </label>
              <label className="block text-sm font-semibold text-[#333D4B]">
                <span className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-[#0066FF]" /> {copy.endAt}</span>
                <input type="datetime-local" value={form.featuredEndAt} onChange={(event) => setForm((current) => ({ ...current, featuredEndAt: event.target.value }))} className="mt-2 h-11 w-full rounded-lg border border-[#D1D6DB] px-3 font-normal outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10" />
                <span className="mt-1 block text-xs font-normal text-[#8B95A1]">{copy.optional}</span>
              </label>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-[#E5E8EB] pt-4">
              <button type="button" onClick={() => resetEditor()} disabled={saving || uploadProgress !== null} className="h-10 rounded-lg border border-[#D1D6DB] bg-white px-4 text-sm font-semibold text-[#4E5968] disabled:opacity-50">{copy.reset}</button>
              <button type="button" onClick={() => void save()} disabled={saving || uploadProgress !== null} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0066FF] px-4 text-sm font-semibold text-white hover:bg-[#0056D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? copy.saving : copy.save}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#E5E8EB] px-4 py-5 sm:px-5">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold"><History className="h-4 w-4 text-[#0066FF]" /> {copy.auditTitle}</h3>
          <p className="mt-1 text-xs leading-5 text-[#6B7684]">{copy.auditHelp}</p>
        </div>
        {loading ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-[#6B7684]"><Loader2 className="h-4 w-4 animate-spin text-[#0066FF]" /> {copy.loading}</div>
        ) : audits.length === 0 ? (
          <p className="mt-4 text-sm text-[#8B95A1]">{copy.auditEmpty}</p>
        ) : (
          <ol className="mt-4 max-h-80 divide-y divide-[#E5E8EB] overflow-y-auto border-y border-[#E5E8EB]" aria-label={copy.auditTitle}>
            {audits.map((audit) => {
              const item = auditView(audit, locale);
              const actor = item.actor || copy.unknownActor;
              const byline = replaceToken(replaceToken(copy.auditBy, 'actor', actor), 'date', item.createdAt);
              return (
                <li key={item.id} className="flex flex-wrap items-start justify-between gap-2 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#333D4B]">{auditAction(item.action)}</p>
                    <p className="mt-1 truncate text-xs text-[#6B7684]">{item.postTitle || copy.unknownPost}</p>
                  </div>
                  <time className="text-xs text-[#8B95A1]">{byline}</time>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}

export default AdminFeaturedSliderManager;
