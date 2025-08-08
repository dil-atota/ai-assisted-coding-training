0. **Verify MCP Access**
   - Confirm that the GitHub MCP connection is active
   - If no connection is available, terminate immediately and return: "No MCP connection. Cannot open pull request."
1. **Verify the Changes:**
   - Use the known verification methods (e.g., tests, manual steps, QA guidelines) to confirm that the changes are correct and working as intended
   - Fix the issues if you identify any
2. **Open a Draft Pull Request** (if verification passes)
   - Source branch: the current branch
   - Target: main branch (if the repository is forked, the fork's main branch)
   - Use the GitHub Pull Request template for the description if defined
   - Include context on what was changed and how it was verified
3. **Request Review**
   - Right after the PR is opened, request a code review from CoPilot (use MCP)
   - Execute this cli command: `sleep 90` Wait for it to finish.
   - Check if the pull request review finished. If you don't find a new completed code review, wait another 30 secs by running `sleep 30`
4. **Review and Address Pull request review comments**
   - Review the PR comments (if any), and address them
     - If the changes make sense to implement
       - Implement them all
       - Commit all changes in one commit
       - Push the changes
     - If the changes doesn't make sense
       - Add a comment to them explaining why you think they should not be applied
       - Use [AI comment] prefix in your comments
5. **Decide in next action**
   - If you implemented changes based on the received code review comments, go back to step 3, and request a new code review
   - If you did not implemented any changes based on the received code review comments, give this answer:
   ```
   Automated & AI verification finished.
   PR is waiting for manual verification.
   Link to the PR: [insert link to the pull request]
   ```
