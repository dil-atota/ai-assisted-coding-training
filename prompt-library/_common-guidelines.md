## Common Prompt Guidelines

### Placeholders

- Use angle-bracket ALL_CAPS placeholders: `<JIRA_TICKET_KEY>`, `<TICKET_LINK>`, `<REPO>`, `<FEATURE_NAME>`, `<DIRECTORIES>`, `<BRANCH_SOURCE>`, `<BRANCH_TARGET>`, `<SLUGIFIED_TITLE>`, `<TICKET_TEMPLATE_URL>`.

### MCP Guard

- Always include as step 0 where relevant:
  - "Confirm whether an active MCP connection is available. If not, terminate with: 'No MCP connection. Execution stopped.'"

### Idempotency

- Avoid duplicate comments/PR review requests. Use unique prefixes like `[AI generated]` and skip if identical content exists.
