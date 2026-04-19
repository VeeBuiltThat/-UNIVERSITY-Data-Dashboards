# Shiny Dashboard

An R Shiny dashboard that visualises the built-in `iris` and `mtcars` datasets. Uses `shinydashboard` for layout, `ggplot2` + `plotly` for interactive charts, and `DT` for the data tables.

There are two tabs. The iris tab has a scatter plot, histogram, and box plot with species filtering. The mtcars tab has a scatter plot and bar chart with cylinder filtering. Both tabs show summary value boxes at the top.

## Running it

Install the required packages first (only needed once):

```r
install.packages(c("shiny", "shinydashboard", "ggplot2", "plotly", "DT"))
```

Then open `app.R` in RStudio and click **Run App**.

## Deploying to shinyapps.io

1. Create a free account at https://www.shinyapps.io
2. Install rsconnect: `install.packages("rsconnect")`
3. Link your account — go to shinyapps.io → Account → Tokens, copy the token command and run it in R
4. Deploy:
   ```r
   rsconnect::deployApp()
   ```

Your app will be live at `https://YOUR_NAME.shinyapps.io/shiny-dashboard/`.

Alternatively you can upload `app.R` to Posit Cloud and run it from there.
