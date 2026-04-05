# Deployment layer: none

No deployment target configured at setup time. Use for local-only projects, libraries published to npm, or when the deployment target is not yet decided.

## Identity

```json
{
  "layer": "deployment",
  "id": "none",
  "label": "No deployment target"
}
```

## Notes

- No deployment dependencies, scripts, or config files added
- Upgrade path: run `/project_setup` again and select a deployment layer
- If the project will eventually be deployed, deciding the target early is recommended — some choices (e.g. Next.js standalone output for Docker) affect `next.config.ts` in ways that are easier to set up from the start

## Extending this layer

See `layers/deployment/vercel.md` for the pattern to follow when adding a new deployment layer.
