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
      {/* Header with logo and button */}
      {/* <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-500">Jobchaja</h1>
        <button className="px-6 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition">
          Get Started
        </button>
      </header> */}

      {/* Blue banner section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FileText className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-3">{title}</h2>
          <p className="text-blue-100 mb-2">Last updated: {lastUpdated}</p>
          <p className="text-blue-50">{description}</p>
        </div>
      </section>

      {/* Info box */}
      <div className="container mx-auto py-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-gray-700 text-sm">
            <span className="font-semibold text-blue-600">ℹ️ </span>
            {disclaimer}
          </p>
        </div>
      </div>
    </>
  );
}
