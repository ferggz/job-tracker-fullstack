import {
  STORAGE_KEYS,
  getApiBaseUrl,
  getStorage,
  removeStorage,
  setStorage,
} from "./storage.js";

let refreshPromise = null;

async function getAuthHeaders() {
  const data = await getStorage([STORAGE_KEYS.accessToken]);
  const token = data[STORAGE_KEYS.accessToken];

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function storeAuthTokens(data, email) {
  await setStorage({
    [STORAGE_KEYS.accessToken]: data.access_token,
    [STORAGE_KEYS.refreshToken]: data.refresh_token,
    ...(email ? { [STORAGE_KEYS.email]: email } : {}),
  });
}

export async function clearAuthTokens() {
  await removeStorage([
    STORAGE_KEYS.accessToken,
    STORAGE_KEYS.refreshToken,
    STORAGE_KEYS.email,
  ]);
}

async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  const baseUrl = await getApiBaseUrl();
  const data = await getStorage([STORAGE_KEYS.refreshToken]);
  const refreshToken = data[STORAGE_KEYS.refreshToken];

  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  refreshPromise = fetch(`${baseUrl}/auth/refresh`, {
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

      const tokenData = await response.json();
      await storeAuthTokens(tokenData);
      return tokenData.access_token;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

async function parseResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const detail = error?.detail;

    if (typeof detail === "string") {
      throw new Error(detail);
    }

    if (Array.isArray(detail) && detail.length > 0) {
      throw new Error(detail[0]?.msg || "Request failed");
    }

    throw new Error(`Request failed (${response.status})`);
  }

  return response.json();
}

async function request(url, options = {}, isRetry = false) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(await getAuthHeaders()),
    },
  });

  if (response.status === 401 && !isRetry) {
    try {
      await refreshAccessToken();
      return request(url, options, true);
    } catch {
      await clearAuthTokens();
      throw new Error("Session expired");
    }
  }

  if (response.status === 401) {
    await clearAuthTokens();
    throw new Error("Session expired");
  }

  return parseResponse(response);
}

export async function loginUser(email, password) {
  const baseUrl = await getApiBaseUrl();
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  const data = await parseResponse(response);
  await storeAuthTokens(data, email);

  return data;
}

export async function logoutUser() {
  const baseUrl = await getApiBaseUrl();
  const headers = await getAuthHeaders();

  await clearAuthTokens();

  try {
    const response = await fetch(`${baseUrl}/auth/logout`, {
      method: "POST",
      headers,
    });

    if (!response.ok) {
      return;
    }

    await response.json().catch(() => null);
  } catch {
    // Local session is already cleared; server logout is best-effort.
  }
}

export async function createApplication(application) {
  const baseUrl = await getApiBaseUrl();

  return request(`${baseUrl}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  });
}

export async function isAuthenticated() {
  const data = await getStorage([STORAGE_KEYS.accessToken]);
  return Boolean(data[STORAGE_KEYS.accessToken]);
}

export async function getSessionEmail() {
  const data = await getStorage([STORAGE_KEYS.email]);
  return data[STORAGE_KEYS.email] || "";
}
