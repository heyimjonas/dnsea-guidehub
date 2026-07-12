import { createDbWorker } from 'sql.js-httpvfs';

let workerPromise = null;

const base = import.meta.env.BASE_URL;

export async function getDb() {
  if (workerPromise) return workerPromise;

  workerPromise = createDbWorker(
    [
      {
        from: 'httpvfs',
        config: {
          serverMode: 'full',
          url: `${base}dnsea-guidehub.db`,
          requestChunkSize: 4096,
        },
      },
    ],
    `${base}sqlite.worker.js`,
    `${base}sql-wasm.wasm`,
  );

  return workerPromise;
}
