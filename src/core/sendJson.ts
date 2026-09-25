import { ServerResponse } from 'node:http';

export function sendJson(
  res: ServerResponse,
  statusCode: number,
  payload: unknown
): void {

  const body = JSON.stringify(payload);

  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });

  res.end(body);
}
``