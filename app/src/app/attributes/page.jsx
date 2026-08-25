import data from '../../../public/data.json';
import Nav from '../../components/Nav';
import { TIER_ORDER } from '../../lib/constants';

export const metadata = { title: 'The four attributes, and how to read them' };

const KINDS = [
  { k: 'Reading and synthesis', ai: 'Language models. Working today.',
    what: 'Reading, summarizing, connecting, proposing. Work whose product is text or an argument.' },
  { k: 'Prediction and modeling', ai: 'Learned surrogates. Working today in several fields.',
    what: 'Learning a fast approximation of something slow to compute or measure, then using it in place of the slow thing.' },
  { k: 'Design search', ai: 'Generative design and search. Working today for proteins and materials.',
    what: 'Searching a large space of candidate designs against a stated objective.' },
  { k: 'Measurement and sensing', ai: 'Learned reconstruction and denoising. Working today.',
    what: 'Getting a usable measurement out of a noisy or indirect one.' },
  { k: 'Running experiments', ai: 'Self-driving labs. Early, and real.',
    what: 'Choosing the next experiment and running it with nobody in the loop.' },
  { k: 'Real-time control', ai: 'Learned control. Working today for plasma and adaptive optics.',
    what: 'Closed-loop sense, decide and actuate on hardware that already exists, at machine timescales. Added after a blind audit found it had no home in the original seven.' },
  { k: 'Physical build', ai: 'Robotics, and it is moving fast. One of these gaps has a capability that works today; the rest are two-to-five years or speculative.',
    what: 'Fabricating, assembling, or handling matter.' },
  { k: 'Coordination and institutions', ai: 'Hardest of the eight, and not empty: matching, scheduling, drafting and forecasting all apply.',
    what: 'Approval, funding, agreement, incentives, and who counts what.' },
];

export default function AttributesPage() {
  const { summary: s } = data;
  const tierText = {
    'Directly measurable': 'An observable quantity exists and everyone agrees which direction is an improvement. Elapsed years, cost per trial, cubic millimeters reconstructed.',
    'Proxy only': 'You can measure inputs or side effects but not the thing itself. This tier failed its own audit at 78% disagreement and I would drop it.',
    'Verification contested': 'A candidate observable exists and there is no agreement that moving it settles anything. Quantum gravity is the clean case.',
    'Counterfactual required': 'The quantity of interest is something that did not happen. No observation of the world you are in contains it.',
  };

  return (
    <>
      <Nav here="attributes/" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>The four attributes</h1>
            <p className="lead">
              What each one is, why it might be worth having, and where it breaks. Two of the four
              have known failure modes and they are described here rather than buried.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>1. The outcome</h2>
            <p>
              One sentence saying what becomes knowable or buildable if the gap closes.
            </p>
            <p>
              Every gap name in the map is a deficit: <em>X is hard</em>, <em>we can&rsquo;t do Y</em>,{' '}
              <em>Z is still invisible</em>. That is the right way to name a gap and the wrong way to
              recruit someone into working on it. The outcome is the same fact stated from the far
              side, and it is the line a person reads when deciding whether this is their problem.
            </p>
            <p>
              <strong>Where it breaks.</strong> These are my interpretation of your descriptions, not
              a restatement of them, and a few of them editorialize. {s.confidence.outcome.confident}{' '}
              of {s.n_gaps} are marked confident, which is too tidy for the most interpretive of the
              four. If you adopt this attribute, the field leads should write them.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>2. What kind of work is in the way</h2>
            <p>
              Eight values, naming <strong>kinds of work</strong> and not kinds of model. This column
              answers one question only: what stands between here and the gap closing. It is not a
              claim that AI does that work &mdash; that is the separate question in the last column.
            </p>
            <p>
              Six of the eight were originally named after the AI that would do the work
              (&ldquo;LLM reasoning and synthesis&rdquo;) and two after the work itself
              (&ldquo;Physical build and manipulation&rdquo;). Read together, that made the
              institutional category look out of place when it was the one naming the thing
              consistently. All eight are now named for the work. The stored labels and every
              recorded judgment are unchanged; only the words a reader sees moved.
            </p>
          </div>
          <div className="scroll" style={{ marginTop: 16 }}>
            <table>
              <thead>
                <tr>
                  <th>Kind of work</th>
                  <th>What it means</th>
                  <th className="num">Gaps</th>
                  <th>Where the AI for it stands</th>
                </tr>
              </thead>
              <tbody>
                {KINDS.map((r) => (
                  <tr key={r.k}>
                    <td>
                      <strong>{r.k}</strong>
                    </td>
                    <td>{r.what}</td>
                    <td className="num">{s.ai_type[r.k] ?? 0}</td>
                    <td>{r.ai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col">
            <p style={{ marginTop: 18 }}>
              Each gap gets exactly one primary and any number of secondaries. Alongside it sits a
              maturity: <strong>working now</strong>, <strong>two-to-five years</strong>, or{' '}
              <strong>speculative</strong>, describing the relevant AI capability rather than the gap.
            </p>
            <div className="pull">
              <p>
                <strong>Where it breaks, and this is the attribute I would most like torn apart.</strong>
              </p>
              <p>
                A full independent relabel of all 103 gaps put type disagreement at 25%. It also
                confirmed the eighth category was worth adding: four gaps took real-time control as
                their primary. Two problems the audit found are still open. Gaps where AI is the
                object rather than the instrument now carry a separate frame flag instead of a type.
                Composite gaps, which bundle sub-problems needing different values, are still recorded
                under one label.
              </p>
              <p>
                Maturity is the weakest thing measured here. The two passes agreed on the kind of work
                for 77 of 103 gaps and on maturity for only 63, and the disagreements moved
                overwhelmingly in one direction. The working-now gradient the first pass produced did
                not replicate and has been withdrawn.
              </p>
              <p style={{ marginBottom: 0 }}>
                Fusing &ldquo;what kind of blocker&rdquo; with &ldquo;how mature is the AI for
                it&rdquo; into one axis is probably the underlying mistake. Two fields would be
                cleaner than one, and would make the robotics trajectory legible instead of hiding it
                inside a maturity label.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>3. The measurability tier</h2>
            <p>
              Whether the gap has something you could actually watch. Your own roadmapping criterion
              asks whether success is unambiguously measurable, and applying it to all{' '}
              {s.n_gaps} gaps turns out to sort them sharply.
            </p>
          </div>
          <div className="scroll" style={{ marginTop: 16 }}>
            <table>
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>What it means</th>
                  <th className="num">Gaps</th>
                </tr>
              </thead>
              <tbody>
                {TIER_ORDER.map((t) => (
                  <tr key={t}>
                    <td>
                      <strong>{t}</strong>
                    </td>
                    <td>{tierText[t]}</td>
                    <td className="num">{s.tier[t] ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col">
            <p style={{ marginTop: 18 }}>
              <strong>Where it breaks, and I would ship three tiers rather than four.</strong>{' '}
              &ldquo;Proxy only&rdquo; ran 78% disagreement in the blind audit against 0% for
              directly measurable. Every auditor independently reported it was the nearest
              alternative and almost never the winner. A category that two careful readers apply
              differently four times in five is not a category.
            </p>
            <p>
              The two tiers that held up are the ones carrying the argument, and the bottom tier is
              where the attribute earns itself:{' '}
              <a href="./indicators/">
                the two gaps where a genuine search for a progress number came back empty
              </a>{' '}
              are both in it, and that is the tier being correct rather than the search failing.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>4. The progress indicator</h2>
            <p>
              The one number you would watch to know whether a gap is closing. Done for eight gaps,
              spread across all four tiers so the set could not be read as picking the easy ones.
            </p>
            <p>
              Six have a number. Two do not. Eight is a feasibility probe rather than an attribute you
              could adopt today, and what it establishes is that indicators are buildable for tier-one
              gaps and honestly are not for tier-four ones.{' '}
              <a href="./indicators/">All eight, with sources and caveats</a>
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>Confidence flags</h2>
            <p>
              Every label carries <span className="tag">confident</span> or{' '}
              <span className="tag flag">guess</span>. A run that produced no guesses would not be a
              careful run.
            </p>
            <p>
              One caveat on reading them. Because every proxy-only tier was downgraded as a class,{' '}
              {s.tier['Proxy only']} of the {s.confidence.tier.guess} flagged tiers come from that one
              rule and only {s.confidence.tier.guess - (s.tier['Proxy only'] ?? 0)} are independent
              judgments. The tier flag is closer to a synonym for proxy-only than to a measure of my
              uncertainty. <a href="./method/">The full audit</a>
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
