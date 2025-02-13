import * as am5 from "@amcharts/amcharts5"
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
import * as am5xy from "@amcharts/amcharts5/xy"

export const initAmchart5 = () => {
  const root = am5.Root.new("chartdiv")
  root.setThemes([am5themes_Animated.new(root)])

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
    })
  )
  const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}))
  cursor.lineY.set("visible", false)

  const xRenderer: am5xy.AxisRenderer = am5xy.AxisRendererX.new(root, {
    minGridDistance: 30,
  })
  const yRenderer: am5xy.AxisRenderer = am5xy.AxisRendererY.new(root, {})
  xRenderer.labels.template.setAll({
    rotation: -90,
    centerY: am5.p50,
    centerX: am5.p100,
    paddingRight: 15,
  })

  const xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "country",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {}),
    })
  )

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: yRenderer,
    })
  )

  const series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      sequencedInterpolation: true,
      categoryXField: "country",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}",
      }),
    })
  )

  series.columns.template.setAll({
    cornerRadiusTL: 5,
    cornerRadiusTR: 5,
  })
  series.columns.template.adapters.add("fill", function (fill, target) {
    return chart.get("colors")?.getIndex(series.columns.indexOf(target))
  })

  series.columns.template.adapters.add("stroke", function (stroke, target) {
    return chart.get("colors")?.getIndex(series.columns.indexOf(target))
  })

  // Set data
  const data = [
    {
      country: "USA",
      value: 2025,
    },
    {
      country: "China",
      value: 1882,
    },
    {
      country: "Japan",
      value: 1809,
    },
    {
      country: "Germany",
      value: 1322,
    },
    {
      country: "UK",
      value: 1122,
    },
    {
      country: "France",
      value: 1114,
    },
    {
      country: "India",
      value: 984,
    },
    {
      country: "Spain",
      value: 711,
    },
    {
      country: "Netherlands",
      value: 665,
    },
    {
      country: "Russia",
      value: 580,
    },
    {
      country: "South Korea",
      value: 443,
    },
    {
      country: "Canada",
      value: 441,
    },
  ]

  xAxis.data.setAll(data)
  series.data.setAll(data)

  series.appear(1000)
  chart.appear(1000, 100)
}
