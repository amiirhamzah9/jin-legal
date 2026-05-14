/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ymerojltkwjauqhdhnzu.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        // Preserve old practice area URL after slug rename
        source: "/practice-areas/criminal-defense-white-collar",
        destination: "/practice-areas/general-special-criminal-law",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
