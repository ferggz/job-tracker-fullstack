import { useEffect, useState } from "react"
import { getReminders } from "../services/api"

function UpcomingReminders() {
  const [reminders, setReminders] = useState([])

  useEffect(() => {
    async function fetchReminders() {
      const data = await getReminders()
      setReminders(
        data
            .filter(reminder => !reminder.completed)
            .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        )
    }

    fetchReminders()
  }, [])

  if (reminders.length === 0) {
    return null
  }

function isOverdue(reminder) {
  const today = new Date()
  const dueDate = new Date(reminder.due_date)

  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)

  return dueDate < today
}

  return (
    <section className="card upcoming-reminders">
      <h2>Upcoming reminders</h2>

      <ul className="upcoming-list">
        {reminders.map(reminder => (
          <li
            key={reminder.id}
            className={`upcoming-item ${
              isOverdue(reminder) ? "upcoming-overdue" : ""
            }`}
          >
            <strong>
              {isOverdue(reminder) ? "🔴 " : ""}
              {reminder.title}
            </strong>

            <div>{reminder.company}</div>

            <small>Due: {reminder.due_date}</small>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default UpcomingReminders