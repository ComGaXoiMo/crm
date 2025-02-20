import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import Col from "antd/lib/col"
import Row from "antd/lib/row"
import projectService from "@services/projects/projectService"
import _, { debounce } from "lodash"
import AppDataStore from "@stores/appDataStore"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import ProjectStore from "@stores/projects/projectStore"
import { AppComponentListBase } from "@components/AppComponentBase"
import AppConsts from "@lib/appconst"
import dayjs from "dayjs"
import UnitStore from "@stores/projects/unitStore"
import FilterSelect from "@components/Filter/FilterSelect"
import FilterRangePicker from "@components/Filter/FilterRangePicker"
const { activeStatus, unitStatus } = AppConsts
type Props = {
  handleSearch: (filters) => void
  tabKeys: any
  filter: any
  changeTab: any
  projectId: any
  appDataStore: AppDataStore
  projectStore: ProjectStore
  unitStore: UnitStore
  onRefresh: () => void
  numberUnitChoose: number
  exportExcel: any
  printRef: any
  tabSelected: any
}

@inject(Stores.AppDataStore, Stores.ProjectStore, Stores.UnitStore)
@observer
class UnitsFilterPanel extends AppComponentListBase<Props, any> {
  constructor(props: Props) {
    super(props)
  }
  state = {
    selectedType: this.props.tabSelected,
    listProject: [],
    disableReservation: true,
    filters: {
      isActive: true,
    } as any,
  }
  componentDidMount = async () => {
    await this.getProject("")
  }
  componentDidUpdate(prevProps): void {
    if (prevProps.filter !== this.props.filter) {
      if (
        this.props.filter?.projectId &&
        this.props.filter?.fromDate &&
        this.props.filter?.toDate &&
        (this.props.filter?.unitStatusId === unitStatus.vacant ||
          this.props.filter?.unitStatusId === unitStatus.showRoom)
      ) {
        this.setState({ disableReservation: false })
      } else {
        this.setState({ disableReservation: true })
      }
    }
  }
  getProject = async (keyword) => {
    const res = await projectService.getAll({
      pageSize: 10,
      keyword,
      isActive: true,
    })
    const newProjects = res.items.map((i) => {
      return { id: i.id, name: i.projectName }
    })
    this.setState({ listProject: newProjects })
  }
  getFloorResult = async (id, keyword) => {
    await this.props.projectStore.getFloors(id, {
      isActive: true,
      keyword,
    })
  }
  handleSearch = async (name, value) => {
    {
      await this.setState({
        filters: { ...this.state.filters, [name]: value },
      })
      await this.props.handleSearch(this.state.filters)
    }
  }
  updateSearch = debounce((name, value) => {
    const { filters } = this.state
    this.setState({ filters: { ...filters, [name]: value } })
    if (value?.length === 0) {
      this.handleSearch("keyword", value)
    }
  }, 100)
  handleDateChange = async (value) => {
    const startDate =
      value && value.length ? dayjs(value[0]).startOf("day").toJSON() : null

    const endDate =
      value && value.length ? dayjs(value[1]).endOf("day").toJSON() : null
    if (this.props.filter?.fromDate !== startDate) {
      await this.handleSearch("fromDate", startDate)
    }
    if (this.props.filter?.toDate !== endDate) {
      await this.handleSearch("toDate", endDate)
    }
  }
  render() {
    const {
      appDataStore: { propertyTypes, unitStatus },
      projectStore: { floors },
      unitStore: { view },
      tabKeys,
    } = this.props
    const { selectedType } = this.state
    return (
      <>
        <Row gutter={[4, 8]}>
          {!this.props.projectId && (
            <Col sm={{ span: 3, offset: 0 }}>
              <FilterSelect
                placeholder={L("PROJECT")}
                onChange={(e) => {
                  this.setState({ filters: { projectId: e } })
                  this.handleSearch("projectId", e)

                  this.getFloorResult(e, "")
                }}
                onSearch={_.debounce((e) => this.getProject(e), 1000)}
                options={this.state.listProject}
              />
            </Col>
          )}
          {selectedType === tabKeys.listView && (
            <>
              <Col sm={{ span: 3, offset: 0 }}>
                <FilterSelect
                  placeholder={L("FLOOR")}
                  onChange={(value) => this.handleSearch("floorId", value)}
                  disabled={!this.state.filters?.projectId}
                  options={floors}
                />
              </Col>
            </>
          )}
          <Col sm={{ span: 3, offset: 0 }}>
            <FilterSelect
              placeholder={L("PRODUCT_TYPE")}
              onChange={(value) => this.handleSearch("productTypeId", value)}
              options={propertyTypes}
            />
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <FilterSelect
              placeholder={L("UNIT_TYPE")}
              onChange={(value) => this.handleSearch("unitTypeIds", value)}
              options={this.props.appDataStore.unitTypes}
              selectProps={{ mode: "multiple" }}
            />
          </Col>
          {selectedType === tabKeys.listView && (
            <Col sm={{ span: 3, offset: 0 }}>
              <FilterSelect
                placeholder={L("STATUS")}
                defaultValue="true"
                onChange={(value) => this.handleSearch("isActive", value)}
                options={activeStatus}
              />
            </Col>
          )}

          <Col sm={{ span: 3, offset: 0 }}>
            <FilterSelect
              placeholder={L("UNIT_STATUS")}
              onChange={(value) => this.handleSearch("unitStatusId", value)}
              options={unitStatus}
            />
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <FilterRangePicker
              onChange={this.handleDateChange}
              disabled={!this.state.filters?.unitStatusId}
            />
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <FilterSelect
              placeholder={L("UNIT_VIEW")}
              onChange={(value) => this.handleSearch("ViewIds", value)}
              options={view}
            />
          </Col>
        </Row>
      </>
    )
  }
}

export default withRouter(UnitsFilterPanel)
