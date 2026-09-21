import Nav from '../../../../components/Nav';
import PageProvenance from '../../../../components/PageProvenance';

export const metadata = { title: 'Turbulence, step by step' };

// The plain-language companion to path-turbulence-cost. Every number on this page is
// the same number as in research-log/critical-paths/path-turbulence-cost.json; if one
// changes there it has to change here, because a reader who only ever sees this page
// should not end up quoting a figure the chain no longer carries.
const STEPS = [
  {
    n: 1,
    name: 'Decide what you are asking, and how right the answer has to be',
    reach: false,
    cost: false,
    what: `Somebody says: I need to know the lift on this wing at this angle, to within this much, or I can't sign the drawing. That number — how right is right enough — is the whole brief for everything below.`,
    stuck: `You can't state up front how wrong the calculation will be, because the flow you care about is by definition one nobody has measured yet. So the accuracy target gets argued from precedent instead of predicted. The certification people have a name for the awkward bit: "predictive capability" is defined as using a model "under conditions for which the computational model has not been validated" — which is exactly the condition you wanted it for.`,
    plain: `This is a meeting, not a calculation. It costs nobody any computer time and it sets every cost below it.`,
  },
  {
    n: 2,
    name: 'Build the shape and chop it into a grid',
    reach: true,
    cost: false,
    what: `The computer can't see a wing. It sees a few hundred million little boxes, and it works out what the air does in each one. Making those boxes is "meshing", and where you put the small ones decides what the simulation can see.`,
    stuck: `Cutting the mesh is no longer the expensive part — a 157-million-cell grid for the aircraft case below gets built in about two minutes on a thousand processor cores, which works out at roughly 33 core-hours. Deciding where the fine cells go is the expensive part, and the people who did it say the sizing "is guided with little a priori information." You're guessing where the interesting flow will be before you've seen it.`,
    plain: `33 core-hours. That's four orders of magnitude less than the step it feeds. The machine part of meshing is basically solved; the judgement part isn't, and this chain measures machine time, so the judgement doesn't show up in the number at all.`,
  },
  {
    n: 3,
    name: 'Pick the stand-in for the eddies you can’t afford to compute',
    reach: true,
    cost: false,
    what: `This is the turbulence model proper — the cheap substitute that stands in for all the small swirls, so you only have to compute the big ones. Convergent's capability for this gap is aimed squarely here.`,
    stuck: `There's no rule that tells you which stand-in fits a flow you haven't run. The two that carry industrial aerodynamics were published in 1992 and 1994 and NASA's 2014 survey called their development "nearly stagnant" over the previous twenty years. The machine-learned replacements have a specific unsolved problem, named again in a review published on 17 September 2026: they're trained on one snapshot at a time, offline, and then asked to run inside a solver for millions of steps, and the two situations don't match.`,
    plain: `Free to choose, and it sets the bill for everything after it. This is the step the Navier-Stokes proof is closest to, and it still isn't the same question.`,
  },
  {
    n: 4,
    name: 'Get the trustworthy data you calibrate the stand-in against',
    reach: false,
    cost: false,
    what: `A stand-in is only as good as the thing you tuned it against. That reference comes from either a brute-force simulation that resolves every eddy, or a physical experiment. Both are expensive, and they're expensive in the same currency as the answer you were trying to get cheaply.`,
    stuck: `Brute-force cost grows as roughly the Reynolds number cubed, against about the first power for the cheap wall-modelled version, and in the range people have looked at, brute force runs about 100 times the cost of the next tier down. The experimental route runs into "test cost, large number of cases needed, and instrumentation limitations."`,
    plain: `This is the circle at the heart of the gap. To make a cheap model you need expensive truth, at the conditions you can't afford, and nothing in current AI produces ground truth — a model trained on the data is not more data. I first marked this step as carrying cost and a reviewer talked me out of it: a reference dataset gets computed once for a canonical flow and reused for decades, while step 5's bill lands again on every single flow condition.`,
  },
  {
    n: 5,
    name: 'Run the thing',
    reach: true,
    cost: true,
    what: `The actual simulation. For the one aircraft case where somebody published the whole bill — a Japanese high-lift research model, wing, flaps, slats, in a wind tunnel — this is 360,000 processor core-hours for one flow condition, on the fine grid.`,
    stuck: `The cost climbs faster than the machines do as you go from wind-tunnel conditions to real flight. That case sat at a Reynolds number of two million; an airliner in cruise is an order of magnitude higher, and the same authors put the scaling at Reynolds to the four-thirds power.`,
    plain: `360,000 core-hours, six times what the old-style cheap calculation costs on the same aircraft, and more than 99.9% of all the cost this chain can actually measure. Cost is already coming out of this step without any AI: the same authors put the GPU route at “an order of magnitude less” in money than CPU supercomputers, and turnaround at 7 hours on 96 GPUs against 7.5 days on 2,000 CPU cores — which is a stopwatch comparison across different hardware, not a fall in core-hours, so it doesn't show up in the number above.`,
  },
  {
    n: 6,
    name: 'Work out how wrong you probably are, and add margin',
    reach: true,
    cost: false,
    what: `You have a number. Now you need an error bar on it, because the error bar is what turns into extra metal, extra fuel, or a smaller guaranteed payload.`,
    stuck: `In practice the error bar comes from how much the answers disagree when lots of groups compute the same aircraft, and that disagreement hasn't narrowed. At the sixth Drag Prediction Workshop the middle half of the submissions spanned 4 to 5 drag counts, the full spread ran 10 to 15, and about 18% of entries were statistical outliers — "consistent with earlier workshops."`,
    plain: `A drag count is one ten-thousandth of the drag coefficient, and on a long-range airliner a handful of them is real money in fuel. Nobody has a calibrated error bar a regulator would take, so the margin gets set conservatively.`,
  },
  {
    n: 7,
    name: 'Get the calculation accepted instead of a physical test',
    reach: false,
    cost: true,
    what: `Yes — this means exactly what it sounds like. A regulator, the FAA or EASA, agreeing that a computer calculation can stand in for a wind-tunnel campaign or a flight test when you certify the aircraft. The industry term is "certification by analysis."`,
    stuck: `A regulator accepts a simulation where a validation record already exists, and the conditions you most want to simulate are the ones nobody has tested — that's why you wanted the simulation. It isn't nothing already: large antenna installations have been certified by analysis since the early 2000s, on the A330-200 and the 737-8, with approved methods of compliance behind them, and EASA and the FAA will take CFD for showing that bolting a radome onto an already-certified fuselage doesn't break the original case. Outside that narrow envelope the field is still at the stage of an industry challenge problem run by AIAA with Boeing, Airbus, DLR and NASA, reporting in 2027.`,
    plain: `Until this step moves, the physical test still happens, so its cost sits on top of everything above. No published figure says how much, and six searches from different angles didn't find one — which is itself a finding.`,
  },
];

// The four substantive resources Convergent hang off this gap's single capability, and
// the step each one would move. Their names and links are theirs; the step mapping and
// the "what changes" column are mine, and they are the arguable part.
const RESOURCES = [
  {
    title: 'Turbulence Modeling in the Age of Data (Duraisamy, Iaccarino and Xiao, 2019) \u2014 the review that set up data-driven closures',
    steps: [3],
    changes:
      'A stand-in that\u2019s right more often on flows it wasn\u2019t tuned for. It doesn\u2019t move the run cost, but it shrinks step 6\u2019s error bar \u2014 and the error bar is what turns into metal.',
  },
  {
    title: 'Beroz, A closed-form mathematical framework for modeling turbulent fluids',
    steps: [3],
    changes:
      'The long-shot version of the same thing: a stand-in you can write down and argue about, rather than one you have to trust. That would matter at step 7, because a regulator can read an equation.',
  },
  {
    title: 'Tensor networks for turbulence probability distributions (Science Advances)',
    steps: [5, 6],
    changes:
      'A cheaper way to get the statistics out of the run \u2014 the step carrying the 360,000 core-hours. A reviewer argued it belongs on step 6 as well, since a distribution of flow quantities is what a calibrated error bar is made of. I read it as step 5, and it is recorded on both, because claiming a step has nothing on it when it does is the worse mistake.',
  },
  {
    title: 'ReynKo Inc. \u2014 Beroz\u2019s company, building software and hardware around that closed-form framework',
    steps: [3, 5],
    changes:
      'The commercial route for the same idea, aimed at oil and gas, wind, aerospace and cardiovascular flow. Whether the underlying framework holds up is exactly the sort of claim step 4 exists to settle.',
  },
  {
    title: 'DARPA APAQuS \u2014 tabletop \u201cquantum wind tunnels\u201d made of ultracold quantum fluids, plus automated discovery of the governing laws',
    steps: [4, 3],
    changes:
      'The one that would break the circle. Generate turbulence data at high Reynolds number on a bench, for less than a wind tunnel costs, and step 4 stops being the wall every data-driven method at step 3 runs into.',
  },
];

export default function TurbulencePage() {
  return (
    <>
      <Nav here="critical-paths/inability-to-model-turbulence/explained/" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>Turbulence, step by step</h1>
            <PageProvenance>
              This page was written by Claude, and a second model pass has checked it. It&rsquo;s
              the plain-language companion to the turbulence critical path and carries the same
              figures. No person has read either against the gap.
            </PageProvenance>
            <p className="lead">
              What the September 2026 Navier&ndash;Stokes proof solved, what it didn&rsquo;t, and
              where the cost of predicting a turbulent flow actually sits.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>The bit to get straight first</h2>
            <p>
              We&rsquo;ve had the equations for fluid motion since the 1840s. Navier and Stokes
              wrote them down, they&rsquo;re believed to be exactly right for ordinary air and
              water, and you can buy them on a mug. Not having the equations isn&rsquo;t the
              problem.
            </p>
            <p>
              The problem is that a turbulent flow has swirls at every size at once, from metres
              down to fractions of a millimetre, each one feeding the next, and an honest
              calculation needs grid points small enough to see the smallest of them. The number of
              points you need climbs roughly with the square of the Reynolds number &mdash; the
              ratio that says how vigorously a flow tumbles &mdash; and an airliner wing in cruise
              sits around ten million. NASA&rsquo;s 2014 estimate for a deliberately cheapened
              version of the calculation, where you fake the thin layer right at the surface
              instead of resolving it, still landed at 7.5&nbsp;&times;&nbsp;10
              <sup>11</sup> unknowns for a Mach 0.2 flow at Reynolds 10<sup>8</sup>.
            </p>
            <p>
              So nobody solves the equations for a real aircraft. What everybody does instead is
              drop in a cheap stand-in for the small swirls &mdash; a{' '}
              <em>turbulence model</em>, or a <em>closure</em> &mdash; and solve the rest. The two
              stand-ins carrying industrial aerodynamics today were published in 1992 and 1994.
            </p>
            <div className="pull">
              <p>
                And here&rsquo;s the actual gap, in one sentence: nobody can tell you in advance how
                wrong a given stand-in will be on a flow it hasn&rsquo;t been tested against. Everything
                below is what people do about that.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>So what did the Navier&ndash;Stokes proof actually do?</h2>
            <p>
              The Clay Mathematics Institute&rsquo;s million-dollar question isn&rsquo;t &ldquo;can
              you predict turbulence.&rdquo; It&rsquo;s narrower and stranger than that: if you
              start a three-dimensional fluid off perfectly smoothly, do the equations always keep
              giving you a sensible answer, or can the maths run away and produce an infinite speed
              somewhere in a finite amount of time? Clay set it out as four statements, A and B
              saying it always stays smooth, C and D saying it doesn&rsquo;t.
            </p>
            <p>
              On 8 September 2026 OpenAI announced that a system of around ten thousand coordinating
              agents, running for 88 hours on an unreleased internal model, had established statement
              C, with a formalisation in Lean. The blow-up is real and the construction is a serious
              piece of mathematics &mdash; Charles Fefferman at Princeton called it the most
              important proof reached by an AI model so far. Two things are worth holding onto
              though. The construction applies a smooth external force to the fluid the whole way,
              and the unforced version &mdash; a fluid left alone, which is the one physicists care
              about &mdash; is still open. And as of a fortnight later it hadn&rsquo;t been
              independently verified; Clay still lists the problem on its site the way it always
              did.
            </p>
            <p>
              Now the part that matters for this page. Even settled completely, in either direction,
              it changes none of the seven steps below. A blow-up is a statement about whether the
              idealised continuum breaks at a point. Every step below is about the price of an
              approximate answer at Reynolds ten million, and not one of them is waiting on whether
              a smooth solution exists. Quanta&rsquo;s write-up put it flatly: the singularity
              results &ldquo;don&rsquo;t have any immediate practical consequences.&rdquo;
            </p>
            <p>
              What the result <em>is</em> strong evidence for is something else, and it&rsquo;s not
              nothing: agents did research-grade mathematics, fast. If that generalises, the step it
              would land on is step 3 &mdash; inventing a better stand-in &mdash; which happens to be
              exactly what Convergent&rsquo;s capability for this gap asks somebody to do. That&rsquo;s
              a real connection. It just isn&rsquo;t the connection the headlines made.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>The seven steps</h2>
            <p>
              This is one prediction of one turbulent flow, from someone asking the question to
              someone acting on the answer. Blue means a current AI capability acts on the step;
              gold means the step carries cost; grey means neither.
            </p>
            <div className="walk">
              {STEPS.map((s) => (
                <div
                  key={s.n}
                  className="wstep"
                  data-reach={s.reach ? 'yes' : 'no'}
                  data-cost={s.cost ? 'yes' : 'no'}
                >
                  <div className="wnum">{s.n}</div>
                  <div className="wbody">
                    <h3>{s.name}</h3>
                    <p>{s.what}</p>
                    <p>
                      <strong>What holds it up.</strong> {s.stuck}
                    </p>
                    <div className="wplain">{s.plain}</div>
                    <div className="wtags">
                      <span className={s.reach ? 'tag reach' : 'tag quiet'}>
                        {s.reach ? 'AI acts here' : 'No AI capability acts here'}
                      </span>
                      {s.cost && <span className="tag spend">Carries cost</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>Reading the seven together</h2>
            <p>
              Only two steps have a published price at all: the mesh at 33 core-hours and the run at
              360,000. That&rsquo;s the step AI reaches, and it&rsquo;s the step that was already
              getting cheaper on its own.
            </p>
            <p>
              Now look at what the unit is doing, because a reviewer caught me leaning on it.
              Core-hours is machine time. The same NASA survey quoted above says the step this page
              prices at 33 core-hours &mdash; sizing the mesh &mdash; is &ldquo;the dominant cost in
              terms of human intervention&rdquo; across the whole workflow. Stand a week of an
              engineer next to 360,000 core-hours at commodity rates and they&rsquo;re the same order
              of magnitude; stand it next to the GPU version and the engineer costs more. So the
              honest headline is that <em>the only priced step is one AI reaches, and the choice of
              unit is doing some of that work.</em>
            </p>
            <p>
              What doesn&rsquo;t move either way: four of the seven steps have no number on either
              unit, and the two practitioners point at &mdash; buying trustworthy reference data, and
              still having to run the physical test &mdash; are among them. That&rsquo;s a different
              result from the two earlier chains on this site, which both found AI missing the step
              where the time or the cost concentrated. Here the expensive part isn&rsquo;t so much
              missed as unpriced.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What Convergent&rsquo;s capability would change</h2>
            <p>
              Convergent attach one capability to this gap: <em>Develop New Modeling Frameworks for
              Turbulence</em> &mdash; &ldquo;create and implement novel mathematical models and
              computational frameworks that can more accurately simulate and predict turbulent
              flows.&rdquo; Read the name on its own and it lands on step 3. Read the five
              substantive resources behind it and it lands on four steps, which is more
              interesting.
            </p>
            <div className="grid2" style={{ margin: '22px 0' }}>
              {RESOURCES.map((r) => (
                <div className="card" key={r.title}>
                  <div className="pad">
                    <div className="wtags" style={{ marginBottom: 10 }}>
                      {r.steps.map((n) => (
                        <span className="tag" key={n}>
                          Step {n}
                        </span>
                      ))}
                    </div>
                    <p style={{ margin: '0 0 10px', fontWeight: 600 }}>{r.title}</p>
                    <p style={{ margin: 0, color: 'var(--ink-2)', fontSize: 15 }}>{r.changes}</p>
                  </div>
                </div>
              ))}
            </div>
            <p>
              So the capability set covers the middle of the workflow &mdash; the data, the model,
              the run, and arguably the error bar &mdash; and touches neither end. Steps 1, 2 and 7
              have nothing attached.
              That&rsquo;s an observation about where one capability was pointed, not a hole in
              their map, and with a single capability on this gap it&rsquo;s a thin reading either
              way. It does suggest an obvious thing to ask them though: would a capability aimed at
              step 7, at what it takes for a regulator to accept a computed answer, belong on this
              gap or somewhere else entirely?
            </p>
            <p>
              My own guess, and it is a guess: APAQuS is the one to watch. Steps 3 and 5 are
              crowded with clever people and money, and step 5&rsquo;s cost is already falling without
              any of it. Step 4 is the one where a win would change what all
              the others can do. Three of the seven steps have no current AI capability acting on
              them at all, and step 4 is the one where a win would unlock the other two!
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>In short</h2>
            <ul>
              <li>
                Turbulence isn&rsquo;t hard because the equations are missing. It&rsquo;s hard
                because solving them honestly at aircraft scale needs more computer than exists, so
                everybody uses a cheap stand-in and nobody can say in advance how wrong it will be.
              </li>
              <li>
                The September 2026 proof settled a different question &mdash; whether the idealised
                maths can blow up, with a force applied, which it can. The unforced version is still
                open, it hasn&rsquo;t been independently verified, and either way it changes none of
                the seven steps.
              </li>
              <li>
                What it does show is agents doing hard mathematics in 88 hours. The step that would
                land on is step 3, inventing a better stand-in, which is exactly what
                Convergent&rsquo;s capability for this gap asks for.
              </li>
              <li>
                Of the seven steps, only two carry a published cost: the mesh at 33 core-hours and
                the run at 360,000. AI reaches the expensive one &mdash; and GPUs got there first,
                which the same paper puts at about an order of magnitude in money.
              </li>
              <li>
                That comparison is in machine time, and machine time is half the story. In engineer
                time the 33-core-hour step is the one NASA calls the dominant cost. The unit is doing
                some of the work in the headline, which is worth knowing before you repeat it.
              </li>
              <li>
                The two steps people say cost the most have no published number at all: buying
                trustworthy reference data, and still having to run the physical test because a
                regulator won&rsquo;t take the calculation yet.
              </li>
              <li>
                &ldquo;Accepted in place of a test&rdquo; means exactly that: the FAA or EASA taking
                a simulation instead of a wind tunnel or a flight. They&rsquo;ve done it for antenna
                installations since the early 2000s, and outside that narrow envelope the industry is
                still running challenge problems to work out the rest.
              </li>
            </ul>
          </div>
        </section>
      </main>
      <div className="footer">
        <div className="wrap col">
          <p style={{ color: 'var(--ink-3)' }}>
            David Sendor, <a href="mailto:david@sendorai.com">david@sendorai.com</a> ·{' '}
            <a href="../">The turbulence critical path</a> ·{' '}
            <a href="../../">All critical paths</a> · <a href="../../../">The argument</a> ·{' '}
            <a href="../../../map/">The extended map</a>
          </p>
        </div>
      </div>
    </>
  );
}
