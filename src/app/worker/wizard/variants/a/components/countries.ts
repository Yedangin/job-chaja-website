/**
 * 국가 목록 / Country list
 * ISO 3166-1 alpha-2 codes
 */

export interface Country {
  code: string;
  nameKo: string;
  nameEn: string;
  flag: string;
}

/** 국가 목록 (주요 외국인 구직자 출신 국가) / Country list (major source countries for foreign job seekers) */
export const COUNTRIES: Country[] = [
  { code: 'KR', nameKo: '대한민국', nameEn: 'South Korea', flag: '🇰🇷' },
  { code: 'US', nameKo: '미국', nameEn: 'United States', flag: '🇺🇸' },
  { code: 'CN', nameKo: '중국', nameEn: 'China', flag: '🇨🇳' },
  { code: 'VN', nameKo: '베트남', nameEn: 'Vietnam', flag: '🇻🇳' },
  { code: 'PH', nameKo: '필리핀', nameEn: 'Philippines', flag: '🇵🇭' },
  { code: 'ID', nameKo: '인도네시아', nameEn: 'Indonesia', flag: '🇮🇩' },
  { code: 'TH', nameKo: '태국', nameEn: 'Thailand', flag: '🇹🇭' },
  { code: 'MM', nameKo: '미얀마', nameEn: 'Myanmar', flag: '🇲🇲' },
  { code: 'KH', nameKo: '캄보디아', nameEn: 'Cambodia', flag: '🇰🇭' },
  { code: 'LA', nameKo: '라오스', nameEn: 'Laos', flag: '🇱🇦' },
  { code: 'NP', nameKo: '네팔', nameEn: 'Nepal', flag: '🇳🇵' },
  { code: 'MN', nameKo: '몽골', nameEn: 'Mongolia', flag: '🇲🇳' },
  { code: 'UZ', nameKo: '우즈베키스탄', nameEn: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'KZ', nameKo: '카자흐스탄', nameEn: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'RU', nameKo: '러시아', nameEn: 'Russia', flag: '🇷🇺' },
  { code: 'JP', nameKo: '일본', nameEn: 'Japan', flag: '🇯🇵' },
  { code: 'IN', nameKo: '인도', nameEn: 'India', flag: '🇮🇳' },
  { code: 'PK', nameKo: '파키스탄', nameEn: 'Pakistan', flag: '🇵🇰' },
  { code: 'BD', nameKo: '방글라데시', nameEn: 'Bangladesh', flag: '🇧🇩' },
  { code: 'LK', nameKo: '스리랑카', nameEn: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'GB', nameKo: '영국', nameEn: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FR', nameKo: '프랑스', nameEn: 'France', flag: '🇫🇷' },
  { code: 'DE', nameKo: '독일', nameEn: 'Germany', flag: '🇩🇪' },
  { code: 'ES', nameKo: '스페인', nameEn: 'Spain', flag: '🇪🇸' },
  { code: 'IT', nameKo: '이탈리아', nameEn: 'Italy', flag: '🇮🇹' },
  { code: 'CA', nameKo: '캐나다', nameEn: 'Canada', flag: '🇨🇦' },
  { code: 'AU', nameKo: '호주', nameEn: 'Australia', flag: '🇦🇺' },
  { code: 'NZ', nameKo: '뉴질랜드', nameEn: 'New Zealand', flag: '🇳🇿' },
  { code: 'BR', nameKo: '브라질', nameEn: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', nameKo: '멕시코', nameEn: 'Mexico', flag: '🇲🇽' },
  { code: 'AR', nameKo: '아르헨티나', nameEn: 'Argentina', flag: '🇦🇷' },
  { code: 'EG', nameKo: '이집트', nameEn: 'Egypt', flag: '🇪🇬' },
  { code: 'ZA', nameKo: '남아프리카공화국', nameEn: 'South Africa', flag: '🇿🇦' },
  { code: 'NG', nameKo: '나이지리아', nameEn: 'Nigeria', flag: '🇳🇬' },
  { code: 'KE', nameKo: '케냐', nameEn: 'Kenya', flag: '🇰🇪' },
  { code: 'OTHER', nameKo: '기타', nameEn: 'Other', flag: '🌍' },
];

/** 국가 코드로 국가 정보 찾기 / Find country by code */
export function findCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
