import type { LaunchLocale } from "@/i18n/locales";

export const FAQ_CATEGORIES = [
  "all",
  "account",
  "job-posting",
  "payment",
  "visa-matching",
  "other",
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];
export type FaqItemCategory = Exclude<FaqCategory, "all">;

type FaqTranslation = {
  question: string;
  answer: string;
};

export type CompanyFaqItem = {
  id: string;
  category: FaqItemCategory;
  reviewedAt: string;
  translations: Record<LaunchLocale, FaqTranslation>;
};

type CompanyFaqCopy = {
  title: string;
  subtitle: string;
  searchLabel: string;
  searchPlaceholder: string;
  clearSearch: string;
  categoriesLabel: string;
  categoryLabels: Record<FaqCategory, string>;
  resultCount: (count: number) => string;
  emptyTitle: (query: string) => string;
  emptyBody: string;
  reset: string;
  answerLabel: string;
  openAnswer: (question: string) => string;
  closeAnswer: (question: string) => string;
  reviewedAt: (date: string) => string;
  policyNoticeTitle: string;
  policyNoticeBody: string;
  contactTitle: string;
  contactBody: string;
  contactAction: string;
};

export const COMPANY_FAQ_COPY: Record<LaunchLocale, CompanyFaqCopy> = {
  ko: {
    title: "자주 묻는 질문",
    subtitle:
      "기업 회원이 자주 찾는 가입, 채용, 결제, 비자 매칭 정보를 확인하세요.",
    searchLabel: "FAQ 검색",
    searchPlaceholder: "질문 또는 답변 검색",
    clearSearch: "검색어 지우기",
    categoriesLabel: "FAQ 카테고리",
    categoryLabels: {
      all: "전체",
      account: "가입·인증",
      "job-posting": "공고 등록",
      payment: "결제·열람권",
      "visa-matching": "비자 매칭",
      other: "기타",
    },
    resultCount: (count) => `질문 ${count}개`,
    emptyTitle: (query) => `“${query}” 검색 결과가 없습니다`,
    emptyBody: "다른 검색어를 입력하거나 전체 카테고리에서 다시 찾아보세요.",
    reset: "검색 및 필터 초기화",
    answerLabel: "답변",
    openAnswer: (question) => `${question} 답변 열기`,
    closeAnswer: (question) => `${question} 답변 닫기`,
    reviewedAt: (date) => `내용 검토일 ${date}`,
    policyNoticeTitle: "비자 매칭 결과를 최종 법률 판단으로 사용하지 마세요",
    policyNoticeBody:
      "체류자격과 고용 가능 여부는 개인 상황과 최신 정책에 따라 달라질 수 있습니다. 신청 또는 채용 전에 출입국·외국인청이나 자격을 갖춘 전문가에게 최종 확인하세요.",
    contactTitle: "원하는 답변을 찾지 못하셨나요?",
    contactBody:
      "계정과 공고 정보를 포함해 1:1 문의를 남기면 확인 후 답변해 드립니다.",
    contactAction: "1:1 문의하기",
  },
  en: {
    title: "Frequently asked questions",
    subtitle:
      "Find answers about company accounts, job posts, payments, and visa matching.",
    searchLabel: "Search FAQs",
    searchPlaceholder: "Search questions or answers",
    clearSearch: "Clear search",
    categoriesLabel: "FAQ categories",
    categoryLabels: {
      all: "All",
      account: "Account & verification",
      "job-posting": "Job posts",
      payment: "Payments & credits",
      "visa-matching": "Visa matching",
      other: "Other",
    },
    resultCount: (count) =>
      `${count} ${count === 1 ? "question" : "questions"}`,
    emptyTitle: (query) => `No results for “${query}”`,
    emptyBody: "Try another search term or search again in all categories.",
    reset: "Reset search and filters",
    answerLabel: "Answer",
    openAnswer: (question) => `Open the answer to ${question}`,
    closeAnswer: (question) => `Close the answer to ${question}`,
    reviewedAt: (date) => `Content reviewed ${date}`,
    policyNoticeTitle: "Do not treat visa matching as a final legal decision",
    policyNoticeBody:
      "Eligibility to stay and work can change based on personal circumstances and current policy. Confirm with the Korea Immigration Service or a qualified professional before applying or hiring.",
    contactTitle: "Could not find the answer you need?",
    contactBody:
      "Send a one-to-one inquiry with the relevant account and job-post details.",
    contactAction: "Contact support",
  },
  vi: {
    title: "Câu hỏi thường gặp",
    subtitle:
      "Tìm câu trả lời về tài khoản doanh nghiệp, tin tuyển dụng, thanh toán và đối chiếu visa.",
    searchLabel: "Tìm kiếm câu hỏi thường gặp",
    searchPlaceholder: "Tìm trong câu hỏi hoặc câu trả lời",
    clearSearch: "Xóa nội dung tìm kiếm",
    categoriesLabel: "Danh mục câu hỏi thường gặp",
    categoryLabels: {
      all: "Tất cả",
      account: "Tài khoản và xác minh",
      "job-posting": "Tin tuyển dụng",
      payment: "Thanh toán và lượt xem",
      "visa-matching": "Đối chiếu visa",
      other: "Khác",
    },
    resultCount: (count) => `${count} câu hỏi`,
    emptyTitle: (query) => `Không có kết quả cho “${query}”`,
    emptyBody: "Hãy thử từ khóa khác hoặc tìm lại trong tất cả danh mục.",
    reset: "Đặt lại tìm kiếm và bộ lọc",
    answerLabel: "Trả lời",
    openAnswer: (question) => `Mở câu trả lời cho ${question}`,
    closeAnswer: (question) => `Đóng câu trả lời cho ${question}`,
    reviewedAt: (date) => `Nội dung được rà soát ngày ${date}`,
    policyNoticeTitle:
      "Không sử dụng kết quả đối chiếu visa như quyết định pháp lý cuối cùng",
    policyNoticeBody:
      "Điều kiện lưu trú và làm việc có thể thay đổi theo hoàn cảnh cá nhân và chính sách hiện hành. Hãy xác nhận với Cơ quan Xuất nhập cảnh Hàn Quốc hoặc chuyên gia đủ điều kiện trước khi nộp hồ sơ hay tuyển dụng.",
    contactTitle: "Bạn chưa tìm thấy câu trả lời?",
    contactBody:
      "Gửi yêu cầu hỗ trợ riêng kèm thông tin tài khoản và tin tuyển dụng liên quan.",
    contactAction: "Liên hệ hỗ trợ",
  },
  th: {
    title: "คำถามที่พบบ่อย",
    subtitle:
      "ค้นหาคำตอบเกี่ยวกับบัญชีบริษัท ประกาศงาน การชำระเงิน และการจับคู่วีซ่า",
    searchLabel: "ค้นหาคำถามที่พบบ่อย",
    searchPlaceholder: "ค้นหาในคำถามหรือคำตอบ",
    clearSearch: "ล้างคำค้นหา",
    categoriesLabel: "หมวดหมู่คำถามที่พบบ่อย",
    categoryLabels: {
      all: "ทั้งหมด",
      account: "บัญชีและการยืนยัน",
      "job-posting": "ประกาศงาน",
      payment: "การชำระเงินและสิทธิ์ดู",
      "visa-matching": "การจับคู่วีซ่า",
      other: "อื่นๆ",
    },
    resultCount: (count) => `${count} คำถาม`,
    emptyTitle: (query) => `ไม่พบผลลัพธ์สำหรับ “${query}”`,
    emptyBody: "ลองใช้คำค้นหาอื่นหรือค้นหาอีกครั้งในทุกหมวดหมู่",
    reset: "รีเซ็ตการค้นหาและตัวกรอง",
    answerLabel: "คำตอบ",
    openAnswer: (question) => `เปิดคำตอบสำหรับ ${question}`,
    closeAnswer: (question) => `ปิดคำตอบสำหรับ ${question}`,
    reviewedAt: (date) => `ตรวจสอบเนื้อหาเมื่อ ${date}`,
    policyNoticeTitle:
      "อย่าใช้ผลการจับคู่วีซ่าเป็นคำวินิจฉัยทางกฎหมายขั้นสุดท้าย",
    policyNoticeBody:
      "สิทธิ์ในการพำนักและทำงานอาจเปลี่ยนไปตามสถานการณ์ส่วนบุคคลและนโยบายปัจจุบัน โปรดยืนยันกับสำนักงานตรวจคนเข้าเมืองเกาหลีหรือผู้เชี่ยวชาญที่มีคุณสมบัติก่อนสมัครหรือจ้างงาน",
    contactTitle: "ไม่พบคำตอบที่ต้องการใช่ไหม?",
    contactBody:
      "ส่งคำถามแบบตัวต่อตัวพร้อมข้อมูลบัญชีและประกาศงานที่เกี่ยวข้อง",
    contactAction: "ติดต่อฝ่ายช่วยเหลือ",
  },
  fil: {
    title: "Mga madalas itanong",
    subtitle:
      "Hanapin ang sagot tungkol sa company account, job post, bayad, at visa matching.",
    searchLabel: "Maghanap sa FAQ",
    searchPlaceholder: "Maghanap sa tanong o sagot",
    clearSearch: "Burahin ang hinahanap",
    categoriesLabel: "Mga kategorya ng FAQ",
    categoryLabels: {
      all: "Lahat",
      account: "Account at verification",
      "job-posting": "Mga job post",
      payment: "Bayad at viewing credits",
      "visa-matching": "Visa matching",
      other: "Iba pa",
    },
    resultCount: (count) => `${count} ${count === 1 ? "tanong" : "mga tanong"}`,
    emptyTitle: (query) => `Walang resulta para sa “${query}”`,
    emptyBody:
      "Subukan ang ibang salita o maghanap muli sa lahat ng kategorya.",
    reset: "I-reset ang search at filter",
    answerLabel: "Sagot",
    openAnswer: (question) => `Buksan ang sagot sa ${question}`,
    closeAnswer: (question) => `Isara ang sagot sa ${question}`,
    reviewedAt: (date) => `Huling sinuri ang nilalaman noong ${date}`,
    policyNoticeTitle:
      "Huwag ituring ang visa matching bilang pinal na legal na pasya",
    policyNoticeBody:
      "Maaaring magbago ang karapatang manatili at magtrabaho ayon sa personal na sitwasyon at kasalukuyang patakaran. Magkumpirma sa Korea Immigration Service o sa kwalipikadong propesyonal bago mag-apply o kumuha ng empleyado.",
    contactTitle: "Hindi nakita ang sagot na kailangan mo?",
    contactBody:
      "Magpadala ng one-to-one inquiry kasama ang kaugnay na account at detalye ng job post.",
    contactAction: "Makipag-ugnayan sa support",
  },
};

export const COMPANY_FAQ_ITEMS: readonly CompanyFaqItem[] = [
  {
    id: "company-verification",
    category: "account",
    reviewedAt: "2026-08-04",
    translations: {
      ko: {
        question: "기업 인증은 어디에서 진행하나요?",
        answer:
          "기업 인증 메뉴에서 사업자 정보를 입력하고 요청된 증빙 서류를 제출하세요. 제출 후에는 같은 화면에서 심사 상태를 확인할 수 있습니다. 실제로 요구되는 서류는 사업자 유형과 심사 상황에 따라 달라질 수 있습니다.",
      },
      en: {
        question: "Where do I verify my company?",
        answer:
          "Open Company Verification, enter your business details, and submit the requested evidence. You can track the review status on the same page. Required documents may vary by business type and review circumstances.",
      },
      vi: {
        question: "Tôi xác minh doanh nghiệp ở đâu?",
        answer:
          "Mở mục Xác minh doanh nghiệp, nhập thông tin kinh doanh và nộp giấy tờ được yêu cầu. Bạn có thể theo dõi trạng thái xét duyệt trên cùng trang. Giấy tờ cần thiết có thể khác nhau tùy loại hình doanh nghiệp và quá trình xét duyệt.",
      },
      th: {
        question: "ฉันจะยืนยันบริษัทได้ที่ไหน?",
        answer:
          "เปิดเมนูการยืนยันบริษัท กรอกข้อมูลธุรกิจ และส่งเอกสารหลักฐานที่ระบบขอ คุณสามารถติดตามสถานะการตรวจสอบได้ในหน้าเดียวกัน เอกสารที่ต้องใช้อาจต่างกันตามประเภทธุรกิจและสถานการณ์การตรวจสอบ",
      },
      fil: {
        question: "Saan ko mabe-verify ang kumpanya?",
        answer:
          "Buksan ang Company Verification, ilagay ang detalye ng negosyo, at isumite ang hinihinging patunay. Makikita rin sa parehong page ang review status. Maaaring mag-iba ang kailangang dokumento ayon sa uri ng negosyo at review.",
      },
    },
  },
  {
    id: "verification-rejected",
    category: "account",
    reviewedAt: "2026-08-04",
    translations: {
      ko: {
        question: "기업 인증이 반려되면 어떻게 해야 하나요?",
        answer:
          "기업 인증 화면에서 반려 사유를 먼저 확인하세요. 잘못되거나 누락된 정보와 서류를 보완한 뒤 다시 제출할 수 있습니다. 사유가 명확하지 않으면 계정 정보와 함께 1:1 문의를 남겨주세요.",
      },
      en: {
        question: "What should I do if company verification is rejected?",
        answer:
          "Check the rejection reason on the Company Verification page. Correct missing or inaccurate details and documents, then submit again. If the reason is unclear, contact support with your account information.",
      },
      vi: {
        question: "Tôi nên làm gì khi xác minh doanh nghiệp bị từ chối?",
        answer:
          "Hãy kiểm tra lý do từ chối trên trang Xác minh doanh nghiệp. Bổ sung hoặc sửa thông tin và giấy tờ rồi nộp lại. Nếu lý do chưa rõ, hãy liên hệ hỗ trợ kèm thông tin tài khoản.",
      },
      th: {
        question: "ควรทำอย่างไรหากการยืนยันบริษัทถูกปฏิเสธ?",
        answer:
          "ตรวจสอบเหตุผลที่ถูกปฏิเสธในหน้าการยืนยันบริษัท แก้ไขข้อมูลหรือเอกสารที่ขาดหรือไม่ถูกต้องแล้วส่งใหม่ หากเหตุผลไม่ชัดเจน โปรดติดต่อฝ่ายช่วยเหลือพร้อมข้อมูลบัญชี",
      },
      fil: {
        question: "Ano ang gagawin kapag na-reject ang company verification?",
        answer:
          "Tingnan muna ang dahilan sa Company Verification page. Ayusin ang kulang o maling detalye at dokumento, pagkatapos ay magsumite muli. Kung hindi malinaw ang dahilan, kontakin ang support kasama ang account information.",
      },
    },
  },
  {
    id: "create-job-post",
    category: "job-posting",
    reviewedAt: "2026-08-04",
    translations: {
      ko: {
        question: "채용 공고는 어떻게 등록하나요?",
        answer:
          "공고 작성에서 정규직 또는 알바 채용관을 선택한 뒤 회사, 근무지, 업무, 급여와 근무조건을 순서대로 입력하세요. 미리보기에서 내용을 확인하고 게시 심사를 요청할 수 있습니다.",
      },
      en: {
        question: "How do I create a job post?",
        answer:
          "Open Create Job Post and choose full-time or part-time recruitment. Enter the company, workplace, role, pay, and working conditions, review the preview, and submit the post for publication review.",
      },
      vi: {
        question: "Tôi đăng tin tuyển dụng như thế nào?",
        answer:
          "Mở mục Tạo tin tuyển dụng và chọn tuyển toàn thời gian hoặc bán thời gian. Nhập thông tin công ty, nơi làm việc, công việc, lương và điều kiện làm việc, kiểm tra bản xem trước rồi gửi yêu cầu xét duyệt đăng tin.",
      },
      th: {
        question: "ฉันจะสร้างประกาศงานได้อย่างไร?",
        answer:
          "เปิดเมนูสร้างประกาศงานแล้วเลือกงานประจำหรืองานพาร์ตไทม์ กรอกข้อมูลบริษัท สถานที่ทำงาน หน้าที่ ค่าจ้าง และเงื่อนไขการทำงาน ตรวจสอบตัวอย่าง แล้วส่งเพื่อขออนุมัติเผยแพร่",
      },
      fil: {
        question: "Paano gumawa ng job post?",
        answer:
          "Buksan ang Create Job Post at piliin ang full-time o part-time recruitment. Ilagay ang kumpanya, lugar ng trabaho, tungkulin, sahod, at kondisyon sa trabaho. Suriin ang preview at isumite para sa publication review.",
      },
    },
  },
  {
    id: "edit-job-post",
    category: "job-posting",
    reviewedAt: "2026-08-04",
    translations: {
      ko: {
        question: "등록한 공고를 수정하거나 마감할 수 있나요?",
        answer:
          "공고 관리에서 공고 상세를 열어 수정하거나 모집을 마감할 수 있습니다. 근무조건처럼 비자 판단에 영향을 주는 정보를 변경하면 비자 매칭 결과와 게시 상태를 다시 확인해야 할 수 있습니다.",
      },
      en: {
        question: "Can I edit or close a published job post?",
        answer:
          "Open the post from Job Management to edit it or close recruitment. If you change information that affects visa eligibility, such as working conditions, you may need to review the visa result and publication status again.",
      },
      vi: {
        question: "Tôi có thể sửa hoặc đóng tin tuyển dụng đã đăng không?",
        answer:
          "Mở tin trong Quản lý tuyển dụng để chỉnh sửa hoặc kết thúc tuyển dụng. Nếu thay đổi thông tin ảnh hưởng đến điều kiện visa, chẳng hạn điều kiện làm việc, bạn có thể cần kiểm tra lại kết quả visa và trạng thái đăng.",
      },
      th: {
        question: "ฉันแก้ไขหรือปิดประกาศงานที่เผยแพร่แล้วได้หรือไม่?",
        answer:
          "เปิดประกาศจากเมนูจัดการงานเพื่อแก้ไขหรือปิดรับสมัคร หากเปลี่ยนข้อมูลที่มีผลต่อสิทธิ์วีซ่า เช่น เงื่อนไขการทำงาน คุณอาจต้องตรวจสอบผลวีซ่าและสถานะการเผยแพร่อีกครั้ง",
      },
      fil: {
        question: "Maaari ko bang i-edit o isara ang nailathalang job post?",
        answer:
          "Buksan ang post sa Job Management para i-edit o isara ang recruitment. Kapag binago ang impormasyong nakaaapekto sa visa eligibility, gaya ng working conditions, maaaring kailangang suriin muli ang visa result at publication status.",
      },
    },
  },
  {
    id: "viewing-credit-use",
    category: "payment",
    reviewedAt: "2026-08-04",
    translations: {
      ko: {
        question: "인재 열람권은 언제 사용되나요?",
        answer:
          "승인된 기업 계정이 인재채용관에서 공개 이력서의 상세 정보와 연락처를 처음 열 때 열람권 1건이 사용됩니다. 같은 이력서를 다시 보는 경우에는 추가로 차감되지 않습니다.",
      },
      en: {
        question: "When is a talent viewing credit used?",
        answer:
          "One credit is used when an approved company account first opens the full details and contact information of a public resume in the talent pool. Opening the same resume again does not use another credit.",
      },
      vi: {
        question: "Khi nào lượt xem hồ sơ ứng viên được sử dụng?",
        answer:
          "Một lượt xem được sử dụng khi tài khoản doanh nghiệp đã duyệt lần đầu mở thông tin đầy đủ và liên hệ của hồ sơ công khai trong kho ứng viên. Xem lại cùng hồ sơ sẽ không bị trừ thêm.",
      },
      th: {
        question: "สิทธิ์ดูโปรไฟล์ผู้สมัครถูกใช้เมื่อใด?",
        answer:
          "ระบบจะใช้ 1 สิทธิ์เมื่อบัญชีบริษัทที่ผ่านการอนุมัติเปิดรายละเอียดและข้อมูลติดต่อทั้งหมดของเรซูเม่สาธารณะในคลังผู้สมัครเป็นครั้งแรก การเปิดเรซูเม่เดิมอีกครั้งจะไม่หักเพิ่ม",
      },
      fil: {
        question: "Kailan nagagamit ang talent viewing credit?",
        answer:
          "Isang credit ang ginagamit kapag unang binuksan ng aprubadong company account ang buong detalye at contact information ng public resume sa talent pool. Walang dagdag na bawas kapag muling binuksan ang parehong resume.",
      },
    },
  },
  {
    id: "credit-refund",
    category: "payment",
    reviewedAt: "2026-08-04",
    translations: {
      ko: {
        question: "열람권의 유효기간과 환불 기준은 무엇인가요?",
        answer:
          "열람권은 구매일로부터 90일간 유효합니다. 구매 후 7일 이내 환불을 신청할 수 있으며, 일부를 사용한 경우 사용분을 정상가 기준으로 차감한 잔액이 환불됩니다. 최종 조건은 결제 시 표시되는 환불 정책을 확인하세요.",
      },
      en: {
        question: "What are the validity and refund rules for viewing credits?",
        answer:
          "Viewing credits are valid for 90 days from purchase. You may request a refund within 7 days. If some credits were used, their standard-price value is deducted from the refund. Review the refund policy shown at checkout for the final terms.",
      },
      vi: {
        question: "Thời hạn và quy định hoàn tiền của lượt xem hồ sơ là gì?",
        answer:
          "Lượt xem hồ sơ có hiệu lực 90 ngày từ ngày mua. Bạn có thể yêu cầu hoàn tiền trong vòng 7 ngày. Nếu đã dùng một phần, giá trị theo giá tiêu chuẩn của phần đã dùng sẽ được trừ. Hãy xem chính sách hoàn tiền tại bước thanh toán để biết điều khoản cuối cùng.",
      },
      th: {
        question: "อายุการใช้งานและเงื่อนไขคืนเงินของสิทธิ์ดูโปรไฟล์คืออะไร?",
        answer:
          "สิทธิ์ดูโปรไฟล์มีอายุ 90 วันนับจากวันที่ซื้อ คุณสามารถขอคืนเงินได้ภายใน 7 วัน หากใช้ไปบางส่วน มูลค่าตามราคาปกติของส่วนที่ใช้จะถูกหักออก โปรดตรวจสอบนโยบายคืนเงินที่แสดงตอนชำระเงินสำหรับเงื่อนไขสุดท้าย",
      },
      fil: {
        question: "Ano ang validity at refund rules ng viewing credits?",
        answer:
          "Valid ang viewing credits nang 90 araw mula sa pagbili. Maaaring humiling ng refund sa loob ng 7 araw. Kung may nagamit na credits, ibabawas ang halaga ng mga iyon batay sa regular na presyo. Tingnan ang refund policy sa checkout para sa pinal na kondisyon.",
      },
    },
  },
  {
    id: "visa-matching",
    category: "visa-matching",
    reviewedAt: "2026-08-04",
    translations: {
      ko: {
        question: "비자 매칭은 어떤 정보를 사용하나요?",
        answer:
          "공고에 입력한 업종, 사업장, 직무, 고용형태, 급여와 근무조건 등을 현재 적용된 비자 규칙과 비교합니다. 결과의 정확도를 위해 회사 정보와 공고 조건을 실제 계약 내용과 일치하게 입력하세요.",
      },
      en: {
        question: "What information does visa matching use?",
        answer:
          "It compares the industry, workplace, role, employment type, pay, and working conditions in the job post with the visa rules currently applied by the service. Enter information that matches the actual employment terms.",
      },
      vi: {
        question: "Đối chiếu visa sử dụng những thông tin nào?",
        answer:
          "Hệ thống so sánh ngành nghề, nơi làm việc, công việc, loại hợp đồng, lương và điều kiện làm việc trong tin tuyển dụng với quy tắc visa đang được dịch vụ áp dụng. Hãy nhập thông tin đúng với điều kiện tuyển dụng thực tế.",
      },
      th: {
        question: "การจับคู่วีซ่าใช้ข้อมูลอะไรบ้าง?",
        answer:
          "ระบบเปรียบเทียบอุตสาหกรรม สถานที่ทำงาน หน้าที่ รูปแบบการจ้าง ค่าจ้าง และเงื่อนไขการทำงานในประกาศกับกฎวีซ่าที่บริการใช้อยู่ โปรดกรอกข้อมูลให้ตรงกับเงื่อนไขการจ้างจริง",
      },
      fil: {
        question: "Anong impormasyon ang ginagamit sa visa matching?",
        answer:
          "Inihahambing nito ang industriya, workplace, role, employment type, sahod, at working conditions sa job post sa kasalukuyang visa rules na ginagamit ng serbisyo. Ilagay ang impormasyong tugma sa aktuwal na employment terms.",
      },
    },
  },
  {
    id: "visa-result",
    category: "visa-matching",
    reviewedAt: "2026-08-04",
    translations: {
      ko: {
        question: "비자 매칭 결과가 채용 가능 여부를 확정하나요?",
        answer:
          "아니요. 매칭 결과는 입력한 정보에 따른 사전 검토 자료이며 비자 발급, 체류자격 변경 또는 고용 허가를 보장하지 않습니다. 후보자의 체류자격과 개별 조건을 확인한 뒤 관계 기관이나 전문가에게 최종 확인하세요.",
      },
      en: {
        question: "Does a visa match confirm that I can hire the candidate?",
        answer:
          "No. A match is a preliminary assessment based on the information entered. It does not guarantee visa issuance, a change of status, or employment permission. Check the candidate’s status and confirm with the relevant authority or a qualified professional.",
      },
      vi: {
        question:
          "Kết quả đối chiếu visa có xác nhận tôi được phép tuyển ứng viên không?",
        answer:
          "Không. Kết quả chỉ là đánh giá sơ bộ dựa trên thông tin đã nhập và không bảo đảm việc cấp visa, đổi tư cách lưu trú hoặc cấp phép lao động. Hãy kiểm tra tình trạng của ứng viên và xác nhận với cơ quan liên quan hoặc chuyên gia đủ điều kiện.",
      },
      th: {
        question: "ผลการจับคู่วีซ่ายืนยันว่าฉันจ้างผู้สมัครได้หรือไม่?",
        answer:
          "ไม่ ผลดังกล่าวเป็นเพียงการประเมินเบื้องต้นจากข้อมูลที่กรอก และไม่รับประกันการออกวีซ่า การเปลี่ยนสถานะพำนัก หรือการอนุญาตทำงาน โปรดตรวจสอบสถานะของผู้สมัครและยืนยันกับหน่วยงานที่เกี่ยวข้องหรือผู้เชี่ยวชาญ",
      },
      fil: {
        question:
          "Kinukumpirma ba ng visa match na maaari kong kunin ang aplikante?",
        answer:
          "Hindi. Paunang assessment lamang ito batay sa inilagay na impormasyon. Hindi nito ginagarantiya ang visa issuance, change of status, o employment permission. Suriin ang status ng aplikante at magkumpirma sa kaukulang ahensiya o kwalipikadong propesyonal.",
      },
    },
  },
  {
    id: "visa-policy-updates",
    category: "visa-matching",
    reviewedAt: "2026-08-04",
    translations: {
      ko: {
        question: "비자 정책이 바뀌면 이전 매칭 결과도 유효한가요?",
        answer:
          "정책이나 행정 해석이 변경되면 이전 결과가 달라질 수 있습니다. 채용 절차를 시작하거나 계약 조건을 바꾸기 전에 공고를 다시 분석하고, 결과에 표시된 정책 기준일과 공식 안내를 함께 확인하세요.",
      },
      en: {
        question:
          "Is an earlier visa result still valid after a policy change?",
        answer:
          "A previous result may change when policy or administrative interpretation changes. Run the analysis again before starting the hiring process or changing contract terms, and check both the policy reference date and official guidance.",
      },
      vi: {
        question:
          "Kết quả visa trước đây còn hiệu lực sau khi chính sách thay đổi không?",
        answer:
          "Kết quả trước đây có thể thay đổi khi chính sách hoặc cách giải thích hành chính thay đổi. Hãy phân tích lại trước khi bắt đầu tuyển dụng hoặc thay đổi điều khoản hợp đồng, đồng thời kiểm tra ngày tham chiếu chính sách và hướng dẫn chính thức.",
      },
      th: {
        question: "ผลวีซ่าเดิมยังใช้ได้หลังนโยบายเปลี่ยนหรือไม่?",
        answer:
          "ผลเดิมอาจเปลี่ยนเมื่อมีการเปลี่ยนนโยบายหรือการตีความทางปกครอง โปรดวิเคราะห์อีกครั้งก่อนเริ่มการจ้างหรือเปลี่ยนเงื่อนไขสัญญา และตรวจสอบทั้งวันที่อ้างอิงนโยบายกับคำแนะนำทางการ",
      },
      fil: {
        question:
          "Valid pa ba ang dating visa result pagkatapos magbago ang policy?",
        answer:
          "Maaaring magbago ang dating resulta kapag nagbago ang policy o administrative interpretation. Patakbuhin muli ang analysis bago simulan ang hiring o baguhin ang contract terms, at tingnan ang policy reference date at opisyal na guidance.",
      },
    },
  },
  {
    id: "technical-support",
    category: "other",
    reviewedAt: "2026-08-04",
    translations: {
      ko: {
        question: "서비스 이용 중 오류가 발생하면 무엇을 보내야 하나요?",
        answer:
          "1:1 문의에 오류가 발생한 시간, 사용한 화면과 기능, 재현 순서, 기기와 브라우저 정보, 개인정보를 가린 스크린샷을 포함해 주세요. 결제 오류라면 주문번호를 함께 보내되 카드번호 전체는 입력하지 마세요.",
      },
      en: {
        question: "What should I send when reporting a technical problem?",
        answer:
          "Include the time, page and feature used, steps to reproduce, device and browser, and a screenshot with personal information hidden. For payment issues, include the order number but never send a full card number.",
      },
      vi: {
        question: "Tôi nên gửi gì khi báo lỗi kỹ thuật?",
        answer:
          "Hãy cung cấp thời gian xảy ra lỗi, trang và tính năng đã dùng, các bước tái hiện, thiết bị, trình duyệt và ảnh chụp đã che thông tin cá nhân. Với lỗi thanh toán, hãy gửi mã đơn hàng nhưng không bao giờ gửi đầy đủ số thẻ.",
      },
      th: {
        question: "ฉันควรส่งข้อมูลอะไรเมื่อรายงานปัญหาทางเทคนิค?",
        answer:
          "ระบุเวลา หน้าและฟังก์ชันที่ใช้ ขั้นตอนการเกิดปัญหาซ้ำ อุปกรณ์ เบราว์เซอร์ และภาพหน้าจอที่ปิดบังข้อมูลส่วนบุคคล สำหรับปัญหาการชำระเงินให้ระบุหมายเลขคำสั่งซื้อ แต่อย่าส่งหมายเลขบัตรเต็ม",
      },
      fil: {
        question:
          "Ano ang dapat ipadala kapag nagrereport ng technical problem?",
        answer:
          "Isama ang oras, page at feature na ginamit, steps para maulit ang problema, device at browser, at screenshot na nakatago ang personal information. Para sa payment issue, isama ang order number ngunit huwag ipadala ang buong card number.",
      },
    },
  },
];

export function getCompanyFaqTranslation(
  item: CompanyFaqItem,
  locale: LaunchLocale,
) {
  return item.translations[locale] ?? item.translations.en;
}

function normalizeSearchText(value: string) {
  return value.normalize("NFKC").trim().toLocaleLowerCase();
}

export function filterCompanyFaqItems(
  items: readonly CompanyFaqItem[],
  locale: LaunchLocale,
  category: FaqCategory,
  query: string,
) {
  const normalizedQuery = normalizeSearchText(query);

  return items.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (!normalizedQuery) return true;

    const translation = getCompanyFaqTranslation(item, locale);
    return normalizeSearchText(
      `${translation.question} ${translation.answer}`,
    ).includes(normalizedQuery);
  });
}

export function getCompanyFaqCounts(items: readonly CompanyFaqItem[]) {
  const counts: Record<FaqCategory, number> = {
    all: items.length,
    account: 0,
    "job-posting": 0,
    payment: 0,
    "visa-matching": 0,
    other: 0,
  };

  for (const item of items) counts[item.category] += 1;
  return counts;
}
