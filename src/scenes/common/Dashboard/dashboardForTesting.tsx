import React from "react"
import * as am5 from "@amcharts/amcharts5"
// import { initAmchart5 } from "./amchart5Helper";

type Props = { id?: any }

const DashboardForTesting = (props: Props) => {
  React.useEffect(() => {
    const root = am5.Root.new("chartdiv")
    // initAmchart5();
    return () => {
      root.dispose()
    }
  }, [])

  return <div id="chartdiv" className="w-100" style={{ height: 500 }}></div>
}

export default DashboardForTesting
