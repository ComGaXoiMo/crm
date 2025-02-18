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
import AppConsts from "@lib/appconst"
import dayjs from "dayjs"
import FilterSelect from "@components/Filter/FilterSelect"
import FilterRangePicker from "@components/Filter/FilterRangePicker"
const { activeStatus } = AppConsts
type Props = {
  handleSearch: (filters) => void
  filter: any
  projectId
  appDataStore: AppDataStore
}

@inject(Stores.AppDataStore)
@observer
class UnitsFilterPanel extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
  }
  state = {
    listProject: [],
    listFloor: [],
    filters: {
      projectId: this.props.projectId,
    } as any,
  }
  componentDidMount = async () => {
    await this.getProject("")
    if (this.props.projectId) {
      await this.getFloorResult(this.props.projectId, "")
    }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.projectId !== this.props.projectId) {
      await this.getFloorResult(this.props.projectId, "")
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
    const res = await projectService.getFloors(id, {
      isActive: true,
    })
    await this.setState({ listFloor: res })
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
    // await this.handleSearch("fromDate", startDate);
    const { filters } = this.state
    await this.setState({ filters: { ...filters, fromDate: startDate } })
    const endDate =
      value && value.length ? dayjs(value[1]).endOf("day").toJSON() : null

    await this.handleSearch("toDate", endDate)
  }
  render() {
    const {
      appDataStore: { propertyTypes, unitStatus },
    } = this.props
    return (
      <>
        <Row gutter={[4, 8]}>
          {!this.props.projectId && (
            <Col sm={{ span: 4, offset: 0 }}>
              <FilterSelect
                placeholder={L("PROJECT")}
                onChange={(e) => {
                  if (!e) {
                    this.setState({ filters: { projectId: null } })
                    return
                  }
                  this.setState({ filters: { projectId: e } })
                  this.getFloorResult(e, "")
                }}
                onSearch={_.debounce((e) => this.getProject(e), 1000)}
                options={this.state.listProject}
              />
            </Col>
          )}
          <>
            <Col sm={{ span: 2, offset: 0 }}>
              <FilterSelect
                placeholder={L("FLOOR")}
                onChange={(value) => this.handleSearch("floorId", value)}
                options={this.state.listFloor}
                disabled={!this.state.filters?.projectId}
              />
            </Col>
          </>
          <Col sm={{ span: 4, offset: 0 }}>
            <FilterSelect
              placeholder={L("TYPE")}
              onChange={(value) => this.handleSearch("productTypeId", value)}
              options={propertyTypes}
            />
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
            <FilterSelect
              placeholder={L("UNIT_STATUS")}
              onChange={(value) => this.handleSearch("unitStatusId", value)}
              options={unitStatus}
            />
          </Col>

          <Col sm={{ span: 4, offset: 0 }}>
            <FilterRangePicker
              onChange={this.handleDateChange}
              disabled={!this.state.filters?.unitStatusId}
            />
          </Col>
          <Col sm={{ span: 2, offset: 0 }}>
            <FilterSelect
              placeholder={L("STATUS")}
              defaultValue="true"
              onChange={(value) => this.handleSearch("isActive", value)}
              options={activeStatus}
            />
          </Col>
        </Row>
      </>
    )
  }
}

export default withRouter(UnitsFilterPanel)
