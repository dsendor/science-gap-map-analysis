// A banner saying who wrote the page you are on. Every page except the front page and
// the one worked gap is a model's first pass, and a reader should not have to infer
// that from a tag halfway down.
export default function PageProvenance({ children }) {
  return (
    <div className="provenance">
      <span className="tag flag">AI written</span>
      <span>{children}</span>
    </div>
  );
}
