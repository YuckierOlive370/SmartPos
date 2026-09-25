import { IncomingMessage } from 'node:http';

export async function parseJsonBody(
  req: IncomingMessage
): Promise<unknown> {

  return new Promise((resolve, reject) => {

    let body = '';

    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();    
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }

    });
    
    req.on('error', reject);
  });

}