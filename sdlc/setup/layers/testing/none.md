# Testing layer: none

No test tooling configured at setup time. Use this for spikes, prototypes, or when testing will be added later.

## Identity

```json
{
  "layer": "testing",
  "id": "none",
  "label": "No testing (prototype / spike)"
}
```

## Notes

- No test dependencies added
- No test scripts added
- Upgrade path: run `/project-setup` again and select a testing layer — it will diff against current `package.json` and add only what's missing
- Document in project README that tests are deferred and why
