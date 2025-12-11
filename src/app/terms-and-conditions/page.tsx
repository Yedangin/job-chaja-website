import { TermsAndConditionsHeader } from "@/components/container/terms-and-conditions/terms-and-condtions-header";
import { TermsAndConditionsSection } from "@/components/container/terms-and-conditions/terms-and-condtions-section";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { termsAndConditionsData } from "@/data/terms-and-conditions";

export default function page() {
  const { sections, header } = termsAndConditionsData;
  return (
    <>
      <Header />
      <TermsAndConditionsHeader
        title={header.title}
        lastUpdated={header.lastUpdated}
        description={header.description}
        disclaimer={header.disclaimer}
      />
      {sections.map((section: any) => (
        <TermsAndConditionsSection
          key={section.id}
          id={section.id}
          title={section.title}
          type={section.type}
          content={section.content}
          subsections={section.subsections}
        />
      ))}
      <Footer />
    </>
  );
}
