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
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          {t("title")}
        </h2>

        <div className="flex gap-3 flex-col md:flex-row">
          {data?.map((termPolicy, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-lg flex gap-6 w-fit"
            >
              {/* ICON */}
              <div className="bg-primary w-20 h-20 flex items-center justify-center rounded-xl">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Image
                    src={termPolicy.icon}
                    width={40}
                    height={40}
                    unoptimized
                    alt={termPolicy.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* CONTENT */}
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
