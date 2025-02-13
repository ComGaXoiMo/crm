import * as am4charts from '@amcharts/amcharts4/charts'
import * as am4core from '@amcharts/amcharts4/core'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'

am4core.useTheme(am4themes_animated)

export function createColumnChart(
  elementId,
  categoryField,
  categoryTitle,
  disabledLegend?,
  xScroll?,
  zoomStart?,
  zoomEnd?
) {
  const chart = am4core.create(elementId, am4charts.XYChart)
  chart.numberFormatter.numberFormat = '#.##'
  chart.logo.hidden = true
  if (xScroll) {
    chart.scrollbarX = new am4core.Scrollbar()
    chart.scrollbarX.minHeight = 4
  }
  if (!disabledLegend) {
    chart.legend = new am4charts.Legend()
    chart.legend.position = 'top'
    chart.legend.paddingBottom = 20
    chart.legend.labels.template.maxWidth = 95
    chart.legend.labels.template.truncate = true
  }
  const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
  categoryAxis.dataFields.category = categoryField
  categoryAxis.title.text = categoryTitle
  categoryAxis.renderer.grid.template.location = 0
  categoryAxis.renderer.minGridDistance = 20
  categoryAxis.renderer.cellStartLocation = 0.1
  categoryAxis.renderer.cellEndLocation = 0.9

  const label = categoryAxis.renderer.labels.template
  label.truncate = true
  label.maxWidth = 120

  categoryAxis.events.on('sizechanged', function (ev) {
    const axis = ev.target
    const cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex)
    if (cellWidth < axis.renderer.labels.template.maxWidth) {
      axis.renderer.labels.template.rotation = -45
      axis.renderer.labels.template.horizontalCenter = 'right'
      axis.renderer.labels.template.verticalCenter = 'middle'
    } else {
      axis.renderer.labels.template.rotation = 0
      axis.renderer.labels.template.horizontalCenter = 'middle'
      axis.renderer.labels.template.verticalCenter = 'top'
    }
  })

  if (zoomStart && zoomEnd) {
    categoryAxis.start = zoomStart
    categoryAxis.end = zoomEnd
  }

  const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
  valueAxis.min = 0

  return chart
}
export function createPieChart(elementId) {
  const chart = am4core.create(elementId, am4charts.PieChart)
  chart.logo.hidden = true

  // Set inner radius
  chart.innerRadius = am4core.percent(45)

  // Add and configure Series
  const pieSeries = chart.series.push(new am4charts.PieSeries())
  pieSeries.dataFields.value = 'value'
  pieSeries.dataFields.category = 'name'
  pieSeries.slices.template.propertyFields.fill = 'color'

  // Disable ticks and labels
  pieSeries.labels.template.disabled = true
  pieSeries.ticks.template.disabled = true

  // This creates initial animation
  pieSeries.hiddenState.properties.opacity = 1
  pieSeries.hiddenState.properties.endAngle = -90
  pieSeries.hiddenState.properties.startAngle = -90

  // Add a legend
  chart.legend = new am4charts.Legend()

  return chart
}

export function createPieChartEscalate(elementId) {
  const chart = am4core.create(elementId, am4charts.PieChart)
  chart.logo.hidden = true

  // Set inner radius
  chart.innerRadius = am4core.percent(15)

  // Add and configure Series
  const pieSeries = chart.series.push(new am4charts.PieSeries())
  pieSeries.dataFields.value = 'value'
  pieSeries.dataFields.category = 'name'
  pieSeries.slices.template.propertyFields.fill = 'color'

  // Disable ticks and labels
  pieSeries.labels.template.disabled = true
  pieSeries.ticks.template.disabled = true

  // This creates initial animation
  pieSeries.hiddenState.properties.opacity = 1
  pieSeries.hiddenState.properties.endAngle = -90
  pieSeries.hiddenState.properties.startAngle = -90

  // Add a legend
  chart.legend = new am4charts.Legend()

  return chart
}

export function prepareChartColumnStack(data, columnListName = 'status') {
  const result = [] as any
  data.forEach((column) => {
    const columnData = {
      id: column.id,
      category: column.category,
      total: column.total
    }
    ;(column[columnListName] || []).forEach((statusData) => {
      columnData[statusData.name] = statusData.value
      columnData[statusData.name + 'percent'] = statusData.percent
    })

    result.push(columnData)
  })
  return result
}

export function prepareChartColumnStackSeries(chart, column, categoryField, isStack, columnListName = 'status') {
  (column[columnListName] || []).forEach((statusData, index) => {
    const series = chart.series.push(new am4charts.ColumnSeries())
    series.name = statusData.name
    series.dataFields.categoryX = categoryField
    series.dataFields.valueY = statusData.name
    series.columns.template.strokeWidth = 0
    series.columns.template.column.fillOpacity = 0.8
    series.columns.template.tooltipText = '{name}: [bold]{valueY}[/]'
    series.stacked = isStack

    if (column[columnListName].length === index + 1) {
      series.columns.template.column.cornerRadiusTopLeft = 10
      series.columns.template.column.cornerRadiusTopRight = 10
    }
  })
}

export const createBarHorizontalChart = (
  elementChartId,
  categoryField,
  categoryTitle,
  showLegend = false,
  cellSize = 30,
  stacked?
) => {
  const chart = am4core.create(elementChartId, am4charts.XYChart)
  chart.logo.hidden = true
  const interfaceColors = new am4core.InterfaceColorSet()
  // Create axes
  const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis())
  categoryAxis.dataFields.category = categoryField
  categoryAxis.title.text = categoryTitle
  categoryAxis.renderer.grid.template.stroke = interfaceColors.getFor('background')
  categoryAxis.renderer.grid.template.strokeOpacity = 1
  categoryAxis.renderer.grid.template.location = 0
  categoryAxis.renderer.minGridDistance = 25

  const valueAxis = chart.xAxes.push(new am4charts.ValueAxis())
  valueAxis.renderer.baseGrid.disabled = true
  valueAxis.renderer.gridContainer.background.fill = interfaceColors.getFor('alternativeBackground')
  valueAxis.renderer.gridContainer.background.fillOpacity = 0.05
  valueAxis.renderer.grid.template.stroke = interfaceColors.getFor('background')
  valueAxis.renderer.grid.template.strokeOpacity = 1

  chart.events.on('datavalidated', (ev) => {
    const chart = ev.target
    const categoryAxis = chart.yAxes.getIndex(0)
    const numberSeries = chart.data.length ? chart.data[0].numberSeries : 0

    // Calculate how we need to adjust chart height
    const adjustHeight = chart.data.length * cellSize * (stacked ? 1 : numberSeries) - (categoryAxis?.pixelHeight || 0)

    // get current chart height
    const targetHeight = chart.pixelHeight + adjustHeight

    // Set it on chart's container
    if (chart.svgContainer?.htmlElement?.style) {
      chart.svgContainer.htmlElement.style.height = targetHeight + 'px'
    }
  })

  const label = categoryAxis.renderer.labels.template
  label.truncate = true
  label.maxWidth = 120

  if (showLegend) {
    chart.legend = new am4charts.Legend()
    chart.legend.position = 'top'
    chart.legend.paddingBottom = 20
    chart.legend.labels.template.maxWidth = 95
  }

  return chart
}

export function prepareChartHorizontalDataColumnStack(data, columnListName = 'status') {
  const result = [] as any
  data.forEach((column) => {
    const columnData = {
      id: column.id,
      category: column.category,
      total: column.total,
      numberSeries: (column[columnListName] || []).length
    }
    ;(column[columnListName] || []).forEach((statusData) => {
      columnData[statusData.name + ''] = statusData.value
      columnData[statusData.name + 'percent'] = statusData.percent
    })

    result.push(columnData)
  })
  return result
}

export const createBarHorizontalChartSeries = (
  chart,
  column,
  categoryField,
  stacked = false,
  columnListName = 'status',
  showTooltip?
) => {
  (column[columnListName] || []).forEach((statusData, index) => {
    const series = chart.series.push(new am4charts.ColumnSeries())
    series.dataFields.categoryY = categoryField
    series.dataFields.valueX = statusData.name
    series.stacked = stacked
    series.name = statusData.name
    if (showTooltip) {
      series.tooltipText = '{name}: {valueX}'
    }

    const labelBullet = series.bullets.push(new am4charts.LabelBullet())
    labelBullet.locationX = 0.5
    labelBullet.label.text = '{valueX}'
    labelBullet.label.fill = am4core.color('#fff')
    labelBullet.label.fontSize = 10
  })
}

// Chart XY normal column

export function prepareChartColumnSeries(chart, columnName, categoryField, valueField) {
  const series = chart.series.push(new am4charts.ColumnSeries())
  series.name = columnName
  series.dataFields.categoryX = categoryField
  series.dataFields.valueY = valueField
  series.calculatePercent = true
  series.columns.template.strokeWidth = 0
  series.columns.template.column.fillOpacity = 0.8
  series.columns.template.tooltipText = '{valueY} ({valueY.percent} %)'
  series.columns.template.column.cornerRadiusTopLeft = 10
  series.columns.template.column.cornerRadiusTopRight = 10
}
