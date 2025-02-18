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
import dayjs from "dayjs"
import FilterSelect from "@components/Filter/FilterSelect"
import FilterRangePicker from "@components/Filter/FilterRangePicker"
type Props = {
  handleSearch: (filters) => void
  filter: any
  inquiryId: any
  appDataStore: AppDataStore
  onRefresh: () => void
  numberUnitChoose: number
  onCreateActiviy: (type) => void
}

// type States = {
//   selectedType: any;
//   filters: any;
//   listProject: any[];
// };
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
      inquiryId: this.props.inquiryId,
    },
  }
  componentDidMount = async () => {
    await this.getProject("")
  }

  getProject = async (keyword) => {
    const res = await projectService.getAll({
      pageSize: 10,
      keyword,
      isActive: true,
    })
    const newProjects = res.items.map((i) => {
      return { id: i.id, name: i.projectCode }
    })
    this.setState({ listProject: newProjects })
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
          <Col sm={{ span: 6, offset: 0 }}>
            <FilterSelect
              placeholder={L("PROJECT")}
              onChange={(value) => this.handleSearch("projectId", value)}
              onSearch={_.debounce((e) => this.getProject(e), 1000)}
              options={this.state.listProject}
            />
          </Col>
          <Col sm={{ span: 5, offset: 0 }}>
            <FilterSelect
              placeholder={L("TYPE")}
              onChange={(value) => this.handleSearch("productTypeId", value)}
              options={propertyTypes}
            />
          </Col>

          <Col sm={{ span: 5, offset: 0 }}>
            <FilterSelect
              placeholder={L("UNIT_STATUS")}
              onChange={(value) => this.handleSearch("unitStatusId", value)}
              options={unitStatus}
            />
          </Col>
          <Col sm={{ span: 6, offset: 0 }}>
            <FilterRangePicker onChange={this.handleDateChange} />
          </Col>
        </Row>
      </>
    )
  }
}

export default withRouter(UnitsFilterPanel)
