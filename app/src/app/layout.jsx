import { Shippori_Mincho } from 'next/font/google';
import './globals.css';

// Their headings are Shippori Mincho 500. Loaded through next/font so the files are
// emitted into out/ at build time — the exported directory stays self-contained and
// works offline, which a CDN <link> would not.
// Weight 500 only, and latin only. Shippori Mincho carries Japanese subsets, and
// asking for three weights preloaded a few hundred font files that were never used.
const serif = Shippori_Mincho({
  weight: ['500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata = {
  title: 'AI is accelerating science. The Gap Map should show where.',
  description:
    "David Sendor's extension of Convergent Research's Fundamental Development Gap Map v1.0: an outcome, the kind of work in the way, and a measurability tier for all 103 gaps, plus two worked critical paths and four proposed gaps. An independent contribution, offered for feedback.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={serif.variable}>
      <body>{children}</body>
    </html>
  );
}
