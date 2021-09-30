export const publicIpUrl = "https://ipecho.net/plain"

export function parseKeyValueString(str: string[]) {
  const m = new Map<string, string>();
  for (const s of str) {
    const [key, value] = s.split("=");
    if (key == null) {
      continue;
    }
    if (value == null) {
      continue;
    }
    m.set(key, value);
  }
  return m;
}

export async function getPublicIp() {
  const response = await fetch(publicIpUrl);
  const text = await response.text();
  return text;
}
