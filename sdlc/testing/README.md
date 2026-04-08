# Testing Phase Templates

This folder contains templates and guides used during the **testing** phase.

## The Role of the Testing Phase

The testing phase is distinct from writing tests during implementation. Implementation agents write unit and integration tests as part of coding a feature. The testing phase is a separate SDLC gate that verifies the completed feature meets its acceptance criteria end-to-end before deployment.

The testing phase happens after implementation is merged to `main` and before deployment begins.

## Test Types

The following test types apply to this project. For implementation-time conventions (where files live, how to mock, how to run), see `sdlc/implementation/testing-strategy.md`.

| Type | When required | Owner |
|---|---|---|
| **Unit** | All pure functions and data transformation logic | Implementation agent during implementation |
| **Integration** | All MCP tool handlers invoked through the MCP server context | Implementation agent during implementation |
| **Contract** | External MCP server integrations where schema may drift independently | Optional — when called for by the design document |
| **End-to-end / Acceptance** | Full user-facing flows that exercise multiple components together | Testing phase — not implementation phase |
| **Regression** | Before any deployment after a defect fix | Testing phase |

## What Lives Here

This directory is the home for testing-phase artifacts. The following templates are planned and will be added as the testing phase is built out:

### Test Plan Template

_Placeholder — to be created during the testing phase build-out._

Used by the orchestrator to define what scenarios must be tested before a release, which test types apply, and what the pass/fail criteria are.

### QA Checklist

_Placeholder — to be created during the testing phase build-out._

A structured checklist for verifying that a feature meets its acceptance criteria before being approved for deployment.

### Regression Testing Guide

_Placeholder — to be created during the testing phase build-out._

Defines which scenarios must be re-verified after any change, and how to run the regression suite.

## Related Documents

- `sdlc/implementation/testing-strategy.md` — implementation-time test conventions (file locations, naming, mocking, coverage expectations)
- `sdlc/overview.md` — full SDLC phase sequence and phase gate conditions
