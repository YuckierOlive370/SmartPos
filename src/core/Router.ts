import {
  IncomingMessage,
  ServerResponse,
} from 'node:http';

import { URL } from 'node:url';

import { Handler } from './types';

export class Router {

  private routes = new Map<string, Handler>();

  register(
    method: string,
    path: string,
    handler: Handler
  ): void {

    this.routes.set(
      `${method}:${path}`,
      handler
    );

  }

  async handle(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<boolean> {

    const method = req.method ?? '';

    const url = new URL(
      req.url ?? '',
      'http://localhost'
    );

    const path = url.pathname;

    const handler =
      this.routes.get(`${method}:${path}`);

    if (!handler) {
      return false;
    }

    await handler(req, res);

    return true;
  }
}