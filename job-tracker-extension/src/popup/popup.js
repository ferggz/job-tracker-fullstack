import {
  createApplication,
  getSessionEmail,
  isAuthenticated,
  logoutUser,
} from "../shared/api.js";
import { getApiBaseUrl } from "../shared/storage.js";
import {
  PLATFORMS,
  cleanPageTitle,
  detectPlatformFromUrl,
} from "../shared/platforms.js";

const authView = document.getElementById("auth-view");
const connectedView = document.getElementById("connected-view");
const confirmView = document.getElementById("confirm-view");
const sessionEmail = document.getElementById("session-email");
const apiUrlLabel = document.getElementById("api-url");
const openOptionsButton = document.getElementById("open-options");
const saveTabButton = document.getElementById("save-tab");
const logoutButton = document.getElementById("logout");
const confirmForm = document.getElementById("confirm-form");
const companyInput = document.getElementById("company");
const positionInput = document.getElementById("position");
const platformSelect = document.getElementById("platform");
const sourceUrlInput = document.getElementById("source-url");
const notesInput = document.getElementById("notes");
const cancelConfirmButton = document.getElementById("cancel-confirm");
const saveApplicationButton = document.getElementById("save-application");
const confirmStatus = document.getElementById("confirm-status");

function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

function showView(view) {
  authView.hidden = view !== "auth";
  connectedView.hidden = view !== "connected";
  confirmView.hidden = view !== "confirm";
}

function showConfirmStatus(message, isError = false) {
  confirmStatus.hidden = false;
  confirmStatus.textContent = message;
  confirmStatus.classList.toggle("error", isError);
}

function hideConfirmStatus() {
  confirmStatus.hidden = true;
}

function populatePlatformOptions(selectedPlatform) {
  platformSelect.innerHTML = "";

  for (const platform of PLATFORMS) {
    const option = document.createElement("option");
    option.value = platform;
    option.textContent = platform;
    option.selected = platform === selectedPlatform;
    platformSelect.appendChild(option);
  }
}

async function renderAuthState() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    showView("auth");
    return;
  }

  const email = await getSessionEmail();
  const apiUrl = await getApiBaseUrl();
  sessionEmail.textContent = email ? `Connected as ${email}` : "Connected";
  apiUrlLabel.textContent = `API: ${apiUrl}`;
  showView("connected");
}

openOptionsButton.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;

  try {
    await logoutUser();
    await renderAuthState();
  } finally {
    logoutButton.disabled = false;
  }
});

saveTabButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.url) {
    showConfirmStatus("Could not read the active tab.", true);
    return;
  }

  const platform = detectPlatformFromUrl(tab.url);
  const position = cleanPageTitle(tab.title || "");

  companyInput.value = "";
  positionInput.value = position;
  notesInput.value = "";
  sourceUrlInput.value = tab.url;
  populatePlatformOptions(platform);
  hideConfirmStatus();
  showView("confirm");
});

cancelConfirmButton.addEventListener("click", async () => {
  hideConfirmStatus();
  await renderAuthState();
});

confirmForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideConfirmStatus();

  saveApplicationButton.disabled = true;

  const payload = {
    company: companyInput.value.trim(),
    position: positionInput.value.trim(),
    status: "Applied",
    platform: platformSelect.value,
    source_url: sourceUrlInput.value,
    date_applied: todayIsoDate(),
    notes: notesInput.value.trim() || null,
  };

  try {
    const savedApplication = await createApplication(payload);

    showConfirmStatus(
      `Application saved (#${savedApplication.id}) to ${await getApiBaseUrl()}.`,
    );
    setTimeout(async () => {
      hideConfirmStatus();
      await renderAuthState();
    }, 900);
  } catch (error) {
    if (error.message === "Session expired") {
      await renderAuthState();
      return;
    }

    showConfirmStatus(error.message || "Could not save application.", true);
  } finally {
    saveApplicationButton.disabled = false;
  }
});

renderAuthState();
