import Image from "next/image";
import { useTranslations } from "next-intl";

export default function MobileApp() {
  const t = useTranslations("HomePage.MobileAppSection");

  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6 text-primary">
          {t("titleLine1")}
          <br />
          <span className="text-primary">{t("titleLine2")}</span>
        </h2>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t("description")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="shadow-md px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition flex items-center justify-center gap-2">
            <span>
              <Image
                src={"/home/apple.png"}
                width={100}
                height={100}
                unoptimized
                alt={t("iosAlt")}
                className="w-10"
              />
            </span>
            <div>
              <p className="text-sm">{t("iosDownloadText")}</p>
              <p className="text-xl font-semibold">{t("iosStore")}</p>
            </div>
          </button>

          <button className="shadow-md px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition flex items-center justify-center gap-2">
            <span>
              <Image
                src={"/home/googlePlay.png"}
                width={100}
                height={100}
                unoptimized
                alt={t("androidAlt")}
                className="w-10"
              />
            </span>
            <div>
              <p className="text-sm">{t("androidDownloadText")}</p>
              <p className="text-xl font-semibold">{t("androidStore")}</p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
