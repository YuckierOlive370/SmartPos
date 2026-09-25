import { ServerResponse } from 'node:http';

export function handleError(
  error: unknown,
  res: ServerResponse
): void {

  console.error('[ERROR]', error);

  res.writeHead(500, {
    'Content-Type': 'application/json; charset=utf-8',
  });

  res.end(
    JSON.stringify({
      error: 'Internal Server Error',
    })
  );
}