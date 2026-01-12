# Improvement Suggestions

- Run UI E2E tests primarily in a controlled environment (staging/QA) with stable data,
  and keep production checks minimal (smoke-level) due to anti-bot protections and
  non-deterministic results.

- Add API/contract tests for search and filter responses (schema + boundary validation)
  to reduce reliance on UI-only assertions and to catch data issues earlier.

- Integrate automated accessibility checks (e.g., axe-core) into CI to detect missing
  labels, focus issues, and semantic problems before release.
