import data from '../../public/data.json';
import Nav from '../components/Nav';
import ChainSteps from '../components/ChainSteps';
import { AiOnly, HumanChecked } from '../components/Reviewed';

export default function Page() {
  const { summary: s, critical_paths: paths } = data;
  const publishing = paths.find((p) => p.id === 'path-publishing-cost');
  const empty = publishing.links.filter((l) => !l.capabilities?.length).length;

  return (
    <>
      <Nav here="" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>
              The Fundamental Development Gap Map is excellent. AI has moved fast enough since v1.0
              that I think it&rsquo;s worth an update.
            </h1>
            <p className="lead">
              Convergent has said the map &ldquo;isn&rsquo;t comprehensive &ndash; at all&rdquo; and
              asked for contributions. I got excited and built one with Claude Code.
            </p>
            <p>There are two places I would start.</p>
            <ol className="bigsteps">
              <li>
                <strong>Break each gap into its critical path</strong>, and work out whether and how
                each capability accelerates each step.
              </li>
              <li>
                <strong>Identify how AI can and does affect each gap</strong>, and how mature that
                AI is.
              </li>
            </ol>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>
              I did this for one gap: research publishing
              <HumanChecked />
            </h2>
            <p>
              <em>{publishing.gap_name}</em>, traced from a finished draft to a credited
              contribution.
            </p>
          </div>

          <ChainSteps path={publishing} />

          <div className="col">
            <h3>Three takeaways</h3>
            <ol className="bigsteps">
              <li>
                <strong>Production and drafting is where AI has had the biggest impact</strong>, and
                where it will keep having one.{' '}
                The saving is real and large, and it has not arrived as cheaper publishing.
                Submissions rose 42% after ChatGPT&rsquo;s release &mdash; against a 20% bump
                during COVID &mdash; and the work that came off authors landed downstream on
                volunteer editors doing desk screening.
                <sup className="fn-ref">
                  <a href="#fn-orgsci" id="fn-orgsci-ref" aria-label="Source, note 1">
                    1
                  </a>
                </sup>{' '}
                This has happened before: arXiv made dissemination free more than thirty years
                ago and neither subscription prices nor the time to publish fell, because what
                journals sell is not distribution.
              </li>
              <li>
                <strong>Review is where the cost sits, and AI only reaches half of it.</strong> A
                model can pick the right reviewer for a paper. It cannot make that person agree to
                do it, and it takes 4.5 invitations to land one accepted review.
              </li>
              <li>
                <strong>Credit and legitimacy is the biggest challenge</strong>, and the one AI is
                least able to move.{' '}
                It is also the last step and it has no published measure.
              </li>
            </ol>
            <p>
              <a href="./critical-paths/">
                This chain step by step, plus two more gaps &mdash; telescopes and turbulence &mdash;
                that Claude did on its own
              </a>
            </p>
            <p className="footnote" id="fn-orgsci">
              <sup>1</sup> Organization Science AI Task Force,{' '}
              <a
                href="https://pubsonline.informs.org/doi/abs/10.1287/orsc.2026.ed.v37.n3"
                target="_blank"
                rel="noreferrer"
              >
                &ldquo;More Versus Better: Artificial Intelligence, Incentives, and the Emerging
                Crisis in Peer Review&rdquo;
              </a>
              , <em>Organization Science</em> editorial, 2026. Covers roughly 7,000 manuscripts.{' '}
              <a href="#fn-orgsci-ref" aria-label="Back to the text">
                &#8617;
              </a>
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>Next steps</h2>
            <ol className="bigsteps">
              <li>
                <strong>Expand to the rest of the map.</strong> Cover all {s.n_gaps} gaps: identify
                the critical paths, identify how much AI is affecting each one, and propose new
                capabilities to close them based on that analysis.
              </li>
              <li>
                <strong>Verify with experts.</strong>{' '}
                One gap here has been read by a person. The rest is a model&rsquo;s first pass and
                is labeled that way throughout.
              </li>
            </ol>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What I&rsquo;m hoping for</h2>
            <p className="lead">
              I&rsquo;d like to start collaborating. Does the approach resonate: expanding gaps into
              critical paths, and identifying where AI is having an impact and where it could?
            </p>
            <p>
              <a href="mailto:david@sendorai.com">david@sendorai.com</a>
            </p>
            <p style={{ fontSize: 15.5, color: 'var(--ink-3)' }}>
              The labels on all {s.n_gaps} gaps are a model&rsquo;s judgment, each with a written
              rationale and a confidence flag, and no person has read them.
              <AiOnly /> <a href="./map/">Every gap</a> &middot;{' '}
              <a href="./attributes/">the eight kinds of work</a> &middot;{' '}
              <a href="./method/">method and disagreement rates</a> &middot;{' '}
              <a href="./missing/">what this does not do</a>
            </p>
          </div>
        </section>
      </main>

      <div className="footer">
        <div className="wrap col">
          <p style={{ color: 'var(--ink-3)' }}>
            David Sendor. I spent 20 years applying AI to hard problems in large organizations,
            including previously leading Enterprise Data Science at Liberty Mutual. I&rsquo;m now
            focusing on exploring this question.{' '}
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
            . Nothing here reorders or ranks the Gap Map&rsquo;s gaps, and the source data is unmodified.{' '}
            <a href="./gap-map-augmented.csv">CSV</a> &middot; <a href="./data.json">JSON</a>{' '}
            &middot;{' '}
            <a href="https://github.com/dsendor/science-gap-map-analysis" target="_blank" rel="noreferrer">
              Source and every label on GitHub
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
