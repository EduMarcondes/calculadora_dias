export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const isHttpError = (value: unknown): value is HttpError => {
  return value instanceof HttpError;
};