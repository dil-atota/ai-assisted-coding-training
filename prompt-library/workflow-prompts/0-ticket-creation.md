Task:
<TASK_DESCRIPTION>

You are a senior engineer tasked with analyzing the codebase to plan the implementation of the task described above.

⸻

Scope of Analysis

Starting points for the <FEATURE_NAME> (or initial scope discovery):

- <LINK_OR_PATH>
- <LINK_OR_PATH>
- ...

Your task is to analyze the entire codebase from these locations and identify all modules, dependencies, data flows, and shared logic related to the task.

Impact Analysis Checklist

- Repository/repositories and primary modules impacted
- Public APIs and internal interfaces touched
- Data model and schema changes (including migrations)
- Feature flags/configuration/env variables
- Security, privacy, authz/authn and PII handling
- Performance considerations and telemetry/metrics
- Test coverage impact (unit/integration/e2e) and test data
- Rollout, monitoring, and rollback strategy
- Risks, edge cases, failure modes, and negative paths

⸻

Output Requirements

When your analysis is complete, create a ticket for the implementation based on this template ticket: <TICKET_TEMPLATE_URL> (example: @https://diligentbrands.atlassian.net/browse/AIADT-9)

Your Deliverables 0. Check MCP Access

- Confirm whether an active Atlassian MCP connection is available.
- If no MCP connection is detected, terminate with: "No MCP connection. Execution stopped."

1. Perform a full impact analysis of code related to the task (use the checklist above).
2. Propose a step-by-step implementation plan, broken down into actionable engineering tasks.
3. Format the plan on the Jira ticket description according to the template ticket.
4. Ensure that the ticket covers happy paths, negative paths, and edge cases.

Ticket Description Template

```
Objective
- <what outcome we need>

Scope
- <in scope>
- <out of scope>

Technical Context
- Repos/Modules: <repo>/<module>
- APIs/Interfaces: <list>
- Data/Schema: <list>
- Flags/Config: <list>

Plan (tasks)
1. <task>
2. <task>

Acceptance Criteria
- <AC 1>
- <AC 2>

Risks & Rollback
- <risk 1>
- <rollback strategy>

References
- <links>
```

Do not proceed with implementation — focus is analysis and ticket creation only. It's okay to ask follow-up questions to improve ticket quality.

Output

```
{
  "ticket_key": "<JIRA_TICKET_KEY>",
  "ticket_url": "<TICKET_LINK>",
  "analysis_summary": "<1-3 paragraph summary>",
  "open_questions": ["<question>", "<question>"] ,
  "next_step": "<what to do next>"
}
```
