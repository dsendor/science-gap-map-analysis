import data from '../../public/data.json';
import Nav from '../components/Nav';
import MaturityGradient from '../components/MaturityGradient';
import ChainMini from '../components/ChainMini';
import { MATURITY_ORDER } from '../lib/constants';

export default function Page() {
  const { summary: s, gaps, critical_paths: paths } = data;
  const workingNow = gaps.filter((g) => g.primary_maturity === 'Working now').length;
  const publishing = paths.find((p) => p.id === 'path-publishing-cost');
  const llm = s.maturity_by_ai_type['LLM reasoning and synthesis'] ?? {};
  const llmTot = MATURITY_ORDER.reduce((a, k) => a + (llm[k] ?? 0), 0);
  const buildTot = MATURITY_ORDER.reduce(
    (a, k) => a + ((s.maturity_by_ai_type['Physical build and manipulation'] ?? {})[k] ?? 0),
    0
  );

  return (
    <>
      <Nav here="" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>AI is accelerating science. The Gap Map should show where.</h1>
            <p className="lead">
              You put {s.n_gaps} R&amp;D gaps on one map and asked what needs building. I added four
              attributes to every one of them to see what kind of work is actually in the way, then
              decomposed two gaps into their steps to test whether a one-line label can be trusted.
              The labels held. What the traces added was where the AI speedup is going, and why some
              of it is not being collected.
            </p>
            <p>
              What I would like is your feedback on whether these are the right attributes, and a
              conversation about what a version of the map built for the next few years should
              record. <a href="mailto:david@sendorai.com">david@sendorai.com</a>.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>The hypothesis</h2>
            <p>
              AI is very good at one slice of scientific work: reading, predicting, and searching a
              design space. As that slice gets cheap, whatever is left over starts to set the pace.
              Software went through this. Writing code got cheap and code review turned into the
              thing everybody complains about.
            </p>
            <p>
              Science looks similar with a harder remainder, because much of what is left is
              fabrication, funding, approval, and agreement. If that is right it changes what is
              worth building.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What I added</h2>
            <p>
              Four attributes on all {s.n_gaps} gaps.{' '}
              <a href="./attributes/">What each one is, and where each one breaks</a>.
            </p>
            <ul>
              <li>
                <strong>An outcome.</strong> What becomes knowable or buildable if this gap closes.
                Your names say what is in the way; this says what is on the other side, which is the
                version that recruits people. <a href="./map/">On the map</a>
              </li>
              <li>
                <strong>The kind of work in the way, and how mature the AI for it is.</strong> Seven
                kinds, five with an AI analogue and two without, each at working now, two-to-five
                years, or speculative. <a href="./map/">On the map</a>
              </li>
              <li>
                <strong>A measurability tier.</strong> Whether the gap has an agreed observable, only
                a proxy, a contested observable, or a quantity that is inherently counterfactual.{' '}
                <a href="./method/">How it was audited</a>
              </li>
              <li>
                <strong>A progress indicator</strong>, for eight gaps. The number you would watch to
                know whether the gap is closing. Six have one, two do not.{' '}
                <a href="./indicators/">All eight</a>
              </li>
              <li>
                <strong>Two worked critical paths</strong> and{' '}
                <strong>four proposed gaps</strong>. <a href="./chains/">Chains</a> ·{' '}
                <a href="./proposed/">Proposed gaps</a>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What I found</h2>
            <p>
              {workingNow - 1} of the {s.n_gaps} gaps have a primary blocker that current AI can act
              on today. That is a snapshot and a coarse one: I labelled what kind of work each gap
              needs and whether the relevant capability works, and I did not measure how much faster
              anything actually got. Working out the size of the speedup is the obvious next piece of
              work, and a single primary label also hides both AI and non-AI opportunities across the
              other {s.n_gaps - workingNow + 1}.
            </p>
          </div>

          <figure className="card" style={{ marginTop: 18 }}>
            <div className="pad">
              <MaturityGradient aiTypes={s.ai_type} maturityByType={s.maturity_by_ai_type} />
              <figcaption>
                For each kind of work, the share of the gaps it primarily blocks where the relevant AI
                capability already works. All {s.n_gaps} gaps, one primary kind each. A snapshot, not
                a trend: I did not label these gaps at any earlier date. The single working-now case
                under coordination and institutional is <em>Ephemeral Societal Data on Proprietary
                Platforms</em>, where the archiving is technically solved and the blocker is entirely
                legal and financial, so I leave it out of the count above.
              </figcaption>
            </div>
          </figure>

          <div className="col">
            <p style={{ marginTop: 22 }}>
              {llm['Working now']} of the {llmTot} gaps blocked by reading and synthesis are served
              today. All {buildTot} blocked by physical build sit at two-to-five years or speculative.
              What separates the top of that list from the bottom is how much physical world is
              involved.
            </p>

            <h3 style={{ marginTop: 34 }}>Then the chains show what a one-line label compresses</h3>
            <p>
              An attribute is one line. A critical path breaks the gap into the steps that have to
              happen and puts a duration or a cost on each of them.
            </p>
            <p>
              Take <em>Doing and publishing research is expensive and subject to structural
              roadblocks</em>. My label says the work in the way is coordination and institutional.
              Seven steps later the trace agrees, and says where: the cost sits in finding reviewers,
              agreeing what a review means, and getting institutions to count the work. A one-line
              label predicted where a seven-step decomposition would land, which is the result I would
              want before adopting the attribute.
            </p>
            <p>
              The surprise is elsewhere. AI has arrived on this gap, and it arrived on the two steps
              that carry no cost. Where it reaches a step that does carry cost, it reaches the wrong
              half: it can match a reviewer to a paper, and it cannot make that reviewer say yes. One
              step got actively worse. Submissions rose 42% over five years in the one corpus where a
              journal has published full figures, and that load landed on reviewer recruitment.
            </p>
          </div>

          <div className="card" style={{ marginTop: 18 }}>
            <div className="pad">
              <ChainMini path={publishing} />
              <figcaption style={{ marginTop: 14 }}>
                Cost, in reviewer and editor labor. Orange marks where the labor concentrates. AI
                acts on the first four steps, but on steps 3 and 4 it reaches only the tractable
                half: matching a reviewer to a paper, not persuading them to say yes.
              </figcaption>
            </div>
          </div>

          <div className="col">
            <div className="pull">
              <p>
                The speedup on this gap is real and mostly uncollectable. Publishing did not get
                cheaper, because the steps AI took over were not the ones setting the cost.
              </p>
              <p style={{ marginBottom: 0 }}>
                That is what makes the remaining steps worth more than they used to be. Clearing
                reviewer recruitment now returns the recruitment saving <em>and</em> lets the drafting
                speedup finally show up. The more of a process AI accelerates, the more of that gain
                is waiting behind whatever it did not touch.{' '}
                <a href="./chains/">Both chains, with the evidence →</a>
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What I would like</h2>
            <p>
              Your About page says you are open to partners interested in meta analyses and new tools
              that make the data more actionable, and that you hope to add attributes for urgency and
              impact. That is what this is aiming at.
            </p>
            <ul>
              <li>
                <strong>Tell me which attributes are wrong.</strong> The seven kinds of work most of
                all. The audit already found three gap types it handles badly.
              </li>
              <li>
                <strong>Chains across the whole map.</strong> The value is in counting how often the
                same binding step recurs across fields, and that needs all {s.n_gaps}.
              </li>
              <li>
                <strong>Typed capability edges.</strong> Nothing marks a capability as necessary,
                sufficient, or partial for its gap, so the chains reconstructed that by hand. Typed
                edges would make chains generatable, and they lead straight to the urgency and impact
                attributes you already want.
              </li>
            </ul>
            <p>
              One thing worth knowing either way. <code>capabilities[].gaps</code> is empty for all{' '}
              {s.n_capabilities} capabilities in the v1.0 export, though <code>schema.json</code>{' '}
              documents it as populated. Anyone starting from <code>capabilities.json</code> builds an
              empty graph and gets no error.
            </p>
            <p className="lead">
              <a href="mailto:david@sendorai.com">david@sendorai.com</a>. The critical version of this
              feedback is the one I want most.
            </p>
            <p style={{ fontSize: 15.5, color: 'var(--ink-3)' }}>
              This is not comprehensive and some of it is wrong. All {s.n_gaps} gaps were labelled in
              about 80 minutes of agent time across six phases, and no human has reviewed any of it.
              A second pass relabelled a stratified sample blind and disagreed on 15% of tiers once
              weighted to the population. That figure, the limitations, and the calls that could have
              gone the other way are on the <a href="./method/">method page</a>.
            </p>
          </div>
        </section>
      </main>

      <div className="footer">
        <div className="wrap col">
          <p style={{ color: 'var(--ink-3)' }}>
            Built on the {data.source.snapshot} export of{' '}
            <a href={data.source.url} target="_blank" rel="noreferrer">
              gap-map.org
            </a>
            . Nothing here reorders or ranks your gaps, and your data is unmodified.{' '}
            <a href="./gap-map-augmented.csv">CSV, keyed on your ids and slugs</a> ·{' '}
            <a href="./data.json">JSON</a> · David Sendor,{' '}
            <a href="mailto:david@sendorai.com">david@sendorai.com</a>
          </p>
        </div>
      </div>
    </>
  );
}
