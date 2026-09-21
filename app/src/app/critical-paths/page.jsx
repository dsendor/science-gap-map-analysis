import data from '../../../public/data.json';
import Nav from '../../components/Nav';
import PageProvenance from '../../components/PageProvenance';
import { fieldColor } from '../../lib/fields';

export const metadata = { title: 'Critical paths' };

// An index, not a document. This page used to render every chain inline, which was
// fine at two and stops being fine somewhere around five: a reader looking for one
// gap had to scroll past all the others, and the page selected chains by hard-coded
// id, so adding one meant editing the page.
//
// Now it lists what exists and each chain lives at /critical-paths/<their gap slug>/,
// keyed on Convergent's slug rather than on our chain id. One page per gap, because
// that is the unit a reader arrives with — they clicked a gap on the extended map —
// and because a gap can carry more than one chain (a time axis and a cost axis are
// different chains over the same gap) and they belong side by side.
export default function CriticalPathsIndex() {
  const paths = data.critical_paths;
  const byGap = [];
  for (const p of paths) {
    const row = byGap.find((r) => r.gap_slug === p.gap_slug);
    if (row) row.paths.push(p);
    else byGap.push({ gap_slug: p.gap_slug, gap_name: p.gap_name, gap_field: p.gap_field, paths: [p] });
  }
  byGap.sort((a, b) => a.gap_name.localeCompare(b.gap_name));

  return (
    <>
      <Nav here="critical-paths/" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>Critical paths</h1>
            <PageProvenance>
              This page was written by Claude. The publishing chain has been read against the gap by
              a person; the telescope and turbulence chains have not.
            </PageProvenance>
            <p className="lead">
              A gap broken into the ordered steps the work actually runs through, with a duration or
              a cost on each one, and which of Convergent&rsquo;s own capabilities act on it.
            </p>
            <p>
              {byGap.length} gaps have one, against {data.summary.n_gaps} in the map, and each is a
              claim about one axis. The capability counts on them are Convergent&rsquo;s data, not my
              labels. Where a gap bundles several axes I picked one and named the rest on the page.
            </p>
          </div>
        </section>

        <section style={{ paddingTop: 20 }}>
          <div className="col">
            {byGap.map((row) => (
              <a className="pathrow" key={row.gap_slug} href={`./${row.gap_slug}/`}>
                <div className="pathrow__head">
                  <h2>{row.gap_name}</h2>
                  <span className="field-pill" style={{ borderColor: fieldColor(row.gap_field) }}>
                    {row.gap_field}
                  </span>
                </div>
                {row.paths.map((p) => (
                  <div key={p.id} className="pathrow__path">
                    <div className="pathrow__tags">
                      <span className="tag">
                        {p.links.length} steps, measured in {p.axis_kind}
                      </span>
                      <span className="tag">
                        AI acts on {p.links.filter((l) => l.ai_acts).length} of {p.links.length}
                      </span>
                      {p.reviewed === 'human' ? (
                        <span className="tag on">Human-checked</span>
                      ) : (
                        <span className="tag flag">AI only, unchecked</span>
                      )}
                    </div>
                    <p>{p.finding?.split('\n\n')[0]}</p>
                  </div>
                ))}
                <span className="pathrow__go">The steps, the evidence and the capabilities &rarr;</span>
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="col">
            <h2>Two of them run through the same step</h2>
            <p>
              Telescope time and facility approval are allocated by peer review of proposals. A
              decadal survey is a review panel, and so is a time allocation committee. That makes the
              telescope chain&rsquo;s ranking and funding steps an instance of the publishing
              chain&rsquo;s reviewer recruitment and judgment steps. ESO on why they changed it:
            </p>
            <blockquote>
              &ldquo;the load on the panels and the Observing Programmes Committee (OPC) members has
              become unsustainable&rdquo; &hellip; &ldquo;it has become progressively harder to find
              scientists willing to serve in the panels and in the OPC&rdquo;
              <cite>
                ESO, introducing Distributed Peer Review, where every PI submitting a qualifying
                proposal reviews ten others. Running since Period 110, at ALMA from Cycle 8, and at
                Gemini before that in the Fast Turnaround channel.
              </cite>
            </blockquote>
            <p>
              Two gaps, two fields, one blocker. The Gap Map&rsquo;s export has one row per gap and
              nowhere to record that, and once gaps decompose into steps a recurring blocker becomes
              something you can count across all {data.summary.n_gaps} rather than notice twice. The
              turbulence chain does not share it, which is the point of having a third: counting
              needs more than two.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>Why there are only {byGap.length}</h2>
            <p>
              Each of these was built by hand, because nothing in the source data marks a capability
              as necessary, sufficient or partial for the gap it hangs under, and a chain needs to
              know which links are load-bearing. Typing those edges is the one change that would
              make chains something the data yields rather than something somebody authors &mdash;
              it is the first item on <a href="../missing/">what&rsquo;s missing</a>.
            </p>
          </div>
        </section>
      </main>
      <div className="footer">
        <div className="wrap col">
          <p style={{ color: 'var(--ink-3)' }}>
            David Sendor, <a href="mailto:david@sendorai.com">david@sendorai.com</a> ·{' '}
            <a href="../">The argument</a> · <a href="../map/">The extended map</a> ·{' '}
            <a href="../method/">Method &amp; audit</a>
          </p>
        </div>
      </div>
    </>
  );
}
