import data from '../../../public/data.json';
import Nav from '../../components/Nav';
import PageProvenance from '../../components/PageProvenance';
import GapCard from '../../components/GapCard';

export const metadata = { title: 'Two proposed gaps' };

export default function ProposedPage() {
  const { new_gaps: newGaps, summary: s } = data;
  return (
    <>
      <Nav here="proposed/" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>Two gaps I&rsquo;d propose</h1>
            <PageProvenance>
              Claude wrote these gap statements, working from Convergent&rsquo;s own house format. Neither has been reviewed by a person.
            </PageProvenance>
            <p className="lead">
              Written to the Gap Map&rsquo;s format: a title-case declarative name, 30 to 60 words, no urgency
              language, no named vendors.
            </p>
            <p>
              Each one was grepped against all {s.n_gaps} of the map&rsquo;s gaps and all {s.n_capabilities} of
              its capabilities for near-duplicates, and checked against current programs to see
              whether it is already funded and under construction. Two of those funding checks came
              back &ldquo;not clear&rdquo;, and say so. Open a card for all five checks: the nearest thing
              already in the map, whether the gap pulls against something else worth having, what it
              would unlock downstream, the near-duplicate search in full, and the funding check.
            </p>
            <p>
              Both are proposals, not part of the Gap Map. They are kept separately from
              Convergent&rsquo;s data everywhere, and the <span className="tag new">proposed</span>{' '}
              mark on a card is how to tell at a glance.
            </p>
          </div>
        </section>
        <section style={{ paddingTop: 20 }}>
          {newGaps.map((n) => (
            <GapCard
              key={n.id}
              gap={{
                ...n,
                primary_ai_type: n.ai_type,
                primary_maturity: n.maturity,
                outcome_confidence: n.confidence,
                primary_confidence: n.confidence,
                tier_confidence: n.confidence,
                capabilities: [],
                indicators: [],
                ai_types: [],
                is_new: 1,
              }}
            />
          ))}
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
