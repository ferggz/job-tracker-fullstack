import { createApplication } from "../shared/api.js";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "CREATE_APPLICATION") {
    createApplication(message.payload)
      .then((application) => {
        sendResponse({ ok: true, application });
      })
      .catch((error) => {
        sendResponse({ ok: false, error: error.message });
      });

    return true;
  }

  return false;
});
