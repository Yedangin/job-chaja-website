import { routing } from "@/i18n/routing";
import TermsAndConditionsClient from "./terms-and-conditions-client";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function Page() {
  return <TermsAndConditionsClient />;
}
