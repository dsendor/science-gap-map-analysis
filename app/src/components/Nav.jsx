const PAGES = [
  { href: '', label: 'The argument' },
  { href: 'attributes/', label: 'The labels' },
  { href: 'map/', label: 'The extended map' },
  { href: 'critical-paths/', label: 'Critical paths' },
  { href: 'proposed/', label: 'Proposed gaps' },
  { href: 'method/', label: 'Method & audit' },
  { href: 'missing/', label: "What's missing" },
];

// David's masthead, not a copy of theirs. The page borrows their visual language
// because it is about their map; it must never be mistakable for something they
// published, so there is no logo and the first line is who wrote this.
//
// `here` is the page's own path from the site root, with a trailing slash, so the
// links have to climb one level per segment: '' is the root, 'map/' is one deep,
// 'critical-paths/<gap>/' is two. This used to assume one level, which was true
// until a gap's critical paths got their own page underneath the index.
export default function Nav({ here = '' }) {
  const depth = here === '' ? 0 : here.replace(/\/+$/, '').split('/').length;
  const up = depth === 0 ? './' : '../'.repeat(depth);
  // A child page keeps its section lit: /critical-paths/<gap>/ is still "Critical paths".
  const inSection = (href) => href !== '' && here.startsWith(href);
  return (
    <header className="masthead">
      <div className="wrap inner">
        <span className="byline">David Sendor</span>
        <a href="mailto:david@sendorai.com">david@sendorai.com</a>
        <nav>
          {PAGES.map((p) => (
            <a
              key={p.href}
              href={up + p.href}
              className={p.href === here || inSection(p.href) ? 'on' : ''}
            >
              {p.label}
            </a>
          ))}
        </nav>
        <a href="https://www.linkedin.com/in/dsendor/" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <span className="note">
          An independent contribution to Convergent Research&rsquo;s{' '}
          <a href="https://www.gap-map.org/" target="_blank" rel="noreferrer">
            Fundamental Development Gap Map v1.0
          </a>
          . Not affiliated with, endorsed by, or published by Convergent Research.
        </span>
      </div>
    </header>
  );
}
