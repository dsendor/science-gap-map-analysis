import data from '../../../public/data.json';
import Nav from '../../components/Nav';
import Chain from '../../components/Chain';
import PageProvenance from '../../components/PageProvenance';

export const metadata = { title: 'Two worked critical paths' };

export default function ChainsPage() {
  const { critical_paths: paths, summary: s } = data;
  const telescope = paths.find((p) => p.id === 'path-telescope-elapsed-time');
  const publishing = paths.find((p) => p.id === 'path-publishing-cost');
  return (
    <>
      <Nav here="chains/" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>Two worked critical paths</h1>
            <PageProvenance>
              This page was written by Claude. The publishing chain below has been read against
              the gap by a person; the telescope chain has not.
            </PageProvenance>
            <p className="lead">
              A gap broken into the ordered steps that have to happen, with a duration or a cost on
              each one.
            </p>
            <ul>
              <li>
                <strong>Publishing</strong>, measured in reviewer and editor labour. Four of seven
                steps have no capability attached, including the one where the cost concentrates.
              </li>
              <li>
                <strong>Telescopes</strong>, measured in elapsed years. The first three steps have
                none, and they hold most of the years.
              </li>
              <li>
                The capability counts are Convergent&rsquo;s own data, not my labels.
              </li>
              <li>
                Two chains, picked to be as unalike as possible so the method had a chance to fail.
                Where a gap bundles several axes I picked one and named the rest.
              </li>
            </ul>
          </div>
        </section>

        <section style={{ paddingTop: 20 }}>
          <Chain path={telescope} />
          <Chain path={publishing} />
        </section>
        <section>
          <div className="col">
            <h2>Both chains run through the same step</h2>
            <p>
              Telescope time and facility approval are allocated by peer review of proposals. A
              decadal survey is a review panel, and so is a time allocation committee. That makes the
              telescope chain&rsquo;s ranking and funding steps an instance of the publishing
              chain&rsquo;s reviewer recruitment and judgment steps. ESO on why they changed it:</p>
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
              Two gaps, two fields, one blocker. Your export has one row per gap and nowhere to
              record that, and once gaps decompose into steps a recurring blocker becomes something
              you can count across all {s.n_gaps} rather than notice twice.
            </p>
            <p>
              <a href="mailto:david@sendorai.com">david@sendorai.com</a>
            </p>
          </div>
        </section>
      </main>
      <div className="footer">
        <div className="wrap col">
          <p style={{ color: 'var(--ink-3)' }}>
            David Sendor, <a href="mailto:david@sendorai.com">david@sendorai.com</a> ·{' '}
            <a href="../">The argument</a> · <a href="../map/">The extended map</a>
          </p>
        </div>
      </div>
    </>
  );
}
