import 'dotenv/config';
import http, {
  IncomingMessage,
  ServerResponse,
} from 'node:http';

const PORT: number = Number(process.env.PORT) || 3000;

function sendJson(
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

const server = http.createServer( (req: IncomingMessage, res: ServerResponse): void => {
    const { method, url } = req;
      if (url === '/' && method === 'GET') {
    return sendJson(res, 200, {
      service: 'SmartPOS API',
      week: 1,
      message: 'Servidor HTTP nativo con node:http, sin frameworks.',
    });
  }

  // Health check
  if (url === '/health' && method === 'GET') {
    return sendJson(res, 200, { status: 'ok', uptime: process.uptime() });
  }

  // Ping simple
  if (url === '/demo/ping' && method === 'GET') {
    return sendJson(res, 200, { pong: true, timestamp: Date.now() });
  }

  // /demo/blocking
  if (url === '/demo/blocking' && method === 'GET') {
    const start = Date.now();
    const durationMs = 3000;
    while (Date.now() - start < durationMs) {
      // solo ocupa el hilo principal, bloqueando el Event Loop y todas las demás peticiones
    }
    return sendJson(res, 200, {
      blocked_for_ms: Date.now() - start,
      note: 'Mientras esto corría, NINGUNA otra petición pudo ser atendida.',
    });
  }

  // /demo/non-blocking
  if (url === '/demo/non-blocking' && method === 'GET') {
    const start = Date.now();
    setTimeout(() => {
      sendJson(res, 200, {
        waited_for_ms: Date.now() - start,
        note: 'El Event Loop quedó libre para otras peticiones mientras esperábamos.',
      });
    }, 3000);
    return; // importante nO respondemos aquí, respondemos dentro del callback
  }

  // 404: ninguna ruta coincidió
  return sendJson(res, 404, { error: 'Not Found', path: url });
});

server.listen(PORT, (): void => {
  console.log(`SmartPOS API (Semana 1) escuchando en http://localhost:${PORT}`);
  console.log('Rutas: GET /, GET /health, GET /demo/ping, GET /demo/blocking, GET /demo/non-blocking');
});