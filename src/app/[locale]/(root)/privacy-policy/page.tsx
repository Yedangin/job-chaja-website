import { routing } from "@/i18n/routing";
import PrivacyPolicyClient from "./privacy-policy-client";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function Page() {
  return <PrivacyPolicyClient />;
}
