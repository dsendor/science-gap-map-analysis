# Two worked critical paths

Generated from `critical_paths` and `critical_path_links`. Method:
`methodology/critical-path.md`. Both expectations were committed in `bbfa54f`,
before any link analysis existed; the links and findings arrived in the next
commit. The ordering is checkable in git rather than asserted.

Two chains, chosen so the results differ. A single chain shows the method works;
a pair shows it discriminates. Doing this across the whole map is the
collaboration being proposed, not the thing being given away.

---

## Chain 1 — Frontier Telescopes Are Expensive and Take Decades to Build

**Gap:** `1c1cb37e-2a00-8008-9ca1-cf81d4b44116` (Astrophysics)
**Axis:** elapsed time from first concept study to first light
**Axes excluded:** cost per unit of collecting area; cost per unit of science
return. Their sentence bundles cost with schedule, and the two run over a partly
different set of links.

```mermaid
flowchart LR
    L1["1 Science case<br/>definition"] --> L2["2 Concept studies, ranking<br/>and design competition"]
    L2 --> L3["3 Phase B start and<br/>funding authorisation"]
    L3 --> L4["4 Design<br/>maturation"]
    L4 --> L5["5 Fabrication"]
    L5 --> L6["6 Integration<br/>and test"]
    L6 --> L7["7 Launch"]
    L7 --> L8["8 Commissioning"]

    classDef acts stroke-width:3px,stroke:#0f766e,fill:#ccfbf1,color:#111
    classDef free stroke-width:1px,stroke:#94a3b8,fill:#f8fafc,color:#111
    class L1,L4,L8 acts
    class L2,L3,L5,L6,L7 free
```

Shaded links are the three a current AI capability acts on. No link is marked
binding: on a strictly sequential chain every step adds to the total, so binding
is not a property this chain can carry. Their three capabilities for this gap —
modular assembly with reduced launch costs, a space telescope factory, and
leveraging commercial component advances — all act on links 5 to 7.

### What the chain reveals

AI acts on three of the eight links, and those three are 9.5 of the 32.5 years.
Which part of the chain dominates depends on the programme, which was not
predicted:

| Programme | Concept → construction start | Construction → first light | Total |
|---|---:|---:|---:|
| JWST | 1989 → 2004, 15 y | 2004 → 2021, 17 y | 32 y |
| Rubin | early 1990s → Aug 2014, ~22 y | Aug 2014 → Jun 2025, 10.9 y | ~33 y |
| ELT | 1998 → Dec 2014, 16 y | Dec 2014 → Mar 2029, 14.3 y | ~31 y |

JWST is build-dominated; Rubin is decision-dominated; the ELT sits between them
with roughly two and a half years attributable to nothing but a funding condition
on an already-approved design.

Closing every cognitive link still leaves a frontier telescope taking well over a
decade. The generous accounting, treating the whole seven-year science-case period
as compressible, removes about nine and a half of JWST's thirty-two and a half
years. The realistic accounting, which notes those years went to community
consensus rather than to analysis, removes about two and a half.

The residual of 23 is an upper bound, not a point estimate. Gate C
(`research-log/reviews/gate-c.json`) found three intervals that count against AI
more than the milestone record supports: link 2 bundles a decadal ranking with a
Phase A design competition; link 3's appropriation blocker is demonstrated on
Rubin and the ELT rather than in JWST's own 2002-2004 window; and design
maturation demonstrably ran to the March 2010 mission critical design review,
four years past the interval it is given. Correcting them as far as the record
allows pulls the residual toward the mid-teens. It does not pull it to zero, and
that is the part that survives.

The 32.5 here and STScI's published 32 are not the same measurement — 32.5 runs
to first images in July 2022, STScI's 32 to launch in December 2021 — so their
near-agreement is rounding, not corroboration.

### Links

| # | Link | Blocker | AI type | Maturity | Years | AI acts |
|---|---|---|---|---|---:|:-:|
| 1 | Science case definition | Community consensus, not analysis capacity | LLM reasoning and synthesis | Working now | 7.0 | ● |
| 2 | Concept studies, strategic ranking and design competition | Fixed decadal cadence, running alongside the Phase A competition | Coordination and institutional | Speculative | 6.0 | |
| 3 | Phase B start and funding authorisation | Appropriation and conditions attached to it | Coordination and institutional | Speculative | 2.0 | |
| 4 | Design maturation | Technology readiness for long-lead items | Design and optimization search | Working now | 2.0 | ● |
| 5 | Fabrication | Long-lead optics, cryogenic qualification | Physical build and manipulation | 2-5 years | 5.0 | |
| 6 | Integration and test | Serial assembly, plus the 2011 replan and 2018 rework | Physical build and manipulation | Speculative | 9.0 | |
| 7 | Launch | Vehicle availability and window | Physical build and manipulation | Speculative | 1.0 | |
| 8 | Commissioning | On-orbit alignment of a segmented optic | Sensing and signal processing | Working now | 0.5 | ● |

Links 2 and 3 carry titles that describe only part of what their intervals
contain, and link 6's block includes roughly 4.3 years of replan following the
2011 near-termination. Those are Gate C's findings and they are recorded in the
link rationales rather than smoothed away here.

Link 8 is the chain in miniature: wavefront sensing across eighteen segments is
the most demanding cognitive task in the sequence and it took under seven months.

---

## Chain 2 — Doing and publishing research is expensive and subject to structural roadblocks

**Gap:** `1c1cb37e-2a00-8063-9b9f-f3c2aa784e50` (Metascience)
**Axis:** cost, measured as reviewer and editor labour per published paper
**Axes excluded:** speed and inclusiveness. Speed in particular behaves
differently by venue — journal latency is reviewer-supply-driven, conference
latency is set by a fixed programme committee calendar — so a chain mixing them
would produce a binding link that is an artifact of the venue mix.

```mermaid
flowchart LR
    P1["1 Production<br/>and drafting"] --> P2["2 Submission<br/>and screening"]
    P2 --> P3["3 Reviewer recruitment<br/>and matching"]
    P3 --> P4["4 Review<br/>judgment"]
    P4 --> P5["5 Editorial<br/>decision"]
    P5 --> P6["6 Dissemination"]
    P6 --> P7["7 Credit and<br/>legitimacy"]
    P1 -. "cheaper drafting<br/>adds load" .-> P2

    classDef binding stroke-width:3px,stroke:#b45309,fill:#fef3c7,color:#111
    classDef free stroke-width:1px,stroke:#94a3b8,fill:#f8fafc,color:#111
    class P3,P4,P7 binding
    class P1,P2,P5,P6 free
```

The dotted edge is the result that was not predicted: relieving link 1 adds load
downstream. Gate C corrected where it lands. The Organization Science corpus puts
the displaced load on volunteer editors at desk screening — among manuscripts
scoring 70%+ on AI detection, nearly 70% are desk-rejected against 44% for low-AI
submissions — and reports no invitation or recruitment figures at all. So the edge
runs to link 2, not link 3. Recruitment strain is real and separately evidenced
(4.5 invitations per accepted review; acceptance down from 43% in 2018 to 22% in
2024), but it is not what the 42% surge is shown to have caused.

### What the chain reveals

AI is not absent here. It acts fully on links 1 and 2 and on half of link 3 —
more than it touches anywhere in chain 1. The finding is that those are the links
that were never rate-limiting.

Link 3 splits into two problems that are usually named as one. **Matching** is a
well-posed prediction problem; on reviewer identification specifically, traditional
statistical representations outperform generative AI. **Willingness** is a
labour-supply problem that no matching system addresses. The binding half is the
half AI does not touch.

This chain does **not** show that publishing is a cognitive bottleneck. It shows
the reverse: the cognitive links are the cheap ones.

One observation about their capability set, running the other way from chain 1:
two of the four capabilities they attach to this gap — a post-publication peer
review layer, and new protocols for knowledge production and verification — act
directly on link 7, which binds.

### Links

| # | Link | Blocker | AI type | Maturity | Binding |
|---|---|---|---|---|:-:|
| 1 | Production and drafting | Author time; cost already collapsed | LLM reasoning and synthesis | Working now | |
| 2 | Submission and desk screening | Editor triage time | LLM reasoning and synthesis | Working now | |
| 3 | Reviewer recruitment and matching | Willingness to serve, not ability to identify | ML surrogates and prediction | 2-5 years | ● |
| 4 | Review judgment | Irreducible subjectivity above the bar | LLM reasoning and synthesis | 2-5 years | ● |
| 5 | Editorial decision | Editor labour and accountability | Coordination and institutional | 2-5 years | |
| 6 | Dissemination | Article processing charges, platform cost | Coordination and institutional | Working now | |
| 7 | Credit and legitimacy | Committees decide what counts | Coordination and institutional | Speculative | ● |

Evidence for link 3: 4.5 invitations per accepted review, nearly double 2018 (Silverchair,
*Future of Peer Review* 2026); 55% of 139 surveyed editors rate finding reviewers
a significant challenge, some sending 30 or more invitations to secure two
(Jamali, Luca and Wakeling, 15 February 2026); 21 years of declining reviewer
acceptance (Meyerson, 2002–2024).

Evidence for link 4: the NeurIPS 2021 consistency experiment found two independent
committees disagreeing on 23% of papers with roughly half the accept list changing
on a rerun, consistent with 26% in 2014; and Cortes and Lawrence find review scores
predict later impact for rejected papers but not for accepted ones.

---

## The intersection

This is the most valuable structural finding in the project, and neither chain
produces it alone.

**Chain 1's links 2 and 3 are an instance of chain 2's links 3 and 4.** Facility
approval and telescope time are both allocated by peer review of proposals. The
decadal survey is a review panel. An observing-time allocation committee is a
review panel. The blocker on chain 1's ranking link — a fixed cadence and a
scarce panel — is chain 2's reviewer recruitment link seen from the facility side.

The evidence for this is not an analogy. It is ESO's own stated reason for
changing the mechanism. Introducing **Distributed Peer Review**, in which every PI
submitting a qualifying proposal reviews ten others, ESO writes that panel load
"has become unsustainable", that classical triage "has significantly degraded the
quality of feedback for the triaged proposals", and that "it has become
progressively harder to find scientists willing to serve in the panels and in the
OPC". Those are chain 2's link 3 and link 2 verbatim, written by an observatory
about telescope time. DPR has run at ESO since Period 110 and was deployed at ALMA
from Cycle 8 and in Gemini's Fast Turnaround channel before that.

That is a live natural experiment in review capacity under load, at scale, with a
before and after. An earlier draft added that nobody funds it as research. That was
wrong twice over, and both corrections came from the gates. Gate B found the
UK Metascience Unit — GBP 10 million across UKRI and the UK government science
department, 2024 to 2027 — running randomised trials on funding processes, whose
first published result is distributed peer review cutting time-to-decision by 53
to 65 per cent. And Gate C noted that a claim of absence resting on not having
found anything is not a claim this analysis is in a position to make, least of all
to readers whose work is deciding what research to fund.

```mermaid
flowchart TB
    subgraph C1["Chain 1 · Astrophysics · elapsed time"]
        A2["Strategic ranking"]
        A3["Funding authorisation"]
    end
    subgraph C2["Chain 2 · Metascience · cost"]
        B3["Reviewer recruitment<br/>and matching"]
        B4["Review judgment"]
    end
    SHARED["Peer review of proposals<br/>panel capacity · reviewer willingness · judgment consistency"]
    A2 --> SHARED
    B3 --> SHARED
    B4 --> SHARED
    SHARED --> DPR["Distributed Peer Review<br/>ESO P110+, ALMA Cycle 8+, Gemini FT<br/>a natural experiment nobody funds as research"]

    classDef shared stroke-width:3px,stroke:#b45309,fill:#fef3c7,color:#111
    class SHARED,DPR shared
```

One qualification first, from Gate C. ESO's distributed peer review governs the
allocation of telescope observing time, not decisions to build and fund a
facility. Chain 1's link 3 is appropriation, and appropriation is not peer
review, so the edge from it has been removed; the intersection is drawn from
link 2 only, where a strategic ranking really is a panel judging proposals
against each other. Narrowed that way it holds.

Two gaps, in two different fields of their map, sharing a link. A
catalogue cannot show this: it has one row per gap and no place to record that
two rows are blocked by the same thing. Chains can, and once you have chains the
recurrence is countable rather than anecdotal. That is the argument for doing this
across the whole map, and it is the reason there are exactly two chains here.
