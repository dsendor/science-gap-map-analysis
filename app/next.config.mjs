/** @type {import('next').NextConfig} */
const nextConfig = {
  // A directory of static files Convergent can keep, not a service they have to
  // trust stays up. Both the URL and the folder come out of the same build.
  output: 'export',
  // Emit out/map/index.html rather than out/map.html, so the exported directory works
  // unchanged on Vercel, on any plain static server, and when opened from disk.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
