import data from '../../../public/data.json';
import Nav from '../../components/Nav';
import Chain from '../../components/Chain';

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
            <p className="lead">
              A gap broken into the ordered steps that actually have to happen, with a duration or a
              cost on each one.
            </p>
            <p>
              <strong>Orange marks where the cost concentrates, and a step is tagged where a current
              AI capability acts on it.</strong> On the telescope chain the steps run strictly one
              after another, so every step adds to the total, concentration is shown by the bar under
              each step, and the useful question is how many of the years AI can reach. On the
              publishing chain three of the seven steps carry most of the labor.
            </p>
            <p>
              I originally called some steps &ldquo;binding&rdquo; and some not. On a strictly
              sequential chain that is circular, because removing any step shortens the total. The
              arithmetic below replaces it.
            </p>
            <p>
              Each step also carries a count of how many of Convergent&rsquo;s own capabilities for
              that gap act on it. That number is theirs, not mine, and the zeroes are why it is
              here: a step with no capability attached is a step nobody has proposed anything for.
              On the publishing chain four of the seven steps are at zero, including the one where
              the labour concentrates. On the telescope chain the first three steps are at zero, and
              the first three steps hold most of the years.
            </p>
            <p>
              I did two, picked to be as unalike as possible so the method had a chance to fail: a
              space telescope measured in elapsed time, and research publishing measured in reviewer
              and editor labour. Where a gap bundles several axes, I picked one, said which, and left
              the others as separate chains.
            </p>
            <div className="pull">
              <p style={{ marginBottom: 0 }}>
                <strong>The two chains have had very different amounts of scrutiny, and that is
                deliberate.</strong> The publishing chain was worked through end to end by a person,
                against the gap, step by step. The telescope chain is a model&rsquo;s first pass and
                nobody has checked it. It is tagged that way below. Read it as a test of whether an
                AI first pass at a critical path is worth having at all &mdash; you are better placed
                to judge that on a telescope than I am.
              </p>
            </div>
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
              chain&rsquo;s reviewer recruitment and judgment steps.
            </p>
            <p>This is ESO&rsquo;s own account of why they changed the mechanism:</p>
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
              That is a natural experiment in review capacity under load, at scale, with a before and
              after, and as far as I can find nobody funds it as research.
            </p>
            <p>
              Two gaps in two different fields of your map, held up by the same step. Your export has
              one row per gap and nowhere to record that. It is the natural place for the map to
              extend, and once gaps decompose into steps a recurring blocker becomes something you can
              count across all {s.n_gaps} rather than notice twice.
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
