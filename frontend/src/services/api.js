const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"
const API_URL = `${BASE_URL}/applications`
const REMINDERS_URL = `${BASE_URL}/reminders`

export async function getApplications() {
  const response = await fetch(API_URL)
  return response.json()
}

export async function createApplication(application) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application)
  })

  return response.json()
}

export async function updateApplication(id, application) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application)
  })

  return response.json()
}

export async function deleteApplication(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  })
}

export async function getApplicationReminders(applicationId) {
  const response = await fetch(`${API_URL}/${applicationId}/reminders`)
  return response.json()
}

export async function createReminder(reminder) {
  const response = await fetch(REMINDERS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reminder)
  })

  return response.json()
}

export async function completeReminder(reminderId) {
  const response = await fetch(`${REMINDERS_URL}/${reminderId}/complete`, {
    method: "PUT"
  })

  return response.json()
}

export async function deleteReminder(reminderId) {
  await fetch(`${REMINDERS_URL}/${reminderId}`, {
    method: "DELETE"
  })
}

export async function getReminders() {
  const response = await fetch(REMINDERS_URL)
  return response.json()
}