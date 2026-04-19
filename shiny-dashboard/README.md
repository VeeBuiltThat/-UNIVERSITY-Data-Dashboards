# Shiny Data Dashboard

Interactive dashboard built with **R Shiny** visualising the built-in `iris` and `mtcars` datasets.

## Features
| Tab | Charts |
|-----|--------|
| Iris | Scatter plot, Histogram, Box plot, Data table |
| MTCars | Scatter plot, Bar chart (avg MPG), Horsepower histogram, Data table |

Both tabs include:
- Live-filtering controls (species / cylinder checkboxes)
- Dynamic axis selectors
- Summary value boxes
- Paginated, colour-coded DT table

---

## Required R Packages

Run once in your R console:

```r
install.packages(c("shiny", "shinydashboard", "ggplot2", "plotly", "DT"))
```

---

## Run Locally

1. Open `app.R` in RStudio.
2. Click **Run App** (top-right of the editor).

---

## Deploy to Posit Cloud (posit.cloud)

1. Sign in at <https://posit.cloud>
2. Click **New Project → New RStudio Project**
3. In the **Files** pane click **Upload** and upload `app.R`
4. In the R Console install packages:
   ```r
   install.packages(c("shiny", "shinydashboard", "ggplot2", "plotly", "DT"))
   ```
5. Open `app.R` and click **Run App → Run External** (opens in a browser tab)

> To share the running app URL with others, click the **Publish** button in RStudio (top-right) or follow the shinyapps.io steps below.

---

## Publish to shinyapps.io (permanent public URL)

1. Create a free account at <https://www.shinyapps.io>
2. Install `rsconnect`:
   ```r
   install.packages("rsconnect")
   ```
3. Go to **shinyapps.io → Account → Tokens → Show** and copy the token command, then run it in R:
   ```r
   rsconnect::setAccountInfo(name = "YOUR_NAME", token = "YOUR_TOKEN", secret = "YOUR_SECRET")
   ```
4. Deploy from the folder containing `app.R`:
   ```r
   rsconnect::deployApp()
   ```
5. Your live URL will be: `https://YOUR_NAME.shinyapps.io/shiny-dashboard/`

---

## Submit link to Batis (university LMS)

1. Copy the live shinyapps.io URL after deployment.
2. Log in to Batis, navigate to the **Test_2 / Data Benchmarking** assignment.
3. Paste the Shiny URL and submit.
