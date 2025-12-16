import { FileText } from "lucide-react";

interface TermsHeaderProps {
  title: string;
  lastUpdated: string;
  description: string;
  disclaimer: string;
}

export function TermsAndConditionsHeader({
  title,
  lastUpdated,
  description,
  disclaimer,
}: TermsHeaderProps) {
  return (
    <>
      {/* Blue banner section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white padding-responsive-md">
        <div className="container-responsive text-center">
          <FileText className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6" />
          <h2 className="text-responsive-lg font-bold mb-2 sm:mb-3">{title}</h2>
          <p className="text-blue-100 mb-2 text-sm sm:text-base">
            Last updated: {lastUpdated}
          </p>
          <p className="text-blue-50 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
      </section>

      {/* Info box */}
      <div className="container-responsive py-6 sm:py-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-6 rounded-lg">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            <span className="font-semibold text-blue-600 text-base sm:text-lg">
              ℹ️{" "}
            </span>
            {disclaimer}
          </p>
        </div>
      </div>
    </>
  );
}
