# ─────────────────────────────────────────────────────────────────────────────
# Data Dashboard – R Shiny
# Datasets: iris (flower measurements) & mtcars (car performance)
# Required packages:
#   install.packages(c("shiny", "shinydashboard", "ggplot2", "plotly", "DT"))
# ─────────────────────────────────────────────────────────────────────────────

library(shiny)
library(shinydashboard)
library(ggplot2)
library(plotly)
library(DT)

# Colour palettes (consistent across both datasets)
SPECIES_COLOURS <- c(setosa = "#e74c3c", versicolor = "#2ecc71", virginica = "#3498db")
CYL_COLOURS     <- c("4" = "#2ecc71",    "6" = "#3498db",         "8" = "#e74c3c")

# ── UI ────────────────────────────────────────────────────────────────────────
ui <- dashboardPage(
  skin = "blue",

  dashboardHeader(title = "Data Dashboard"),

  dashboardSidebar(
    sidebarMenu(
      menuItem("Iris Dataset",   tabName = "iris",   icon = icon("seedling")),
      menuItem("MTCars Dataset", tabName = "mtcars", icon = icon("car"))
    )
  ),

  dashboardBody(
    tags$head(
      tags$style(HTML("
        body { font-family: 'Segoe UI', sans-serif; }
        .content-wrapper { background-color: #f4f6f9; }
        .box            { border-radius: 8px; }
        .small-box      { border-radius: 8px; }
      "))
    ),

    tabItems(

      # ── IRIS TAB ─────────────────────────────────────────────────────────────
      tabItem(
        tabName = "iris",

        fluidRow(
          valueBoxOutput("iris_obs",     width = 4),
          valueBoxOutput("iris_species", width = 4),
          valueBoxOutput("iris_avg_sl",  width = 4)
        ),

        fluidRow(
          box(
            title = "Controls", width = 3, status = "primary", solidHeader = TRUE,
            selectInput("iris_x", "X Axis:",
              choices  = c("Sepal Length" = "Sepal.Length", "Sepal Width" = "Sepal.Width",
                           "Petal Length" = "Petal.Length", "Petal Width" = "Petal.Width"),
              selected = "Sepal.Length"),
            selectInput("iris_y", "Y Axis:",
              choices  = c("Sepal Length" = "Sepal.Length", "Sepal Width" = "Sepal.Width",
                           "Petal Length" = "Petal.Length", "Petal Width" = "Petal.Width"),
              selected = "Petal.Length"),
            hr(),
            checkboxGroupInput("iris_species", "Filter Species:",
              choices  = c("setosa", "versicolor", "virginica"),
              selected = c("setosa", "versicolor", "virginica"))
          ),
          box(
            title = "Scatter Plot", width = 9, status = "primary", solidHeader = TRUE,
            plotlyOutput("iris_scatter", height = "340px")
          )
        ),

        fluidRow(
          box(title = "Histogram",           width = 6, status = "info", solidHeader = TRUE,
              plotlyOutput("iris_hist", height = "280px")),
          box(title = "Box Plot by Species", width = 6, status = "info", solidHeader = TRUE,
              plotlyOutput("iris_box",  height = "280px"))
        ),

        fluidRow(
          box(title = "Data Table", width = 12, status = "warning", solidHeader = TRUE,
              DTOutput("iris_table"))
        )
      ),

      # ── MTCARS TAB ───────────────────────────────────────────────────────────
      tabItem(
        tabName = "mtcars",

        fluidRow(
          valueBoxOutput("mtcars_obs",     width = 4),
          valueBoxOutput("mtcars_avg_mpg", width = 4),
          valueBoxOutput("mtcars_avg_hp",  width = 4)
        ),

        fluidRow(
          box(
            title = "Controls", width = 3, status = "primary", solidHeader = TRUE,
            selectInput("mtcars_x", "X Axis:",
              choices  = c("Horsepower"     = "hp",   "Weight"         = "wt",
                           "Displacement"   = "disp", "Rear Axle Ratio" = "drat",
                           "1/4 Mile Time"  = "qsec"),
              selected = "hp"),
            selectInput("mtcars_y", "Y Axis:",
              choices  = c("MPG"          = "mpg",  "Horsepower"  = "hp",
                           "Weight"       = "wt",   "Displacement" = "disp",
                           "1/4 Mile Time" = "qsec"),
              selected = "mpg"),
            hr(),
            checkboxGroupInput("mtcars_cyl", "Filter Cylinders:",
              choices  = c("4 cyl" = "4", "6 cyl" = "6", "8 cyl" = "8"),
              selected = c("4", "6", "8"))
          ),
          box(
            title = "Scatter Plot", width = 9, status = "primary", solidHeader = TRUE,
            plotlyOutput("mtcars_scatter", height = "340px")
          )
        ),

        fluidRow(
          box(title = "Avg MPG by Cylinders",    width = 6, status = "info", solidHeader = TRUE,
              plotlyOutput("mtcars_bar",  height = "280px")),
          box(title = "Horsepower Distribution", width = 6, status = "info", solidHeader = TRUE,
              plotlyOutput("mtcars_hist", height = "280px"))
        ),

        fluidRow(
          box(title = "Data Table", width = 12, status = "warning", solidHeader = TRUE,
              DTOutput("mtcars_table"))
        )
      )
    )
  )
)

# ── SERVER ────────────────────────────────────────────────────────────────────
server <- function(input, output, session) {

  # ── Iris: reactive data ─────────────────────────────────────────────────────
  iris_data <- reactive({
    req(input$iris_species)
    iris[iris$Species %in% input$iris_species, ]
  })

  output$iris_obs <- renderValueBox({
    valueBox(nrow(iris_data()), "Observations",
             icon = icon("database"), color = "blue")
  })
  output$iris_species <- renderValueBox({
    valueBox(length(unique(iris_data()$Species)), "Species Selected",
             icon = icon("seedling"), color = "green")
  })
  output$iris_avg_sl <- renderValueBox({
    valueBox(round(mean(iris_data()$Sepal.Length), 2), "Avg Sepal Length (cm)",
             icon = icon("ruler"), color = "yellow")
  })

  output$iris_scatter <- renderPlotly({
    df <- iris_data()
    validate(need(nrow(df) > 0, "Please select at least one species."))
    p <- ggplot(df, aes(x = .data[[input$iris_x]], y = .data[[input$iris_y]],
                        color = Species, text = paste("Species:", Species))) +
      geom_point(size = 3, alpha = 0.75) +
      scale_color_manual(values = SPECIES_COLOURS) +
      theme_minimal(base_size = 12) +
      labs(x = input$iris_x, y = input$iris_y)
    ggplotly(p, tooltip = c("x", "y", "text")) %>%
      layout(legend = list(orientation = "h", y = -0.15))
  })

  output$iris_hist <- renderPlotly({
    df <- iris_data()
    validate(need(nrow(df) > 0, "Please select at least one species."))
    p <- ggplot(df, aes(x = .data[[input$iris_x]], fill = Species)) +
      geom_histogram(bins = 20, alpha = 0.75, position = "identity") +
      scale_fill_manual(values = SPECIES_COLOURS) +
      theme_minimal(base_size = 12) +
      labs(x = input$iris_x, y = "Count")
    ggplotly(p) %>% layout(legend = list(orientation = "h", y = -0.2))
  })

  output$iris_box <- renderPlotly({
    df <- iris_data()
    validate(need(nrow(df) > 0, "Please select at least one species."))
    p <- ggplot(df, aes(x = Species, y = .data[[input$iris_y]], fill = Species)) +
      geom_boxplot(alpha = 0.75) +
      scale_fill_manual(values = SPECIES_COLOURS) +
      theme_minimal(base_size = 12) +
      labs(x = "Species", y = input$iris_y) +
      theme(legend.position = "none")
    ggplotly(p)
  })

  output$iris_table <- renderDT({
    datatable(
      iris_data(),
      options  = list(pageLength = 10, scrollX = TRUE),
      rownames = FALSE
    ) %>%
      formatStyle("Species",
        backgroundColor = styleEqual(
          c("setosa", "versicolor", "virginica"),
          c("#fde8e8", "#e8fdf0", "#e8f4fd")))
  })

  # ── MTCars: reactive data ───────────────────────────────────────────────────
  mtcars_data <- reactive({
    req(input$mtcars_cyl)
    df      <- mtcars
    df$car  <- rownames(df)
    df[df$cyl %in% as.integer(input$mtcars_cyl), ]
  })

  output$mtcars_obs <- renderValueBox({
    valueBox(nrow(mtcars_data()), "Observations",
             icon = icon("database"), color = "blue")
  })
  output$mtcars_avg_mpg <- renderValueBox({
    valueBox(round(mean(mtcars_data()$mpg), 1), "Avg MPG",
             icon = icon("gas-pump"), color = "green")
  })
  output$mtcars_avg_hp <- renderValueBox({
    valueBox(round(mean(mtcars_data()$hp), 0), "Avg Horsepower",
             icon = icon("bolt"), color = "red")
  })

  output$mtcars_scatter <- renderPlotly({
    df <- mtcars_data()
    validate(need(nrow(df) > 0, "Please select at least one cylinder group."))
    df$cyl <- as.factor(df$cyl)
    p <- ggplot(df, aes(x = .data[[input$mtcars_x]], y = .data[[input$mtcars_y]],
                        color = cyl, text = car)) +
      geom_point(size = 3, alpha = 0.8) +
      scale_color_manual(values = CYL_COLOURS) +
      theme_minimal(base_size = 12) +
      labs(x = input$mtcars_x, y = input$mtcars_y, color = "Cylinders")
    ggplotly(p, tooltip = c("text", "x", "y")) %>%
      layout(legend = list(orientation = "h", y = -0.15))
  })

  output$mtcars_bar <- renderPlotly({
    df <- mtcars_data()
    validate(need(nrow(df) > 0, "Please select at least one cylinder group."))
    avg <- aggregate(mpg ~ cyl, data = df, mean)
    avg$cyl <- as.factor(avg$cyl)
    avg$mpg <- round(avg$mpg, 1)
    p <- ggplot(avg, aes(x = cyl, y = mpg, fill = cyl,
                         text = paste("Avg MPG:", mpg))) +
      geom_bar(stat = "identity", alpha = 0.85, width = 0.6) +
      scale_fill_manual(values = CYL_COLOURS) +
      theme_minimal(base_size = 12) +
      labs(x = "Cylinders", y = "Average MPG") +
      theme(legend.position = "none")
    ggplotly(p, tooltip = "text")
  })

  output$mtcars_hist <- renderPlotly({
    df <- mtcars_data()
    validate(need(nrow(df) > 0, "Please select at least one cylinder group."))
    df$cyl <- as.factor(df$cyl)
    p <- ggplot(df, aes(x = hp, fill = cyl)) +
      geom_histogram(bins = 15, alpha = 0.75, position = "identity") +
      scale_fill_manual(values = CYL_COLOURS) +
      theme_minimal(base_size = 12) +
      labs(x = "Horsepower", y = "Count", fill = "Cylinders")
    ggplotly(p) %>% layout(legend = list(orientation = "h", y = -0.2))
  })

  output$mtcars_table <- renderDT({
    df      <- mtcars_data()
    df      <- df[, c("car", "mpg", "cyl", "hp", "wt", "disp", "drat", "qsec", "gear", "carb")]
    datatable(
      df,
      options  = list(pageLength = 10, scrollX = TRUE),
      rownames = FALSE
    ) %>%
      formatRound(c("mpg", "wt", "drat", "qsec"), digits = 2) %>%
      formatStyle("cyl",
        backgroundColor = styleEqual(
          c(4, 6, 8),
          c("#e8fdf0", "#e8f4fd", "#fde8e8")))
  })
}

shinyApp(ui, server)
