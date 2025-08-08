## Workflow Prompts Summary

- **0-ticket-creation.md**: Guides initial codebase impact analysis and creates a well-scoped Jira ticket using a template; analysis only, no implementation.

- **1-initial-review-unified.md**: Reviews a Jira ticket for implementation readiness, gathers linked context, identifies gaps, proposes answers, and outputs a readiness assessment with an implementation prompt if ready.

- **2-iterating-on-questions.md**: Evaluates answers to previously raised open questions; asks follow-ups if needed or posts a concise update to the ticket when resolved, confirming readiness status.

- **3-implmentation-plan-generation.md**: Produces a structured implementation prompt, saves it to `implementation-plans/<ticket-key>-implementation-plan.md`, and posts it to the ticket; halts with Missing Information if details are absent.

- **4-implement-plan.md**: Executes the approved implementation plan: gather context, implement clean/testable code per conventions, and return a brief implementation summary.

- **5-feedback-request-review.md**: Verifies changes, opens a draft PR, requests AI review, iterates on review comments, and reports next steps or readiness for manual verification.
