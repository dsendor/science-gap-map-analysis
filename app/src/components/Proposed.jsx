// Text I added that was not in David's draft, marked so he can accept or cut it before
// this is sent. Everything wrapped in this component is a proposal, not a decision.
// When the review is done this component and every use of it comes out.
export default function Proposed({ children, note }) {
  return (
    <span className="proposed" title={note ?? 'Proposed addition — not in David’s draft'}>
      {children}
    </span>
  );
}
