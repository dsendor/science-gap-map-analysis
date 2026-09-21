import Nav from '../../components/Nav';

// This page moved to /critical-paths/, which is the language the project uses
// everywhere else. The site is a static export, so there is no server to issue a 301;
// this stub keeps the old URL alive for anything already linking to it, tells a
// crawler where the page went, and bounces a reader straight there.
const DEST = '../critical-paths/';

// No canonical URL here on purpose: the export is meant to work unchanged on Vercel,
// on any static server and from disk, so it never hard-codes a site root. The refresh
// and the visible link are what move a reader; robots keeps the stub out of an index.
export const metadata = {
  title: 'Critical paths',
  robots: { index: false, follow: true },
};

export default function ChainsMoved() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${DEST}`} />
      <Nav here="critical-paths/" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>This page moved</h1>
            <p className="lead">
              The worked chains now live at <a href={DEST}>critical paths</a>, one page per gap.
            </p>
            <p>
              If your browser has not taken you there already, <a href={DEST}>follow this link</a>.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
