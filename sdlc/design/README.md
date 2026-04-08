# Design Phase Templates

This folder contains lightweight templates used during the **design** phase.

## Available Templates

- **architecture-decision-record-template.md**  
  Used to document significant architectural or technical decisions and their trade-offs.

- **technical-design-template.md**  
  High-level technical design document that describes how a feature or component will be built.

- **design-checklist.md**  
  Checklist to ensure the design phase is complete and ready for implementation.

## When to Use

- Use **architecture-decision-record-template.md** when making important decisions with real trade-offs (tech stack, security model, data strategy, integration approach, etc.).
- Use **technical-design-template.md** when a feature needs clear technical structure (data models, API design, component breakdown, flows, etc.).
- Use **design-checklist.md** to validate that design is complete before starting implementation.

## Recommended Workflow

1. After the PRD is approved, start the design phase (via `/create_technical_design` or by spawning the Design Agent).
2. Create ADRs for any major architectural decisions.
3. Fill out the Technical Design document for complex features.
4. Complete the **design-checklist.md**.
5. Get design approval before moving into implementation.

**Note:** On brand new projects, limit ADRs to only the most impactful foundational decisions. Do not create an ADR for every small choice.

## Best Practice

- Keep design artifacts lean and focused.
- ADRs are for recording **why** a decision was made. The technical design document is for describing **how** it will be built.
- Design phase should be completed before significant implementation work begins (except for simple bug fixes or UI-only changes).
- ADR decisions cannot be deferred to the TDD. If a decision meets the ADR threshold, it gets its own ADR file. Documenting a decision in the TDD  does not substitute for an ADR.

Templates in this folder follow a **lean agile** approach.