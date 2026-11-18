import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const broker = (process.env.PACT_BROKER_BASE_URL || 'http://127.0.0.1:9292').replace(/\/$/, '');
const consumerVersion = process.env.GIT_COMMIT || process.env.GITHUB_SHA || 'local';
const pactsDir = path.resolve(__dirname, 'pacts');

const files = fs.readdirSync(pactsDir).filter((f) => f.endsWith('.json'));
if (files.length === 0) {
  console.error('No pact files found. Run consumer tests first.');
  process.exit(1);
}

for (const file of files) {
  const pactPath = path.join(pactsDir, file);
  const pact = JSON.parse(fs.readFileSync(pactPath, 'utf8'));
  const consumer = pact.consumer?.name;
  const provider = pact.provider?.name;
  if (!consumer || !provider) {
    console.error(`Could not read consumer/provider from ${file}`);
    process.exit(1);
  }

  const url = `${broker}/pacts/provider/${encodeURIComponent(provider)}/consumer/${encodeURIComponent(consumer)}/version/${encodeURIComponent(consumerVersion)}`;
  console.log(`Publishing ${file} → ${url}`);

  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/hal+json' },
    body: JSON.stringify(pact),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Publish failed (${res.status}): ${body}`);
    process.exit(1);
  }

  console.log(`Published OK (${res.status})`);
}

console.log('All pacts published.');
