export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: string; // yyyy-MM-dd format
}