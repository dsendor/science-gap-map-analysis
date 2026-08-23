import data from '../../public/data.json';
import Nav from '../components/Nav';
import RelabelCompare from '../components/RelabelCompare';
import ChainMini from '../components/ChainMini';

export default function Page() {
  const { summary: s, gaps, critical_paths: paths } = data;
  const publishing = paths.find((p) => p.id === 'path-publishing-cost');

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
            <p style={{ fontSize: 15.5, color: 'var(--ink-3)' }}>
              I spent 15+ years applying AI to hard problems in large organizations, most recently
              leading Enterprise Data Science at Liberty Mutual. I am moving into AI for science,
              working on where the binding constraint goes as AI dissolves the cognitive bottleneck.{' '}
              <a href="https://www.linkedin.com/in/dsendor/" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
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
                version that recruits people. <a href="./attributes/#outcome">How I wrote them</a>
              </li>
              <li>
                <strong>The kind of work in the way, and how mature the AI for it is.</strong> Eight
                kinds of work, each with an AI analogue and each at working now, two-to-five years,
                or speculative. Robotics is the analogue for physical build.{' '}
                <a href="./attributes/">What the eight are</a>
              </li>
              <li>
                <strong>A measurability tier.</strong> Whether the gap has an agreed observable, only
                a proxy, a contested observable, or a quantity that is inherently counterfactual. One
                of the four tiers failed its own audit. <a href="./attributes/">What the tiers are</a>
              </li>
              <li>
                <strong>A progress indicator</strong>, for eight gaps. The number you would watch to
                know whether the gap is closing. Six have one, two do not.{' '}
                <a href="./indicators/">All eight</a> · <a href="./attributes/">What it is for</a>
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
            <h2>What I found, and what did not survive</h2>
            <p>
              The first pass produced a clean result: the share of gaps each kind of work blocks where
              the AI for it already works ran from 60% for reading and synthesis down to 0% for
              physical build. It was the most striking thing this analysis produced.
            </p>
            <p>
              A second pass relabelled all {s.n_gaps} gaps blind, against a revised taxonomy, by
              labelers who never saw the first set, with predictions registered in a commit
              beforehand. It did not reproduce that result.
            </p>
          </div>

          <figure className="card" style={{ marginTop: 18 }}>
            <div className="pad">
              <RelabelCompare relabel={data.relabel} />
              <figcaption>
                Share of each kind of work whose gaps have an AI capability that works today, in both
                passes. The two agreed on the kind of work for {data.relabel.type_agreed} of{' '}
                {data.relabel.n} gaps and on maturity for only {data.relabel.maturity_agreed}.
              </figcaption>
            </div>
          </figure>

          <div className="col">
            <p style={{ marginTop: 22 }}>
              The ordering inverts at the top. Coordination and institutional goes from last place to
              first. Physical build is no longer zero. So the gradient is withdrawn.
            </p>
            <p>
              The cause is a definitional hole I left open. Does &ldquo;working now&rdquo; mean the
              capability exists, or that applying it would move this gap? For technical categories
              those coincide. For institutional ones they come apart completely: convening a standards
              body is available this afternoon, and getting universal DNA-synthesis screening adopted
              is not. I labelled institutional gaps on efficacy and the relabelers read availability.
              Both are defensible, and a reader of the published number could not tell which they were
              getting.
            </p>
            <div className="pull">
              <p>
                <strong>What survived is weaker and better supported.</strong> Reading and synthesis
                is the primary blocker for 10 of {s.n_gaps} gaps, identical in both passes, at 60%
                working-now in both. Coordination is primary for 15 of {s.n_gaps} in both passes. The
                two passes disagree sharply about how mature institutional capability is, and not at
                all about how often it is the constraint.
              </p>
              <p style={{ marginBottom: 0 }}>
                So: the cognitive layer is a small, stable slice of this map, and the rest spreads
                across sensing, prediction, design, build and institutions. The sharper claim is not
                supported at this measurement reliability.{' '}
                <a href="./method/">The full scoring</a>
              </p>
            </div>
          </div>

          <div className="col">
            <h3 style={{ marginTop: 34 }}>Then the chains show what a one-line label compresses</h3>
            <p>
              An attribute is one line. A critical path breaks the gap into the steps that have to
              happen and puts a duration or a cost on each of them.
            </p>
            <p>
              Take <em>Doing and publishing research is expensive and subject to structural
              roadblocks</em>, tracing the publishing half. The cost of doing the research is the
              other half, and it is most of what the rest of your map is about. My label for this gap
              says the work in the way is coordination and institutional.
              Seven steps later the trace agrees, and says where: the cost sits in finding reviewers,
              agreeing what a review means, and getting institutions to count the work. A one-line
              label predicted where a seven-step decomposition would land, which is the result I would
              want before adopting the attribute.
            </p>
            <p>
              The surprise is what happened to the saving. Drafting was one of the most expensive
              steps here, measured in researcher weeks per paper, and AI has taken a large share of
              that cost out. Publishing did not get cheaper. Submissions rose 42% over five years in
              the one corpus where a journal has published full figures, and the labor moved
              downstream to reviewer recruitment, which is where the cost now concentrates. Where AI
              reaches a step that carries cost, it reaches the tractable half: it can match a reviewer
              to a paper, and it cannot make that reviewer say yes.
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
                The speedup is real and currently uncollectable. Relieving a step upstream of where
                the cost concentrates moves the cost along; it does not remove it.
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
                <strong>Tell me which attributes are wrong.</strong> The kinds of work most of
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
