export const termsAndConditionsData = {
  header: {
    title: "Terms & Conditions",
    lastUpdated: "February 28, 2026",
    description:
      "Please read these Terms of Service carefully before using Jobchaja platform.",
    disclaimer:
      "By using Jobchaja, you agree to these terms. Please read them carefully.",
  },
  sections: [
    {
      id: 1,
      title: "Basic Rules",
      type: "bullet-list",
      content: [
        "You must be at least 18 years old to use our platform",
        "Provide accurate and truthful information in your profile",
        "Don't create fake profiles or accounts",
        "Be respectful to other users",
        "Don't share personal contact information before interviews",
        "Follow all applicable laws and regulations",
      ],
    },
    {
      id: 2,
      title: "Service & Pricing",
      type: "complex",
      subsections: [
        {
          subtitle: "Free Services",
          table: [
            { label: "Part-time job posting:", value: "Free (14 days)" },
            { label: "Full-time job posting:", value: "Free (30 days)" },
            { label: "Basic visa diagnosis:", value: "Free" },
          ],
        },
        {
          subtitle: "Premium Services (Paid)",
          table: [
            { label: "Premium posting (7 days):", value: "₩19,000 (launch price)" },
            { label: "Premium posting (14 days):", value: "₩29,000 (launch price)" },
            { label: "Premium posting (30 days):", value: "₩50,000 (launch price)" },
            { label: "Premium posting (60 days):", value: "₩79,000 (launch price)" },
            { label: "Detailed visa diagnosis:", value: "$10 USD" },
          ],
        },
        {
          subtitle: "Refund Policy",
          bullets: [
            "Premium posting (before activation): Full refund",
            "Premium posting (after activation): Pro-rata refund for remaining days",
            "Visa diagnosis (before result): Full refund",
            "Visa diagnosis (after result): No refund",
            "No refund for violations of Terms of Service",
            "Admin-granted premium: Not eligible for refund",
          ],
        },
      ],
    },
    {
      id: 3,
      title: "Your Responsibilities",
      type: "subsection-list",
      subsections: [
        {
          subtitle: "As a Job Seeker:",
          bullets: [
            "Apply only for jobs you're qualified for",
            "Be on time for scheduled interviews",
            "Keep your profile information updated",
            "Don't apply with fake resumes or visa information",
          ],
        },
        {
          subtitle: "As an Employer:",
          bullets: [
            "Complete company verification before posting jobs",
            "Post only real, lawful job openings",
            "Comply with employment laws (Equal Employment Act, Foreign Workers Act, etc.)",
            "Respond to applicants in a timely manner",
            "Don't impersonate other companies",
          ],
        },
      ],
    },
    {
      id: 4,
      title: "Prohibited Actions",
      type: "bullet-list",
      content: [
        "Discrimination of any kind",
        "Posting illegal job types (entertainment, gambling establishments, etc.)",
        "Impersonating another company or using fake business credentials",
        "Recruitment fraud or scam activities",
        "Harassment or bullying",
        "Spam or unsolicited messages",
        "Attempting to manipulate visa matching results",
        "Abusing premium services or requesting fraudulent refunds",
      ],
    },
    {
      id: 5,
      title: "Enforcement & Penalties",
      type: "subsection-list",
      subsections: [
        {
          subtitle: "For Employers (escalating):",
          bullets: [
            "Step 1: Specific job posting suspended",
            "Step 2: All job postings blocked (up to 30 days)",
            "Step 3: Account temporarily suspended (7-30 days)",
            "Step 4: Permanent ban and forced withdrawal",
          ],
        },
        {
          subtitle: "Premium Service on Violation:",
          bullets: [
            "Premium features immediately revoked upon violation",
            "No refund for remaining premium period if violated",
            "Severe violations may result in immediate permanent ban",
          ],
        },
      ],
    },
    {
      id: 6,
      title: "Platform Rules",
      type: "bullet-list",
      content: [
        "We may remove content that violates our rules",
        "We can suspend accounts for serious violations",
        "We may update these terms with 7 days notice (30 days for unfavorable changes)",
        "Prices may change with 7 days notice; existing purchases are not affected",
        "We're not responsible for job outcomes after hiring",
        "Visa matching results are for reference only — actual visa issuance depends on government authorities",
      ],
    },
  ],
  footer: {
    platformLinks: ["How it Works", "Pricing", "Policies"],
    supportLinks: [
      "Help Center",
      "Contact Support",
      "Email: pch0675@naver.com",
      "Phone: 010-3885-0675",
    ],
  },
};
