"use client";
import { TermsAndConditionsHeader } from "@/components/container/terms-and-conditions/terms-and-condtions-header";
import { TermsAndConditionsSection } from "@/components/container/terms-and-conditions/terms-and-condtions-section";
import { useTranslations } from "next-intl";

export default function PrivacyPolicyClient() {
  const t = useTranslations("PrivacyPolicy");

  const header = t.raw("header");
  const sections = t.raw("sections");

  return (
    <>
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
    </>
  );
}
