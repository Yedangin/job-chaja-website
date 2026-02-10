import { toast as sonnerToast } from 'sonner';

/**
 * Toast 알림 헬퍼
 * sonner 라이브러리를 래핑하여 일관된 토스트 알림 제공
 */
export const toast = {
  success: (message: string) => {
    sonnerToast.success(message, {
      duration: 3000,
      position: 'top-right',
    });
  },

  error: (message: string) => {
    sonnerToast.error(message, {
      duration: 4000,
      position: 'top-right',
    });
  },

  info: (message: string) => {
    sonnerToast.info(message, {
      duration: 3000,
      position: 'top-right',
    });
  },

  loading: (message: string) => {
    return sonnerToast.loading(message, {
      position: 'top-right',
    });
  },
};
