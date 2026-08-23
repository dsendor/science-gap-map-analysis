import data from '../../public/data.json';
import Nav from '../components/Nav';
import MaturityGradient from '../components/MaturityGradient';
import { MATURITY_ORDER } from '../lib/constants';

export default function Page() {
  const { summary: s, gaps } = data;
  const workingNow = gaps.filter((g) => g.primary_maturity === 'Working now').length;
  const share = Math.round((100 * workingNow) / s.n_gaps);
  const llm = s.maturity_by_ai_type['LLM reasoning and synthesis'] ?? {};
  const llmTot = MATURITY_ORDER.reduce((a, k) => a + (llm[k] ?? 0), 0);
  const build = s.maturity_by_ai_type['Physical build and manipulation'] ?? {};
  const buildTot = MATURITY_ORDER.reduce((a, k) => a + (build[k] ?? 0), 0);

  return (
    <>
      <Nav here="" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>AI has reached about a fifth of the Gap Map in four years</h1>
            <p className="lead">
              Convergent Research put 103 R&amp;D gaps on one map and asked what needs building. I
              added four attributes to every gap to find out where AI has already arrived, and then
              traced two gaps step by step to see what still sets the pace. The two answers disagree,
              and the disagreement is the interesting part.
            </p>
            <p>
              Everything here runs on the v1.0 export with the ids and slugs preserved, so it joins
              straight back to your data. Nothing of yours is modified.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>Why I went looking</h2>
            <p>
              AI is very good at one slice of scientific work: reading, predicting, and searching a
              design space. As that slice gets cheap, whatever is left over starts to set the pace.
            </p>
            <p>
              Software has already been through this. Writing code got cheap, and code review turned
              into the thing everybody complains about. My working hypothesis was that science would
              rhyme, with a harder remainder, because most of what is left in science is fabrication,
              funding, approval, and agreement.
            </p>
            <p>
              If that is right, it changes what is worth funding. So it seemed better to test it
              against 103 real gaps than to assert it.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What I found</h2>
            <h3>Twenty-two gaps now have a primary blocker that current AI can work on</h3>
            <p>
              That is {share}% of the map, and four years ago it was close to none. Whatever else is
              true, that is a remarkable four years.
            </p>
          </div>

          <figure className="card" style={{ marginTop: 20 }}>
            <div className="pad">
              <MaturityGradient aiTypes={s.ai_type} maturityByType={s.maturity_by_ai_type} />
              <figcaption>
                For each kind of work, the share of the gaps it primarily blocks where the relevant
                AI capability already works today. All {s.n_gaps} gaps, one primary kind each.
              </figcaption>
            </div>
          </figure>

          <div className="col">
            <p style={{ marginTop: 24 }}>
              The arrival is uneven, and it tracks how quickly you can check an answer. Where a result
              can be verified in a loop, AI is here: {llm['Working now']} of {llmTot} gaps blocked by
              reading and synthesis are already served. Where verification is slow, contested, or a
              matter of what an institution agrees to, it is not. All {buildTot} gaps blocked by
              physical build sit at two-to-five years or speculative.
            </p>

            <h3 style={{ marginTop: 36 }}>Then the critical paths complicate it</h3>
            <p>
              An attribute describes a gap from outside. A critical path describes it from the inside,
              by breaking the gap into the ordered steps that have to happen and asking which step
              sets the duration or the cost. That step is the binding one. Speeding up any other step
              changes nothing.
            </p>
            <p>
              Take one of the gaps AI has visibly reached:{' '}
              <em>Doing and publishing research is expensive and subject to structural roadblocks</em>.
              Reading and synthesis on that gap already works. Drafting and screening are done.
            </p>
            <p>
              Trace it step by step and three steps set the cost: finding reviewers, agreeing what a
              review means, and getting institutions to count the work. None of the three is
              cognitive. Worse, the step AI took over made one of them harder. Submissions rose 42%
              over five years in the one corpus where a journal has published full figures, and that
              load landed on reviewer recruitment, which was already binding.
            </p>
            <div className="pull">
              <p style={{ marginBottom: 0 }}>
                A gap can look half-solved from its attributes and stay entirely blocked in practice.
                That is the case for doing this per gap rather than once, and it is what I would most
                like to work on with you.{' '}
                <a href="./chains/">Both chains, with the evidence →</a>
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What I added</h2>
            <p>Four attributes on all {s.n_gaps} gaps, and two things that are additions rather than attributes.</p>
            <ul>
              <li>
                <strong>Outcome.</strong> What becomes knowable or buildable if this gap closes. Your
                gap names describe what is in the way; this describes what is on the other side, which
                is the version that recruits people.{' '}
                <a href="./map/">See it on the map</a>
              </li>
              <li>
                <strong>What kind of work is in the way, and how mature the AI for it is.</strong>{' '}
                Seven kinds of work, five with an AI analogue and two without, each at working now,
                two-to-five years, or speculative. The chart above is this attribute.
              </li>
              <li>
                <strong>Measurability tier.</strong> Whether the gap has an agreed observable, only a
                proxy, a contested observable, or a quantity that is inherently counterfactual. One of
                my four tiers failed its own audit, which is written up on the{' '}
                <a href="./method/">method page</a>.
              </li>
              <li>
                <strong>Progress indicator.</strong> One number to watch, for a sample of eight gaps.
                Six have one. Two came back empty after a genuine search, and those two are the rows I
                would read first.
              </li>
              <li>
                <strong>Four proposed gaps</strong>, written to your format and checked for
                near-duplicates against all {s.n_gaps} gaps and all {s.n_capabilities} capabilities.{' '}
                <a href="./proposed/">Read them</a>
              </li>
              <li>
                <strong>Two worked critical paths</strong>, a telescope on elapsed time and research
                publishing on reviewer labour. <a href="./chains/">Read them</a>
              </li>
            </ul>
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
                <strong>Tell me which attributes are wrong.</strong> The seven kinds of work is the
                one I would most like torn apart. The audit already found three gap types it handles
                badly.
              </li>
              <li>
                <strong>Chains across the whole map.</strong> Two is enough to show the method
                discriminates. The value is in counting how often the same binding step recurs across
                fields, and that needs all {s.n_gaps}.
              </li>
              <li>
                <strong>Typed capability edges.</strong> Nothing in the export marks a capability as
                necessary, sufficient, or partial for its gap, so the chains had to reconstruct that
                by hand. Typed edges would make chains generatable, and they lead straight to the
                urgency and impact attributes you already want.
              </li>
            </ul>
            <p>
              One thing worth knowing either way. <code>capabilities[].gaps</code> is empty for all{' '}
              {s.n_capabilities} capabilities in the v1.0 export, though <code>schema.json</code>{' '}
              documents it as populated. All {s.n_edges} edges sit on the gap side, so anyone starting
              from <code>capabilities.json</code> builds an empty graph and gets no error. Two
              capability records are missing the <code>description</code> your schema marks required,
              and six resources are referenced by no capability.
            </p>
            <p className="lead">
              <a href="mailto:david@sendorai.com">david@sendorai.com</a>. The critical version of this
              feedback is the one I want most.
            </p>
            <p style={{ fontSize: 15.5, color: 'var(--ink-3)' }}>
              This is not comprehensive and some of it is wrong. It was built in a few days, mostly by
              AI, and no human has reviewed the labels. A second pass relabelled a stratified sample
              blind; the disagreement rates, the limitations, and the calls that could have gone the
              other way are all on the <a href="./method/">method page</a>.
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
            , which describes itself as &ldquo;not by any means a comprehensive survey or prioritized
            roadmap&rdquo;. Neither is this. Nothing here reorders or ranks your gaps.
          </p>
          <p style={{ color: 'var(--ink-3)' }}>
            <a href="./gap-map-augmented.csv">CSV, keyed on your ids and slugs</a> ·{' '}
            <a href="./data.json">JSON</a> · David Sendor,{' '}
            <a href="mailto:david@sendorai.com">david@sendorai.com</a>
          </p>
        </div>
      </div>
    </>
  );
}
