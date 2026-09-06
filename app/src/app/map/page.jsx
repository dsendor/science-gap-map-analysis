import data from '../../../public/data.json';
import Nav from '../../components/Nav';
import PageProvenance from '../../components/PageProvenance';
import MapBrowser from '../../components/MapBrowser';

export const metadata = { title: 'The extended map — 103 gaps with four added attributes' };

export default function MapPage() {
  const { summary: s, gaps, new_gaps: newGaps } = data;
  return (
    <>
      <Nav here="map/" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>The extended map</h1>
            <PageProvenance>
              Every label on this page is Claude&rsquo;s judgment, with a written rationale and a confidence flag. No person has reviewed any of them.
            </PageProvenance>
            <p className="lead">
              All {s.n_gaps} gaps in your export order, each with your problem statement and the four
              added attributes. Open a card for the reasoning behind every label and your own
              foundational capabilities for that gap. Titles link back to gap-map.org.
            </p>
            <p>
              <a href="../gap-map-augmented.csv">Download the CSV</a>, keyed on your{' '}
              <code>id</code> and <code>slug</code>, or the{' '}
              <a href="../data.json">JSON</a> this page runs on.
            </p>
          </div>
        </section>
        <section style={{ paddingTop: 26 }}>
          <MapBrowser gaps={gaps} newGaps={newGaps} />
        </section>
      </main>
      <div className="footer">
        <div className="wrap col">
          <p style={{ color: 'var(--ink-3)' }}>
            David Sendor, <a href="mailto:david@sendorai.com">david@sendorai.com</a> ·{' '}
            <a href="../">The argument</a> · <a href="../method/">Method &amp; audit</a>
          </p>
        </div>
      </div>
    </>
  );
}
