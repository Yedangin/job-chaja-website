import { termsAndConditionsData } from "@/data/terms-and-conditions";
import { Fragment } from "react";

// A simple component to render the table data
const renderTable = (table: { label: string; value: string }[]) => (
  <div className="overflow-x-auto my-4">
    <table className="min-w-full divide-y divide-gray-200 border">
      <tbody className="bg-white divide-y divide-gray-200">
        {table.map((row, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.label}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function TermsAndConditionsPage() {
  const { header, sections } = termsAndConditionsData;

  return (
    <main className="bg-gray-50 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{header.title}</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: {header.lastUpdated}</p>
          <p className="mt-4 text-lg text-gray-600">{header.description}</p>
          <p className="mt-2 text-sm text-gray-500 italic">{header.disclaimer}</p>
        </header>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.id} className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">{section.title}</h2>
              {section.type === 'bullet-list' && section.content && (
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {section.content.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
              {section.type === 'subsection-list' && section.subsections && (
                <div className="space-y-6">
                  {section.subsections.map((subsection, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{subsection.subtitle}</h3>
                      {subsection.bullets && (
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          {subsection.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {section.type === 'complex' && section.subsections && (
                 <div className="space-y-6">
                    {section.subsections.map((subsection, index) => (
                        <Fragment key={index}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{subsection.subtitle}</h3>
                            {subsection.bullets && (
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    {subsection.bullets.map((bullet, bulletIndex) => (
                                        <li key={bulletIndex}>{bullet}</li>
                                    ))}
                                </ul>
                            )}
                            {subsection.table && renderTable(subsection.table)}
                        </Fragment>
                    ))}
                 </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
  