"use client";
import { useEffect } from "react";
import { routing } from "@/i18n/routing";

export default function PrivacyPolicyRedirect() {
  useEffect(() => {
    // Client-side redirect to the default locale
    window.location.replace(`/${routing.defaultLocale}/privacy-policy`);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div>
        <p>Redirecting to Privacy Policy...</p>
        <noscript>
          <p>Please enable JavaScript or visit:</p>
          <ul>
            <li>
              <a href="/en/privacy-policy">English Privacy Policy</a>
            </li>
            <li>
              <a href="/kr/privacy-policy">한국어 개인정보처리방침</a>
            </li>
          </ul>
        </noscript>
      </div>
    </div>
  );
}
