export class CustomError extends Error {
  constructor (message: string, public status?: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}
