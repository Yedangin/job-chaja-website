import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function TermsPolicies() {
  const t = useTranslations("HomePage.Terms&PolicySection");

  type TermPolicyType = {
    id: number;
    title: string;
    description: string;
    icon: string;
    url: string;
  };

  const data: TermPolicyType[] = t.raw("items") as TermPolicyType[];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          {t("title")}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {data?.map((termPolicy, index) => (
            <div key={index} className="bg-card p-8 rounded-lg flex gap-6">
              <div className="text-4xl mb-4 bg-primary w-20 h-20 flex items-center justify-center rounded-xl">
                <Image
                  src={termPolicy.icon}
                  width={100}
                  height={100}
                  unoptimized
                  alt={termPolicy.title}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {termPolicy.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {termPolicy.description}
                </p>
                <Link
                  href={termPolicy.url}
                  className="text-primary font-medium hover:underline"
                >
                  {t("btn")} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
