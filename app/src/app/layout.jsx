import { Shippori_Mincho } from 'next/font/google';
import './globals.css';

// Their headings are Shippori Mincho 500. Loaded through next/font so the files are
// emitted into out/ at build time — the exported directory stays self-contained and
// works offline, which a CDN <link> would not.
const serif = Shippori_Mincho({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata = {
  title: 'Where AI does and does not move the Gap Map — a proposed extension',
  description:
    "David Sendor's extension of Convergent Research's Fundamental Development Gap Map v1.0: a stated outcome, an AI capability type and maturity, and a measurability tier for all 103 gaps, plus sampled progress indicators, four proposed gaps and two worked critical paths. An independent contribution, offered for feedback.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={serif.variable}>
      <body>{children}</body>
    </html>
  );
}
