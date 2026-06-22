import { useEffect, useState } from "react"
import { getApplicationReminders } from "../services/api"

function ReminderList({ applicationId }) {
  const [reminders, setReminders] = useState([])

  useEffect(() => {
    async function fetchReminders() {
      const data = await getApplicationReminders(applicationId)
      setReminders(data)
    }

    fetchReminders()
  }, [applicationId])

  if (reminders.length === 0) {
    return <p>No reminders</p>
  }

  return (
    <ul>
      {reminders.map(reminder => (
        <li key={reminder.id}>
          {reminder.title} - {reminder.due_date}
        </li>
      ))}
    </ul>
  )
}

export default ReminderList