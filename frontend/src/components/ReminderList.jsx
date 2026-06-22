import { useEffect, useState } from "react"
import {
  createReminder,
  getApplicationReminders
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

  return (
    <div className="reminders">
      <h3>Reminders</h3>

      {reminders.length === 0 ? (
        <p>No reminders</p>
      ) : (
        <ul>
          {reminders.map(reminder => (
            <li key={reminder.id}>
              {reminder.title} - {reminder.due_date}
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