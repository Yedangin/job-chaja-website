import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    unoptimized: true,
  },

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    // fallback: 모든 filesystem 체크(route handler 포함) 후 마지막에 실행
    // fallback: runs LAST after all filesystem checks (including route handlers)
    // afterFiles는 catch-all 동적 라우트([...path]) 전에 실행되어 route handler를 우회할 수 있음
    // afterFiles runs BEFORE catch-all dynamic routes ([...path]), bypassing route handlers
    return {
      fallback: [
        // diagnosis API는 /api 접두사 유지 (백엔드 @Controller('api/diagnosis'))
        // Diagnosis API keeps /api prefix (backend controller at /api/diagnosis)
        {
          source: "/api/diagnosis/:path*",
          destination: `${backendUrl}/api/diagnosis/:path*`,
        },
        {
          source: "/api/diagnosis",
          destination: `${backendUrl}/api/diagnosis`,
        },
        // alba API는 /api 접두사 유지 (백엔드 @Controller('api/alba'))
        // Alba API keeps /api prefix (backend controller at /api/alba)
        {
          source: "/api/alba/:path*",
          destination: `${backendUrl}/api/alba/:path*`,
        },
        {
          source: "/api/alba",
          destination: `${backendUrl}/api/alba`,
        },
        // 기타 API는 /api 제거 후 전달 / Other APIs strip /api prefix
        {
          source: "/api/:path*",
          destination: `${backendUrl}/:path*`,
        },
      ],
    };
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);