// The chain diagram alone, for embedding in the argument. Binding steps carry the
// heavier border, the warmer wash, and the word "binding", so the distinction never
// rests on colour.
export default function ChainMini({ path }) {
  return (
    <div className="chain">
      {path.links.map((l) => (
        <div key={l.seq} className={l.is_binding ? 'node bind' : 'node'}>
          <span className="seq">
            {l.seq}
            {l.is_binding ? ' · binding' : ''}
          </span>
          {l.link}
          {l.figure && (
            <span
              style={{
                display: 'block', marginTop: 6, fontSize: 11.5, lineHeight: 1.35,
                color: l.is_binding ? 'var(--ink)' : 'var(--ink-3)',
              }}
            >
              {l.figure}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
