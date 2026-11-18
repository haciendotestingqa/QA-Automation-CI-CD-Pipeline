# QA Automation & CI-CD Pipeline

Professional automated testing lab covering the full quality ecosystem:

| Layer | Tool | Location |
|------|-------------|-----------|
| Web E2E | [Playwright](https://playwright.dev) | `tests/web/` |
| API | Playwright (`request`) + local catalog provider | `tests/api/` + `provider/` |
| Mobile Android | [Maestro](https://maestro.mobile.dev) | `tests/mobile/` |
| Load / Stress | [k6](https://k6.io) | `tests/performance/` |
| Contracts | [Pact](https://docs.pact.io) + Broker (multi-consumer) | `tests/contract/` |

The unified pipeline lives in [`.github/workflows/qa-lab.yml`](.github/workflows/qa-lab.yml).

## Requirements

- **Node.js** 18+ (LTS recommended)
- **Playwright** browsers (`npx playwright install`)
- **Maestro CLI** + Android emulator/device (for mobile)
- **k6** (for performance)
- **Docker** (optional, for Pact Broker locally)

## Quick install

```bash
npm install
npx playwright install
```

Maestro (Linux/macOS):

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
maestro download-samples
```

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run provider:start` | Start local catalog API (`:4010`) |
| `npm run test:web` | Web E2E tests |
| `npm run test:api` | API tests (needs provider) |
| `npm run test:e2e` | Web + API |
| `npm run test:perf` | Stress test with k6 |
| `npm run test:contract` | Pact consumers + provider (file-based) |
| `npm run test:contract:broker` | Consumers → publish → verify via Broker |
| `npm run broker:up` / `broker:down` | Local Pact Broker on `:9292` (needs Docker running) |
| `npm run report` | Open the Playwright HTML report |

### Manual local runs (outside the pipeline)

**Catalog API** (same mini-backend CI uses):

```bash
npm run provider:start
# browser or curl:
#   http://127.0.0.1:4010/health
#   http://127.0.0.1:4010/api/products
npm run test:api
```

**Web only** (no provider needed):

```bash
npm run test:web
```

**Mobile** (emulator on + sample APK installed):

```bash
maestro test tests/mobile/android-flow.yaml
```

**Pact Broker UI** only appears after Docker is up:

```bash
# start Docker Desktop / daemon first, then:
npm run broker:up
# open http://127.0.0.1:9292
npm run provider:start   # other terminal
npm run test:contract:broker
npm run broker:down      # when finished
```

Without Broker (still multi-consumer, file-based):

```bash
npm run provider:start
npm run test:contract
```

## CI/CD

GitHub Actions runs:

- **e2e-and-api-tests** — Playwright Web + local catalog API
- **contract-tests** — Pact multi-consumer + Broker publish/verify
- **mobile-tests** — Maestro on Android emulator (**API 30** in CI for stable boot; local manual often API 33)
- **performance-scheduled-tests** — k6 on cron `0 7 * * *` (03:00 UTC-4) and manual  
  Temporary lab window through **2026-11-20**; local anytime with `npm run test:perf`

Reports are published as workflow **Artifacts**.

## License

MIT
