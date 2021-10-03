export type CloudflareGetResponse = CloudflareResponse & {
  result_info: {
    page: number;
    per_page: number;
    count: number;
    total_count: number;
    total_pages: number;
  };
  result: Array<CloudflareDnsRecord>;
};

export type CloudflarePatchResponse = CloudflareResponse & {
  result: CloudflareDnsRecord;
};

export type CloudflareResponse = {
  success: boolean;
  errors: string[];
  messages: string[];
};

type CloudflareDnsRecord = {
  id: string;
  // deno-lint-ignore camelcase
  zone_id: string;
  // deno-lint-ignore camelcase
  zone_nme: string;
  name: string;
  type: string;
  content: string;
  proxiable: boolean;
  proxied: boolean;
  ttl: number;
  locked: boolean;
  meta: {
    // deno-lint-ignore camelcase
    auto_added: boolean;
    // deno-lint-ignore camelcase
    managed_by_apps: boolean;
    // deno-lint-ignore camelcase
    managed_by_argo_tunnel: boolean;
    source: string;
  };
  // deno-lint-ignore camelcase
  created_on: Date;
  // deno-lint-ignore camelcase
  modified_on: Date;
};
