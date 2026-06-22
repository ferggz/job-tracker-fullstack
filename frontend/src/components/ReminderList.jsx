import { useEffect, useState } from "react"
import {
  createReminder,
  getApplicationReminders,
  completeReminder,
  deleteReminder
} from "../services/api"

function ReminderList({ applicationId }) {
  const [reminders, setReminders] = useState([])
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    fetchReminders()
  }, [applicationId])

  async function fetchReminders() {
    const data = await getApplicationReminders(applicationId)
    setReminders(data)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const newReminder = await createReminder({
      application_id: applicationId,
      title,
      due_date: dueDate,
      completed: false,
      notes
    })

    setReminders([...reminders, newReminder])
    setTitle("")
    setDueDate("")
    setNotes("")
  }

  async function handleComplete(reminderId) {
    await completeReminder(reminderId)

    setReminders(
      reminders.map(reminder =>
        reminder.id === reminderId
          ? { ...reminder, completed: true }
          : reminder
      )
    )
  }

  async function handleDelete(reminderId) {
    await deleteReminder(reminderId)

    setReminders(
      reminders.filter(reminder => reminder.id !== reminderId)
    )
  }

  function isOverdue(reminder) {
  const today = new Date()
  const dueDate = new Date(reminder.due_date)

  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)

  return dueDate < today && !reminder.completed
}

  return (
    <div className="reminders">
      <h3>Reminders</h3>

      {reminders.length === 0 ? (
        <p>No reminders</p>
      ) : (
        <ul>
          {reminders.map(reminder => (
            <li
              key={reminder.id}
              className={isOverdue(reminder) ? "reminder-overdue reminder-item" : "reminder-item"}
            >
              <div className="reminder-content">
                <span className={reminder.completed ? "reminder-completed" : ""}>
                  {reminder.completed ? "[Done]" : isOverdue(reminder) ? "[Overdue]" : "[Pending]"}{" "}
                  {reminder.title} - {reminder.due_date}
                </span>

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

                <button onClick={() => handleDelete(reminder.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="reminder-form">
        <input
          type="text"
          placeholder="Reminder title"
          value={title}
          onChange={event => setTitle(event.target.value)}
          required
        />

        <input
          type="date"
          value={dueDate}
          onChange={event => setDueDate(event.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Notes"
          value={notes}
          onChange={event => setNotes(event.target.value)}
        />

        <button type="submit">Add reminder</button>
      </form>
    </div>
  )
}

export default ReminderList