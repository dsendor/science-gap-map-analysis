import { Archivo, Public_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

// Three roles, three faces, all loaded through next/font so the exported directory
// stays self-contained and works offline.
//
// Archivo for display: a grotesque drawn for signage and forms, tight and slightly
// condensed at weight 700. It reads as a schedule header rather than an essay title,
// which is what this page is. Public Sans for body: a civic face, plain and unfashionable.
// Plex Mono for anything that is a measurement — step numbers, durations, counts — so a
// number is visually a number and never prose.
const display = Archivo({
  weight: ['600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});
const body = Public_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});
const mono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata = {
  title: 'The Gap Map, with two gaps broken into critical paths',
  description:
    "David Sendor's extension of Convergent Research's Fundamental Development Gap Map v1.0: one gap decomposed into the steps it runs through, showing where AI reaches and which steps have no capability attached, plus a kind-of-work label on all 103 gaps. An independent contribution, offered for feedback.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
