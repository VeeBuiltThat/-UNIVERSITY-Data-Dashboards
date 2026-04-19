# React Data Dashboard

Interactive single-page dashboard built with **React 18 + Recharts** visualising the `iris` and `mtcars` datasets.

## Features
| Tab | Charts |
|-----|--------|
| Iris | Scatter plot (configurable axes), Grouped bar chart (avg measurements), Data table |
| MTCars | Scatter plot (configurable axes), Bar chart (avg MPG & HP by cylinder), Data table |

Both tabs include:
- Live axis selectors (dropdowns)
- Species / cylinder filter (checkboxes)
- Summary KPI cards
- Paginated data table with hover highlighting

---

## Prerequisites

Node.js 18+ — download from <https://nodejs.org>

---

## Run Locally

```bash
cd react-dashboard
npm install
npm start
```

Opens at <http://localhost:3000>

---

## Deploy to Netlify

### Option A – Drag & Drop (no account CLI needed)

1. Build the production bundle:
   ```bash
   npm install
   npm run build
   ```
2. Sign in at <https://app.netlify.com>
3. Click **Add new site → Deploy manually**
4. Drag the generated **`build/`** folder into the drop zone
5. Done — copy the live URL Netlify provides

### Option B – Netlify CLI

```bash
npm install
npm run build
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=build
```

### Option C – Connect GitHub (continuous deployment)

1. Push the `react-dashboard` folder to a GitHub repository
2. In Netlify: **Add new site → Import an existing project → GitHub**
3. Select your repo; Netlify auto-detects the settings from `netlify.toml`
   - Build command: `npm run build`
   - Publish directory: `build`
4. Click **Deploy site** — every push to `main` auto-deploys

---

## Submit link to Batis (university LMS)

1. Copy the Netlify live URL (e.g. `https://my-data-dashboard.netlify.app`)
2. Log in to Batis, navigate to the **Test_2 / Data Benchmarking** assignment
3. Paste the React URL and submit
