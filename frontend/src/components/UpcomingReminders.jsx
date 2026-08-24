import { useEffect, useState } from "react";
import { getReminders } from "../services/api";
import { isOverdue } from "../utils/reminders";

function UpcomingReminders() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    async function fetchReminders() {
      try {
        const data = await getReminders();
        setReminders(
          data
            .filter((reminder) => !reminder.completed)
            .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)),
        );
      } catch {
        // Dashboard widget: fail silently
      }
    }

    fetchReminders();
  }, []);

  if (reminders.length === 0) {
    return null;
  }

  return (
    <section className="upcoming-reminders">
      <div className="section-heading">
        <div><p className="page-kicker">Needs attention</p><h2>Upcoming reminders</h2></div>
        <span>{reminders.length}</span>
      </div>

      <ul className="upcoming-list">
        {reminders.map((reminder) => (
          <li
            key={reminder.id}
            className={`upcoming-item ${
              isOverdue(reminder, { requireIncomplete: false })
                ? "upcoming-overdue"
                : ""
            }`}
          >
            <strong>
              {reminder.title}
            </strong>

            <div>{reminder.company}</div>

            <small className={isOverdue(reminder, { requireIncomplete: false }) ? "overdue-label" : ""}>
              {isOverdue(reminder, { requireIncomplete: false }) ? "Overdue · " : "Due · "}{reminder.due_date}
            </small>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default UpcomingReminders;
