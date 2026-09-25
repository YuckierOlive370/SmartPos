import 'dotenv/config';
import http, {
  IncomingMessage,
  ServerResponse,
} from 'node:http';

import { Router } from './core/Router';
import { logger } from './middlewares/logger';
import { handleError } from './middlewares/errorHandler';
import { sendJson } from './core/sendJson';
import { products } from './routes/products';
import { parseJsonBody } from './core/bodyParser';

const PORT: number = Number(process.env.PORT) || 3000;

const router = new Router();

/* =========================
   RUTAS SEMANA 1
========================= */

router.register('GET', '/', (_req, res) => {
  sendJson(res, 200, {
    service: 'SmartPOS API',
    week: 2,
    message: 'Servidor HTTP nativo con node:http, sin frameworks.',
  });
});

router.register('GET', '/health', (_req, res) => {
  sendJson(res, 200, {
    status: 'ok',
    uptime: process.uptime(),
  });
});

router.register('GET', '/demo/ping', (_req, res) => {
  sendJson(res, 200, {
    pong: true,
    timestamp: Date.now(),
  });
});

router.register('GET', '/demo/blocking', (_req, res) => {
  const start = Date.now();
  const durationMs = 3000;

  while (Date.now() - start < durationMs) {
    // Busy wait intencional
  }

  sendJson(res, 200, {
    blocked_for_ms: Date.now() - start,
    note: 'Mientras esto corría, NINGUNA otra petición pudo ser atendida.',
  });
});

router.register('GET', '/demo/non-blocking', (_req, res) => {
  const start = Date.now();

  setTimeout(() => {
    sendJson(res, 200, {
      waited_for_ms: Date.now() - start,
      note: 'El Event Loop quedó libre para otras peticiones mientras esperábamos.',
    });
  }, 3000);
});

/* =========================
   RUTA NUEVA SEMANA 2
========================= */

router.register(
  'GET',
  '/products',
  (req, res) => {

    const url = new URL(
      req.url ?? '',
      'http://localhost'
    );

    const id = url.searchParams.get('id');

    if (id) {

      const product = products.find(
        p => p.id === Number(id)
      );

      if (!product) {
        return sendJson(res, 404, {
          error: 'Product not found',
        });
      }

      return sendJson(res, 200, product);
    }

    return sendJson(res, 200, products);

  }
);

router.register(
  'POST',
  '/products',
  async (req, res) => {

    try {

      const body =
        await parseJsonBody(req);

      const data = body as {
        name?: string;
        price?: number;
        description?: string;
      };

      if (
        !data.name ||
        typeof data.price !== 'number' ||
        !data.description
      ) {

        return sendJson(res, 400, {
          error: 'Invalid data',
        });

      }

      const product = {
        id: products.length + 1,
        name: data.name,
        price: data.price,
        description: data.description,
      };

      products.push(product);

      sendJson(res, 201, product);

    } catch {

      sendJson(res, 400, {
        error: 'Invalid JSON',
      });

    }

  }
);

router.register(
  'PUT',
  '/products',
  async (req, res) => {

    try {

      const body =
        await parseJsonBody(req);

      const data = body as {
        id?: number;
        name?: string;
        price?: number;
        description?: string;
      };

      const product =
        products.find(
          p => p.id === data.id
        );

      if (!product) {

        return sendJson(
          res,
          404,
          {
            error: 'Product not found',
          }
        );

      }

      if (data.name) {
        product.name = data.name;
      }

      if (typeof data.price === 'number') {
        product.price = data.price;
      }

      if (data.description) {
        product.description = data.description;
      }

      sendJson(res, 200, product);

    } catch {

      sendJson(res, 400, {
        error: 'Invalid JSON',
      });

    }

  }
);

router.register(
  'DELETE',
  '/products',
  async (req, res) => {

    try {

      const body =
        await parseJsonBody(req);

      const data =
        body as { id?: number };

      const index =
        products.findIndex(
          p => p.id === data.id
        );

      if (index === -1) {

        return sendJson(
          res,
          404,
          {
            error: 'Product not found',
          }
        );

      }

      products.splice(index, 1);

      sendJson(res, 200, {
        message: 'Deleted',
      });

    } catch {

      sendJson(res, 400, {
        error: 'Invalid JSON',
      });

    }

  }
);

//Ruta de prueba para generar un error y probar el middleware de manejo de erroresc
router.register(
'GET',
'/error',
() => {
throw new Error('Test error');
}
);

/* =========================
   SERVIDOR
========================= */

const server = http.createServer(
  async (
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> => {
    try {
      logger(req);

      const handled = await router.handle(req, res);

      if (!handled) {
        sendJson(res, 404, {
          error: 'Not Found',
          path: req.url,
        });
      }

    } catch (error: unknown) {
      handleError(error, res);
    }
  }
);


server.listen(PORT, (): void => {
  console.log(
    `SmartPOS API escuchando en http://localhost:${PORT}`
  );
});
  console.log('Semana 1: GET /, /health, /demo/ping, /demo/blocking, /demo/non-blocking, /demo/double-next');
  console.log('Semana 2: GET/POST /products, GET/PUT/DELETE /products?id=id');