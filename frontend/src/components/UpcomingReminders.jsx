import { useEffect, useState } from "react"
import { getReminders } from "../services/api"

function UpcomingReminders() {
  const [reminders, setReminders] = useState([])

  useEffect(() => {
    async function fetchReminders() {
      const data = await getReminders()
      console.log("reminders:", data)
      setReminders(data.filter(reminder => !reminder.completed))
    }

    fetchReminders()
  }, [])

  if (reminders.length === 0) {
    return null
  }

  return (
    <section className="upcoming-reminders">
      <h2>Upcoming reminders</h2>

      <ul>
        {reminders.map(reminder => (
          <li key={reminder.id}>
            {reminder.title} - {reminder.due_date}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default UpcomingReminders