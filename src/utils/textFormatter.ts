export function convertToTitleCase(str: string | string[]): string {
  if (Array.isArray(str)) {
    return str
      .join(" ")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
  return str.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
