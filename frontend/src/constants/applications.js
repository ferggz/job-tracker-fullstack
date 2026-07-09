export const APPLICATION_STATUSES = [
  "Applied",
  "Interview",
  "Rejected",
  "Offer",
];

export const STATUS_ORDER = {
  Offer: 1,
  Interview: 2,
  Applied: 3,
  Rejected: 4,
};

export const PLATFORMS = [
  "LinkedIn",
  "InfoJobs",
  "Indeed",
  "Tecnoempleo",
  "Other",
];

const PLATFORM_URL_PATTERNS = [
  { pattern: "linkedin.com", platform: "LinkedIn" },
  { pattern: "infojobs.net", platform: "InfoJobs" },
  { pattern: "indeed", platform: "Indeed" },
  { pattern: "tecnoempleo", platform: "Tecnoempleo" },
];

export function detectPlatformFromUrl(url) {
  const lowerUrl = url.toLowerCase();

  for (const { pattern, platform } of PLATFORM_URL_PATTERNS) {
    if (lowerUrl.includes(pattern)) {
      return platform;
    }
  }

  return null;
}
