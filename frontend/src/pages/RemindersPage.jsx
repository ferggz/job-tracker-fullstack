import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { completeReminder, deleteReminder, getReminders } from "../services/api";

function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReminders();
  }, []);

  async function fetchReminders() {
    try {
      const data = await getReminders();
      setReminders(
        data.sort((a, b) => new Date(a.due_date) - new Date(b.due_date)),
      );
      setError("");
    } catch {
      setError("Could not load reminders.");
    }
  }

  async function handleComplete(reminderId) {
    await completeReminder(reminderId);

    setReminders(
      reminders.map((reminder) =>
        reminder.id === reminderId
          ? { ...reminder, completed: true }
          : reminder,
      ),
    );
  }

  async function handleDelete(reminderId) {
    await deleteReminder(reminderId);

    setReminders(reminders.filter((reminder) => reminder.id !== reminderId));
  }

  function isOverdue(reminder) {
    const today = new Date();
    const dueDate = new Date(reminder.due_date);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today && !reminder.completed;
  }

  return (
    <MainLayout>
      <section>
        <h2>Reminders</h2>

        {error && <p className="error-message">{error}</p>}

        {reminders.length === 0 ? (
          <p>No reminders yet.</p>
        ) : (
          <ul className="upcoming-list">
            {reminders.map((reminder) => (
              <li
                key={reminder.id}
                className={`upcoming-item ${
                  isOverdue(reminder) ? "upcoming-overdue" : ""
                }`}
              >
                <strong>
                  {isOverdue(reminder) ? "Overdue: " : ""}
                  {reminder.title}
                </strong>

                <div>
                  {reminder.company} — {reminder.position}
                </div>

                <small>Due: {reminder.due_date}</small>

                {reminder.notes && <p>{reminder.notes}</p>}

                <div className="reminder-actions">
                  {!reminder.completed && (
                    <button onClick={() => handleComplete(reminder.id)}>
                      Complete
                    </button>
                  )}

                  <button onClick={() => handleDelete(reminder.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </MainLayout>
  );
}

export default RemindersPage;