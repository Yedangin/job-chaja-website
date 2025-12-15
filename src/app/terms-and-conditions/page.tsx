"use client";
import { useEffect } from "react";
import { routing } from "@/i18n/routing";

export default function TermsAndConditionsRedirect() {
  useEffect(() => {
    // Client-side redirect to the default locale
    window.location.replace(`/${routing.defaultLocale}/terms-and-conditions`);
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
        <p>Redirecting to Terms and Conditions...</p>
        <noscript>
          <p>Please enable JavaScript or visit:</p>
          <ul>
            <li>
              <a href="/en/terms-and-conditions">
                English Terms and Conditions
              </a>
            </li>
            <li>
              <a href="/kr/terms-and-conditions">한국어 이용약관</a>
            </li>
          </ul>
        </noscript>
      </div>
    </div>
  );
}
