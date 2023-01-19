export function capitalizeFirstLetter(str: string[]) {
  const res = str
    .map((s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
    .join(" ");
  return res;
}
