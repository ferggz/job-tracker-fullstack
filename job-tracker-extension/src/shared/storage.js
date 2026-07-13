export const DEFAULT_API_BASE_URL =
  "https://job-tracker-fullstack-z6cy.onrender.com";

export const STORAGE_KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  apiBaseUrl: "apiBaseUrl",
  email: "email",
};

export async function getStorage(keys) {
  return chrome.storage.local.get(keys);
}

export async function setStorage(values) {
  return chrome.storage.local.set(values);
}

export async function removeStorage(keys) {
  return chrome.storage.local.remove(keys);
}

export async function getApiBaseUrl() {
  const data = await getStorage([STORAGE_KEYS.apiBaseUrl]);
  const baseUrl = data[STORAGE_KEYS.apiBaseUrl] || DEFAULT_API_BASE_URL;

  return baseUrl.replace(/\/+$/, "");
}
