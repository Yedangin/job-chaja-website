import Image from "next/image";

export default function TermsPolicies() {
  type TermPolicyType = {
    id: number;
    title: string;
    description: string;
    icon: string;
  };

  const data: TermPolicyType[] = [
    {
      id: 1,
      title: "Terms & Conditions",
      description:
        "Detailed terms covering deposit requirements, refund policies, user responsibilities, and platform rules",
      icon: "/home/termsNpoliciesIcons/1.png",
    },
    {
      id: 2,
      title: "Privacy Policy",
      description:
        "How we protect your personal information, data usage, and your security rights",
      icon: "/home/termsNpoliciesIcons/1.png",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Terms & Policies
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {data?.map((termPolicy: TermPolicyType, index) => (
            <div key={index} className="bg-card p-8 rounded-lg flex gap-6">
              <div className="text-4xl mb-4 bg-primary w-20 h-20 flex items-center justify-center rounded-xl">
                <Image
                  src={termPolicy?.icon}
                  width={100}
                  height={100}
                  unoptimized
                  alt="JobChaJa-Terms&Policies"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {termPolicy?.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {termPolicy?.description}
                </p>
                <a
                  href="#"
                  className="text-primary font-medium hover:underline"
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}

          {/* <div className="bg-card p-8 rounded-lg">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Privacy Policy
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              How we protect your personal information, data usage, and your
              security rights
            </p>
            <a href="#" className="text-primary font-medium hover:underline">
              Read More →
            </a>
          </div> */}
        </div>
      </div>
    </section>
  );
}
