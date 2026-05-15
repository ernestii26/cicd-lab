import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app';

describe('Fastify app', () => {
  it('GET /health returns ok status', async () => {
    const app = buildApp({ logger: false });
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
    await app.close();
  });

  it('GET / returns app message and version', async () => {
    const app = buildApp({ logger: false });
    const response = await app.inject({
      method: 'GET',
      url: '/'
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().message).toBe('CI/CD Lab Fastify app is running');
    await app.close();
  });

  it('GET /version returns app version', async () => {
    const app = buildApp({ logger: false });
    const previousVersion = process.env.APP_VERSION;
    process.env.APP_VERSION = '1.2.3';

    try {
      const response = await app.inject({
        method: 'GET',
        url: '/version'
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ version: '1.2.3' });
    } finally {
      if (previousVersion === undefined) {
        delete process.env.APP_VERSION;
      } else {
        process.env.APP_VERSION = previousVersion;
      }
      await app.close();
    }
  });
});
