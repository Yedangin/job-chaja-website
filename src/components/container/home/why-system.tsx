import { useTranslations } from "next-intl";

export default function WhySystem() {
  const t = useTranslations("HomePage.WhySection");
  return (
    <section className="max-w-7xl mx-auto bg-primary text-white py-16 md:py-24 rounded-2xl">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-6">{t("title")}</h2>
        <p className="text-center text-opacity-90 max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>
    </section>
  );
}
