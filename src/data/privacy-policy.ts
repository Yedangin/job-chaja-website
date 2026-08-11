export const privacyPolicyData = {
  header: {
    title: "Privacy Policy",
    lastUpdated: "August 4, 2026",
    description: "Easy to understand privacy practices.",
    disclaimer:
      "We protect your privacy. This policy explains how we handle your information in simple terms.",
  },
  sections: [
    {
      id: 1,
      title: "Information We Collect",
      type: "complex",
      subsections: [
        {
          subtitle: "Basic Information",
          bullets: [
            "Profile Info: Name, email, nationality, visa type",
            "Job Seeker: Resume, education, work experience, qualifications",
            "Employer: Company name, business registration number, industry, workforce size",
            "Employer identity verification: verified name, mobile number, CI and DI (collected with separate consent for manager verification and duplicate-account prevention)",
          ],
        },
        {
          subtitle: "Payment Info",
          bullets: [
            "Payment provider transaction IDs, product, amount, currency, payment status, and refund records",
            "Card and bank-account credentials are processed by PortOne and the selected payment provider and are not stored directly by JobChaja",
          ],
        },
        {
          subtitle: "Sensitive Information (Separate Consent)",
          bullets: [
            "Visa documents and other sensitive information are collected only for a feature the user chooses and only after the required separate consent and access controls are applied",
          ],
        },
        {
          subtitle: "Automatic Collection",
          bullets: [
            "IP address, cookies, access time, device info (for security and service improvement)",
          ],
        },
      ],
    },
    {
      id: 2,
      title: "How We Use Your Information",
      type: "bullet-list",
      content: [
        "To create and manage your account",
        "To match you with jobs or candidates via visa matching",
        "To process payments, cancellations, and refunds",
        "To send you important service notifications",
        "To improve our platform and user experience",
        "To prevent fraud and ensure security",
        "To provide visa diagnosis services",
      ],
    },
    {
      id: 3,
      title: "Information Sharing",
      type: "bullet-list",
      content: [
        "Job application info shared with the employer you apply to",
        "PortOne, Danal, payment providers, and OAuth providers when you choose the related identity, payment, or social-login feature",
        "Cloud hosting: AWS (Seoul region server + Lightsail)",
        "Email delivery: AWS SES",
        "Notifications: Kakao Corp. (KakaoTalk Alimtalk, Phase 2)",
        "Development support: Yedangin Co., Ltd. (Myanmar) via encrypted VPN/SSH",
        "Required by law or to protect rights",
        "We NEVER sell your personal information",
      ],
    },
    {
      id: 4,
      title: "International Data Transfer",
      type: "bullet-list",
      content: [
        "Yedangin Co., Ltd. (Myanmar): Platform development and maintenance \u2014 Items transferred: source code, anonymized test data (no personal info in production); Purpose: software development support; Retention: project duration; Transfer method: encrypted VPN/SSH",
        "Payment and social-login providers: transaction or authentication data required for the feature selected by the user",
        "AWS (USA headquarters / Seoul region servers): Cloud infrastructure and email services",
        "All transfers use encrypted communication (SSL/TLS, SSH, VPN)",
        "Contracts with all providers include privacy protection obligations",
        "IMPORTANT: International data transfer requires separate consent at sign-up (Personal Information Protection Act §17). This consent is collected as a mandatory item distinct from general data collection consent.",
        "Consent categories at sign-up: (1) [Required] Terms of Service, (2) [Required] Personal Data Collection & Use, (3) [Required] International Data Transfer, (4) [Optional] Marketing Communications",
      ],
    },
    {
      id: 5,
      title: "Data Retention",
      type: "bullet-list",
      content: [
        "Active accounts: While you use our service",
        "After withdrawal: Account recoverable for 90 days (soft delete); minimal identifiers (email hash, activity logs) retained up to 6 months for fraud prevention, then permanently deleted",
        "Visa diagnosis results: 1 year after completion",
        "Payment/transaction records: 5 years (e-commerce law)",
        "Verified identity information (name, mobile number, encrypted CI/DI): until account withdrawal or consent withdrawal; deleted immediately when account deletion is requested unless another law requires retention",
        "Identity verification attempt records: 30 days, then automatically deleted",
        "Consumer complaint records: 3 years",
        "Login records: 3 months (telecommunications law)",
        "System logs (request/error logs): 90\u2013180 days for security monitoring",
        "Inactive accounts: Separated after 1 year of inactivity",
        "You can request deletion of your data anytime",
      ],
    },
    {
      id: 6,
      title: "Your Privacy Rights",
      type: "bullet-list",
      content: [
        "See what information we have about you",
        "Correct inaccurate information",
        "Delete your account and data",
        "Request to stop processing your information",
        "Withdraw consent (including sensitive info consent) at any time",
        "Rights can be exercised by you or an authorized representative",
        "We respond within 10 days of receiving your request",
      ],
    },
    {
      id: 7,
      title: "Security",
      type: "bullet-list",
      content: [
        "Encrypted data transmission (SSL/TLS) and storage (AES-256)",
        "Passwords hashed with bcrypt (one-way encryption)",
        "Payment credentials are handled by approved payment providers; CI and DI are encrypted with AES-256-GCM and never returned to the client or application logs",
        "Minimum-privilege access control for all personnel",
        "Regular security audits and monitoring",
      ],
    },
    {
      id: 8,
      title: "Cookies",
      type: "bullet-list",
      content: [
        "Essential cookies: Required for login and basic functions",
        "Preference cookies: Remember your settings",
        "Non-essential analytics and marketing cookies are disabled until approved",
        "You can control cookies in your browser settings",
      ],
    },
    {
      id: 9,
      title: "Automated Decision-Making",
      type: "bullet-list",
      content: [
        "Our visa matching engine automatically evaluates which visa holders can be hired for each job posting. This affects which jobs you see and which candidates employers can access",
        "For explanation, correction, and audit, each assessment records its calculation time, policy and rule versions, applied rule identifiers, minimum necessary input categories, outcome, and reasons; unique identification numbers, passport numbers, raw OCR text, and document file paths are excluded from the decision log",
        "You have the right to know that automated visa matching is being used",
        "You have the right to request an explanation of how the matching decision was made",
        "You have the right to request human review of an automated decision",
        "Automated matching results are reference information only; final visa decisions are made by the Immigration Office",
        "To exercise these rights, contact our privacy officer at pch0675@naver.com",
      ],
    },
    {
      id: 10,
      title: "Chief Privacy Officer (CPO)",
      type: "bullet-list",
      content: [
        "CPO: Park Chanho (\ubc15\ucc2c\ud638), CEO",
        "Email: pch0675@naver.com",
        "Phone: 070-8095-4474",
        "The CPO is responsible for handling all privacy-related inquiries, complaints, and data subject requests",
        "Response to privacy inquiries: within 10 business days",
      ],
    },
  ],
  footer: {
    platformLinks: ["How it Works", "Pricing", "Policies"],
    supportLinks: [
      "Help Center",
      "Contact Support",
      "Email: pch0675@naver.com",
      "Phone: 070-8095-4474",
    ],
    externalLinks: [
      "KISA Privacy Center: privacy.kisa.or.kr (Tel: 118)",
      "Supreme Prosecutors' Office Cyber Division: spo.go.kr (Tel: 1301)",
      "National Police Cyber Bureau: cyberbureau.police.go.kr (Tel: 182)",
    ],
  },
};
