# Database layer: none

No database configured at setup time. Use for pure frontend apps, API proxies, or when the database will be added later.

## Identity

```json
{
  "layer": "database",
  "id": "none",
  "label": "No database"
}
```

## Notes

- No database dependencies, scripts, or config files added
- Upgrade path: run `/project_setup` again and select a database layer — it will diff against the current setup and add only what is missing
- If adding a database later, also update the deployment layer — some hosts (e.g. Vercel) need specific env var configuration for DB connection pooling

## Extending this layer

See `layers/database/supabase.md` for the pattern to follow when adding a new database layer.
