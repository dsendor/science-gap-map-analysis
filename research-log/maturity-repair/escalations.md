# Maturity repair: questions for David

Four gaps out of 54 reviewed. Everything else was decided on the branch; the reasoning
for each decision is in `report.md` and in the `note` field of
`research-log/relabel-adjudication.json`.

These four are untouched in the data. They still carry the label the mechanical
adjudication gave them, so if you answer "leave it" nothing needs to change.

Two of them are the only `Coordination and institutional` gaps still labelled
`Working now` after the repair — that category went from 10 working-now gaps to these
two. So these two answers decide whether the artifact says coordination has two
working-now gaps, one, or none.

---

### Ephemeral Societal Data on Proprietary Platforms
**Current:** Coordination and institutional / Working now  ·  **v1:** Working now  ·  **v2:** Working now
**The gap says:** "Much critical data is stored on proprietary platforms and is at risk of disappearing, hindering long-term research and reproducibility."
**Case for Working now:** Web-scale archiving is solved and running — Internet Archive, national legal-deposit programmes, Common Crawl. Wherever permission exists the capability is applied today and the data is preserved.
**Case for 2-5 years or Speculative:** The gap is the platforms that do *not* grant permission, and nothing applied today moves those. Under the pinned definition this is convening a standards body, not getting screening adopted.
**Question for David:** Does a capability that works completely wherever it is permitted count as `Working now` when permission is the gap — yes or no?

---

### Clinical Trials Are Poorly Optimized for Evidence Gathering
**Current:** Coordination and institutional / Working now  ·  **v1:** 2-5 years  ·  **v2:** Working now
**The gap says:** "Current clinical trial designs are not sufficiently optimized for gathering robust evidence, leading to inefficiencies and suboptimal outcomes."
**Case for Working now:** Adaptive platform trials are the rare institutional innovation that actually reached scale. RECOVERY enrolled over 40,000 patients, answered dexamethasone in three months, and changed global standard of care; I-SPY2 has run Bayesian adaptive allocation since 2010; FDA has issued adaptive-design guidance. The mechanism is deployed and moving the gap now.
**Case for 2-5 years or Speculative:** Those are a handful of exceptions against tens of thousands of conventional trials, and the reason the rest do not adopt them is sponsor incentives and regulatory risk aversion — an adoption problem, which is the pattern this repair marked `2-5 years` everywhere else. The AI content is also thin: Bayesian adaptive randomisation is statistics, not a recent AI capability.
**Question for David:** Is a proven-at-scale institutional mechanism `Working now` even when the field at large has not adopted it — or does the non-adoption make it `2-5 years`, the same call made for scientific publishing, development economics and civic deliberation?

---

### Inadequate Emergency Climate Interventions and Response
**Current:** ML surrogates and prediction / Working now  ·  **v1:** Working now  ·  **v2:** Working now
**The gap says:** "Current approaches lack the fine-grained models and rapid response mechanisms required to adapt to diverse climate impacts, such as heatwaves... The ability to control local weather phenomena—including cloud formation and hurricanes—could help mitigate climate risks."
**Case for Working now:** The gap names fine-grained models and rapid response, and learned weather emulators are operational — ECMWF's AIFS runs in production, GraphCast and GenCast beat the physical models on the lead times that emergency response actually uses.
**Case for 2-5 years or Speculative:** The gap next door, *Insufficient Monitoring and Modeling of Climate Processes and Control Paths*, already carries the monitoring-and-modelling claim and is `Working now`. What is left to distinguish this one is intervention — controlling cloud formation and hurricanes — and nothing applied today moves that. A rationale that would serve both gaps equally has labelled the category, not the gap.
**Question for David:** Should this gap be read as the intervention gap, with the modelling half already covered by the neighbouring gap — yes or no?

---

### AI is Still Narrow in its Reasoning and Planning
**Current:** LLM reasoning and synthesis / Speculative  ·  **v1:** 2-5 years  ·  **v2:** Speculative
**The gap says:** "Current AI systems exhibit narrow reasoning and planning capabilities compared to human cognition."
**Case for Speculative:** `Speculative` means no clear path from what exists today. Human-level breadth of reasoning and planning has no agreed path, and the gap's own proposed route — brain-inspired architectures and cognitive frameworks — is not the route anyone is currently making progress on.
**Case for 2-5 years:** The gap has visibly moved in the last two years along a route that does exist: reinforcement learning on reasoning traces, and models that plan over long horizons. Calling a gap `Speculative` while it is measurably closing each year is the harder claim to defend.
**Question for David:** This is one of the four `ai-as-object` gaps and it is the map's statement about AI itself, so it will be read closely. `Speculative` or `2-5 years`?
