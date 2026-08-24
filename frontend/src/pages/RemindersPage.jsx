import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import { completeReminder, deleteReminder, getReminders } from "../services/api";
import { isOverdue } from "../utils/reminders";

function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReminders() {
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

    loadReminders();
  }, []);

  async function handleComplete(reminderId) {
    try {
      await completeReminder(reminderId);

      setReminders(
        reminders.map((reminder) =>
          reminder.id === reminderId
            ? { ...reminder, completed: true }
            : reminder,
        ),
      );

    } catch {
      toast.error("Could not complete reminder.");
    }
  }

  async function handleDelete(reminderId) {
    try {
      await deleteReminder(reminderId);

      setReminders(reminders.filter((reminder) => reminder.id !== reminderId));
    } catch {
      toast.error("Could not delete reminder.");
    }
  }

  return (
    <MainLayout>
      <section className="page-section">
        <header className="page-header compact">
          <div><p className="page-kicker">Follow-ups</p><h1>Reminders</h1><p>Keep time-sensitive application work visible.</p></div>
        </header>

        {error && <p className="error-message">{error}</p>}

        {reminders.length === 0 ? (
          <div className="empty-state"><h2>No reminders yet</h2><p>Add a reminder from an application’s detail panel.</p></div>
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
                    {isOverdue(reminder) ? "Overdue · " : ""}
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
