// Deliberately David's masthead and not a copy of theirs. The page borrows their
// visual language because it is about their map; it must never be mistakable for a
// page published by them, so there is no logo, no wordmark, and the first thing on
// screen is who wrote this and how to reply.
export default function Masthead({ active = 'why' }) {
  return (
    <header className="masthead">
      <div className="wrap inner">
        <span className="byline">David Sendor</span>
        <span className="sep">·</span>
        <a href="mailto:david@sendorai.com">david@sendorai.com</a>
        <span className="sep">·</span>
        {active === 'why' ? (
          <a href="./map/">Browse the extended map →</a>
        ) : (
          <a href="../">← Back to the argument</a>
        )}
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
