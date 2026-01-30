import ko from './ko';
import en from './en';
import ja from './ja';
import vi from './vi';
import th from './th';
import tl from './tl';

export const uiMessages = {
  ko,
  en,
  ja,
  vi,
  th,
  tl,
};

export type UILang = keyof typeof uiMessages;
export type UIMessageKey = keyof typeof en;
