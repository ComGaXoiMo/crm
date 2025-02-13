import * as React from "react"
import { Row, Col } from "antd"
import "./index.less"
import AppComponentBase from "@components/AppComponentBase"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import AppDataStore from "@stores/appDataStore"

export interface IDashboardProps {
  history: any;
  appDataStore: AppDataStore;
}

@inject(Stores.AppDataStore)
@observer
export class Dashboard extends AppComponentBase<IDashboardProps, any> {
  componentDidMount = async () => {
    setTimeout(() => this.setState({ cardLoading: false }), 1000)
    setTimeout(() => this.setState({ lineChartLoading: false }), 1500)
    setTimeout(() => this.setState({ barChartLoading: false }), 2000)
    setTimeout(() => this.setState({ pieChartLoading: false }), 1000)
    // await this.props.appDataStore?.getLinkDashboard();
  };

  state = {
    cardLoading: true,
    lineChartLoading: true,
    barChartLoading: true,
    pieChartLoading: true,
  };

  render() {
    return (
      <Row style={{ height: "100%" }}>
        <Col sm={24} style={{ height: "100%" }}>
          <iframe
            title="dashboard"
            style={{ position: "relative", height: "100%", width: "100%" }}
            src={this.props.appDataStore?.linkDashboard ?? ""}
            frameBorder="0"
            allowFullScreen={true}
          ></iframe>
        </Col>
      </Row>
    )
  }
}

export default Dashboard
