import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_URL = `${BASE_URL}/applications`;
const REMINDERS_URL = `${BASE_URL}/reminders`;

let refreshPromise = null;

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

function clearAuthTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

function handleUnauthorized() {
  clearAuthTokens();
  window.location.href = "/login";
}

function storeAuthTokens(data) {
  localStorage.setItem("accessToken", data.access_token);
  localStorage.setItem("refreshToken", data.refresh_token);
}

async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Refresh failed");
      }

      const data = await response.json();
      storeAuthTokens(data);
      return data.access_token;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

async function parseResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || "Request failed");
  }

  return response.json();
}

async function request(url, options = {}, isRetry = false) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...getAuthHeaders(),
    },
  });

  if (response.status === 401 && !isRetry) {
    try {
      await refreshAccessToken();
      return request(url, options, true);
    } catch {
      handleUnauthorized();
      throw new Error("Session expired");
    }
  }

  if (response.status === 401) {
    handleUnauthorized();
    throw new Error("Session expired");
  }

  return parseResponse(response);
}

export async function getApplications() {
  return request(API_URL);
}

export async function createApplication(application) {
  return request(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  });
}

export async function updateApplication(id, application) {
  return request(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  });
}

export async function deleteApplication(id) {
  return request(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}

export async function getApplicationReminders(applicationId) {
  return request(`${API_URL}/${applicationId}/reminders`);
}

export async function createReminder(reminder) {
  return request(REMINDERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reminder),
  });
}

export async function completeReminder(reminderId) {
  return request(`${REMINDERS_URL}/${reminderId}/complete`, {
    method: "PUT",
  });
}

export async function deleteReminder(reminderId) {
  return request(`${REMINDERS_URL}/${reminderId}`, {
    method: "DELETE",
  });
}

export async function getReminders() {
  return request(REMINDERS_URL);
}

export async function registerUser(user) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  return parseResponse(response);
}

export async function loginUser(user) {
  const formData = new URLSearchParams();

  formData.append("username", user.email);
  formData.append("password", user.password);

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  return parseResponse(response);
}

export async function logoutUser() {
  try {
    await request(`${BASE_URL}/auth/logout`, {
      method: "POST",
    });
  } catch {
    // Session may already be invalid; still clear local tokens.
  } finally {
    clearAuthTokens();
  }
}

export async function uploadProfileCv(cvType, file) {
  const formData = new FormData();
  formData.append("file", file);

  return request(`${BASE_URL}/profile/cv/${cvType}`, {
    method: "POST",
    body: formData,
  });
}

async function fetchProfileCv(cvType, isRetry = false) {
  const response = await fetch(`${BASE_URL}/profile/cv/${cvType}`, {
    headers: getAuthHeaders(),
  });

  if (response.status === 401 && !isRetry) {
    try {
      await refreshAccessToken();
      return fetchProfileCv(cvType, true);
    } catch {
      handleUnauthorized();
      return null;
    }
  }

  if (response.status === 401) {
    handleUnauthorized();
    return null;
  }

  return response;
}

export async function openProfileCv(cvType) {
  const response = await fetchProfileCv(cvType);

  if (!response) {
    return;
  }

  if (!response.ok) {
    toast.error("Could not open CV");
    return;
  }

  const blob = await response.blob();
  const pdfBlob = new Blob([blob], { type: "application/pdf" });
  const url = window.URL.createObjectURL(pdfBlob);

  window.location.href = url;
}

export async function getProfile() {
  return request(`${BASE_URL}/profile`);
}

export async function deleteProfileCv(cvType) {
  return request(`${BASE_URL}/profile/cv/${cvType}`, {
    method: "DELETE",
  });
}

export { storeAuthTokens, clearAuthTokens };
