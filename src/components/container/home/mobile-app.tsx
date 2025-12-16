import Image from "next/image";
import { useTranslations } from "next-intl";

export default function MobileApp() {
  const t = useTranslations("HomePage.MobileAppSection");

  return (
    <section className="bg-secondary padding-responsive-md">
      <div className="container-responsive text-center">
        <h2 className="text-responsive-lg font-bold mb-4 sm:mb-6 text-primary">
          {t("titleLine1")}
          <br />
          <span className="text-primary">{t("titleLine2")}</span>
        </h2>

        <p className="text-responsive-sm text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
          {t("description")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
          <button className="bg-white shadow-md px-4 sm:px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
            <span className="flex-shrink-0">
              <Image
                src={"/home/apple.png"}
                width={40}
                height={40}
                unoptimized
                alt={t("iosAlt")}
                className="w-8 sm:w-10"
              />
            </span>
            <div className="text-left">
              <p className="text-xs sm:text-sm text-gray-600">
                {t("iosDownloadText")}
              </p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">
                {t("iosStore")}
              </p>
            </div>
          </button>

          <button className="bg-white shadow-md px-4 sm:px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
            <span className="flex-shrink-0">
              <Image
                src={"/home/googlePlay.png"}
                width={40}
                height={40}
                unoptimized
                alt={t("androidAlt")}
                className="w-8 sm:w-10"
              />
            </span>
            <div className="text-left">
              <p className="text-xs sm:text-sm text-gray-600">
                {t("androidDownloadText")}
              </p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">
                {t("androidStore")}
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
