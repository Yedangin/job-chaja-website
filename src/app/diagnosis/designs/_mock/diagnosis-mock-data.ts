// ============================================================
// 공통 타입 정의 / Common type definitions
// ============================================================

export interface Milestone {
  order: number;
  monthFromStart: number;
  type: string;
  nameKo: string;
  visaStatus: string;
  canWorkPartTime: boolean;
  weeklyHours: number;
  estimatedMonthlyIncome: number;
  requirements: string;
  platformAction: string;
}

export interface NextStep {
  actionType: string;
  nameKo: string;
  description: string;
  url?: string;
}

export interface ScoreBreakdown {
  base: number;
  ageMultiplier: number;
  nationalityMultiplier: number;
  fundMultiplier: number;
  educationMultiplier: number;
  priorityWeight: number;
}

export interface RecommendedPathway {
  pathwayId: string;
  nameKo: string;
  nameEn: string;
  finalScore: number;
  scoreBreakdown: ScoreBreakdown;
  feasibilityLabel: string;
  estimatedMonths: number;
  estimatedCostWon: number;
  visaChain: string;
  platformSupport: string;
  milestones: Milestone[];
  nextSteps: NextStep[];
  note: string;
}

export interface DiagnosisResult {
  pathways: RecommendedPathway[];
  meta: {
    totalPathwaysEvaluated: number;
    hardFilteredOut: number;
    timestamp: string;
  };
}

export interface DiagnosisInput {
  nationality: string;
  age: number;
  educationLevel: string;
  availableAnnualFund: number;
  finalGoal: string;
  priorityPreference: string;
  topikLevel?: number;
  workExperienceYears?: number;
  major?: string;
  isEthnicKorean?: boolean;
  currentVisa?: string;
}

// ============================================================
// 국가 목록 / Country list (popular)
// ============================================================

export const popularCountries = [
  { code: 'VNM', flag: '\u{1F1FB}\u{1F1F3}', name: '\uBCA0\uD2B8\uB0A8', nameKo: '\uBCA0\uD2B8\uB0A8', nameEn: 'Vietnam' },
  { code: 'UZB', flag: '\u{1F1FA}\u{1F1FF}', name: '\uC6B0\uC988\uBCA0\uD0A4\uC2A4\uD0C4', nameKo: '\uC6B0\uC988\uBCA0\uD0A4\uC2A4\uD0C4', nameEn: 'Uzbekistan' },
  { code: 'NPL', flag: '\u{1F1F3}\u{1F1F5}', name: '\uB124\uD314', nameKo: '\uB124\uD314', nameEn: 'Nepal' },
  { code: 'CHN', flag: '\u{1F1E8}\u{1F1F3}', name: '\uC911\uAD6D', nameKo: '\uC911\uAD6D', nameEn: 'China' },
  { code: 'PHL', flag: '\u{1F1F5}\u{1F1ED}', name: '\uD544\uB9AC\uD540', nameKo: '\uD544\uB9AC\uD540', nameEn: 'Philippines' },
  { code: 'IDN', flag: '\u{1F1EE}\u{1F1E9}', name: '\uC778\uB3C4\uB124\uC2DC\uC544', nameKo: '\uC778\uB3C4\uB124\uC2DC\uC544', nameEn: 'Indonesia' },
  { code: 'USA', flag: '\u{1F1FA}\u{1F1F8}', name: '\uBBF8\uAD6D', nameKo: '\uBBF8\uAD6D', nameEn: 'USA' },
  { code: 'IND', flag: '\u{1F1EE}\u{1F1F3}', name: '\uC778\uB3C4', nameKo: '\uC778\uB3C4', nameEn: 'India' },
  { code: 'MNG', flag: '\u{1F1F2}\u{1F1F3}', name: '\uBABD\uACE8', nameKo: '\uBABD\uACE8', nameEn: 'Mongolia' },
  { code: 'MMR', flag: '\u{1F1F2}\u{1F1F2}', name: '\uBBF8\uC580\uB9C8', nameKo: '\uBBF8\uC580\uB9C8', nameEn: 'Myanmar' },
  { code: 'KHM', flag: '\u{1F1F0}\u{1F1ED}', name: '\uCE84\uBCF4\uB514\uC544', nameKo: '\uCE84\uBCF4\uB514\uC544', nameEn: 'Cambodia' },
  { code: 'THA', flag: '\u{1F1F9}\u{1F1ED}', name: '\uD0DC\uAD6D', nameKo: '\uD0DC\uAD6D', nameEn: 'Thailand' },
];

// ============================================================
// 학력 옵션 / Education options
// ============================================================

export const educationOptions = [
  { value: 'none', labelKo: '\uBB34\uD559', labelEn: 'No formal education', emoji: '' },
  { value: 'middle', labelKo: '\uC911\uD559\uAD50 \uC878\uC5C5', labelEn: 'Middle school', emoji: '\u{1F4DA}' },
  { value: 'high_school', labelKo: '\uACE0\uB4F1\uD559\uAD50 \uC878\uC5C5', labelEn: 'High school', emoji: '\u{1F393}' },
  { value: 'associate', labelKo: '\uC804\uBB38\uB300 \uC878\uC5C5', labelEn: 'Associate degree', emoji: '\u{1F4D6}' },
  { value: 'bachelor', labelKo: '\uD559\uC0AC (\uB300\uD559\uAD50)', labelEn: "Bachelor's degree", emoji: '\u{1F3EB}' },
  { value: 'master', labelKo: '\uC11D\uC0AC', labelEn: "Master's degree", emoji: '\u{1F9D1}\u200D\u{1F393}' },
  { value: 'doctor', labelKo: '\uBC15\uC0AC', labelEn: 'Doctorate', emoji: '\u{1F9D1}\u200D\u{1F52C}' },
];

// ============================================================
// 목표 옵션 / Goal options
// ============================================================

export const goalOptions = [
  { value: 'employment', labelKo: '\uCDE8\uC5C5', labelEn: 'Employment', emoji: '\u{1F4BC}', descKo: '\uD55C\uAD6D\uC5D0\uC11C \uC77C\uD558\uACE0 \uC2F6\uC5B4\uC694' },
  { value: 'degree', labelKo: '\uD559\uC704', labelEn: 'Degree', emoji: '\u{1F393}', descKo: '\uD55C\uAD6D\uC5D0\uC11C \uACF5\uBD80\uD558\uACE0 \uC2F6\uC5B4\uC694' },
  { value: 'permanent_residence', labelKo: '\uC601\uC8FC\uAD8C', labelEn: 'Permanent Residence', emoji: '\u{1F3E0}', descKo: '\uD55C\uAD6D\uC5D0 \uC624\uB798 \uC0B4\uACE0 \uC2F6\uC5B4\uC694' },
  { value: 'explore', labelKo: '\uD0D0\uC0C9', labelEn: 'Explore', emoji: '\u{1F30F}', descKo: '\uC544\uC9C1 \uBAA8\uB974\uACA0\uC5B4\uC694' },
];

// ============================================================
// 우선순위 옵션 / Priority options
// ============================================================

export const priorityOptions = [
  { value: 'speed', labelKo: '\uBE60\uB974\uAC8C', labelEn: 'Speed', emoji: '\u26A1', descKo: '\uAC00\uC7A5 \uBE60\uB978 \uACBD\uB85C' },
  { value: 'stability', labelKo: '\uC548\uC815\uC801\uC73C\uB85C', labelEn: 'Stability', emoji: '\u{1F6E1}\uFE0F', descKo: '\uAC00\uC7A5 \uC548\uC804\uD55C \uACBD\uB85C' },
  { value: 'cost', labelKo: '\uCD5C\uC18C \uBE44\uC6A9', labelEn: 'Low Cost', emoji: '\u{1F4B0}', descKo: '\uAC00\uC7A5 \uC800\uB834\uD55C \uACBD\uB85C' },
  { value: 'income', labelKo: '\uB192\uC740 \uC218\uC785', labelEn: 'High Income', emoji: '\u{1F4C8}', descKo: '\uAC00\uC7A5 \uB9CE\uC774 \uBC84\uB294 \uACBD\uB85C' },
];

// ============================================================
// 자금 범위 옵션 / Fund range options
// ============================================================

export const fundOptions = [
  { value: 0, labelKo: '0 ~ 300\uB9CC\uC6D0', labelEn: '0 - 3M KRW', bracket: '0-300' },
  { value: 300, labelKo: '300 ~ 500\uB9CC\uC6D0', labelEn: '3M - 5M KRW', bracket: '300-500' },
  { value: 500, labelKo: '500 ~ 1,000\uB9CC\uC6D0', labelEn: '5M - 10M KRW', bracket: '500-1000' },
  { value: 1000, labelKo: '1,000 ~ 2,000\uB9CC\uC6D0', labelEn: '10M - 20M KRW', bracket: '1000-2000' },
  { value: 2000, labelKo: '2,000 ~ 3,000\uB9CC\uC6D0', labelEn: '20M - 30M KRW', bracket: '2000-3000' },
  { value: 3000, labelKo: '3,000\uB9CC\uC6D0 \uC774\uC0C1', labelEn: '30M+ KRW', bracket: '3000+' },
];

// ============================================================
// 목업 진단 결과 / Mock diagnosis result
// (베트남 24세 고졸 500만원 안정취업 기준)
// ============================================================

export const mockDiagnosisResult: DiagnosisResult = {
  pathways: [
    {
      pathwayId: 'PW-006',
      nameKo: 'EPS(E-9) \uBE44\uC804\uBB38\uCDE8\uC5C5',
      nameEn: 'EPS Non-professional Employment',
      finalScore: 60,
      scoreBreakdown: {
        base: 60,
        ageMultiplier: 0.8,
        nationalityMultiplier: 0.9,
        fundMultiplier: 1.0,
        educationMultiplier: 1.0,
        priorityWeight: 0.5,
      },
      feasibilityLabel: '\uBCF4\uD1B5',
      estimatedMonths: 12,
      estimatedCostWon: 50,
      visaChain: 'E-9',
      platformSupport: 'info_only',
      milestones: [
        { order: 1, monthFromStart: 0, type: 'entry', nameKo: 'EPS-TOPIK \uC751\uC2DC', visaStatus: 'none', canWorkPartTime: false, weeklyHours: 0, estimatedMonthlyIncome: 0, requirements: 'EPS-TOPIK\uD569\uACA9', platformAction: 'info_only' },
        { order: 2, monthFromStart: 6, type: 'waiting', nameKo: '\uAD6C\uC9C1\uC790\uBA85\uBD80 \uB4F1\uB85D, \uB300\uAE30', visaStatus: 'none', canWorkPartTime: false, weeklyHours: 0, estimatedMonthlyIncome: 0, requirements: '\uC0B0\uC5C5\uC778\uB825\uACF5\uB2E8 \uBC30\uC815\uB300\uAE30', platformAction: 'info_only' },
        { order: 3, monthFromStart: 12, type: 'final_goal', nameKo: 'E-9 \uCDE8\uC5C5 \uC2DC\uC791', visaStatus: 'E-9', canWorkPartTime: true, weeklyHours: 0, estimatedMonthlyIncome: 250, requirements: '\uACE0\uC6A9\uD5C8\uAC00+\uC785\uAD6D', platformAction: 'info_only' },
      ],
      nextSteps: [
        { actionType: 'eps_test', nameKo: 'EPS-TOPIK \uC751\uC2DC', description: '\uD55C\uAD6D\uC0B0\uC5C5\uC778\uB825\uACF5\uB2E8 EPS-TOPIK \uC2DC\uD5D8 \uC77C\uC815 \uD655\uC778' },
      ],
      note: '\uC815\uBD80\uAD00\uB9AC, 16\uAC1C \uC1A1\uCD9C\uAD6D\uB9CC, \uC9C1\uC7A5\uC120\uD0DD \uBD88\uAC00',
    },
    {
      pathwayId: 'PW-003',
      nameKo: '\uC5B4\uD559\uB2F9 \u2192 \uC804\uBB38\uB300 \u2192 E-7-4',
      nameEn: 'Lang School \u2192 College \u2192 E-7-4',
      finalScore: 18,
      scoreBreakdown: {
        base: 55,
        ageMultiplier: 0.85,
        nationalityMultiplier: 0.6,
        fundMultiplier: 0.8,
        educationMultiplier: 1.0,
        priorityWeight: 0.8,
      },
      feasibilityLabel: '\uB9E4\uC6B0\uB0AE\uC74C',
      estimatedMonths: 42,
      estimatedCostWon: 2500,
      visaChain: 'D-4 \u2192 D-2-1 \u2192 D-10 \u2192 E-7-4',
      platformSupport: 'full_support',
      milestones: [
        { order: 1, monthFromStart: 0, type: 'entry', nameKo: '\uD55C\uAD6D \uC785\uAD6D, \uC5B4\uD559\uB2F9 \uC2DC\uC791', visaStatus: 'D-4', canWorkPartTime: false, weeklyHours: 0, estimatedMonthlyIncome: 0, requirements: '\uC5B4\uD559\uB2F9 \uC785\uD559\uD5C8\uAC00+\uC7AC\uC815\uC99D\uBA85', platformAction: 'language_school_connect' },
        { order: 2, monthFromStart: 6, type: 'part_time_unlock', nameKo: '\uC544\uB974\uBC14\uC774\uD2B8 \uD5C8\uAC00 \uAC00\uB2A5', visaStatus: 'D-4', canWorkPartTime: true, weeklyHours: 10, estimatedMonthlyIncome: 40, requirements: '\uCD9C\uC11D90%+TOPIK2\uAE09', platformAction: 'alba_matching' },
        { order: 3, monthFromStart: 12, type: 'study_upgrade', nameKo: '\uC804\uBB38\uB300 \uC785\uD559, D-2 \uC804\uD658', visaStatus: 'D-2-1', canWorkPartTime: true, weeklyHours: 25, estimatedMonthlyIncome: 100, requirements: 'TOPIK3\uAE09+\uC804\uBB38\uB300\uC785\uD559', platformAction: 'university_connect' },
        { order: 4, monthFromStart: 12, type: 'part_time_expand', nameKo: '\uC544\uB974\uBC14\uC774\uD2B8 \uD655\uB300(\uBC29\uD559\uBB34\uC81C\uD55C)', visaStatus: 'D-2-1', canWorkPartTime: true, weeklyHours: 25, estimatedMonthlyIncome: 150, requirements: 'D-2\uC804\uD658\uC644\uB8CC', platformAction: 'alba_matching' },
        { order: 5, monthFromStart: 36, type: 'graduation', nameKo: '\uC804\uBB38\uB300 \uC878\uC5C5, D-10 \uC804\uD658', visaStatus: 'D-10', canWorkPartTime: true, weeklyHours: 20, estimatedMonthlyIncome: 80, requirements: '\uC878\uC5C5+TOPIK4\uAE09', platformAction: 'job_matching' },
        { order: 6, monthFromStart: 38, type: 'final_goal', nameKo: 'E-7-4 \uC815\uADDC\uCDE8\uC5C5', visaStatus: 'E-7-4', canWorkPartTime: true, weeklyHours: 0, estimatedMonthlyIncome: 250, requirements: '\uAE30\uC5C5\uB9E4\uCE6D+\uBE44\uC790\uCC98\uB9AC', platformAction: 'visa_processing' },
      ],
      nextSteps: [
        { actionType: 'take_topik', nameKo: 'TOPIK \uC751\uC2DC \uC900\uBE44', description: '\uC5B4\uD559\uB2F9 \uC785\uD559 \uB610\uB294 \uB300\uD559 \uC9C0\uC6D0\uC744 \uC704\uD574 TOPIK \uC900\uBE44 \uD544\uC694' },
        { actionType: 'connect_school', nameKo: '\uC5B4\uD559\uB2F9/\uB300\uD559 \uC5F0\uACB0', description: '\uC785\uD559 \uAC00\uB2A5\uD55C \uC5B4\uD559\uB2F9 \uBC0F \uB300\uD559 \uAC80\uC0C9' },
      ],
      note: '\uAC00\uC7A5 \uBCF4\uD3B8\uC801 \uACBD\uB85C, \uC790\uAE08 \uBD80\uB2F4 \uC911\uAC04',
    },
    {
      pathwayId: 'PW-001',
      nameKo: 'GKS \uD559\uBD80 \uC7A5\uD559\uAE08',
      nameEn: 'GKS Undergraduate Scholarship',
      finalScore: 14,
      scoreBreakdown: {
        base: 35,
        ageMultiplier: 0.85,
        nationalityMultiplier: 0.75,
        fundMultiplier: 1.0,
        educationMultiplier: 1.0,
        priorityWeight: 0.9,
      },
      feasibilityLabel: '\uB9E4\uC6B0\uB0AE\uC74C',
      estimatedMonths: 60,
      estimatedCostWon: 0,
      visaChain: 'D-2 \u2192 D-10 \u2192 E-7',
      platformSupport: 'info_only',
      milestones: [
        { order: 1, monthFromStart: 0, type: 'entry', nameKo: 'GKS \uC7A5\uD559\uAE08 \uC9C0\uC6D0', visaStatus: 'none', canWorkPartTime: false, weeklyHours: 0, estimatedMonthlyIncome: 0, requirements: 'GKS\uBAA8\uC9D1\uACF5\uACE0 \uD655\uC778', platformAction: 'info_only' },
        { order: 2, monthFromStart: 6, type: 'entry', nameKo: '\uD55C\uAD6D\uC5B4 \uC5F0\uC218 \uC2DC\uC791', visaStatus: 'D-2', canWorkPartTime: false, weeklyHours: 0, estimatedMonthlyIncome: 0, requirements: '\uD569\uACA9+\uBE44\uC790\uBC1C\uAE09', platformAction: 'info_only' },
        { order: 3, monthFromStart: 18, type: 'study_upgrade', nameKo: '\uD559\uBD80 \uACFC\uC815 \uC2DC\uC791', visaStatus: 'D-2', canWorkPartTime: true, weeklyHours: 20, estimatedMonthlyIncome: 80, requirements: '\uD55C\uAD6D\uC5B4\uC5F0\uC218\uC218\uB8CC', platformAction: 'alba_matching' },
        { order: 4, monthFromStart: 54, type: 'graduation', nameKo: '\uD559\uBD80 \uC878\uC5C5', visaStatus: 'D-10', canWorkPartTime: true, weeklyHours: 20, estimatedMonthlyIncome: 80, requirements: '\uC878\uC5C5', platformAction: 'job_matching' },
        { order: 5, monthFromStart: 60, type: 'final_goal', nameKo: 'E-7 \uCDE8\uC5C5', visaStatus: 'E-7', canWorkPartTime: true, weeklyHours: 0, estimatedMonthlyIncome: 300, requirements: '\uAE30\uC5C5\uB9E4\uCE6D', platformAction: 'visa_processing' },
      ],
      nextSteps: [
        { actionType: 'apply_scholarship', nameKo: 'GKS \uC7A5\uD559\uAE08 \uC9C0\uC6D0', description: '\uAD6D\uB9BD\uAD6D\uC81C\uAD50\uC721\uC6D0 GKS \uC7A5\uD559\uAE08 \uBAA8\uC9D1 \uACF5\uACE0 \uD655\uC778' },
      ],
      note: '\uACBD\uC7C1\uB960 10:1, \uAD6D\uAC00\uBCC4 \uCFFC\uD130 \uC0C1\uC774',
    },
    {
      pathwayId: 'PW-004',
      nameKo: '\uC5B4\uD559\uB2F9 \u2192 \uC77C\uBC18\uB300 \u2192 E-7-1',
      nameEn: 'Lang School \u2192 University \u2192 E-7-1',
      finalScore: 10,
      scoreBreakdown: {
        base: 45,
        ageMultiplier: 0.85,
        nationalityMultiplier: 0.6,
        fundMultiplier: 0.5,
        educationMultiplier: 1.0,
        priorityWeight: 1.0,
      },
      feasibilityLabel: '\uB9E4\uC6B0\uB0AE\uC74C',
      estimatedMonths: 66,
      estimatedCostWon: 4500,
      visaChain: 'D-4 \u2192 D-2-2 \u2192 D-10 \u2192 E-7-1',
      platformSupport: 'full_support',
      milestones: [
        { order: 1, monthFromStart: 0, type: 'entry', nameKo: '\uD55C\uAD6D \uC785\uAD6D, \uC5B4\uD559\uB2F9 \uC2DC\uC791', visaStatus: 'D-4', canWorkPartTime: false, weeklyHours: 0, estimatedMonthlyIncome: 0, requirements: '\uC5B4\uD559\uB2F9 \uC785\uD559\uD5C8\uAC00+\uC7AC\uC815\uC99D\uBA85', platformAction: 'language_school_connect' },
        { order: 2, monthFromStart: 12, type: 'study_upgrade', nameKo: '\uC77C\uBC18\uB300 \uC785\uD559, D-2 \uC804\uD658', visaStatus: 'D-2-2', canWorkPartTime: true, weeklyHours: 25, estimatedMonthlyIncome: 100, requirements: 'TOPIK4\uAE09+\uB300\uD559\uC785\uD559', platformAction: 'university_connect' },
        { order: 3, monthFromStart: 60, type: 'graduation', nameKo: '\uB300\uD559 \uC878\uC5C5, D-10 \uC804\uD658', visaStatus: 'D-10', canWorkPartTime: true, weeklyHours: 20, estimatedMonthlyIncome: 80, requirements: '\uC878\uC5C5+TOPIK4\uAE09', platformAction: 'job_matching' },
        { order: 4, monthFromStart: 62, type: 'final_goal', nameKo: 'E-7-1 \uC804\uBB38\uC9C1 \uCDE8\uC5C5', visaStatus: 'E-7-1', canWorkPartTime: true, weeklyHours: 0, estimatedMonthlyIncome: 300, requirements: '\uAE30\uC5C5\uB9E4\uCE6D+\uBE44\uC790\uCC98\uB9AC', platformAction: 'visa_processing' },
      ],
      nextSteps: [
        { actionType: 'take_topik', nameKo: 'TOPIK \uC751\uC2DC \uC900\uBE44', description: '\uC5B4\uD559\uB2F9 \uC785\uD559 \uB610\uB294 \uB300\uD559 \uC9C0\uC6D0\uC744 \uC704\uD574 TOPIK \uC900\uBE44 \uD544\uC694' },
        { actionType: 'connect_school', nameKo: '\uC5B4\uD559\uB2F9/\uB300\uD559 \uC5F0\uACB0', description: '\uC785\uD559 \uAC00\uB2A5\uD55C \uC5B4\uD559\uB2F9 \uBC0F \uB300\uD559 \uAC80\uC0C9' },
      ],
      note: '4\uB144\uC81C \uD559\uC704, \uC804\uBB38\uC9C1 E-7 \uAC00\uB2A5',
    },
    {
      pathwayId: 'PW-013',
      nameKo: 'F-2-R \uC9C0\uC5ED\uD2B9\uD654\uBE44\uC790',
      nameEn: 'F-2-R Regional Visa',
      finalScore: 8,
      scoreBreakdown: {
        base: 40,
        ageMultiplier: 0.7,
        nationalityMultiplier: 0.7,
        fundMultiplier: 0.8,
        educationMultiplier: 1.0,
        priorityWeight: 0.7,
      },
      feasibilityLabel: '\uB9E4\uC6B0\uB0AE\uC74C',
      estimatedMonths: 1,
      estimatedCostWon: 50,
      visaChain: 'F-2-R',
      platformSupport: 'visa_processing',
      milestones: [
        { order: 1, monthFromStart: 0, type: 'application', nameKo: 'F-2-R \uBE44\uC790 \uC2E0\uCCAD', visaStatus: 'none', canWorkPartTime: false, weeklyHours: 0, estimatedMonthlyIncome: 0, requirements: '\uC778\uAD6C\uAC10\uC18C\uC9C0\uC5ED \uCDE8\uC5C5\uC2DC', platformAction: 'visa_processing' },
        { order: 2, monthFromStart: 1, type: 'final_goal', nameKo: '\uC9C0\uC5ED\uD2B9\uD654 \uCDE8\uC5C5 \uC2DC\uC791', visaStatus: 'F-2-R', canWorkPartTime: true, weeklyHours: 0, estimatedMonthlyIncome: 220, requirements: '\uBE44\uC790\uBC1C\uAE09+\uCDE8\uC5C5', platformAction: 'job_matching' },
      ],
      nextSteps: [
        { actionType: 'find_job', nameKo: '\uC9C0\uC5ED \uCC44\uC6A9 \uACF5\uACE0 \uAC80\uC0C9', description: '\uC778\uAD6C\uAC10\uC18C\uC9C0\uC5ED \uCC44\uC6A9 \uACF5\uACE0 \uD655\uC778' },
      ],
      note: '\uC778\uAD6C\uAC10\uC18C\uC9C0\uC5ED \uD55C\uC815, \uB2E8\uC21C\uB178\uBB34 \uD5C8\uC6A9',
    },
  ],
  meta: {
    totalPathwaysEvaluated: 15,
    hardFilteredOut: 10,
    timestamp: new Date().toISOString(),
  },
};

// ============================================================
// 기본 입력 목업 / Default input mock
// ============================================================

export const mockInput: DiagnosisInput = {
  nationality: 'VNM',
  age: 24,
  educationLevel: 'high_school',
  availableAnnualFund: 500,
  finalGoal: 'employment',
  priorityPreference: 'stability',
};

// ============================================================
// 유틸: 경로 ID로 경로 찾기 / Util: find pathway by ID
// ============================================================

export function getPathwayById(pathwayId: string): RecommendedPathway | undefined {
  return mockDiagnosisResult.pathways.find((p) => p.pathwayId === pathwayId);
}

// ============================================================
// 유틸: 점수 색상 / Util: score color
// ============================================================

export function getScoreColor(score: number): string {
  if (score >= 71) return '#22c55e';
  if (score >= 51) return '#3b82f6';
  if (score >= 31) return '#f59e0b';
  if (score >= 1) return '#ef4444';
  return '#9ca3af';
}

export function getScoreBgClass(score: number): string {
  if (score >= 71) return 'bg-green-500';
  if (score >= 51) return 'bg-blue-500';
  if (score >= 31) return 'bg-amber-500';
  if (score >= 1) return 'bg-red-400';
  return 'bg-gray-400';
}

export function getFeasibilityEmoji(label: string): string {
  switch (label) {
    case '\uB192\uC74C': return '\u{1F7E2}';
    case '\uBCF4\uD1B5': return '\u{1F535}';
    case '\uB0AE\uC74C': return '\u{1F7E1}';
    case '\uB9E4\uC6B0\uB0AE\uC74C': return '\u{1F534}';
    default: return '\u26AA';
  }
}

// ============================================================
// 시안 호환 별칭 / Design compatibility aliases
// 각 시안 에이전트가 다른 이름으로 임포트하므로 별칭 제공
// ============================================================

// 옵션 배열 별칭 / Option array aliases
export const countries = popularCountries;
export const educationLevels = educationOptions;
export const fundRanges = fundOptions;
export const goals = goalOptions;
export const priorities = priorityOptions;

// visaChain 문자열 → 배열 변환 / Convert visaChain string → arrays
function splitVisaChain(chain: string): string[] {
  return chain.split(' → ').map((s) => s.trim());
}

// 시안 호환 경로 타입 / Design-compatible pathway type
export interface CompatPathway {
  id: string;
  pathwayId: string;
  name: string;
  nameKo: string;
  nameEn: string;
  pathwayName: string;
  description: string;
  highlights: string[];
  score: number;
  finalScore: number;
  totalScore: number;
  feasibility: string;
  feasibilityLabel: string;
  durationMonths: number;
  totalMonths: number;
  estimatedMonths: number;
  estimatedCost: number;
  estimatedCostWon: number;
  estimatedCostKRW: number;
  estimatedCostUSD: number;
  visaChain: { code: string; name: string }[];
  visaChainStr: string;
  platformSupport: string;
  scoreBreakdown: {
    base: number;
    ageMultiplier: number;
    nationalityMultiplier: number;
    fundMultiplier: number;
    educationMultiplier: number;
    priorityWeight: number;
    feasibility: number;
    speed: number;
    cost: number;
    stability: number;
  };
  milestones: CompatMilestone[];
  nextSteps: { actionType: string; nameKo: string; description: string; url?: string }[];
  note: string;
}

export interface CompatMilestone {
  order: number;
  monthFromStart: number;
  type: string;
  name: string;
  nameKo: string;
  nameEn: string;
  visaStatus: string;
  visaType: string;
  canWork: boolean;
  canWorkPartTime: boolean;
  weeklyHours: number;
  maxWorkHoursPerWeek: number;
  estimatedMonthlyIncome: number;
  requirements: string[];
  durationMonths: number;
  estimatedCost: number;
  platformAction: string;
}

function mapMilestone(m: Milestone, allMilestones: Milestone[]): CompatMilestone {
  const nextM = allMilestones.find((x) => x.order === m.order + 1);
  const duration = nextM ? nextM.monthFromStart - m.monthFromStart : 0;
  return {
    ...m,
    name: m.nameKo,
    nameEn: m.nameKo,
    visaType: m.visaStatus || 'none',
    canWork: m.canWorkPartTime,
    maxWorkHoursPerWeek: m.weeklyHours,
    requirements: m.requirements.split(/[,、+]/).map((s) => s.trim()).filter(Boolean),
    durationMonths: duration,
    estimatedCost: 0,
  };
}

function mapPathway(p: RecommendedPathway): CompatPathway {
  const feasMap: Record<string, string> = {
    '높음': 'HIGH',
    '보통': 'MEDIUM',
    '낮음': 'LOW',
    '매우낮음': 'LOW',
  };
  const codes = splitVisaChain(p.visaChain);
  return {
    id: p.pathwayId,
    pathwayId: p.pathwayId,
    name: p.nameKo,
    nameKo: p.nameKo,
    nameEn: p.nameEn,
    pathwayName: p.nameKo,
    description: p.note,
    highlights: [p.note, `${p.estimatedMonths}개월 소요`],
    score: p.finalScore,
    finalScore: p.finalScore,
    totalScore: p.finalScore,
    feasibility: feasMap[p.feasibilityLabel] || 'LOW',
    feasibilityLabel: p.feasibilityLabel,
    durationMonths: p.estimatedMonths,
    totalMonths: p.estimatedMonths,
    estimatedMonths: p.estimatedMonths,
    estimatedCost: p.estimatedCostWon,
    estimatedCostWon: p.estimatedCostWon,
    estimatedCostKRW: p.estimatedCostWon * 10000,
    estimatedCostUSD: Math.round(p.estimatedCostWon / 1300),
    visaChain: codes.map((c) => ({ code: c, name: c })),
    visaChainStr: p.visaChain,
    platformSupport: p.platformSupport,
    scoreBreakdown: {
      ...p.scoreBreakdown,
      feasibility: Math.round(p.finalScore * 0.8),
      speed: Math.round((1 / Math.max(p.estimatedMonths, 1)) * 1000),
      cost: Math.round(100 - (p.estimatedCostWon / 50)),
      stability: Math.round(p.finalScore * 0.7),
    },
    milestones: p.milestones.map((m) => mapMilestone(m, p.milestones)),
    nextSteps: p.nextSteps,
    note: p.note,
  };
}

// 시안에서 사용하는 호환 경로 배열 / Compatible pathway arrays for designs
export const mockPathways: CompatPathway[] = mockDiagnosisResult.pathways.map(mapPathway);
export const pathwayResults: CompatPathway[] = mockPathways;
export const mockPathwayDetail: CompatPathway = mockPathways[0];
