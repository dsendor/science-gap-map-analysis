import data from '../../public/data.json';
import Nav from '../components/Nav';
import ChainSteps from '../components/ChainSteps';
import Proposed from '../components/Proposed';
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
            <h1>The Gap Map is a good idea. I think it can be better.</h1>
            <p className="lead">
              I used Claude Code to try to make it better, and there are two places I would start.
            </p>
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
            <p className="proposed-key">
              <i />
              highlighted text is mine and not yet approved
            </p>
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
              contribution.{' '}
              <Proposed note="Scope note — the gap bundles three axes and a chain needs one.">
                Your gap statement bundles cost, speed and who can afford to take part. This chain
                follows cost.
              </Proposed>
            </p>
          </div>

          <div style={{ marginTop: 20 }}>
            <ChainSteps path={publishing} />
          </div>

          <div className="col">
            <h3>Three takeaways</h3>
            <ol className="bigsteps">
              <li>
                <strong>Production and drafting is where AI has had the biggest impact</strong>, and
                where it will keep having one.{' '}
                <Proposed note="The nuance David asked to lead with, plus the arXiv parallel.">
                  The saving is real and large, and it has not arrived as cheaper publishing.
                  Submissions rose 42% after ChatGPT&rsquo;s release, and the work that came off
                  authors landed downstream on volunteer editors doing desk screening. This has
                  happened before: arXiv made dissemination free more than thirty years ago and
                  neither subscription prices nor the time to publish fell, because what journals
                  sell is not distribution.
                </Proposed>
              </li>
              <li>
                <strong>Review is a clear blocker.</strong> AI can act on it, and it may stay hard
                anyway.{' '}
                <Proposed note="The specific reason review stays hard even with AI on it.">
                  It can match a reviewer to a paper. It cannot make that reviewer say yes.
                </Proposed>
              </li>
              <li>
                <strong>Credit and legitimacy is the biggest challenge</strong>, and the one AI is
                least able to move.{' '}
                <Proposed note="Ties the takeaway to the capability finding above.">
                  It is also the last step, it has no published measure, and until recently nobody
                  had anything attached to it.
                </Proposed>
              </li>
            </ol>
            <p>
              <Proposed note="This is the finding that comes from Convergent's own data rather than my labels. I think it is the strongest thing on the page, but it is my addition.">
                One thing worth saying because it comes from your data and not from my labels:{' '}
                {empty} of the {publishing.links.length} steps have no capability attached to them at
                all, and one of those is reviewer recruitment.
              </Proposed>{' '}
              <a href="./chains/">Both chains, step by step, with the evidence</a>
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
                <Proposed note="Says who, since 'experts' on its own is hard to act on.">
                  One gap here has been read by a person. The rest is a model&rsquo;s first pass and
                  is labelled that way throughout.
                </Proposed>
              </li>
            </ol>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What I&rsquo;d like from you</h2>
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
            David Sendor. I spent 15+ years applying AI to hard problems in large organizations, most
            recently leading Enterprise Data Science at Liberty Mutual.{' '}
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
            <a href="./gap-map-augmented.csv">CSV</a> &middot; <a href="./data.json">JSON</a>
          </p>
        </div>
      </div>
    </>
  );
}
