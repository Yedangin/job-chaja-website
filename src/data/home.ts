export type TagType = {
  id: number;
  title: string;
  description: string;
  pricing?: string;
  icon: string;
};

export type HomeJobType = {
  id: number;
  title: string;
  image: string;
  tags: TagType[];
};

export const HomeAboutJobs: HomeJobType[] = [
  {
    id: 1,
    title: "For Job Seekers",
    image: "/home/detailDeposit.png",
    tags: [
      {
        id: 1,
        title: "Per Job Application",
        description: "your description",
        pricing: "₩50,000 per application",
        icon: "/home/icons/1.png",
      },
      {
        id: 2,
        title: "Win When Hired",
        description:
          "If you get hired through Jobchaja, you WIN ₩50,000 back as a bonus",
        pricing: "Win ₩50,000 bonus",
        icon: "/home/icons/2.png",
      },
      {
        id: 3,
        title: "Refund Policy",
        description:
          "Application deposit refunded if not selected within 14 days. Interview deposits fully refunded after interview.",
        icon: "/home/icons/3.png",
      },
    ],
  },
  {
    id: 2,
    title: "For Corporate Members",
    image: "/home/detailDeposit1.png",
    tags: [
      {
        id: 1,
        title: "Account Opening",
        description: "One-time ₩50,000 deposit when creating corporate account",
        pricing: "₩50,000 one-time",
        icon: "/home/icons/4.png",
      },
      {
        id: 2,
        title: "Per Job Posts",
        description:
          "Pay ₩30,000 for each job posting to ensure genuine position",
        pricing: "₩50,000 per application",
        icon: "/home/icons/5.png",
      },
      {
        id: 3,
        title: "Per Job Application",
        description:
          "Pay ₩50,000 for each scheduled interview to show commitment",
        pricing: "₩50,000 per application",
        icon: "/home/icons/6.png",
      },
      {
        id: 4,
        title: "Per Job Application",
        description:
          "Interview deposits fully refunded after interview completion. Job post deposits valid for 30 days.",
        pricing: "₩50,000 per application",
        icon: "/home/icons/7.png",
      },
    ],
  },
];



