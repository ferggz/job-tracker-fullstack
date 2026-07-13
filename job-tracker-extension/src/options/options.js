import { loginUser, logoutUser } from "../shared/api.js";
import {
  DEFAULT_API_BASE_URL,
  STORAGE_KEYS,
  getStorage,
  setStorage,
} from "../shared/storage.js";

const loginForm = document.getElementById("login-form");
const apiBaseUrlInput = document.getElementById("api-base-url");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const statusMessage = document.getElementById("status-message");

let storedApiBaseUrl = DEFAULT_API_BASE_URL;

function showStatus(message, isError = false) {
  statusMessage.hidden = false;
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function normalizeApiBaseUrl(url) {
  return url.trim().replace(/\/+$/, "");
}

async function loadSettings() {
  const data = await getStorage([
    STORAGE_KEYS.apiBaseUrl,
    STORAGE_KEYS.email,
  ]);

  storedApiBaseUrl = data[STORAGE_KEYS.apiBaseUrl] || DEFAULT_API_BASE_URL;
  apiBaseUrlInput.value = storedApiBaseUrl;
  emailInput.value = data[STORAGE_KEYS.email] || "";
}

async function handleApiUrlChange() {
  const nextApiBaseUrl = normalizeApiBaseUrl(apiBaseUrlInput.value);

  if (!nextApiBaseUrl || nextApiBaseUrl === storedApiBaseUrl) {
    return;
  }

  await setStorage({ [STORAGE_KEYS.apiBaseUrl]: nextApiBaseUrl });
  await logoutUser();
  storedApiBaseUrl = nextApiBaseUrl;
  showStatus("API URL updated. Sign in again.", true);
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginButton.disabled = true;
  statusMessage.hidden = true;

  try {
    const apiBaseUrl = normalizeApiBaseUrl(apiBaseUrlInput.value);

    await setStorage({
      [STORAGE_KEYS.apiBaseUrl]: apiBaseUrl,
    });

    storedApiBaseUrl = apiBaseUrl;

    await loginUser(emailInput.value.trim(), passwordInput.value);
    passwordInput.value = "";
    showStatus(`Signed in to ${apiBaseUrl}`);
  } catch (error) {
    showStatus(error.message || "Could not sign in.", true);
  } finally {
    loginButton.disabled = false;
  }
});

apiBaseUrlInput.addEventListener("change", handleApiUrlChange);

loadSettings();
