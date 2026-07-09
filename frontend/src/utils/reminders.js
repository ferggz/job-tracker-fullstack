export function isOverdue(reminder, { requireIncomplete = true } = {}) {
  const today = new Date();
  const dueDate = new Date(reminder.due_date);

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const pastDue = dueDate < today;

  return requireIncomplete ? pastDue && !reminder.completed : pastDue;
}
