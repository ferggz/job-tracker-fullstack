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

  return (
    <div className="reminders">
      <h3>Reminders</h3>

      {reminders.length === 0 ? (
        <p>No reminders</p>
      ) : (
        <ul>
          {reminders.map(reminder => (
            <li key={reminder.id}>
              <span className={reminder.completed ? "reminder-completed" : ""}>
                {reminder.completed ? "[Done]" : "[Pending]"} {reminder.title} - {reminder.due_date}
              </span>

              {!reminder.completed && (
                <button onClick={() => handleComplete(reminder.id)}>
                  Complete
                </button>
              )}

              <button onClick={() => handleDelete(reminder.id)}>
                Delete
              </button>
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