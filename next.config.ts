import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
<<<<<<< HEAD
  // output: "export",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // distDir: "out",
=======
>>>>>>> a8e0574d45d9a7f559ab0bfa699c137e92fe0bb9
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
