# Framework layer: react-lib

React component library or standalone frontend app. Vite-based, no SSR.

## Identity

```json
{
  "layer": "framework",
  "id": "react-lib",
  "label": "React + Vite (library / SPA)"
}
```

## Core dependencies

```json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "vite": "^6.x",
    "@vitejs/plugin-react": "^4.x",
    "typescript": "^5.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x"
  }
}
```

## Scripts

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

## Config files to generate

- `vite.config.ts`
- `tsconfig.json` — strict, DOM lib
- `tsconfig.node.json` — for vite config itself
- `index.html`
- `src/main.tsx`
- `src/App.tsx`

## Optional add-ons (ask before adding)

- Tailwind CSS — `tailwindcss`, `@tailwindcss/vite`
- React Router — `react-router-dom`
- Storybook — `storybook init` after scaffold

## Notes

- Library mode: set `build.lib` in vite.config if publishing to npm
- App mode: default vite output to `dist/`
