import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Spin, Card } from "antd"

import withRouter from "@components/Layout/Router/withRouter"
import DashboardStore from "@stores/dashboardStore"
import Stores from "@stores/storeIdentifier"
import TableUnitOccByDate from "./components/tableUnitOccByDate"
// import TableUnitOccByWeek from "./components/tableUnitOccByWeek"
import TableUnitOccByMonth from "./components/tableUnitOccByMonth"
import TableUnitTypeOccByDate from "./components/tableUnitTypeOccByDate"
// import TableUnitTypeOccByWeek from "./components/tableUnitTypeOccByWeek"
import TableUnitTypeOccByMonth from "./components/tableUnitTypeOccByMonth"
import { L } from "@lib/abpUtility"
import TableUnitOccSQMByDate from "./components/tableUnitOccSQMByDate"
// import TableUnitOccSQMByWeek from "./components/tableUnitOccSQMByWeek"
import TableUnitOccSQMByMonth from "./components/tableUnitOccSQMByMonth"
// import TableOccSummaryByUnitType from "./components/tableOccSummaryByUnitType"
// import TableOccSummaryBySQM from "./components/tableOccSummaryBySQM"
import TableConsolidateOccupancy from "./components/tableConsolidateOccupancy"
import AppConsts from "@lib/appconst"
import projectService from "@services/projects/projectService"
import TableOccDetail from "./components/tableOccDetail"
import UnitStore from "@stores/projects/unitStore"
const { itemDashboard } = AppConsts
export interface IProps {
  selectItem: any
  dashboardStore: DashboardStore
  unitStore: UnitStore
}
@inject(Stores.DashboardStore, Stores.UnitStore)
@observer
class UnitOccReport extends AppComponentListBase<IProps> {
  printRef: any = React.createRef()
  state = {
    isConvertting: false,
    listProject: {} as any,
    modalVisible: false,
    unitOccDetail: [] as any,
  }

  componentDidMount() {
    this.getProject("")
  }
  componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === itemDashboard.unitOcc) {
        this.getProject("")
      }
    }
  }
  getProject = async (keyword) => {
    const res = await projectService.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword,
      isActive: true,
    })
    const newProjects = res.items.map((i) => {
      return { id: i.id, name: i.projectName }
    })
    this.setState({ listProject: newProjects })
  }

  handleOpenModal = async (params: any) => {
    await this.props.unitStore.getUnitOccDetail(params)
    this.setState({ modalVisible: true })
  }

  handleCloseModal = () => {
    this.setState({ modalVisible: false })
  }

  public render() {
    return (
      <>
        <Spin spinning={this.props.dashboardStore.isLoading}>
          <Card
            style={{
              borderRadius: 12,
              padding: 20,
            }}
          >
            <span className="card-overview-title">
              {L("OCCUPANCY_BY_UNIT_STATUS")}
            </span>
            <br />
            <div ref={this.printRef} className="dashboard-style">
              <Row gutter={[8, 8]}>
                <Col sm={{ span: 24, offset: 0 }}>
                  <TableUnitOccByDate
                    selectItem={this.props.selectItem}
                    projects={this.state.listProject}
                    handleOpenModal={this.handleOpenModal}
                  />
                </Col>
                {/* <Col sm={{ span: 24, offset: 0 }}>
                  <TableUnitOccByWeek
                    selectItem={this.props.selectItem}
                    projects={this.state.listProject}
                    handleOpenModal={this.handleOpenModal}
                  />
                </Col> */}
                <Col sm={{ span: 24, offset: 0 }}>
                  <TableUnitOccByMonth
                    selectItem={this.props.selectItem}
                    projects={this.state.listProject}
                    handleOpenModal={this.handleOpenModal}
                  />
                </Col>
              </Row>
            </div>
          </Card>
          <br />

          <Card
            style={{
              borderRadius: 12,
              padding: 20,
            }}
          >
            <span className="card-overview-title">{L("OCCUPANCY_BY_SQM")}</span>
            <br />
            <div ref={this.printRef} className="dashboard-style">
              <Row gutter={[8, 8]}>
                <Col sm={{ span: 24, offset: 0 }}>
                  <TableUnitOccSQMByDate
                    selectItem={this.props.selectItem}
                    projects={this.state.listProject}
                  />
                </Col>
                {/* <Col sm={{ span: 24, offset: 0 }}>
                  <TableUnitOccSQMByWeek
                    selectItem={this.props.selectItem}
                    projects={this.state.listProject}
                  />
                </Col> */}
                <Col sm={{ span: 24, offset: 0 }}>
                  <TableUnitOccSQMByMonth
                    selectItem={this.props.selectItem}
                    projects={this.state.listProject}
                  />
                </Col>
              </Row>
            </div>
          </Card>
          <br />

          <Card
            style={{
              borderRadius: 12,
              padding: 20,
            }}
          >
            <span className="card-overview-title">
              {L("OCCUPANCY_BY_UNIT_TYPE")}
            </span>
            <br />
            <div ref={this.printRef} className="dashboard-style">
              <Row gutter={[8, 8]}>
                <Col sm={{ span: 24, offset: 0 }}>
                  <TableUnitTypeOccByDate
                    selectItem={this.props.selectItem}
                    projects={this.state.listProject}
                  />
                </Col>{" "}
                {/* <Col sm={{ span: 24, offset: 0 }}>
                  <TableUnitTypeOccByWeek
                    selectItem={this.props.selectItem}
                    projects={this.state.listProject}
                  />
                </Col>{" "} */}
                <Col sm={{ span: 24, offset: 0 }}>
                  <TableUnitTypeOccByMonth
                    selectItem={this.props.selectItem}
                    projects={this.state.listProject}
                  />
                </Col>
              </Row>
            </div>
          </Card>
          <br />

          {/* <Card
            style={{
              borderRadius: 12,
              padding: 20,
            }}
          >
            <span className="card-overview-title">
              {L("OCCUPANCY_SUMMARY_BY_UNIT_TYPE")}
            </span>
            <br />
            <div ref={this.printRef} className="dashboard-style">
              <Row gutter={[8, 8]}>
                <Col sm={{ span: 24, offset: 0 }}>
                  <TableOccSummaryByUnitType
                    selectItem={this.props.selectItem}
                    projects={this.state.listProject}
                  />
                </Col>{" "}
              </Row>
            </div>
          </Card>
          <br />

          <Card
            style={{
              borderRadius: 12,
              padding: 20,
            }}
          >
            <span className="card-overview-title">
              {L("OCCUPANCY_SUMMARY_BY_SQM")}
            </span>
            <br />
            <div ref={this.printRef} className="dashboard-style">
              <Row gutter={[8, 8]}>
                <Col sm={{ span: 24, offset: 0 }}>
                  <TableOccSummaryBySQM
                    selectItem={this.props.selectItem}
                    projects={this.state.listProject}
                  />
                </Col>{" "}
              </Row>
            </div>
          </Card>
          <br /> */}

          <Card
            style={{
              borderRadius: 12,
              padding: 20,
            }}
          >
            <span className="card-overview-title">
              {L("CONSOLIDATE_OCCUPANCY")}
            </span>
            <br />
            <div ref={this.printRef} className="dashboard-style">
              <Row gutter={[8, 8]}>
                <Col sm={{ span: 24, offset: 0 }}>
                  <TableConsolidateOccupancy
                    selectItem={this.props.selectItem}
                    projects={this.state.listProject}
                  />
                </Col>
              </Row>
            </div>
          </Card>

          <TableOccDetail
            dataTable={this.props.unitStore.tableData?.items}
            visible={this.state.modalVisible}
            onClose={() => this.setState({ modalVisible: false })}
          />
        </Spin>
      </>
    )
  }
}

export default withRouter(UnitOccReport)
