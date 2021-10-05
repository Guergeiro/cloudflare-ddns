export class CloudflareDnsError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "CloudflareDnsError";
  }
}
