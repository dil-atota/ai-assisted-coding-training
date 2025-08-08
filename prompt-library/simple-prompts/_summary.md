## Simple Prompts Summary

- **test-mcp.md**: Validates MCP connectivity to Jira and GitHub, then summarizes the AIADT Jira project and extracts the repo tech stack from code and docs.

- **open-pr.md**: Opens a pull request from the current branch to the main branch via GitHub MCP, returning the PR URL.

- **ai-code-review.md**: Retrieves PR review comments, applies valid suggestions (or replies with `[AI comment]` when not), commits/pushes changes if any, and summarizes the actions taken.
