import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/admin/accounts",
        destination: "/admin/alumni",
        permanent: true,
      },
      {
        source: "/admin/posts",
        destination: "/admin/posting",
        permanent: true,
      },
      {
        source: "/admin/users",
        destination: "/admin/alumni",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
