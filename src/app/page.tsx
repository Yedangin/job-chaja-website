"use client";
import { useEffect } from "react";
import { routing } from "@/i18n/routing";

export default function RootPage() {
  useEffect(() => {
    // Client-side redirect to the default locale
    window.location.replace(`/${routing.defaultLocale}`);
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
        <p>Redirecting...</p>
        <noscript>
          <p>
            Please enable JavaScript or visit <a href="/en">English</a> |{" "}
            <a href="/kr">한국어</a>
          </p>
        </noscript>
      </div>
    </div>
  );
}
