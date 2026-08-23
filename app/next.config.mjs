/** @type {import('next').NextConfig} */
const nextConfig = {
  // A directory of static files Convergent can keep, not a service they have to
  // trust stays up. Both the URL and the folder come out of the same build.
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
