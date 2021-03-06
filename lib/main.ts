import {
  cloudflareUrl,
  getCloudflareConfig,
  getCloudflareData,
  patchCloudflareRecord,
} from "./cloudflare/cloudflare.ts";
import { CloudflareDnsError } from "./cloudflare/CloudflareDnsError.ts";
import { getPublicIp } from "./general/utils.ts";
import { version } from "./general/version.ts";
import { Command } from "../deps.ts";

export async function cloudflareDns(configUrl: string) {
  const config = await getCloudflareConfig(configUrl);
  const xAuthKey = config.get("x-auth-key");
  const xAuthEmail = config.get("x-auth-email");
  const zoneId = config.get("zone-id");
  const aRecord = config.get("a-record");

  const publicIp = await getPublicIp();

  const headers = new Headers();
  headers.set("x-auth-key", xAuthKey!);
  headers.set("x-auth-email", xAuthEmail!);

  const json = await getCloudflareData(
    new URL(`${cloudflareUrl}/${zoneId}/dns_records`),
    headers,
  );

  const typeARecords = json.filter(function (element) {
    return element.type === "A";
  });
  const dnsRecord = typeARecords.find(function (element) {
    return element.name.startsWith(aRecord!);
  });
  if (dnsRecord == null) {
    throw new CloudflareDnsError("No type A record provided.");
  }
  await patchCloudflareRecord(
    new URL(`${cloudflareUrl}/${zoneId}/dns_records/${dnsRecord.id}`),
    headers,
    JSON.stringify({
      content: publicIp,
    }),
  );
}

async function main() {
  const { options } = await new Command().name("cloudflare-ddns").description(
    "Automatically update cloudflare A records to work like a ddns",
  ).version(version).option(
    "-c, --config [path/to/config]",
    "Path to config file.",
    {
      default: `${Deno.cwd()}/config`,
    },
  ).parse(Deno.args);

  await cloudflareDns(options.config);
}

if (import.meta.main === true) {
  try {
    await main();
  } catch (err) {
    const output: string[] = [];
    output.push(err.message);
    if (err instanceof CloudflareDnsError) {
      output.push(`This was an error expected by cloudflare-ddns.`);
    } else {
      output.push(`This was not an error expected by cloudflare-ddns.`);
    }
    output.join("\n");
    await Deno.writeTextFile(`./${new Date().toISOString()}.log`, err.stack);
    Deno.exit(1);
  }
}
