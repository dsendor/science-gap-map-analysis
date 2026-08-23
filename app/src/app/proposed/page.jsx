import data from '../../../public/data.json';
import Nav from '../../components/Nav';
import GapCard from '../../components/GapCard';

export const metadata = { title: 'Four proposed gaps' };

export default function ProposedPage() {
  const { new_gaps: newGaps, summary: s } = data;
  return (
    <>
      <Nav here="proposed/" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>Four gaps I&rsquo;d propose</h1>
            <p className="lead">
              Written to your format: a title-case declarative name, 30 to 60 words, no urgency
              language, no named vendors.
            </p>
            <p>
              Each one was greped against all {s.n_gaps} of your gaps and all {s.n_capabilities} of
              your capabilities for near-duplicates, and checked against current programmes to see
              whether it is already funded and under construction. Two of those funding checks came
              back &ldquo;not clear&rdquo;, and say so. Open a card for both tests, the full
              near-duplicate check, and the funding check.
            </p>
            <p>
              These live in their own table with ids prefixed <code>new-</code>. None of them is a
              Convergent-style UUID, so nothing downstream can confuse a proposal with your data.
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
