import { TermsAndConditionsHeader } from "@/components/container/terms-and-conditions/terms-and-condtions-header";
import { TermsAndConditionsSection } from "@/components/container/terms-and-conditions/terms-and-condtions-section";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { privacyPolicyData } from "@/data/privacy-policy";

export default function page() {
  const { header, sections } = privacyPolicyData;
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
