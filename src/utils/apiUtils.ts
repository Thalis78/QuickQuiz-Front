export const DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com.br",
  "icloud.com",
];

export const getEmailSuggestions = (value: string) => {
  const parts = value.split("@");

  if (parts.length === 2 && parts[0].length >= 3) {
    const [user, domainPart] = parts;

    const isExactMatch = DOMAINS.some((d) => d === domainPart);
    if (isExactMatch) return [];

    return DOMAINS.filter((d) => d.startsWith(domainPart)).map(
      (d) => `${user}@${d}`,
    );
  }

  return [];
};

export const API_URL = "http://localhost:3001/api";
