import data from '../../../../public/data.json';
import Nav from '../../../components/Nav';
import PageProvenance from '../../../components/PageProvenance';
import Chain from '../../../components/Chain';
import { fieldColor } from '../../../lib/fields';

// One page per gap, at Convergent's own slug, so /critical-paths/<slug>/ sits beside
// their /gaps/<slug>/ and the two join without a lookup table. A gap can carry more
// than one chain — the same gap measured in time and in cost are different chains —
// and they render together here rather than in two places.
//
// generateStaticParams is what keeps this from needing a page edit per chain: the
// routes come out of the exported data, so a chain that passes the ingest appears on
// the site the next time it is built. Publishing a chain is still a deliberate act,
// because a draft chain is never exported at all.
// A gap can carry a plain-language companion written for a reader who does not know
// the field. It is a subpage of the gap's critical path rather than a top-level page,
// because it explains this chain and is not an argument of its own. Keyed by slug, so
// a gap without one simply does not show the link.
const EXPLAINERS = {
  'inability-to-model-turbulence': {
    href: './explained/',
    label: 'Turbulence, step by step',
    blurb:
      'The same seven steps in ordinary words, what the September 2026 Navier\u2013Stokes proof did and did not settle, and which step each of Convergent\u2019s resources would move.',
  },
};

export function generateStaticParams() {
  return [...new Set(data.critical_paths.map((p) => p.gap_slug))].filter(Boolean).map((gap) => ({ gap }));
}

// Next hands `params` in as a promise, so both of these await it before reading the
// slug. Reading it synchronously silently yields undefined, which renders an empty
// page rather than throwing.
export async function generateMetadata({ params }) {
  const { gap } = await params;
  const p = data.critical_paths.find((c) => c.gap_slug === gap);
  return { title: p ? `Critical path: ${p.gap_name}` : 'Critical path' };
}

export default async function GapCriticalPaths({ params }) {
  const { gap: slug } = await params;
  const paths = data.critical_paths.filter((p) => p.gap_slug === slug);
  if (paths.length === 0) return null;
  const gap = data.gaps.find((g) => g.slug === slug);
  const { gap_name: name, gap_field: field } = paths[0];
  const anyUnchecked = paths.some((p) => p.reviewed !== 'human');

  return (
    <>
      <Nav here={`critical-paths/${slug}/`} />
      <main className="wrap">
        <section>
          <div className="col">
            <p style={{ fontSize: 14.5, marginBottom: 10 }}>
              <a href="../">&larr; All critical paths</a>
            </p>
            <div className="gcard__head" style={{ borderBottom: 'none', padding: 0 }}>
              <h1 style={{ margin: 0 }}>{name}</h1>
              <span className="field-pill" style={{ borderColor: fieldColor(field) }}>
                {field}
              </span>
            </div>
            <PageProvenance>
              {anyUnchecked
                ? 'This page was written by Claude and no person has read it against the gap.'
                : 'The chain on this page has been read against the gap by a person.'}
            </PageProvenance>

            {gap?.description && (
              <div className="pull">
                <p style={{ marginBottom: 8, fontSize: 14, color: 'var(--ink-3)' }}>
                  Convergent&rsquo;s problem statement, unedited
                </p>
                <p style={{ marginBottom: 0 }}>{gap.description}</p>
              </div>
            )}

            <p className="lead">
              {paths.length === 1
                ? 'One chain, on one axis. The steps below are the order the work runs in; the number on each is what that step costs on that axis.'
                : `${paths.length} chains over the same gap, on different axes. Each measures one thing, and they are not addable.`}
            </p>
            <p style={{ fontSize: 15 }}>
              <a href={`https://www.gap-map.org/gaps/${slug}/`} target="_blank" rel="noreferrer">
                This gap on gap-map.org
              </a>
              {gap && (
                <>
                  {' '}
                  &middot; <a href="../../map/">its labels on the extended map</a>
                </>
              )}
            </p>
          </div>
        </section>

        {EXPLAINERS[slug] && (
          <section style={{ paddingTop: 0 }}>
            <div className="col">
              <a className="pathrow" href={EXPLAINERS[slug].href}>
                <div className="pathrow__head">
                  <h2>{EXPLAINERS[slug].label}</h2>
                  <span className="tag">plain language</span>
                </div>
                <div className="pathrow__path">
                  <p>{EXPLAINERS[slug].blurb}</p>
                </div>
                <span className="pathrow__go">Read it &rarr;</span>
              </a>
            </div>
          </section>
        )}

        <section style={{ paddingTop: 20 }}>
          {paths.map((p) => (
            <Chain key={p.id} path={p} />
          ))}
        </section>

        {gap?.capabilities?.length > 0 && (
          <section>
            <div className="col">
              <h2>
                What Convergent attach to this gap
                {gap.capabilities.length === 1 ? ', which is one capability' : ''}
              </h2>
              <p>
                Their foundational capabilities for this gap, in their words. Which steps each one
                acts on is my reading, and it is in the step table above.
              </p>
              <ul>
                {gap.capabilities.map((c) => (
                  <li key={c.id} style={{ marginBottom: 8 }}>
                    <strong>{c.name}</strong>
                    {c.description ? ` — ${c.description}` : ''}
                  </li>
                ))}
              </ul>
              {gap.capabilities.length < 3 && (
                <p style={{ fontSize: 15, color: 'var(--ink-3)' }}>
                  A chain says most about capability coverage when a gap carries three or more. With{' '}
                  {gap.capabilities.length === 1 ? 'one' : gap.capabilities.length}, &ldquo;which
                  steps have none attached&rdquo; is thin by construction, and that is a fact about
                  this gap rather than a finding about their map.
                </p>
              )}
            </div>
          </section>
        )}
      </main>
      <div className="footer">
        <div className="wrap col">
          <p style={{ color: 'var(--ink-3)' }}>
            David Sendor, <a href="mailto:david@sendorai.com">david@sendorai.com</a> ·{' '}
            <a href="../">All critical paths</a> · <a href="../../">The argument</a> ·{' '}
            <a href="../../map/">The extended map</a>
          </p>
        </div>
      </div>
    </>
  );
}
