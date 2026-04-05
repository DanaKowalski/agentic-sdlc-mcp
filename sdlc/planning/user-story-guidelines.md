# User Story Guidelines

## What is a Good User Story?

A good user story follows the format:

**As a** [type of user],  
**I want** [some goal],  
**so that** [some reason/benefit].

## Acceptance Criteria

Every user story must include clear, testable acceptance criteria using **Given-When-Then**:

- Given [precondition/context]  
  When [action occurs]  
  Then [expected outcome]

## Best Practices

- Keep stories small and focused (should fit in one sprint)
- Write from the user's perspective
- Avoid technical implementation details in the story
- Make acceptance criteria specific and verifiable
- Include edge cases and error scenarios where relevant
- Use "As a...", "I want...", "so that..." consistently

## Examples

**Good:**
- As a registered user, I want to reset my password so that I can regain access if I forget it.
  - Given I am on the login page and forgot my password, When I click "Forgot Password", Then I receive a reset link via email.

**Poor:**
- Implement password reset functionality.

## Tips for Planning

- Break large stories into smaller ones
- Aim for 3–8 acceptance criteria per story
- Review stories with the team during planning

Use these guidelines when filling the PRD or Agile SRS.