0. Pre-flight
   - Ensure MCP access if required by steps below
   - Ensure clean working tree; create a feature branch if not on one: `<BRANCH_SOURCE>`
   - Run tests and lint to establish baseline
1. Analyze the Implementation Plan
   - Read and fully understand the implementation plan.
   - Identify all referenced context (e.g., Jira tickets, design docs, issue links).
2. Gather Additional Context
   - Access all linked Jira tickets and relevant references.
   - Extract key functional, technical, and business requirements.
3. Validate Understanding
   - Confirm that the goal, scope, and edge cases of the feature are clear.
   - If not, return a clarification summary or list of missing details.
4. Implement the Feature
   - Write clean, modular, and testable code that aligns with the implementation plan and context.
   - Use existing project conventions and architecture.
   - Commit using the repository’s convention (e.g., Conventional Commits). Group logically related changes.
   - Add or update tests (unit/integration/e2e) and ensure they cover acceptance criteria.
   - Run tests and lint; fix issues until green.
5. Final Output
   - Return a summary of what was implemented, referencing key points from the plan and context.
