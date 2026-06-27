const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"
const API_URL = `${BASE_URL}/applications`
const REMINDERS_URL = `${BASE_URL}/reminders`

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken")

  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getApplications() {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders()
  })

  return response.json()
}

export async function createApplication(application) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(application)
  })

  return response.json()
}

export async function updateApplication(id, application) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(application)
  })

  return response.json()
}

export async function deleteApplication(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  })
}

export async function getApplicationReminders(applicationId) {
  const response = await fetch(`${API_URL}/${applicationId}/reminders`, {
    headers: getAuthHeaders()
  })

  return response.json()
}

export async function createReminder(reminder) {
  const response = await fetch(REMINDERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(reminder)
  })

  return response.json()
}

export async function completeReminder(reminderId) {
  const response = await fetch(`${REMINDERS_URL}/${reminderId}/complete`, {
    method: "PUT",
    headers: getAuthHeaders()
  })

  return response.json()
}

export async function deleteReminder(reminderId) {
  await fetch(`${REMINDERS_URL}/${reminderId}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  })
}

export async function getReminders() {
  const response = await fetch(REMINDERS_URL, {
    headers: getAuthHeaders()
  })

  return response.json()
}

export async function registerUser(user) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })

  return response.json()
}

export async function loginUser(user) {
  const formData = new URLSearchParams()

  formData.append("username", user.email)
  formData.append("password", user.password)

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData
  })

  return response.json()
}

export async function uploadApplicationCv(applicationId, file) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_URL}/${applicationId}/cv`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData
  })

  return response.json()
}

export async function openApplicationCv(applicationId) {
  const newWindow = window.open("", "_blank")

  const response = await fetch(`${API_URL}/${applicationId}/cv`, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    newWindow.close()
    alert("Could not open CV")
    return
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)

  newWindow.location.href = url
}