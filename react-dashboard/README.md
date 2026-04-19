# React Dashboard

A single-page React app that visualises the `iris` and `mtcars` datasets. Built with React 18 and Recharts.

There are two tabs — one for each dataset. Each tab has a scatter plot with selectable axes, a bar chart showing averages, and a paginated data table. You can filter by species (iris) or cylinder count (mtcars) using the checkboxes in the sidebar.

## Running it

Requires Node.js 18+.

```bash
npm install
npm start
```

Opens at `http://localhost:3000`.

## Building for deployment

```bash
npm run build
```

This produces a `build/` folder with the static site. Upload that folder to Netlify (drag and drop on the Netlify dashboard) or use the CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

If you connect this repo to Netlify directly, it will pick up the `netlify.toml` config and build automatically on every push.
