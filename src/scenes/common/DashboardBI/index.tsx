import * as React from "react"
import "./index.less"

import AppComponentBase from "@components/AppComponentBase"
import Row from "antd/lib/grid/row"
import Col from "antd/lib/grid/col"
import { observer } from "mobx-react"

@observer
export class Dashboard extends AppComponentBase<any, any> {
  state = {
    linkDashboard:
      "https://app.powerbi.com/view?r=eyJrIjoiYTZkMjcwMjMtYmFkMy00ODQ5LTkxYzktNDFlMzgxYzNkMjc3IiwidCI6Ijg1OGJhZDU2LWIwZDctNGQ1ZS05NGQ3LWFhMGQ4MmVlZGJlMiIsImMiOjEwfQ%3D%3D",
  }

  render() {
    return (
      <Row>
        <Col sm={24} style={{ height: "calc(100vh - 80px)" }}>
          <iframe
            style={{ position: "relative", height: "100%", width: "100%" }}
            src={this.state.linkDashboard}
            frameBorder="0"
            allowFullScreen={true}
          ></iframe>
        </Col>
      </Row>
    )
  }
}

export default Dashboard
