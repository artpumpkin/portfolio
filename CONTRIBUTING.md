# Contributing

Use Node.js 24 and install the locked dependencies with `npm ci`.
Keep changes focused and explain the behavior being changed. Include a screenshot
for visible changes and a regression test when changing behavior that can break.
Do not submit credentials, private data, or assets you cannot redistribute.

Before opening a pull request, run:

```sh
npm run check
npm run build
npm run test:e2e
npm audit
```

For portfolio browser tests, first run `npx playwright install chromium`.
Report security issues privately as described in SECURITY.md.
