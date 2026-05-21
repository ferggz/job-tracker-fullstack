const API_URL = "https://job-tracker-fullstack-z6cy.onrender.com/applications"


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