export class CloudflareDnsError extends Error {
  #code: number;

  public constructor(code: number, message?: string) {
    super(message);
    this.#code = code;
    this.name = "CloudflareDnsError";
  }

  get code() {
    return this.#code;
  }
}
