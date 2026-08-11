import type { PlannerLang } from './planner-types';

export type PlannerUiCopy = {
  nav: { section: string; signIn: string; myAccount: string };
  intro: {
    eyebrow: string;
    title: string;
    body: string;
    noAccount: string;
    privateAnswers: string;
  };
  steps: string[];
  stepTitles: string[];
  stepBodies: string[];
  fields: {
    nationality: string;
    residence: string;
    age: string;
    ethnicKorean: string;
    ethnicKoreanHelp: string;
    education: string;
    field: string;
    major: string;
    majorPlaceholder: string;
    degreeDocument: string;
    degreeDocumentHelp: string;
    goal: string;
    priority: string;
    budget: string;
    budgetHelp: string;
    topik: string;
    kiip: string;
    experience: string;
    occupation: string;
    occupationPlaceholder: string;
    currentVisa: string;
    currentVisaPlaceholder: string;
    select: string;
    optional: string;
    yes: string;
    no: string;
    none: string;
  };
  review: {
    about: string;
    education: string;
    goal: string;
    experience: string;
    edit: string;
    missing: string;
  };
  receiveTitle: string;
  receiveItems: string[];
  actions: {
    back: string;
    next: string;
    submit: string;
    submitting: string;
    error: string;
  };
  status: {
    retry: string;
    loadError: string;
    notFound: string;
    forbidden: string;
    invalidPathway: string;
    saveAlreadyOwned: string;
    saveRoleError: string;
    saveForbidden: string;
    saveConflict: string;
    saveNetwork: string;
  };
  history: {
    title: string;
    subtitle: string;
    newPlan: string;
    loginTitle: string;
    loginAction: string;
    emptyTitle: string;
    emptyBody: string;
    routeCount: string;
    open: string;
  };
  result: {
    eyebrow: string;
    title: string;
    subtitle: string;
    bestMatch: string;
    otherOptions: string;
    fit: string;
    readiness: string;
    time: string;
    monthUnit: string;
    timeline: string;
    cost: string;
    visaRoute: string;
    whyItFits: string;
    toPrepare: string;
    detail: string;
    expertReview: string;
    keepTitle: string;
    keepBody: string;
    save: string;
    saved: string;
    saving: string;
    loginToSave: string;
    restart: string;
    premium: string;
    informationBasis: string;
    policyChecked: string;
    policyVersion: string;
    policyReviewRequired: string;
    informationOnly: string;
    scoreGuide: string;
    scoreGuideBody: string;
    legalTitle: string;
    emptyTitle: string;
    emptyBody: string;
    backToResults: string;
    overview: string;
    preparationTimeline: string;
    whatHelps: string;
    nextActions: string;
  };
};

const en: PlannerUiCopy = {
  nav: { section: 'Visa Planner', signIn: 'Log in', myAccount: 'My account' },
  intro: {
    eyebrow: 'Plan before you apply',
    title: 'Find a practical route to study or work in Korea',
    body: 'Tell us about your background and goals. We will compare routes you may qualify for and show what to prepare next.',
    noAccount: 'See your options before creating an account',
    privateAnswers: 'Your answers are not shared with employers.',
  },
  steps: ['About you', 'Education', 'Goals', 'Experience', 'Review'],
  stepTitles: [
    'Where are you starting from?',
    'Tell us about your education',
    'What do you want to achieve in Korea?',
    'Add your language and work experience',
    'Check your answers',
  ],
  stepBodies: [
    'Nationality and current residence can change which visa routes are available.',
    'Your highest qualification and field help us compare study and skilled-work routes.',
    'We will balance your preferred speed, cost, and long-term stability.',
    'These details show what you already meet and what you may need to improve.',
    'You can change any answer before viewing your routes.',
  ],
  fields: {
    nationality: 'Nationality',
    residence: 'Country where you live now',
    age: 'Age',
    ethnicKorean: 'I may have overseas Korean heritage',
    ethnicKoreanHelp: 'This can open different eligibility checks. You can confirm documents later.',
    education: 'Highest education completed',
    field: 'Field of study or work',
    major: 'Major or qualification name',
    majorPlaceholder: 'e.g. Computer engineering',
    degreeDocument: 'I can obtain a diploma or graduation certificate',
    degreeDocumentHelp: 'No upload is needed now. We ask for proof only when a route requires it.',
    goal: 'Main goal',
    priority: 'Most important to me',
    budget: 'Funds available for the first year',
    budgetHelp: 'An estimate is enough. This helps compare tuition and initial living costs.',
    topik: 'TOPIK level',
    kiip: 'KIIP stage',
    experience: 'Full-time work experience',
    occupation: 'Work you want to do in Korea',
    occupationPlaceholder: 'e.g. Software developer, welder, hotel staff',
    currentVisa: 'Current Korean visa, if any',
    currentVisaPlaceholder: 'e.g. D-2, D-10',
    select: 'Select an option',
    optional: 'Optional',
    yes: 'Yes',
    no: 'No',
    none: 'None',
  },
  review: {
    about: 'About you',
    education: 'Education',
    goal: 'Goal and budget',
    experience: 'Language and experience',
    edit: 'Edit',
    missing: 'Not provided',
  },
  receiveTitle: 'Your result will show',
  receiveItems: [
    'Routes that best match your profile',
    'Likely timing, cost, and visa sequence',
    'Requirements to improve before applying',
  ],
  actions: {
    back: 'Back',
    next: 'Continue',
    submit: 'See my Korea options',
    submitting: 'Comparing your options...',
    error: 'We could not check your routes. Please try again.',
  },
  status: {
    retry: 'Try again', loadError: 'We could not load this result.', notFound: 'This result is unavailable or no longer exists.', forbidden: 'This result belongs to another account or browser.', invalidPathway: 'This route is not included in the saved result.', saveAlreadyOwned: 'This plan is already saved to your account.', saveRoleError: 'Only an individual account can save a visa plan.', saveForbidden: 'This result cannot be saved from this account or browser.', saveConflict: 'The original browser information is required to save this result.', saveNetwork: 'The plan was not saved. Check your connection and try again.',
  },
  history: {
    title: 'Saved visa plans', subtitle: 'Open a saved result and continue your preparation.', newPlan: 'New plan', loginTitle: 'Log in to view saved plans', loginAction: 'Log in', emptyTitle: 'No saved plans yet', emptyBody: 'Complete a visa plan and save it to your account.', routeCount: 'routes', open: 'Open result',
  },
  result: {
    eyebrow: 'Your personalized result',
    title: 'Your most practical routes to Korea',
    subtitle: 'Compare the time, cost, and preparation needed for each option.',
    bestMatch: 'Best match',
    otherOptions: 'Other routes to consider',
    fit: 'Route fit (comparison score)',
    readiness: 'Current preparation reference',
    time: 'Estimated preparation time',
    monthUnit: 'months',
    timeline: 'Estimated preparation time',
    cost: 'Estimated preparation cost',
    visaRoute: 'Possible visa route',
    whyItFits: 'Why it may fit',
    toPrepare: 'What to prepare',
    detail: 'View route details',
    expertReview: 'Case review recommended',
    keepTitle: 'Keep this plan and continue later',
    keepBody: 'Save your routes, update your profile, and return to your preparation checklist anytime.',
    save: 'Save this plan',
    saved: 'Plan saved',
    saving: 'Saving...',
    loginToSave: 'Log in to save',
    restart: 'Change my answers',
    premium: 'Get a document roadmap',
    informationBasis: 'About this result',
    policyChecked: 'Policy information checked',
    policyVersion: 'Reference version',
    policyReviewRequired: 'Official source review required',
    informationOnly: 'Reference information only',
    scoreGuide: 'How the scores work',
    scoreGuideBody: 'Route fit is a JobChaja comparison score, not an approval probability. The preparation reference combines route fit and profile completeness; it is not the percentage of legal requirements met.',
    legalTitle: 'Before you apply',
    emptyTitle: 'We need a little more information',
    emptyBody: 'Change your answers or request a case review to explore more routes.',
    backToResults: 'Back to all routes',
    overview: 'Route overview',
    preparationTimeline: 'Preparation timeline',
    whatHelps: 'What already helps',
    nextActions: 'Recommended next actions',
  },
};

const ko: PlannerUiCopy = {
  ...en,
  nav: { section: '비자 플래너', signIn: '로그인', myAccount: '내 계정' },
  intro: {
    eyebrow: '신청 전에 가능성부터 확인하세요',
    title: '한국에서 공부하거나 일할 수 있는 현실적인 경로를 찾아보세요',
    body: '학력, 경력, 한국어 능력과 목표를 알려주시면 가능한 경로와 앞으로 준비할 조건을 비교해 드립니다.',
    noAccount: '회원가입 전에 결과를 먼저 확인할 수 있어요',
    privateAnswers: '입력한 내용은 기업에 공개되지 않습니다.',
  },
  steps: ['기본 정보', '학력', '목표', '경력', '확인'],
  stepTitles: ['현재 상황을 알려주세요', '학력과 전공을 알려주세요', '한국에서 이루고 싶은 목표는 무엇인가요?', '한국어 능력과 경력을 알려주세요', '입력한 내용을 확인해 주세요'],
  stepBodies: ['국적과 현재 거주 국가는 검토할 수 있는 비자 경로에 영향을 줍니다.', '최종 학력과 전공을 바탕으로 유학 및 전문 취업 경로를 비교합니다.', '입국 속도, 비용, 장기 체류 가능성 중 무엇이 중요한지 반영합니다.', '현재 충족한 조건과 앞으로 보완할 조건을 구분하는 데 사용합니다.', '결과를 보기 전에 언제든 답변을 수정할 수 있습니다.'],
  fields: {
    nationality: '국적', residence: '현재 거주 국가', age: '나이',
    ethnicKorean: '재외동포에 해당할 가능성이 있어요', ethnicKoreanHelp: '해당 여부에 따라 다른 경로를 검토할 수 있습니다. 증빙은 나중에 확인합니다.',
    education: '최종 학력', field: '전공 또는 경력 분야', major: '전공·자격 명칭', majorPlaceholder: '예: 컴퓨터공학',
    degreeDocument: '졸업증명서 또는 학위증을 준비할 수 있어요', degreeDocumentHelp: '지금 서류를 올릴 필요는 없습니다. 필요한 경로에서만 나중에 요청합니다.',
    goal: '가장 중요한 목표', priority: '우선하고 싶은 조건', budget: '첫 1년 동안 준비 가능한 자금', budgetHelp: '대략적인 금액이면 충분합니다. 학비와 초기 생활비를 비교하는 데 사용합니다.',
    topik: 'TOPIK 급수', kiip: '사회통합프로그램 단계', experience: '정규 경력 기간', occupation: '한국에서 하고 싶은 일',
    occupationPlaceholder: '예: 소프트웨어 개발, 용접, 호텔 서비스', currentVisa: '현재 보유한 한국 비자', currentVisaPlaceholder: '예: D-2, D-10',
    select: '선택해 주세요', optional: '선택 사항', yes: '예', no: '아니요', none: '없음',
  },
  review: { about: '기본 정보', education: '학력', goal: '목표와 자금', experience: '언어와 경력', edit: '수정', missing: '입력하지 않음' },
  receiveTitle: '결과에서 확인할 수 있어요',
  receiveItems: ['내 조건과 잘 맞는 한국 진입 경로', '예상 기간·비용과 비자 진행 순서', '신청 전에 보완해야 할 조건'],
  actions: { back: '이전', next: '계속', submit: '내 한국 진입 경로 보기', submitting: '가능한 경로를 비교하고 있어요...', error: '경로를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.' },
  status: { retry: '다시 시도', loadError: '저장된 결과를 불러오지 못했습니다.', notFound: '결과가 없거나 더 이상 열람할 수 없습니다.', forbidden: '다른 계정 또는 브라우저의 결과입니다.', invalidPathway: '저장된 결과에 없는 경로입니다.', saveAlreadyOwned: '이미 내 계정에 저장된 결과입니다.', saveRoleError: '개인회원만 비자 플랜을 저장할 수 있습니다.', saveForbidden: '이 계정 또는 브라우저에서 저장할 수 없는 결과입니다.', saveConflict: '결과를 저장하려면 처음 진단한 브라우저 정보가 필요합니다.', saveNetwork: '결과가 저장되지 않았습니다. 연결을 확인하고 다시 시도해 주세요.' },
  history: { title: '저장한 비자 플랜', subtitle: '결과를 다시 열고 준비를 이어가세요.', newPlan: '새 플랜', loginTitle: '저장한 플랜을 보려면 로그인해 주세요', loginAction: '로그인', emptyTitle: '아직 저장한 플랜이 없습니다', emptyBody: '비자 플랜을 완성하고 계정에 저장해 보세요.', routeCount: '개 경로', open: '결과 열기' },
  result: {
    eyebrow: '나에게 맞춘 결과', title: '한국으로 갈 수 있는 현실적인 경로', subtitle: '각 경로에 필요한 기간, 비용, 준비 조건을 비교해 보세요.',
    bestMatch: '가장 잘 맞는 경로', otherOptions: '함께 검토할 수 있는 경로', fit: '경로 적합도(비교점수)', readiness: '현재 준비 참고도', time: '예상 준비기간', monthUnit: '개월',
    timeline: '예상 준비기간', cost: '예상 준비 비용', visaRoute: '가능한 비자 흐름', whyItFits: '이 경로가 맞는 이유', toPrepare: '내가 준비할 조건',
    detail: '경로 자세히 보기', expertReview: '개별 확인 권장', keepTitle: '결과를 저장하고 계속 준비하세요',
    keepBody: '경로를 보관하고 프로필을 채우면 준비 목록을 언제든 이어서 볼 수 있습니다.', save: '이 결과 저장', saved: '결과가 저장됐어요', saving: '저장 중...',
    loginToSave: '로그인하고 저장', restart: '답변 수정하기', premium: '서류 준비표 받기', informationBasis: '결과 안내', policyChecked: '정책 정보 확인일', policyVersion: '참고 기준 버전', policyReviewRequired: '공식 출처 확인 필요', informationOnly: '참고용 정보',
    scoreGuide: '점수는 이렇게 해석해요', scoreGuideBody: '경로 적합도는 잡차자 모델 안의 비교점수이며 발급 확률이 아닙니다. 준비 참고도는 적합도와 입력 완성도를 조합한 값으로, 법정 필요조건 충족률이 아닙니다.',
    legalTitle: '신청 전 확인 사항', emptyTitle: '조금 더 많은 정보가 필요해요', emptyBody: '답변을 바꾸거나 개별 검토를 통해 더 많은 경로를 확인해 보세요.',
    backToResults: '전체 결과로 돌아가기', overview: '경로 한눈에 보기', preparationTimeline: '준비 순서', whatHelps: '현재 유리한 조건', nextActions: '지금 할 일',
  },
};

const ja: PlannerUiCopy = {
  ...en,
  nav: { section: 'ビザプランナー', signIn: 'ログイン', myAccount: 'マイアカウント' },
  intro: { eyebrow: '申請前に可能性を確認', title: '韓国で学ぶ・働くための現実的なルートを探しましょう', body: '学歴、職歴、韓国語力、目標をもとに、可能性のあるルートと次に準備する条件を比較します。', noAccount: '会員登録前に結果を確認できます', privateAnswers: '入力内容が企業に公開されることはありません。' },
  steps: ['基本情報', '学歴', '目標', '経験', '確認'],
  stepTitles: ['現在の状況を教えてください', '学歴と専攻を教えてください', '韓国での目標は何ですか？', '韓国語力と職歴を追加してください', '入力内容を確認してください'],
  stepBodies: ['国籍と現在の居住国は利用できるルートに影響します。', '最終学歴と専攻から留学・専門就労ルートを比較します。', '速さ、費用、長期的な安定性の優先順位を反映します。', '満たしている条件と今後補う条件を確認します。', '結果を見る前に回答を変更できます。'],
  fields: { ...en.fields, nationality: '国籍', residence: '現在の居住国', age: '年齢', ethnicKorean: '在外同胞に該当する可能性がある', ethnicKoreanHelp: '該当する場合は別のルートも確認できます。書類は後で確認します。', education: '最終学歴', field: '専攻・職種分野', major: '専攻・資格名', majorPlaceholder: '例：コンピューター工学', degreeDocument: '卒業証明書または学位証明を用意できる', degreeDocumentHelp: '今はアップロード不要です。必要な場合にのみ後で確認します。', goal: '主な目標', priority: '最優先の条件', budget: '最初の1年間に使える資金', budgetHelp: '概算で構いません。学費と初期生活費の比較に使います。', topik: 'TOPIK級', kiip: '社会統合プログラム段階', experience: 'フルタイム職歴', occupation: '韓国で希望する仕事', occupationPlaceholder: '例：ソフトウェア開発、溶接、ホテルスタッフ', currentVisa: '現在の韓国ビザ', currentVisaPlaceholder: '例：D-2、D-10', select: '選択してください', optional: '任意', yes: 'はい', no: 'いいえ', none: 'なし' },
  review: { about: '基本情報', education: '学歴', goal: '目標と資金', experience: '言語と職歴', edit: '修正', missing: '未入力' },
  receiveTitle: '結果で分かること', receiveItems: ['プロフィールに合うルート', '予想期間・費用・ビザの流れ', '申請前に補う条件'],
  actions: { back: '戻る', next: '次へ', submit: '韓国へのルートを見る', submitting: 'ルートを比較しています…', error: 'ルートを確認できませんでした。もう一度お試しください。' },
  result: { ...en.result, eyebrow: 'あなた向けの結果', title: '韓国へ進むための現実的なルート', subtitle: '各ルートの期間、費用、準備条件を比較してください。', bestMatch: '最も合うルート', otherOptions: '検討できる他のルート', fit: '条件適合度', readiness: '現在の準備度', time: '期間', monthUnit: 'か月', timeline: '予想準備期間', cost: '予想準備費用', visaRoute: '可能なビザルート', whyItFits: '合う理由', toPrepare: '準備する条件', detail: '詳細を見る', expertReview: '個別確認を推奨', keepTitle: '結果を保存して準備を続ける', keepBody: 'ルートと準備リストをいつでも確認できます。', save: '結果を保存', saved: '保存しました', saving: '保存中…', loginToSave: 'ログインして保存', restart: '回答を変更', premium: '書類ロードマップを見る', informationBasis: '結果について', policyChecked: '政策情報の確認日', scoreGuide: 'スコアについて', scoreGuideBody: '適合度はプロフィールと要件の一致、準備度は現在満たしている条件を示します。', legalTitle: '申請前の確認', emptyTitle: 'もう少し情報が必要です', emptyBody: '回答を変更するか個別確認をご利用ください。', backToResults: '結果一覧へ', overview: 'ルート概要', preparationTimeline: '準備の流れ', whatHelps: '現在有利な条件', nextActions: '次にすること' },
};

const vi: PlannerUiCopy = {
  ...en,
  nav: { section: 'Lộ trình visa', signIn: 'Đăng nhập', myAccount: 'Tài khoản' },
  intro: { eyebrow: 'Kiểm tra trước khi nộp hồ sơ', title: 'Tìm lộ trình thực tế để học tập hoặc làm việc tại Hàn Quốc', body: 'Cho chúng tôi biết học vấn, kinh nghiệm, tiếng Hàn và mục tiêu. Chúng tôi sẽ so sánh lộ trình phù hợp và điều cần chuẩn bị tiếp theo.', noAccount: 'Xem kết quả trước khi tạo tài khoản', privateAnswers: 'Câu trả lời không được chia sẻ với doanh nghiệp.' },
  steps: ['Thông tin', 'Học vấn', 'Mục tiêu', 'Kinh nghiệm', 'Xác nhận'],
  stepTitles: ['Bạn đang bắt đầu từ đâu?', 'Hãy cho biết về học vấn', 'Bạn muốn đạt được điều gì tại Hàn Quốc?', 'Thêm tiếng Hàn và kinh nghiệm làm việc', 'Kiểm tra câu trả lời'],
  stepBodies: ['Quốc tịch và nơi cư trú ảnh hưởng đến lộ trình visa.', 'Bằng cấp và chuyên ngành giúp so sánh lộ trình du học và việc làm.', 'Chúng tôi cân nhắc tốc độ, chi phí và độ ổn định bạn ưu tiên.', 'Thông tin này cho biết điều đã đáp ứng và cần cải thiện.', 'Bạn có thể sửa trước khi xem kết quả.'],
  fields: { ...en.fields, nationality: 'Quốc tịch', residence: 'Quốc gia đang cư trú', age: 'Tuổi', ethnicKorean: 'Tôi có thể có nguồn gốc Hàn kiều', ethnicKoreanHelp: 'Điều này có thể mở thêm lộ trình. Giấy tờ sẽ được kiểm tra sau.', education: 'Học vấn cao nhất', field: 'Chuyên ngành hoặc lĩnh vực', major: 'Tên chuyên ngành hoặc bằng cấp', majorPlaceholder: 'Ví dụ: Kỹ thuật máy tính', degreeDocument: 'Tôi có thể chuẩn bị bằng hoặc giấy chứng nhận tốt nghiệp', degreeDocumentHelp: 'Chưa cần tải lên. Chỉ yêu cầu khi lộ trình cần chứng minh.', goal: 'Mục tiêu chính', priority: 'Điều quan trọng nhất', budget: 'Ngân sách cho năm đầu', budgetHelp: 'Ước tính là đủ để so sánh học phí và chi phí ban đầu.', topik: 'Cấp TOPIK', kiip: 'Giai đoạn KIIP', experience: 'Kinh nghiệm toàn thời gian', occupation: 'Công việc mong muốn tại Hàn Quốc', occupationPlaceholder: 'Ví dụ: Lập trình viên, thợ hàn, nhân viên khách sạn', currentVisa: 'Visa Hàn Quốc hiện tại', currentVisaPlaceholder: 'Ví dụ: D-2, D-10', select: 'Chọn một mục', optional: 'Không bắt buộc', yes: 'Có', no: 'Không', none: 'Không có' },
  review: { about: 'Thông tin', education: 'Học vấn', goal: 'Mục tiêu và ngân sách', experience: 'Ngôn ngữ và kinh nghiệm', edit: 'Sửa', missing: 'Chưa nhập' },
  receiveTitle: 'Kết quả sẽ cho biết', receiveItems: ['Lộ trình phù hợp nhất', 'Thời gian, chi phí và chuỗi visa dự kiến', 'Điều cần cải thiện trước khi nộp'],
  actions: { back: 'Quay lại', next: 'Tiếp tục', submit: 'Xem lựa chọn đến Hàn Quốc', submitting: 'Đang so sánh lựa chọn...', error: 'Không thể kiểm tra lộ trình. Vui lòng thử lại.' },
  status: { retry: 'Thử lại', loadError: 'Không thể tải kết quả này.', notFound: 'Kết quả không tồn tại hoặc không còn khả dụng.', forbidden: 'Kết quả thuộc về tài khoản hoặc trình duyệt khác.', invalidPathway: 'Lộ trình này không có trong kết quả đã lưu.', saveAlreadyOwned: 'Kế hoạch này đã được lưu.', saveRoleError: 'Chỉ tài khoản cá nhân mới có thể lưu.', saveForbidden: 'Không thể lưu kết quả từ tài khoản hoặc trình duyệt này.', saveConflict: 'Cần thông tin của trình duyệt đã tạo kết quả.', saveNetwork: 'Chưa lưu kết quả. Hãy kiểm tra kết nối và thử lại.' },
  history: { title: 'Kế hoạch visa đã lưu', subtitle: 'Mở lại kết quả và tiếp tục chuẩn bị.', newPlan: 'Kế hoạch mới', loginTitle: 'Đăng nhập để xem kế hoạch đã lưu', loginAction: 'Đăng nhập', emptyTitle: 'Chưa có kế hoạch đã lưu', emptyBody: 'Hoàn thành kế hoạch visa và lưu vào tài khoản.', routeCount: 'lộ trình', open: 'Mở kết quả' },
  result: { ...en.result, eyebrow: 'Kết quả dành cho bạn', title: 'Các lộ trình thực tế nhất đến Hàn Quốc', subtitle: 'So sánh thời gian, chi phí và điều kiện chuẩn bị.', bestMatch: 'Phù hợp nhất', otherOptions: 'Lộ trình khác nên cân nhắc', fit: 'Độ phù hợp', readiness: 'Mức sẵn sàng', time: 'Thời gian', monthUnit: 'tháng', timeline: 'Thời gian dự kiến', cost: 'Chi phí chuẩn bị dự kiến', visaRoute: 'Lộ trình visa tham khảo', whyItFits: 'Vì sao nên xem xét', toPrepare: 'Điều cần chuẩn bị', detail: 'Xem chi tiết', expertReview: 'Nên kiểm tra hồ sơ riêng', keepTitle: 'Lưu kết quả để tiếp tục chuẩn bị', keepBody: 'Quay lại lộ trình và danh sách chuẩn bị bất cứ lúc nào.', save: 'Lưu kết quả', saved: 'Đã lưu', saving: 'Đang lưu...', loginToSave: 'Đăng nhập để lưu', restart: 'Sửa câu trả lời', premium: 'Xem lộ trình giấy tờ', informationBasis: 'Về kết quả', policyChecked: 'Ngày kiểm tra chính sách', policyVersion: 'Phiên bản tham khảo', policyReviewRequired: 'Cần kiểm tra nguồn chính thức', informationOnly: 'Chỉ dùng để tham khảo', scoreGuide: 'Cách tính điểm', scoreGuideBody: 'Độ phù hợp so sánh hồ sơ với yêu cầu; mức sẵn sàng cho biết điều kiện đã đáp ứng.', legalTitle: 'Trước khi nộp hồ sơ', emptyTitle: 'Cần thêm một ít thông tin', emptyBody: 'Hãy đổi câu trả lời hoặc yêu cầu kiểm tra hồ sơ.', backToResults: 'Quay lại tất cả lộ trình', overview: 'Tổng quan lộ trình', preparationTimeline: 'Trình tự chuẩn bị', whatHelps: 'Điểm thuận lợi hiện tại', nextActions: 'Việc nên làm tiếp theo' },
};

const th: PlannerUiCopy = {
  ...en,
  nav: { section: 'วางแผนวีซ่า', signIn: 'เข้าสู่ระบบ', myAccount: 'บัญชีของฉัน' },
  intro: { eyebrow: 'ตรวจสอบก่อนสมัคร', title: 'ค้นหาเส้นทางที่เป็นจริงเพื่อเรียนหรือทำงานในเกาหลี', body: 'บอกเราเกี่ยวกับการศึกษา ประสบการณ์ ภาษาเกาหลี และเป้าหมาย เราจะเปรียบเทียบเส้นทางและสิ่งที่ควรเตรียมต่อไป', noAccount: 'ดูผลลัพธ์ได้ก่อนสร้างบัญชี', privateAnswers: 'คำตอบของคุณจะไม่ถูกเปิดเผยต่อนายจ้าง' },
  steps: ['ข้อมูลคุณ', 'การศึกษา', 'เป้าหมาย', 'ประสบการณ์', 'ตรวจสอบ'],
  stepTitles: ['ตอนนี้คุณอยู่ในสถานการณ์ใด?', 'บอกเราเกี่ยวกับการศึกษาของคุณ', 'คุณต้องการอะไรในเกาหลี?', 'เพิ่มภาษาและประสบการณ์ทำงาน', 'ตรวจสอบคำตอบ'],
  stepBodies: ['สัญชาติและประเทศที่พำนักมีผลต่อเส้นทางวีซ่า', 'วุฒิและสาขาช่วยเปรียบเทียบเส้นทางเรียนและงานทักษะ', 'เราจะคำนึงถึงความเร็ว ค่าใช้จ่าย และความมั่นคง', 'ข้อมูลนี้ช่วยแยกสิ่งที่ผ่านแล้วและสิ่งที่ต้องพัฒนา', 'แก้ไขคำตอบได้ก่อนดูผลลัพธ์'],
  fields: { ...en.fields, nationality: 'สัญชาติ', residence: 'ประเทศที่พำนักปัจจุบัน', age: 'อายุ', ethnicKorean: 'ฉันอาจมีเชื้อสายเกาหลีโพ้นทะเล', ethnicKoreanHelp: 'อาจมีเส้นทางเพิ่มเติม โดยตรวจเอกสารภายหลัง', education: 'การศึกษาสูงสุด', field: 'สาขาเรียนหรือสายงาน', major: 'ชื่อสาขาหรือวุฒิ', majorPlaceholder: 'เช่น วิศวกรรมคอมพิวเตอร์', degreeDocument: 'ฉันสามารถเตรียมวุฒิหรือใบรับรองจบการศึกษา', degreeDocumentHelp: 'ยังไม่ต้องอัปโหลด จะขอเมื่อเส้นทางนั้นต้องใช้', goal: 'เป้าหมายหลัก', priority: 'สิ่งสำคัญที่สุด', budget: 'เงินสำหรับปีแรก', budgetHelp: 'ใช้ตัวเลขโดยประมาณเพื่อเทียบค่าเรียนและค่าครองชีพเริ่มต้น', topik: 'ระดับ TOPIK', kiip: 'ระดับ KIIP', experience: 'ประสบการณ์งานเต็มเวลา', occupation: 'งานที่ต้องการทำในเกาหลี', occupationPlaceholder: 'เช่น นักพัฒนาซอฟต์แวร์ ช่างเชื่อม พนักงานโรงแรม', currentVisa: 'วีซ่าเกาหลีปัจจุบัน', currentVisaPlaceholder: 'เช่น D-2, D-10', select: 'เลือกตัวเลือก', optional: 'ไม่บังคับ', yes: 'ใช่', no: 'ไม่', none: 'ไม่มี' },
  review: { about: 'ข้อมูลคุณ', education: 'การศึกษา', goal: 'เป้าหมายและงบ', experience: 'ภาษาและประสบการณ์', edit: 'แก้ไข', missing: 'ไม่ได้ระบุ' },
  receiveTitle: 'ผลลัพธ์จะแสดง', receiveItems: ['เส้นทางที่ตรงกับโปรไฟล์', 'เวลา ค่าใช้จ่าย และลำดับวีซ่า', 'เงื่อนไขที่ควรพัฒนาก่อนสมัคร'],
  actions: { back: 'ย้อนกลับ', next: 'ถัดไป', submit: 'ดูเส้นทางไปเกาหลี', submitting: 'กำลังเปรียบเทียบ...', error: 'ตรวจสอบเส้นทางไม่ได้ กรุณาลองอีกครั้ง' },
  status: { retry: 'ลองอีกครั้ง', loadError: 'ไม่สามารถโหลดผลลัพธ์นี้ได้', notFound: 'ไม่พบผลลัพธ์หรือไม่สามารถเปิดได้แล้ว', forbidden: 'ผลลัพธ์นี้เป็นของบัญชีหรือเบราว์เซอร์อื่น', invalidPathway: 'เส้นทางนี้ไม่อยู่ในผลลัพธ์ที่บันทึก', saveAlreadyOwned: 'แผนนี้บันทึกแล้ว', saveRoleError: 'เฉพาะบัญชีบุคคลเท่านั้นที่บันทึกได้', saveForbidden: 'ไม่สามารถบันทึกจากบัญชีหรือเบราว์เซอร์นี้', saveConflict: 'ต้องใช้ข้อมูลจากเบราว์เซอร์ที่สร้างผลลัพธ์', saveNetwork: 'ยังไม่ได้บันทึก กรุณาตรวจสอบการเชื่อมต่อ' },
  history: { title: 'แผนวีซ่าที่บันทึก', subtitle: 'เปิดผลลัพธ์และเตรียมตัวต่อ', newPlan: 'แผนใหม่', loginTitle: 'เข้าสู่ระบบเพื่อดูแผนที่บันทึก', loginAction: 'เข้าสู่ระบบ', emptyTitle: 'ยังไม่มีแผนที่บันทึก', emptyBody: 'ทำแผนวีซ่าให้เสร็จและบันทึกไว้', routeCount: 'เส้นทาง', open: 'เปิดผลลัพธ์' },
  result: { ...en.result, eyebrow: 'ผลลัพธ์สำหรับคุณ', title: 'เส้นทางที่เป็นจริงที่สุดสู่เกาหลี', subtitle: 'เปรียบเทียบเวลา ค่าใช้จ่าย และสิ่งที่ต้องเตรียม', bestMatch: 'เหมาะที่สุด', otherOptions: 'เส้นทางอื่นที่ควรพิจารณา', fit: 'ความเหมาะสม', readiness: 'ความพร้อม', time: 'เวลา', monthUnit: 'เดือน', timeline: 'เวลาที่คาด', cost: 'ค่าเตรียมการโดยประมาณ', visaRoute: 'เส้นทางวีซ่าที่เป็นไปได้', whyItFits: 'เหตุผลที่เหมาะ', toPrepare: 'สิ่งที่ต้องเตรียม', detail: 'ดูรายละเอียด', expertReview: 'แนะนำให้ตรวจรายกรณี', keepTitle: 'บันทึกผลและเตรียมต่อ', keepBody: 'กลับมาดูเส้นทางและรายการเตรียมได้ทุกเมื่อ', save: 'บันทึกผล', saved: 'บันทึกแล้ว', saving: 'กำลังบันทึก...', loginToSave: 'เข้าสู่ระบบเพื่อบันทึก', restart: 'แก้ไขคำตอบ', premium: 'ดูแผนเอกสาร', informationBasis: 'เกี่ยวกับผลลัพธ์', policyChecked: 'วันที่ตรวจข้อมูลนโยบาย', scoreGuide: 'การคำนวณคะแนน', scoreGuideBody: 'ความเหมาะสมเปรียบเทียบโปรไฟล์กับข้อกำหนด ส่วนความพร้อมแสดงเงื่อนไขที่ผ่านแล้ว', legalTitle: 'ก่อนสมัคร', emptyTitle: 'ต้องการข้อมูลเพิ่มเล็กน้อย', emptyBody: 'เปลี่ยนคำตอบหรือขอให้ตรวจรายกรณี', backToResults: 'กลับไปทุกเส้นทาง', overview: 'ภาพรวมเส้นทาง', preparationTimeline: 'ลำดับการเตรียม', whatHelps: 'จุดที่ได้เปรียบ', nextActions: 'สิ่งที่ควรทำต่อ' },
};

const fil: PlannerUiCopy = {
  ...en,
  nav: { section: 'Visa Planner', signIn: 'Mag-log in', myAccount: 'Aking account' },
  intro: { eyebrow: 'Suriin bago mag-apply', title: 'Hanapin ang praktikal na paraan para mag-aral o magtrabaho sa Korea', body: 'Ilagay ang iyong edukasyon, karanasan, Korean level, at goal. Ikukumpara namin ang mga posibleng route at susunod na paghahanda.', noAccount: 'Tingnan muna ang resulta bago gumawa ng account', privateAnswers: 'Hindi ibinabahagi sa employers ang iyong sagot.' },
  steps: ['Tungkol sa iyo', 'Edukasyon', 'Goal', 'Karanasan', 'Suriin'],
  stepTitles: ['Ano ang iyong kasalukuyang sitwasyon?', 'Ilagay ang iyong edukasyon', 'Ano ang gusto mong makamit sa Korea?', 'Idagdag ang wika at work experience', 'Suriin ang iyong sagot'],
  stepBodies: ['Nakaaapekto ang nationality at tirahan sa available na visa routes.', 'Tumutulong ang degree at field sa paghahambing ng study at skilled-work routes.', 'Isasaalang-alang ang bilis, gastos, at stability na mahalaga sa iyo.', 'Makikita rito ang natutugunan mo na at kailangan pang paghandaan.', 'Maaari mong baguhin ang sagot bago makita ang resulta.'],
  fields: { ...en.fields, nationality: 'Nasyonalidad', residence: 'Bansang tinitirhan ngayon', age: 'Edad', ethnicKorean: 'Maaaring may overseas Korean heritage ako', ethnicKoreanHelp: 'Maaari itong magbukas ng ibang route. Saka na ibe-verify ang documents.', education: 'Pinakamataas na edukasyon', field: 'Field of study o trabaho', major: 'Major o qualification', majorPlaceholder: 'Hal. Computer engineering', degreeDocument: 'Makakakuha ako ng diploma o graduation certificate', degreeDocumentHelp: 'Walang upload ngayon. Hihingin lang kapag kailangan ng route.', goal: 'Pangunahing goal', priority: 'Pinakamahalaga sa akin', budget: 'Pondo para sa unang taon', budgetHelp: 'Estimate lang para ikumpara ang tuition at initial living cost.', topik: 'TOPIK level', kiip: 'KIIP stage', experience: 'Full-time work experience', occupation: 'Trabahong gusto sa Korea', occupationPlaceholder: 'Hal. Software developer, welder, hotel staff', currentVisa: 'Kasalukuyang Korean visa', currentVisaPlaceholder: 'Hal. D-2, D-10', select: 'Pumili', optional: 'Opsyonal', yes: 'Oo', no: 'Hindi', none: 'Wala' },
  review: { about: 'Tungkol sa iyo', education: 'Edukasyon', goal: 'Goal at budget', experience: 'Wika at karanasan', edit: 'Baguhin', missing: 'Hindi inilagay' },
  receiveTitle: 'Makikita sa resulta', receiveItems: ['Routes na tugma sa profile', 'Tinatayang oras, gastos, at visa sequence', 'Mga kailangang ayusin bago mag-apply'],
  actions: { back: 'Bumalik', next: 'Magpatuloy', submit: 'Tingnan ang Korea options', submitting: 'Kinukumpara ang options...', error: 'Hindi ma-check ang routes. Subukan ulit.' },
  status: { retry: 'Subukan ulit', loadError: 'Hindi ma-load ang resultang ito.', notFound: 'Wala o hindi na available ang resultang ito.', forbidden: 'Pag-aari ito ng ibang account o browser.', invalidPathway: 'Wala ang route na ito sa naka-save na resulta.', saveAlreadyOwned: 'Naka-save na ang planong ito.', saveRoleError: 'Individual account lamang ang maaaring mag-save.', saveForbidden: 'Hindi ito maaaring i-save mula sa account o browser na ito.', saveConflict: 'Kailangan ang impormasyon ng browser na gumawa ng resulta.', saveNetwork: 'Hindi na-save ang resulta. Suriin ang koneksyon at subukan ulit.' },
  history: { title: 'Mga naka-save na visa plan', subtitle: 'Buksan ang resulta at ipagpatuloy ang paghahanda.', newPlan: 'Bagong plan', loginTitle: 'Mag-log in para makita ang mga naka-save na plan', loginAction: 'Mag-log in', emptyTitle: 'Wala pang naka-save na plan', emptyBody: 'Tapusin ang visa plan at i-save ito sa account.', routeCount: 'route', open: 'Buksan ang resulta' },
  result: { ...en.result, eyebrow: 'Resulta para sa iyo', title: 'Pinakapraktikal na routes papuntang Korea', subtitle: 'Ikumpara ang oras, gastos, at paghahanda sa bawat option.', bestMatch: 'Pinakatugma', otherOptions: 'Ibang routes na puwedeng tingnan', fit: 'Pagkatugma', readiness: 'Kahandaan', time: 'Oras', monthUnit: 'buwan', timeline: 'Tinatayang oras', cost: 'Tinatayang gastos', visaRoute: 'Posibleng visa route', whyItFits: 'Bakit maaaring tugma', toPrepare: 'Dapat ihanda', detail: 'Tingnan ang detalye', expertReview: 'Inirerekomenda ang case review', keepTitle: 'I-save at ipagpatuloy ang paghahanda', keepBody: 'Balikan ang routes at preparation list anumang oras.', save: 'I-save ang resulta', saved: 'Na-save na', saving: 'Sine-save...', loginToSave: 'Mag-log in para i-save', restart: 'Baguhin ang sagot', premium: 'Tingnan ang document roadmap', informationBasis: 'Tungkol sa resulta', policyChecked: 'Huling check ng policy info', scoreGuide: 'Paano gumagana ang score', scoreGuideBody: 'Ikinukumpara ng fit ang profile sa requirements; ipinapakita ng readiness ang mga kondisyon na natutugunan na.', legalTitle: 'Bago mag-apply', emptyTitle: 'Kailangan pa ng kaunting impormasyon', emptyBody: 'Baguhin ang sagot o humingi ng case review.', backToResults: 'Bumalik sa lahat ng routes', overview: 'Route overview', preparationTimeline: 'Preparation timeline', whatHelps: 'Mga kasalukuyang advantage', nextActions: 'Susunod na gagawin' },
};

export const plannerUiCopy: Record<PlannerLang, PlannerUiCopy> = {
  en,
  ko,
  vi,
  th,
  fil,
};
