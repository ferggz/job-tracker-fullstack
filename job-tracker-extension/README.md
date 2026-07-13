# Job Tracker — Chrome Extension (MVP)

Save the current browser tab as a job application in [Job Tracker](https://job-tracker-fullstack-three.vercel.app).

## Features (MVP)

- Sign in from the extension options page
- Save the active tab URL and page title as a new application
- Confirm company, position, platform and notes before saving
- Automatic JWT refresh on expired access tokens

## Troubleshooting

**Saved in extension but not visible in the web app?**

1. Check the API URL shown in the popup matches your web app (Render URL for production, `http://localhost:8000` for local dev).
2. Use the **same email** in extension options and web login.
3. Reload the Applications page after saving (the list does not auto-refresh).
4. After changing extension code, go to `chrome://extensions` and click **Reload** on Job Tracker.

**Production (default)**

| App | URL |
|-----|-----|
| Web | `https://job-tracker-fullstack-three.vercel.app` |
| API | `https://job-tracker-fullstack-z6cy.onrender.com` |

No API URL configuration is required for production. Sign in from the options page with your production account.

**Local development**

| App | URL |
|-----|-----|
| Web | `http://localhost:5173` |
| API | `http://localhost:8000` |
| Extension options API URL | `http://localhost:8000` |

Set the API URL to `http://localhost:8000` in options, sign in again, and reload the extension.

**Extension and web app point to different backends?**

Check the API line in the popup. If it shows the Render URL, saves go to production. For local backend, set `http://localhost:8000` in options, sign in again, and reload the extension.

## Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select this folder: `job-tracker-extension/`

## First use

1. Click the extension icon → **Iniciar sesión**
2. Sign in with your Job Tracker email and password
3. Open a job offer page in another tab
4. Click the extension icon → **Guardar pestaña actual**
5. Fill in company and position, then **Add application**

## Configuration

Default API: `https://job-tracker-fullstack-z6cy.onrender.com`

You can change the API URL in the options page (useful for local backend at `http://localhost:8000`).

## Project structure

```
job-tracker-extension/
├── manifest.json
├── icons/
├── src/
│   ├── background/     # Service worker (API messages)
│   ├── options/        # Login & settings
│   ├── popup/          # Main UI
│   └── shared/         # API client, storage, platform detection
└── README.md
```

## Permissions

| Permission | Why |
|------------|-----|
| `storage` | Save JWT tokens and API URL |
| `activeTab` | Read URL and title of the current tab when you open the popup |
| `host_permissions` | Call the Job Tracker API (prod + localhost) |
