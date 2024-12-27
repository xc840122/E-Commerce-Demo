import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "cdn.sanity.io",
      pathname: "/images/g77rhi5o/production/*"
    }],
  },
  // images: {
  //   domains: ["cdn.sanity.io"],
  // },
};

export default nextConfig;
