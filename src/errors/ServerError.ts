export class ServerError extends Error {
    constructor(message: string = 'Internal server error') {
      super(message);
      this.name = 'ServerError';
    }
  }
  