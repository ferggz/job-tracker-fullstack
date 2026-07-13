const PLATFORM_URL_PATTERNS = [
  { pattern: "linkedin.com", platform: "LinkedIn" },
  { pattern: "infojobs.net", platform: "InfoJobs" },
  { pattern: "indeed", platform: "Indeed" },
  { pattern: "tecnoempleo", platform: "Tecnoempleo" },
];

export const PLATFORMS = [
  "LinkedIn",
  "InfoJobs",
  "Indeed",
  "Tecnoempleo",
  "Other",
];

export function detectPlatformFromUrl(url) {
  const lowerUrl = url.toLowerCase();

  for (const { pattern, platform } of PLATFORM_URL_PATTERNS) {
    if (lowerUrl.includes(pattern)) {
      return platform;
    }
  }

  return "Other";
}

export function cleanPageTitle(title) {
  if (!title) {
    return "";
  }

  return title
    .replace(/\s*[|\-–—]\s*LinkedIn.*$/i, "")
    .replace(/\s*[|\-–—]\s*Indeed.*$/i, "")
    .replace(/\s*[|\-–—]\s*InfoJobs.*$/i, "")
    .replace(/\s*[|\-–—]\s*Tecnoempleo.*$/i, "")
    .trim();
}
