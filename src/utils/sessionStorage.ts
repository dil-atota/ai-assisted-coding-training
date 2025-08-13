import type { Todo } from '../types/Todo';

export const TODO_STORAGE_KEY = 'todoItems';

// Keep track if we've already logged malformed data warning
let hasLoggedMalformedWarning = false;

/**
 * Normalize and validate a todo-like object from storage
 */
function normalizeTodo(todoLike: any): Todo | null {
  try {
    // Ensure required fields exist
    if (!todoLike || typeof todoLike !== 'object') return null;
    if (!todoLike.id || !todoLike.title || typeof todoLike.completed !== 'boolean') return null;

    // Parse createdAt to Date object
    let createdAt: Date;
    if (todoLike.createdAt instanceof Date) {
      createdAt = todoLike.createdAt;
    } else if (typeof todoLike.createdAt === 'string') {
      createdAt = new Date(todoLike.createdAt);
      if (isNaN(createdAt.getTime())) return null;
    } else {
      return null;
    }

    // Validate and normalize dueDate if present
    let dueDate: string | undefined;
    if (todoLike.dueDate !== undefined && todoLike.dueDate !== null) {
      if (typeof todoLike.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(todoLike.dueDate)) {
        const testDate = new Date(todoLike.dueDate);
        if (!isNaN(testDate.getTime())) {
          dueDate = todoLike.dueDate;
        } else {
          // Malformed date string - log once and ignore
          if (!hasLoggedMalformedWarning && process.env.NODE_ENV === 'development') {
            console.debug('TodoStorage: Ignoring malformed dueDate value:', todoLike.dueDate);
            hasLoggedMalformedWarning = true;
          }
        }
      } else {
        // Invalid format - log once and ignore
        if (!hasLoggedMalformedWarning && process.env.NODE_ENV === 'development') {
          console.debug('TodoStorage: Ignoring invalid dueDate format:', todoLike.dueDate);
          hasLoggedMalformedWarning = true;
        }
      }
    }

    return {
      id: todoLike.id,
      title: todoLike.title,
      description: todoLike.description || '',
      completed: todoLike.completed,
      createdAt,
      dueDate,
    };
  } catch (error) {
    if (!hasLoggedMalformedWarning && process.env.NODE_ENV === 'development') {
      console.debug('TodoStorage: Error normalizing todo:', error);
      hasLoggedMalformedWarning = true;
    }
    return null;
  }
}

/**
 * Load todos from sessionStorage
 */
export function loadTodos(): Todo[] {
  try {
    const stored = sessionStorage.getItem(TODO_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    const normalized = parsed
      .map(normalizeTodo)
      .filter((todo): todo is Todo => todo !== null);

    return normalized;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.debug('TodoStorage: Error loading todos:', error);
    }
    return [];
  }
}

/**
 * Save todos to sessionStorage
 */
export function saveTodos(todos: Todo[]): void {
  try {
    // Convert Date objects to ISO strings for storage
    const toStore = todos.map(todo => ({
      ...todo,
      createdAt: todo.createdAt.toISOString(),
    }));

    sessionStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(toStore));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.debug('TodoStorage: Error saving todos:', error);
    }
    // Could show user toast notification here in the future
  }
}