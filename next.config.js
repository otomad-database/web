/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["nicovideo.cdn.nimg.jp", "img.cdn.nimg.jp"],
  },
  experimental: {
    appDir: true,
    runtime: "experimental-edge",
  },
};
module.exports = nextConfig;
