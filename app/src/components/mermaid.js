// The same Mermaid sources as docs/critical-paths.md, shipped so a reader can paste
// a chain into their own tooling. The page renders the chains itself; this is the
// portable form, not the render path.
export const MERMAID = {
  'path-telescope-elapsed-time': `flowchart LR
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
    class L2,L3,L5,L6,L7 free`,
  'path-publishing-cost': `flowchart LR
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
    class P1,P2,P5,P6 free`,
  intersection: `flowchart TB
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
    SHARED --> DPR["Distributed Peer Review<br/>ESO P110+, ALMA Cycle 8+, Gemini FT<br/>a natural experiment with a before and after"]

    classDef shared stroke-width:3px,stroke:#b45309,fill:#fef3c7,color:#111
    class SHARED,DPR shared`,
};
