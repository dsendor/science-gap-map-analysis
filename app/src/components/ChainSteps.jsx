// The chain as a schedule table.
//
// A table, not a grid of divs, for one concrete reason: the durations contain a real
// rowspan. On the publishing chain a single published median, 119 days, brackets steps
// 2 to 5 together and measures none of them individually. Rendering that as a number on
// step 2 and "not measured" on steps 3, 4 and 5 states something false about the data on
// a page whose whole argument is to look at the per-step data. A rowspan says what is
// true: one figure, four steps, no split available.
//
// Three columns carry data and get headers. The step itself is the row header. "Carries
// the cost" is a property of the row, so it is a rule down the row edge rather than a
// fourth column pretending to be data.
//
// Maturity is a fill state, not a lightness ramp. The ramp's palest step was 1.6:1 on
// this ground; fill survives greyscale, colour blindness and a contrast floor.

const MATURITY = {
  'Working now': { fill: 'full', label: 'works now' },
  '2-5 years': { fill: 'half', label: '2–5 years' },
  Speculative: { fill: 'hollow', label: 'speculative' },
};

// The first sentence of a blocker. Step 3's runs to 549 characters and triples the
// height of its row; the full text is on the chains page.
const firstSentence = (t) => {
  if (!t) return null;
  // A period between digits is a decimal, not a sentence end: "4.5 invitations…"
  const m = t.match(/^.*?(?<!\d)[.!?](?=\s|$)/);
  return m ? m[0] : t;
};

export default function ChainSteps({ path, showBlockers = true }) {
  const isTime = path.axis_kind === 'time';
  const val = (l) => (isTime ? l.duration_years : l.duration_days);
  const unit = isTime ? (v) => (v === 1 ? 'year' : 'years') : () => 'days';
  const unitShort = isTime ? 'year' : 'day';

  // seq -> the link whose figure covers it, so a covered row renders no duration cell
  // and the covering row spans them all.
  const coveredBy = new Map();
  for (const l of path.links) {
    const c = l.duration_covers;
    if (!c?.length) continue;
    // rowSpan only ever spans downward from the cell that declares it, so a figure
    // recorded on any row but the first one it covers would attach itself to unrelated
    // steps and leave phantom cells. Fail loudly rather than render a wrong table.
    if (c[0] !== l.seq) {
      throw new Error(
        `${path.id} step ${l.seq}: duration_covers starts at ${c[0]}, so the figure is not on the first row it covers`
      );
    }
    for (const n of c) coveredBy.set(n, l.seq);
  }

  const noCaps = path.links.filter((l) => !(l.capability_links ?? []).length).length;

  return (
    <figure className="sched">
      <table>
        <thead>
          <tr>
            <th scope="col" className="sched__hstep">Step</th>
            <th scope="col">AI reaches it</th>
            <th scope="col">Gap Map capabilities</th>
            <th scope="col" className="sched__htime">Elapsed</th>
          </tr>
        </thead>
        <tbody>
          {path.links.map((l) => {
            const caps = l.capability_links ?? [];
            const carries = l.is_binding === 1 && path.axis_kind === 'cost';
            const d = val(l);
            const covers = l.duration_covers ?? null;
            const isCovered = coveredBy.has(l.seq) && coveredBy.get(l.seq) !== l.seq;
            const m = MATURITY[l.maturity];

            return (
              <tr key={l.seq} className={carries ? 'is-cost' : undefined}>
                <th scope="row" className="sched__step">
                  <span className="sched__seq">{String(l.seq).padStart(2, '0')}</span>
                  <span className="sched__name">{l.link}</span>
                  {carries && <span className="sched__costflag">carries the cost</span>}
                  {showBlockers && l.blocker && (
                    <span className="sched__blocker">{firstSentence(l.blocker)}</span>
                  )}
                </th>

                <td className="sched__ai">
                  {l.ai_acts ? (
                    <>
                      <i className={`fill fill--${m?.fill ?? 'half'}`} aria-hidden="true" />
                      {m?.label ?? l.maturity}
                    </>
                  ) : (
                    <span className="sched__no">— no</span>
                  )}
                </td>

                <td className="sched__caps">
                  {caps.length === 0 ? (
                    <span className="sched__none">none</span>
                  ) : (
                    <>
                      <span className="sched__capcount">
                        {caps.length} {caps.length === 1 ? 'capability' : 'capabilities'}
                      </span>
                      <ul>
                        {caps.map((c) => (
                          <li key={c.name}>
                            {c.url ? (
                              <a href={c.url} target="_blank" rel="noreferrer">{c.name}</a>
                            ) : (
                              c.name
                            )}
                            {c.initiatives?.length > 0 && (
                              <span className="sched__init">
                                {c.initiatives.map((i, n) => (
                                  <span key={i.title}>
                                    {n > 0 && ', '}
                                    {i.url ? (
                                      <a href={i.url} target="_blank" rel="noreferrer">{i.title}</a>
                                    ) : (
                                      i.title
                                    )}
                                  </span>
                                ))}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </td>

                {isCovered ? (
                  // The rowspan cell lives only in the covering row's <tr>, and the
                  // mobile rule turns table cells into blocks, which drops rowspan and
                  // with it every covered row's duration. Without this the three rows
                  // this component exists to stop mis-labelling would show nothing at
                  // all on a phone.
                  <td className="sched__time sched__time--covered">
                    <span className="sched__note">
                      Inside the {val(path.links.find((x) => x.seq === coveredBy.get(l.seq)))}-
                      {unitShort} span carried on step {coveredBy.get(l.seq)}.
                    </span>
                  </td>
                ) : (
                  <td className="sched__time" rowSpan={covers ? covers.length : 1}>
                    {d != null ? (
                      <>
                        <span className="sched__num">
                          {d} <small>{unit(d)}</small>
                        </span>
                        {covers && covers.length > 1 && (
                          <span className="sched__span">
                            one figure, steps {covers[0]}–{covers[covers.length - 1]}
                          </span>
                        )}
                        {l.duration_span_note && (
                          <span className="sched__note">{l.duration_span_note}</span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="sched__nofig">no published figure</span>
                        {l.duration_span_note && (
                          <span className="sched__note">{l.duration_span_note}</span>
                        )}
                      </>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <figcaption className="sched__key">
        <strong>
          {noCaps} of {path.links.length} steps have no capability attached.
        </strong>
        <span><i className="fill fill--full" />works now</span>
        <span><i className="fill fill--half" />2–5 years</span>
        <span><i className="fill fill--hollow" />speculative</span>
        <span className="sched__keycost">gold edge · carries the cost</span>
      </figcaption>
    </figure>
  );
}
