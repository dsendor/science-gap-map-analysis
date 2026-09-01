import data from '../../public/data.json';
import Nav from '../components/Nav';
import ChainMini from '../components/ChainMini';
import { AiOnly, HumanChecked } from '../components/Reviewed';

export default function Page() {
  const { summary: s, gaps, critical_paths: paths } = data;
  const publishing = paths.find((p) => p.id === 'path-publishing-cost');

  // Derived here rather than retyped into prose, so a number cannot drift out of step
  // with the database.
  const pubGap = gaps.find((g) => g.id === publishing.gap_id);
  const acts = publishing.links.filter((l) => l.ai_acts).length;
  const steps = publishing.links.length;

  return (
    <>
      <Nav here="" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>AI is accelerating science. The Gap Map should show where.</h1>
            <p className="lead">
              You put {s.n_gaps} R&amp;D gaps on one map and asked what needs building. I labelled all
              of them for what kind of work stands in the way and whether AI reaches it, then took one
              gap apart step by step. The step-by-step version is the part worth your time. It says
              which step the cost actually sits in, where AI stops, and which steps none of your
              capabilities touch. A one-line label on a whole gap cannot say any of that.
            </p>
            <p>
              <strong>
                Decomposing gaps into their steps is the thing I think your map most needs next.
              </strong>{' '}
              Here is one gap done that way, so you can judge whether it is worth doing to the other{' '}
              {s.n_gaps - 1}. <a href="mailto:david@sendorai.com">david@sendorai.com</a>
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>
              One gap, all the way down
              <HumanChecked />
            </h2>
            <p>
              <em>{publishing.gap_name}</em>. Everything in this section has been read against the gap
              by a person. Nothing else on this site has.
            </p>

            <div className="pull">
              <p style={{ marginBottom: 6, fontSize: 15, color: 'var(--ink-3)' }}>
                A chain has to be a path to something. This one runs to:
              </p>
              <p style={{ marginBottom: 10, fontSize: 19 }}>
                <strong>{pubGap?.outcome}</strong>
              </p>
              <p style={{ marginBottom: 0, fontSize: 15, color: 'var(--ink-3)' }}>
                Your gap statement bundles cost, speed and inclusiveness. Picking one is what makes
                the steps orderable, and the other two are named and left as separate chains.
              </p>
            </div>

            <p>
              My one-line label says the work in the way is coordination and institutional. Seven
              steps later the trace agrees, and says where: the cost sits in finding reviewers,
              agreeing what a review means, and getting institutions to count the work. Those three
              were named in the label&rsquo;s rationale before the decomposition existed. The same
              author wrote both, so that is a consistency check rather than an independent test.
            </p>
          </div>

          <div className="card" style={{ marginTop: 18 }}>
            <div className="pad">
              <ChainMini path={publishing} />
              <figcaption style={{ marginTop: 14 }}>
                Cost, in reviewer and editor labor. Orange marks where the labor concentrates. AI acts
                on {acts} of the {steps} steps, and on steps 3 and 4 it reaches only the tractable
                half: matching a reviewer to a paper, not persuading them to say yes.
              </figcaption>
            </div>
          </div>

          <div className="col">
            <p>
              Drafting was one of the most expensive steps here, measured in researcher weeks per
              paper, and AI has taken a large share of that cost out. Publishing did not get cheaper.
              Submissions rose 42% after ChatGPT&rsquo;s release against the prior two-year window, in
              the one corpus where a journal has published full figures, and the labor the saving
              displaced landed downstream on volunteer editors at desk screening.
            </p>

            <div className="pull">
              <p>
                <strong>
                  Four of the seven steps have no capability of yours attached to them, including
                  reviewer recruitment, where the labor actually concentrates.
                </strong>{' '}
                Your four capabilities for this gap act on the last two steps and on review judgment.
                That count comes from your data, not from any label of mine.
              </p>
              <p style={{ marginBottom: 0 }}>
                It is the same shape on the telescope gap. Your three capabilities there act on design
                maturation, fabrication, integration and launch. Nothing acts on the first three
                steps, and the first three steps are where most of the years are.{' '}
                <a href="./chains/">Both chains, step by step, with the evidence &rarr;</a>
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>On all {s.n_gaps} gaps</h2>
            <p>
              One gap is a demonstration. The label is on the whole map, so it can be queried:{' '}
              <strong>what kind of work stands in the way, and whether AI reaches it</strong>. Eight
              kinds of work, each at working now, two-to-five years, or speculative.
              <AiOnly /> None of the {s.n_gaps} has been read by a person. Each is a
              model&rsquo;s judgment, with a written rationale and a confidence flag.
            </p>
            <p>
              <a href="./map/">Every gap, with its label</a> &middot;{' '}
              <a href="./attributes/">The eight kinds of work, and where the label breaks</a>{' '}
              &middot; <a href="./proposed/">{s.n_new_gaps} proposed gaps</a>
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What I would like</h2>
            <ul>
              <li>
                <strong>Critical paths across the map.</strong> The value is in counting how often the
                same binding step recurs across fields, and in seeing which steps have no capability
                on them. That needs more than two.
              </li>
              <li>
                <strong>Typed capability edges.</strong> Nothing marks a capability as necessary,
                sufficient, or partial for its gap, so both chains reconstructed that by hand. Typed
                edges would make the step mapping derivable instead of manual.
              </li>
              <li>
                <strong>Tell me which labels are wrong</strong>, the kinds of work most of all.
              </li>
            </ul>
            <p>
              <code>capabilities[].gaps</code> is empty for all {s.n_capabilities} capabilities in the
              v1.0 export, though <code>schema.json</code> documents it as populated. Anyone starting
              from <code>capabilities.json</code> builds an empty graph and gets no error.
            </p>
            <p className="lead">
              <a href="mailto:david@sendorai.com">david@sendorai.com</a>. The critical version of this
              feedback is the one I want most.
            </p>
            <p style={{ fontSize: 15.5, color: 'var(--ink-3)' }}>
              This is not comprehensive and some of it is wrong. Every label outside the worked gap is
              an AI judgment, and a second pass relabelled all {s.n_gaps} blind and disagreed often
              enough to be worth publishing. The disagreement rates are on the{' '}
              <a href="./method/">method page</a>; what this does not do is on{' '}
              <a href="./missing/">what&rsquo;s missing</a>.
            </p>
          </div>
        </section>
      </main>

      <div className="footer">
        <div className="wrap col">
          <p style={{ color: 'var(--ink-3)' }}>
            David Sendor. I spent 15+ years applying AI to hard problems in large organizations, most
            recently leading Enterprise Data Science at Liberty Mutual. I am moving into AI for
            science, working on where the binding constraint goes as AI dissolves the cognitive
            bottleneck.{' '}
            <a href="https://www.linkedin.com/in/dsendor/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>{' '}
            &middot; <a href="mailto:david@sendorai.com">david@sendorai.com</a>
          </p>
          <p style={{ color: 'var(--ink-3)' }}>
            Built on the {data.source.snapshot} export of{' '}
            <a href={data.source.url} target="_blank" rel="noreferrer">
              gap-map.org
            </a>
            . Nothing here reorders or ranks your gaps, and your data is unmodified.{' '}
            <a href="./gap-map-augmented.csv">CSV, keyed on your ids and slugs</a> &middot;{' '}
            <a href="./data.json">JSON</a>
          </p>
        </div>
      </div>
    </>
  );
}
