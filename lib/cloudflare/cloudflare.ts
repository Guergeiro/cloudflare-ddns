import { parseKeyValueString } from "../general/utils.ts";
import { CloudflareDnsError } from "../general/CloudflareDnsError.ts";
import {
  CloudflareGetResponse,
  CloudflarePatchResponse,
  CloudflareResponse,
} from "./types.ts";
const { readTextFile } = Deno;

export const cloudflareUrl = "https://api.cloudflare.com/client/v4/zones";

export async function getCloudflareData(url: URL, headers: Headers) {
  const json = await fetchCloudflare<CloudflareGetResponse>(
    fetch(url, { headers: headers }),
  );
  // deno-lint-ignore camelcase
  const { result, result_info } = json;
  if (result_info.page !== result_info.total_pages) {
    url.searchParams.set("page", `${result_info.page += 1}`);
    result.push(...await getCloudflareData(url, headers));
  }
  return result;
}

export async function patchCloudflareRecord(
  url: URL,
  headers: Headers,
  body: string,
) {
  const json = await fetchCloudflare<CloudflarePatchResponse>(fetch(url, {
    method: "PATCH",
    headers: headers,
    body: body,
  }));

  return json;
}

async function fetchCloudflare<G extends CloudflareResponse>(
  request: Promise<Response>,
) {
  const response = await request;
  const json: G = await response.json();
  if (json.success === false) {
    throw new CloudflareDnsError(1, json.errors.join("\n"));
  }
  return json;
}

export async function getCloudflareConfig(configArgs: string[]) {
  const file = await getConfigFile(configArgs);
  const config = parseFile(file);
  return config;
}

function parseFile(txt: string) {
  function errorMessage(str: string) {
    return `No config with ${str} provided.`;
  }
  const lines = txt.split("\n");
  const m = parseKeyValueString(lines);

  if (m.has("x-auth-key") === false) {
    throw new CloudflareDnsError(1, errorMessage("auth key"));
  }
  if (m.has("x-auth-email") === false) {
    throw new CloudflareDnsError(1, errorMessage("auth email"));
  }
  if (m.has("zone-id") === false) {
    throw new CloudflareDnsError(1, errorMessage("zone id"));
  }
  if (m.has("a-record") === false) {
    throw new CloudflareDnsError(1, errorMessage("a record"));
  }
  return m;
}

function parseArguments(args: string[]) {
  return parseKeyValueString(args).get("config");
}

async function getConfigFile(args: string[]) {
  const config = parseArguments(args);
  if (config == null) {
    throw new CloudflareDnsError(1, "No config specified.");
  }
  if (config.length === 0) {
    throw new CloudflareDnsError(1, "No config specified.");
  }
  const txt = await readTextFile(config);
  return txt;
}
