import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";
import {
  completeReminder,
  createReminder,
  deleteReminder,
  getApplicationReminders,
} from "../services/api";
import { isOverdue } from "../utils/reminders";

function ReminderList({ applicationId }) {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [reminderToDelete, setReminderToDelete] = useState(null);

  useEffect(() => {
    async function loadReminders() {
      try {
        const data = await getApplicationReminders(applicationId);
        setReminders(data);
      } catch {
        toast.error("Could not load reminders.");
      }
    }

    loadReminders();
  }, [applicationId]);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const newReminder = await createReminder({
        application_id: applicationId,
        title,
        due_date: dueDate,
        completed: false,
        notes,
      });

      setReminders([...reminders, newReminder]);
      setTitle("");
      setDueDate("");
      setNotes("");

    } catch {
      toast.error("Could not create reminder.");
    }
  }

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
    <div className="reminders">
      <div className="detail-section-heading">
        <h3>Reminders</h3>
        <span>{reminders.length}</span>
      </div>

      {reminders.length === 0 ? (
        <p>No reminders</p>
      ) : (
        <ul>
          {reminders.map((reminder) => (
            <li
              key={reminder.id}
              className={
                isOverdue(reminder)
                  ? "reminder-overdue reminder-item"
                  : "reminder-item"
              }
            >
              <div className="reminder-content">
                <span className={reminder.completed ? "reminder-completed" : ""}>
                  <span className={`reminder-state ${reminder.completed ? "is-done" : isOverdue(reminder) ? "is-overdue" : "is-pending"}`}>
                    {reminder.completed ? "Done" : isOverdue(reminder) ? "Overdue" : "Pending"}
                  </span>{" "}{reminder.title}
                </span>
                <small>{reminder.due_date}</small>

                {reminder.notes && (
                  <small className="reminder-notes">{reminder.notes}</small>
                )}
              </div>

              <div className="reminder-actions">
                {!reminder.completed && (
                  <button onClick={() => handleComplete(reminder.id)}>
                    Complete
                  </button>
                )}

                <button
                  className="button-danger"
                  onClick={() => setReminderToDelete(reminder)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {reminderToDelete && (
        <ConfirmModal
          title="Delete reminder?"
          message={`Delete "${reminderToDelete.title}"?`}
          onCancel={() => setReminderToDelete(null)}
          onConfirm={async () => {
            await handleDelete(reminderToDelete.id);
            setReminderToDelete(null);
          }}
        />
      )}

      <form onSubmit={handleSubmit} className="reminder-form">
        <label className="field"><span>Reminder</span><input type="text" value={title} onChange={(event) => setTitle(event.target.value)} required aria-required="true" /></label>
        <label className="field"><span>Due date</span><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} required aria-required="true" /></label>
        <label className="field"><span>Notes <small>Optional</small></span><input type="text" value={notes} onChange={(event) => setNotes(event.target.value)} /></label>

        <button type="submit">Add reminder</button>
      </form>
    </div>
  );
}

export default ReminderList;
