import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Load/stress test (default: JSONPlaceholder public demo API).
 * Stages: 0 → 50 VUs (30s) → hold 1m → ramp down to 0.
 * Threshold: 95% of requests under 500ms.
 */
export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
};

// Prefer lab provider in CI/local; fall back to a public demo API for ad-hoc runs.
const BASE_URL = __ENV.BASE_URL || 'https://jsonplaceholder.typicode.com';
const PATH = __ENV.API_PATH || '/posts';

export default function () {
  const res = http.get(`${BASE_URL}${PATH}`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'body is not empty': (r) => r.body && r.body.length > 0,
  });

  sleep(1);
}
