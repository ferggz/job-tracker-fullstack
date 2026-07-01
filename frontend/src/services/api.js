import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"
const API_URL = `${BASE_URL}/applications`
const REMINDERS_URL = `${BASE_URL}/reminders`

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken")

  return token ? { Authorization: `Bearer ${token}` } : {}
}

function handleUnauthorized() {
  localStorage.removeItem("accessToken")
  window.location.href = "/login"
}

async function parseResponse(response) {
  if (response.status === 401) {
    handleUnauthorized()
    throw new Error("Session expired")
  }

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.detail || "Request failed")
  }

  return response.json()
}

export async function getApplications() {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders()
  })

  return parseResponse(response)
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

  return parseResponse(response)
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

  return parseResponse(response)
}

export async function deleteApplication(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  })

  return parseResponse(response)
}

export async function getApplicationReminders(applicationId) {
  const response = await fetch(`${API_URL}/${applicationId}/reminders`, {
    headers: getAuthHeaders()
  })

  return parseResponse(response)
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

  return parseResponse(response)
}

export async function completeReminder(reminderId) {
  const response = await fetch(`${REMINDERS_URL}/${reminderId}/complete`, {
    method: "PUT",
    headers: getAuthHeaders()
  })

  return parseResponse(response)
}

export async function deleteReminder(reminderId) {
  const response = await fetch(`${REMINDERS_URL}/${reminderId}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  })

  return parseResponse(response)
}

export async function getReminders() {
  const response = await fetch(REMINDERS_URL, {
    headers: getAuthHeaders()
  })

  return parseResponse(response)
}

export async function registerUser(user) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })

  return parseResponse(response)
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

  return parseResponse(response)
}

export async function uploadProfileCv(cvType, file) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${BASE_URL}/profile/cv/${cvType}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData
  })

  return parseResponse(response)
}

export async function openProfileCv(cvType) {
  const newWindow = window.open("", "_blank")

  const response = await fetch(`${BASE_URL}/profile/cv/${cvType}`, {
    headers: getAuthHeaders()
  })

  if (response.status === 401) {
    handleUnauthorized()
    newWindow.close()
    return
  }

  if (!response.ok) {
    newWindow.close()
    toast.error("Could not open CV");
    return
  }

  const blob = await response.blob()
  const pdfBlob = new Blob([blob], { type: "application/pdf" })
  const url = window.URL.createObjectURL(pdfBlob)

  newWindow.location.href = url
}

export async function getProfile() {
  const response = await fetch(`${BASE_URL}/profile`, {
    headers: getAuthHeaders()
  })

  return parseResponse(response)
}

export async function deleteProfileCv(cvType) {
  const response = await fetch(`${BASE_URL}/profile/cv/${cvType}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  })

  return parseResponse(response)
}