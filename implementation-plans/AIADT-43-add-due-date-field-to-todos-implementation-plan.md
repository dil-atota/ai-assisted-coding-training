# AIADT-43 Implementation Plan – Add Due Date Field to Todos

Source Ticket: https://diligentbrands.atlassian.net/browse/AIADT-43
Status: Ready (all decisions finalized)
Owner: (assign on pickup)
Date: 2025-08-13

---
## 0. Objective & Non-goals
**Objective:** Add an optional `dueDate` (date-only) to todos with create/edit UI, persistence in sessionStorage, display in list, and overdue visual indicator, without altering existing ordering or unrelated behavior.
**Business Value:** Users can time-manage and prioritize tasks via deadlines.

**Non-goals:**
- Notifications / reminders / calendar sync
- Backend persistence or API changes
- Automatic sorting by date
- Complex timezone normalization beyond date-only storage
- Feature flagging (simple unconditional release)

---
## 1. Architecture / Design Overview
Current app: React + TypeScript + MUI, in-memory state via `TodoProvider`. No persistence yet (ticket references storage util to be added). We will introduce a small storage utility for sessionStorage (single key) handling serialization/deserialization and forward compatibility.

Key design decisions:
- Extend `Todo` with `dueDate?: string` storing `yyyy-MM-dd` (normalized local date). No time component -> avoids TZ drift and simplifies comparisons.
- Add storage layer: load on provider mount, write on every mutating operation (debounce not required for small scale).
- Validation: Structural only (parsable date + simple regex). Invalid input blocked at form level. Malformed stored values gracefully ignored.
- Overdue detection: `dueDate < today (startOfToday)`.
- Accessibility: Overdue badge `role="status"` `aria-label="Overdue task"` with theme error palette and AA contrast.

---
## 2. Data / Schema Changes & Migration
Schema change: `Todo` adds optional `dueDate?: string`.
Migration strategy:
- Legacy items (without field) load unchanged; absence treated as undefined.
- Malformed `dueDate`: treat as undefined, dev-only console.debug (once).
- Storage key: `todoItems` (constant `TODO_STORAGE_KEY`). No schemaVersion yet; design utility to allow addition later.

Serialization considerations:
- `createdAt: Date` currently stored as JS Date in memory. On persistence, convert to ISO string; on load, rehydrate to Date object.
- `dueDate` stays a date-only ISO (YYYY-MM-DD). No conversion to Date object for storage; convert on demand for UI formatting.

---
## 3. APIs / External Integrations
None added. Using new dependency `@mui/x-date-pickers` (internal UI library) and `date-fns` for formatting & comparisons.

---
## 4. Feature Flags / Config
None required. Straight addition. Code isolated so future flag could wrap date UI block.

---
## 5. Detailed Implementation Steps (File-by-File)

### 5.1 Dependencies
Add (if not present):
```
npm install @mui/x-date-pickers date-fns
```
(Already using @mui/material.)

### 5.2 `src/types/Todo.ts`
Add optional field:
```ts
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date; // persisted as ISO string
  dueDate?: string; // yyyy-MM-dd
}
```

### 5.3 `src/utils/sessionStorage.ts` (NEW)
Responsibilities:
- `loadTodos(): Todo[]`
- `saveTodos(todos: Todo[]): void`
- Internal: `normalize(todoLike)` to coerce/validate.
Validation steps:
1. Parse JSON array.
2. For each item: ensure required fields; parse `createdAt` to Date; if `dueDate` matches `/^\d{4}-\d{2}-\d{2}$/` and `!isNaN(new Date(dueDate))` keep; else drop field.
3. Dev-only log once if any malformed.
Export constant `TODO_STORAGE_KEY = 'todoItems'`.

### 5.4 `src/contexts/TodoContext.tsx`
Changes:
- Import storage utils.
- On mount (`useEffect` once) load initial todos into state.
- Wrap mutators (`addTodo`, `editTodo`, `toggleTodoCompletion`, `deleteTodo`) to persist after state update (using functional setState for atomicity).
- Update `addTodo` signature: `(title: string, description: string, dueDate?: string)`.
- `editTodo` can accept partial including `dueDate?: string | undefined` (explicit undefined clears value).

### 5.5 `src/App.tsx` (if needed)
- Wrap root (already using MUI) with `LocalizationProvider`:
```tsx
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

<LocalizationProvider dateAdapter={AdapterDateFns}> ... </LocalizationProvider>
```
(Ensure not double-wrapping.)

### 5.6 `src/components/TodoModal/TodoModal.tsx`
Add state `dueDate` (string | undefined). On edit, seed from `initialValues.dueDate`.
Insert DatePicker:
```tsx
import { DatePicker } from '@mui/x-date-pickers';
// ... inside form content
<DatePicker
  label="Due Date"
  value={dueDate ? new Date(dueDate) : null}
  onChange={(val) => setDueDate(val ? format(val, 'yyyy-MM-dd') : undefined)}
  slotProps={{ textField: { fullWidth: true } }}
/>
<Button disabled={!dueDate} onClick={() => setDueDate(undefined)}>Clear date</Button>
```
Validation: Ensure that if user manually types an invalid date (if text field variant used), block submit and show helper text.
On submit:
- Pass `dueDate` in `addTodo` or `editTodo` updates.
- For clearing date in edit mode ensure passing `dueDate: undefined`.

### 5.7 `src/components/TodoList/TodoItem.tsx`
Display due date beneath description (or appended) if present:
```tsx
{todo.dueDate && (
  <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
    Due: {format(new Date(todo.dueDate), 'PP')}
    {isOverdue && <OverdueBadge />}
  </Typography>
)}
```
Helper `isOverdue = !todo.completed && todo.dueDate && new Date(todo.dueDate) < startOfToday()` (implement `startOfToday()` with date-fns `startOfToday`).
Add small styled badge component or inline `<Box component="span" role="status" aria-label="Overdue task" sx={...}>Overdue</Box>`.

### 5.8 `src/components/TodoModal/index` (if any) & Other Re-exports
No changes expected.

### 5.9 Tests (`src/__tests__/*`)
Add new test files or extend existing:
- `TodoContext.test.tsx`: ensure persistence (mock sessionStorage) including dueDate save/load & clearing.
- `TodoModal.test.tsx`: create with due date; edit modify; clear date; invalid date reject.
- `TodoItem.test.tsx`: renders formatted date and overdue badge logic.
- Ordering regression: Add test verifying list order remains insertion order after dueDate assignment.
- Coverage check: Ensure lines/branches not reduced.

Mock date: Use fixed `jest.useFakeTimers()` / `vi.setSystemTime()` for deterministic overdue boundary.

### 5.10 README Update
Add under new section "Enhancements":
```
Aug 2025: Added optional dueDate field to todos (stored as yyyy-MM-dd). Legacy items remain compatible.
```

---
## 6. Validation & Edge Cases
- Missing/undefined dueDate -> hidden field in list.
- Malformed stored dueDate -> ignored silently (dev log).
- Overdue indicates only when `dueDate < today` and not completed.
- Clearing date sets field to undefined and persists removal.
- DatePicker null selection -> clears date.
- Timezone independence: Comparison uses date-only strings converted to Date at local midnight; acceptable for out-of-scope complexity.

---
## 7. Telemetry / Monitoring
No telemetry system present. Minimal: dev console debug for malformed migration cases (one-time). Future enhancement: add instrumentation hook.

---
## 8. Risks & Mitigation / Rollback
| Risk | Impact | Mitigation | Rollback |
|------|--------|------------|----------|
| Incorrect date parsing due to locale | Overdue mislabel | Use date-only format & date-fns | Revert to commit prior to feature; data remains compatible |
| Performance overhead from frequent saves | Minor | Small data set, acceptable; could batch later | Remove persistence calls |
| Accessibility oversight | Users with assistive tech miss info | role/aria-label + contrast | Remove badge styling |
| Bundle size increase (date pickers) | Slight load increase | Accept tradeoff; optional future code splitting | Swap to native input |

---
## 9. Rollout Strategy
Single release; no phased rollout. Manual validation checklist:
1. Create todo w/out due date → persists.
2. Create todo with date → displays formatted.
3. Refresh page → data intact.
4. Edit todo change date → updated.
5. Clear date → removed from UI & storage.
6. Set past date → Overdue badge appears (unless completed).
7. Mark completed overdue → badge optionally could remain or hide (decide: leave badge for historical context; document). (If prefer hide: adjust test.)
8. All tests pass; coverage unchanged or higher.

---
## 10. Acceptance Criteria Mapping
| Acceptance Criterion | Planned Task(s) |
|----------------------|-----------------|
| Optional due date on create | Modal DatePicker integration, addTodo signature |
| Existing todos unaffected | Load logic leaves missing field undefined |
| Edit shows & allows change/remove | Pre-fill dueDate; Clear button |
| Due date shows in list | TodoItem display & formatting |
| Validation prevents invalid dates | Modal validation logic |
| Persistence across refresh | sessionStorage utils & load on mount |
| Legacy data loads | Graceful parsing ignoring missing field |
| Tests & coverage | New/updated tests + no regression |

---
## 11. Implementation Task Checklist
- [ ] Install dependencies
- [ ] Add `dueDate` to `Todo` type
- [ ] Create `sessionStorage` utility
- [ ] Integrate load/save in `TodoContext`
- [ ] Extend `addTodo` / `editTodo` logic to include `dueDate`
- [ ] Wrap app with `LocalizationProvider`
- [ ] Update `TodoModal` with DatePicker, state, clear button, validation
- [ ] Update `TodoItem` to show formatted date + overdue badge
- [ ] Add helper(s) for date formatting / overdue calc (optional util)
- [ ] Write / update tests (context, modal, item, ordering)
- [ ] Add README enhancement note
- [ ] Verify coverage not decreased
- [ ] Manual validation checklist run

---
## 12. Ready-to-Use Agent Execution Prompt (Condensed)
```
Implement AIADT-43 per plan:
1. Add dueDate?: string (yyyy-MM-dd) to Todo.
2. Create storage util (loadTodos/saveTodos) using key 'todoItems'; parse createdAt to Date; validate dueDate regex; dev-only log malformed.
3. Update TodoContext: load on mount; persist after each mutation; extend addTodo(title, description, dueDate?).
4. Add LocalizationProvider (AdapterDateFns) in App root.
5. Enhance TodoModal: manage dueDate state; DatePicker; Clear date button; validation; pass dueDate on create/edit.
6. Update TodoItem: show formatted due date (format(new Date(dueDate), 'PP')); show Overdue badge when dueDate < today and not completed.
7. Add tests: creation with/without date, edit/change/remove, overdue badge logic, persistence, ordering unchanged, invalid date blocked.
8. Documentation: README enhancement note.
9. Ensure coverage not reduced.
10. Run manual validation steps then commit.
```

---
## 13. Rollback Plan
Revert commit(s) adding feature (dueDate remains optional; legacy data unaffected). Remove storage util if unused. No data migration required.

---
## 14. Future Enhancements (Not in Scope)
- Sorting by due date
- Reminder notifications
- i18n date formatting strategy injection
- schemaVersion & migrations
- Filter views (overdue, due today)

---
End of plan.
