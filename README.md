# SmartPOS API

API REST para un Punto de Venta Inteligente desarrollada con Node.js y TypeScript.

Proyecto académico enfocado en comprender los fundamentos de Node.js, el Event Loop y las buenas prácticas de desarrollo backend utilizando tipado estricto con TypeScript.

---

## Tecnologías

- Node.js
- TypeScript
- node:http
- Git
- GitHub

---

## Semana 1 — Fundamentos de Node.js y Event Loop

**Tag:** `v1.0.0-http-core`

Servidor HTTP nativo construido con `node:http`, sin Express ni frameworks.

El objetivo de esta etapa es comprender que Node.js ejecuta JavaScript en un único hilo y que el Event Loop permite atender múltiples peticiones concurrentes sin bloquear el proceso, siempre que no exista trabajo síncrono pesado.

---

## Características

- Servidor HTTP nativo con `node:http`.
- Proyecto migrado a TypeScript.
- Configuración estricta mediante `"strict": true`.
- Eliminación de tipos `any` implícitos.
- Demostración práctica de operaciones bloqueantes y no bloqueantes.
- Uso de variables de entorno mediante `process.env`.
- Compilación a JavaScript mediante TypeScript Compiler (`tsc`).

## Probar
 - npm run buil
 - npm start