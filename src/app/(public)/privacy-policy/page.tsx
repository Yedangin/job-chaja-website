import { privacyPolicyData } from "@/data/privacy-policy";
import { Fragment } from "react";
import krMessages from "../../../../messages/kr.json";

export default function PrivacyPolicyPage() {
  const { header, sections } = privacyPolicyData;
  const koreanPolicy = krMessages.PrivacyPolicy;

  return (
    <main className="bg-gray-50 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{koreanPolicy.header.title}</h1>
          <p className="text-sm text-gray-500 mt-2">{koreanPolicy.header.lastUpdated}</p>
          <p className="mt-4 text-lg text-gray-600">{koreanPolicy.header.description}</p>
        </header>

        <div className="space-y-10">
          {koreanPolicy.sections.map((section) => (
            <section
              id={`privacy-section-${section.id}`}
              key={`ko-${section.id}`}
              className="scroll-mt-6 bg-white p-6 md:p-8 rounded-lg shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">{section.title}</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {section.content.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </section>
          ))}

          <header className="border-t border-gray-300 pt-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">{header.title} - English Reference</h2>
            <p className="text-sm text-gray-500 mt-2">Last updated: {header.lastUpdated}</p>
            <p className="mt-4 text-gray-600">{header.description}</p>
            <p className="mt-2 text-sm text-gray-500 italic">{header.disclaimer}</p>
          </header>

          {sections.map((section) => (
            <section
              id={`privacy-en-section-${section.id}`}
              key={`en-${section.id}`}
              className="scroll-mt-6 bg-white p-6 md:p-8 rounded-lg shadow-sm"
            >
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
