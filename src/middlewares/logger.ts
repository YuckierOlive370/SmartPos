import { IncomingMessage } from 'node:http';

export function logger(
  req: IncomingMessage
): void {

  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url}`
  );

}