const PAGES = [
  { href: '', label: 'The argument' },
  { href: 'map/', label: 'The extended map' },
  { href: 'chains/', label: 'Critical paths' },
  { href: 'indicators/', label: 'Indicators' },
  { href: 'proposed/', label: 'Proposed gaps' },
  { href: 'method/', label: 'Method & audit' },
];

// David's masthead, not a copy of theirs. The page borrows their visual language
// because it is about their map; it must never be mistakable for something they
// published, so there is no logo and the first line is who wrote this.
export default function Nav({ here = '' }) {
  const up = here === '' ? './' : '../';
  return (
    <header className="masthead">
      <div className="wrap inner">
        <span className="byline">David Sendor</span>
        <a href="mailto:david@sendorai.com">david@sendorai.com</a>
        <nav>
          {PAGES.map((p) => (
            <a key={p.href} href={up + p.href} className={p.href === here ? 'on' : ''}>
              {p.label}
            </a>
          ))}
        </nav>
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
