import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Button, Col, DatePicker, Row } from "antd"
import { L } from "@lib/abpUtility"
import withRouter from "@components/Layout/Router/withRouter"
import { budgetAppType, yearFormat } from "@lib/appconst"
import Stores from "@stores/storeIdentifier"
import { debounce } from "lodash"
import moment from "moment"
import BudgetAppStore from "@stores/budgetAppStore"
import projectService from "@services/projects/projectService"
import { RowBudgetAppModel } from "@models/budgetApp/budgetAppModel"
import TableBudgetApp from "./components/tableBudgetApp"
//

export interface IProps {
  budgetAppStore: BudgetAppStore
}
export interface IState {
  filters: any
  dataTableUnit: any[]
  dataTableRevenue: any[]
  listProject: any[]
}

@inject(Stores.BudgetAppStore)
@observer
class BudgetApp extends AppComponentListBase<IProps, IState> {
  formRef: any = React.createRef()

  constructor(props: IProps) {
    super(props)
    this.state = {
      filters: { year: moment().year() },
      dataTableUnit: [] as any,
      dataTableRevenue: [] as any,
      listProject: [] as any,
    }
  }

  async componentDidMount() {
    await this.getListProject()
    await this.getAllByUnit()
    await this.getAllByRevenue()
  }
  getListProject = async () => {
    const list = await projectService.getSimpleProject()
    this.setState({ listProject: list })
  }

  getAllByUnit = async () => {
    await this.props.budgetAppStore.getAllByUnit({
      ...this.state.filters,
    })
    const listInitData = this.state.listProject.map((initProj) => {
      let dataRow = this.props.budgetAppStore.pageResultUnit?.find(
        (defProj) => defProj.projectId === initProj.id
      )
      if (dataRow) {
        return dataRow
      } else {
        return new RowBudgetAppModel(
          budgetAppType.unit,
          this.state.filters.year,
          initProj.id,
          initProj
        )
      }
    })
    this.setState({
      dataTableUnit: listInitData,
    })
  }

  getAllByRevenue = async () => {
    await this.props.budgetAppStore.getAllByRevenue({
      ...this.state.filters,
    })
    const listInitData = this.state.listProject.map((initProj) => {
      let dataRow = this.props.budgetAppStore.pageResultRevenue?.find(
        (defProj) => defProj.projectId === initProj.id
      )
      if (dataRow) {
        return dataRow
      } else {
        return new RowBudgetAppModel(
          budgetAppType.revenue,
          this.state.filters.year,
          initProj.id,
          initProj
        )
      }
    })
    this.setState({
      dataTableRevenue: listInitData,
    })
  }
  updateSearch = debounce((name, value) => {
    const { filters } = this.state
    this.setState({ filters: { ...filters, [name]: value } })
  }, 100)

  handleSearch = async (name, value) => {
    {
      // this.setState({ [name]: value });
      await this.setState({
        filters: { ...this.state.filters, [name]: value },
      })
      await this.getAllByUnit()
      await this.getAllByRevenue()
    }
  }

  dataUnitChange = async (data) => {
    this.setState({ dataTableUnit: data })
  }
  dataRevenueChange = async (data) => {
    this.setState({ dataTableRevenue: data })
  }
  handleTableSave = async () => {
    const { dataTableUnit, dataTableRevenue } = this.state
    await this.props.budgetAppStore.createOrUpdate([
      ...dataTableUnit,
      ...dataTableRevenue,
    ])
    await this.getAllByRevenue()
  }
  public render() {
    const { dataTableUnit, dataTableRevenue } = this.state
    const { isLoading } = this.props.budgetAppStore

    return (
      <>
        <Row gutter={[8, 8]}>
          <Col sm={{ span: 3, offset: 0 }}>
            <DatePicker
              className="full-width"
              format={yearFormat}
              allowClear={false}
              picker="year"
              defaultValue={moment()}
              placeholder={L("YEAR")}
              onChange={(value) =>
                this.handleSearch("year", moment(value).year())
              }
            />
          </Col>
          <Col
            sm={{ span: 21, offset: 0 }}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              className="button-primary"
              onClick={() => this.handleTableSave()}
            >
              {L("SAVE")}
            </Button>
          </Col>
        </Row>
        <br />
        <h3 className="card-text-strong-blue">{L("UNIT")}</h3>
        <TableBudgetApp
          tableData={dataTableUnit}
          onDatatableChange={this.dataUnitChange}
          isLoading={isLoading}
          budgetType={budgetAppType.unit}
        />
        <br />
        <h3 className="card-text-strong-blue">{L("REVENUE")}</h3>
        <TableBudgetApp
          tableData={dataTableRevenue}
          onDatatableChange={this.dataRevenueChange}
          isLoading={isLoading}
          budgetType={budgetAppType.revenue}
        />
      </>
    )
  }
}

export default withRouter(BudgetApp)
