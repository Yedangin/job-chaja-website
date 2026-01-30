export const termsAndConditionsData = {
  header: {
    title: "Terms & Conditions",
    lastUpdated: "February 9, 2025",
    description:
      "Please read these Terms of Service carefully before using Jobchaja platform.",
    disclaimer:
      "By using Jobchaja forms, you agree to these simple terms. Please read them carefully.",
  },
  sections: [
    {
      id: 1,
      title: "Basic Rule",
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
      title: "Deposit System",
      type: "complex",
      subsections: [
        {
          subtitle: "Deposit Requirements",
          table: [
            { label: "Job Seeker (per application):", value: "₩50,000" },
            { label: "Job Seeker bonus (if hired):", value: "Win ₩50,000" },
            { label: "Corporate account opening:", value: "₩50,000" },
            { label: "Corporate per job post:", value: "₩30,000" },
            { label: "Corporate per interview:", value: "₩50,000" },
          ],
        },
        {
          subtitle: "Refund Rules",
          bullets: [
            "Job seeker deposits refunded if not selected within 14 days",
            "Interview deposits refunded within 24 hours after interview",
            "Job post deposits valid for 30 days",
            "Account opening deposit not refundable",
            "No refunds for no-shows or last-minute cancellations",
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
            "Don't apply with fake resumes",
          ],
        },
        {
          subtitle: "As an Employer:",
          bullets: [
            "Post only real job openings",
            "Respond to applicants in a timely manner",
            "Conduct professional interviews",
            "Make hiring decisions fairly",
          ],
        },
      ],
    },
    {
      id: 4,
      title: "What We Don't Allow",
      type: "bullet-list",
      content: [
        "Discrimination of any kind",
        "Harassment or bullying",
        "Spam or unsolicited messages",
        "Sharing inappropriate content",
        "Attempting to bypass the deposit system",
        "Fraudulent activity",
      ],
    },
    {
      id: 5,
      title: "Platform Rules",
      type: "bullet-list",
      content: [
        "We may remove content that violates our rules",
        "We can suspend accounts for serious violations",
        "We may update these terms with 14 days notice",
        "Deposit amounts may change with 30 days notice",
        "We're not responsible for job outcomes after hiring",
      ],
    },
  ],
  footer: {
    platformLinks: ["How it Works", "Deposit System", "Policies"],
    depositLinks: [
      "For Job Seekers",
      "For Companies",
      "Refund Policy",
      "Bonus System",
    ],
    supportLinks: ["Help Center", "Contact Support", "Phone: +82-2-1234-5678"],
  },
};
