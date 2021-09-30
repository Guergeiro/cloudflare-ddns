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
  zone_id: string;
  zone_nme: string;
  name: string;
  type: string;
  content: string;
  proxiable: boolean;
  proxied: boolean;
  ttl: number;
  locked: boolean;
  meta: {
    auto_added: boolean;
    managed_by_apps: boolean;
    managed_by_argo_tunnel: boolean;
    source: string;
  };
  created_on: Date;
  modified_on: Date;
};
