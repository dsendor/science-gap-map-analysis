import data from '../../public/data.json';
import Nav from '../components/Nav';
import ChainSteps from '../components/ChainSteps';
import { AiOnly, HumanChecked } from '../components/Reviewed';

export default function Page() {
  const { summary: s, gaps, critical_paths: paths } = data;
  const publishing = paths.find((p) => p.id === 'path-publishing-cost');

  // Derived here rather than retyped into prose, so a number cannot drift out of step
  // with the database.
  const pubGap = gaps.find((g) => g.id === publishing.gap_id);
  const acts = publishing.links.filter((l) => l.ai_acts).length;
  const steps = publishing.links.length;
  const empty = publishing.links.filter((l) => !l.capabilities?.length).length;
  const nCaps = pubGap?.capabilities?.length ?? 4;

  return (
    <>
      <Nav here="" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>AI is accelerating science. The Gap Map should show where.</h1>
            <p className="lead">
              One of your gaps taken apart into the seven steps it actually runs through, and an
              AI-reach label on all {s.n_gaps}.
            </p>
            <p>
              I&rsquo;ve built two things on top of the {data.source.snapshot} export, and
              they&rsquo;re both downloadable as <a href="./gap-map-augmented.csv">CSV</a> and{' '}
              <a href="./data.json">JSON</a>, keyed on your own ids and slugs. One is a label on every
              gap saying what kind of work is in the way and whether AI gets there. The other is a
              single gap broken all the way down into the ordered steps that have to happen, with a
              number on each one. None of your data has been touched.
            </p>
            <p>
              The second thing is why I&rsquo;m writing. A one-line label on a gap the size of
              &ldquo;doing and publishing research is expensive&rdquo; can&rsquo;t tell you which part
              of it is expensive. So which step is the money actually in? You can&rsquo;t answer that
              without breaking the gap into steps &ndash; and once I did, something fell out of your
              own data that I hadn&rsquo;t expected.
            </p>
            <p>
              Treat this the way you ask people to treat the map itself: one gap done properly,{' '}
              {s.n_gaps - 1} done quickly, and a probe rather than a survey!{' '}
              <a href="mailto:david@sendorai.com">david@sendorai.com</a>
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
              <em>{publishing.gap_name}</em>, traced from a finished draft to a credited
              contribution. Seven steps. This is the one section a person has read line by line
              against the gap; everything else on the site carries an <AiOnly /> badge and means it.
            </p>
            <p>
              A chain has to be a path to <em>something</em>, and your gap statement bundles three of
              them &ndash; cost, speed, and who can afford to take part. I picked cost, said so, and
              left the other two as separate chains. So the end of this one is:{' '}
              {pubGap?.outcome
                ? pubGap.outcome.charAt(0).toLowerCase() + pubGap.outcome.slice(1)
                : null}
            </p>
            <p>
              My one-line label for the gap said the work in the way was coordination and
              institutional. Seven steps later the trace agreed and got specific: the cost sits in
              finding reviewers, in agreeing what a review means, and in getting institutions to
              count the work. Those three were written into the label&rsquo;s rationale before the
              decomposition existed, which is a nice result and not an independent one &ndash; I
              wrote both, so treat it as a consistency check.
            </p>
          </div>

          <div style={{ marginTop: 22 }}>
            <ChainSteps path={publishing} />
            <div className="steps-legend">
              <span><i style={{ background: 'var(--reach-1)' }} />works now</span>
              <span><i style={{ background: 'var(--reach-2)' }} />2–5 years</span>
              <span><i style={{ background: 'var(--reach-3)' }} />speculative</span>
              <span><i style={{ background: 'var(--none)', opacity: 0.55 }} />no AI reaches it</span>
              <span style={{ color: 'var(--cost)' }}>gold row · carries the cost</span>
            </div>
          </div>

          <div className="col">
            <p>
              AI reaches {acts} of those {steps} steps, which is more than I&rsquo;d expected going
              in. On steps 3 and 4 it only reaches the tractable half: it&rsquo;ll match a reviewer to
              a paper, and it won&rsquo;t make that reviewer say yes.
            </p>
            <p>
              Drafting used to eat researcher-weeks per paper and AI has taken a large share of that
              out. Publishing didn&rsquo;t get cheaper. In the one journal with a published five-year
              full-submission corpus, submissions rose 42% after ChatGPT&rsquo;s release against the
              prior two-year window, and the load that came off the authors landed a step downstream
              on volunteer editors doing desk screening.
            </p>
            <p>
              Then the part that comes out of your data rather than out of any label of mine. Open
              this gap on your own site and you&rsquo;ll find {nCaps} foundational capabilities
              hanging off it. Map those {nCaps} onto the {steps} steps and they cluster hard: two on
              credit and legitimacy, three on dissemination, one on review judgment. {empty} of the{' '}
              {steps} steps have nothing attached at all &ndash; and one of those {empty} is reviewer
              recruitment, where editors are now sending 4.5 invitations for every accepted review,
              nearly double the 2018 rate.
            </p>
            <p>
              It&rsquo;s the same shape on the telescope gap. Your three capabilities there act on
              design maturation, fabrication, integration and launch. Nothing acts on the first three
              steps, which are the science case, the concept studies and ranking, and funding
              authorisation &ndash; and on JWST&rsquo;s record those first three steps are where most
              of the 32.5 years sit.
            </p>
            <p>
              That&rsquo;s the step-level finding, and if I could get you to take one thing from this
              page it&rsquo;d be the decomposition that produced it.{' '}
              <a href="./chains/">Both chains, step by step, with the evidence and the sources →</a>
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>The label, on all {s.n_gaps}</h2>
            <p>
              One gap is a demonstration, so the other attribute runs across the whole map and you can
              query it. Eight kinds of work &ndash; reading and synthesis, prediction and modeling,
              design search, measurement and sensing, running experiments, real-time control, physical
              build, and coordination and institutions &ndash; each carrying whether the AI for it
              works now, is two to five years out, or is speculative.
            </p>
            <p>
              Every one of those {s.n_gaps} is a model&rsquo;s judgment with a written rationale and a
              confidence flag, and no person has read them.
              <AiOnly /> A second pass relabelled all {s.n_gaps} blind and disagreed often enough that
              publishing the disagreement rate seemed more useful than hiding it &ndash; the rates are
              on the <a href="./method/">method page</a>, and what this still doesn&rsquo;t do is on{' '}
              <a href="./missing/">what&rsquo;s missing</a>.
            </p>
            <p>
              <a href="./map/">Every gap, with its label</a> &middot;{' '}
              <a href="./attributes/">The eight kinds of work, and where the label breaks</a>{' '}
              &middot;{' '}
              <a href="./proposed/">{s.n_new_gaps} proposed gaps, in your house format</a>
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What I&rsquo;d like from you</h2>
            <p>
              The step-level view is the thing I&rsquo;d most like your reaction to, and there are
              three specific ways you could tell me I&rsquo;m wrong.
            </p>
            <p>
              Critical paths across the whole map, not two. The value isn&rsquo;t in any single chain,
              it&rsquo;s in counting how often the same step recurs as the binding one across{' '}
              {s.n_fields} fields, and in seeing which steps come up empty of capabilities again and
              again. Two chains can suggest that; they can&rsquo;t establish it.
            </p>
            <p>
              Typed capability edges. Nothing in the export marks a capability as necessary,
              sufficient, or partial for its gap, so both chains reconstructed that by hand, one
              capability at a time. If you typed the edges, the step mapping stops being manual and
              starts being derivable &ndash; and it lands right next to the urgency and impact
              attributes you&rsquo;ve said you want to add.
            </p>
            <p>
              And tell me which labels are wrong. The kinds of work most of all, since that&rsquo;s
              the one running across all {s.n_gaps}.
            </p>
            <p>
              One thing you&rsquo;ll want to know either way: <code>capabilities[].gaps</code> is
              empty for all {s.n_capabilities} capabilities in the v1.0 export, even though{' '}
              <code>schema.json</code> documents it as populated. Anyone who starts from{' '}
              <code>capabilities.json</code> builds an empty graph and gets no error at any point.
            </p>
            <p className="lead">
              <a href="mailto:david@sendorai.com">david@sendorai.com</a> &ndash; and the critical
              version of this is the one I want most.
            </p>
          </div>
        </section>
      </main>

      <div className="footer">
        <div className="wrap col">
          <p style={{ color: 'var(--ink-3)' }}>
            David Sendor. I spent 15+ years applying AI to hard problems in large organizations, most
            recently leading Enterprise Data Science at Liberty Mutual. I&rsquo;m moving into AI for
            science, and what I&rsquo;m chasing is where the binding constraint goes as AI dissolves
            the cognitive bottleneck.{' '}
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
