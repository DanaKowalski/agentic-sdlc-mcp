# Planning Phase Templates

This folder contains lightweight templates used during the **planning** phase.

## Available Templates

- **PRD-template.md**  
  Primary template for most projects. Focuses on vision, user needs, features, and success metrics.

- **SRS-template.md** (Agile)  
  Lightweight Agile SRS for technical specification when deeper details are needed.

- **planning-checklist.md**  
  Quick checklist to verify the planning phase is complete before moving forward.

- **user-story-guidelines.md**  
  Guidelines and best practices for writing effective user stories and acceptance criteria.

## When to Use Which

- Start with **PRD** on nearly all projects.
- Use **user-story-guidelines.md** when writing or refining user stories in the PRD or SRS.
- Add the **Agile SRS** only when technical clarity is required.
- Use **planning-checklist.md** to confirm everything is ready before proceeding to setup.

## Recommended Workflow

1. Run `/generate_prd` to create the PRD.
2. Fill in and review the PRD (using user story guidelines).
3. Complete the **planning-checklist.md**.
4. If needed, create an Agile SRS.
5. Approve planning phase, then move to `/project_setup`.

Templates in this folder are designed to be **lean and agile** by default.