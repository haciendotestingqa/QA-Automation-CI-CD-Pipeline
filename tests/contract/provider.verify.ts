import path from 'node:path';
import { Verifier } from '@pact-foundation/pact';

const providerBaseUrl = process.env.PROVIDER_BASE_URL ?? 'http://127.0.0.1:4010';
const brokerBaseUrl = process.env.PACT_BROKER_BASE_URL;
const pactsDir = path.resolve(__dirname, 'pacts');

async function verify(): Promise<void> {
  const common = {
    provider: 'catalog-api',
    providerBaseUrl,
    providerVersion: process.env.GIT_COMMIT || process.env.GITHUB_SHA || 'local',
    stateHandlers: {
      'catalog exists': async () => {
        // Provider always has catalog data in this lab.
      },
    },
  };

  const verifier = brokerBaseUrl
    ? new Verifier({
        ...common,
        pactBrokerUrl: brokerBaseUrl,
        publishVerificationResult: true,
        consumerVersionSelectors: [{ latest: true }],
      })
    : new Verifier({
        ...common,
        // Multi-consumer without Broker: verify every pact file in pacts/
        pactUrls: [
          path.join(pactsDir, 'web-shop-catalog-api.json'),
          path.join(pactsDir, 'mobile-shop-catalog-api.json'),
        ],
      });

  await verifier.verifyProvider();
  console.log(
    brokerBaseUrl
      ? `Provider verification against Broker (${brokerBaseUrl}) passed.`
      : 'Provider verification against local multi-consumer pacts passed.',
  );
}

verify().catch((err) => {
  console.error('Pact provider verification failed:', err);
  process.exit(1);
});
