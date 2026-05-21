const API_URL = "http://127.0.0.1:8000/applications"


export async function getApplications() {
  const response = await fetch(API_URL)
  return response.json()
}


export async function createApplication(application) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(application)
  })

  return response.json()
}


export async function updateApplication(id, application) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(application)
  })

  return response.json()
}


export async function deleteApplication(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  })
}