import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { Button, DatePicker, Select, Tooltip } from "antd"
import Col from "antd/lib/col"
import Search from "antd/lib/input/Search"
import Row from "antd/lib/row"
import projectService from "@services/projects/projectService"
import { renderOptions } from "@lib/helper"
import _, { debounce } from "lodash"
import { ReloadOutlined } from "@ant-design/icons"
import AppDataStore from "@stores/appDataStore"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import AppConsts, { dateFormat, rangePickerPlaceholder } from "@lib/appconst"
import dayjs from "dayjs"
const { RangePicker } = DatePicker
const { activeStatus } = AppConsts
type Props = {
  handleSearch: (filters) => void
  tabKeys: any
  filter: any
  changeTab: any
  projectId
  onCreateProject: () => void
  appDataStore: AppDataStore
  onRefresh: () => void
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
    selectedType: this.props.tabKeys.listView,
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
      tabKeys,
    } = this.props
    const { selectedType } = this.state
    return (
      <>
        <Row gutter={[4, 8]}>
          <Col sm={{ span: 4, offset: 0 }}>
            <Search
              onChange={(value) =>
                this.updateSearch("keyword", value.target?.value)
              }
              onSearch={(value) => this.handleSearch("keyword", value)}
              size="middle"
              placeholder={L("UNIT_NAME")}
            />
          </Col>
          {!this.props.projectId && (
            <Col sm={{ span: 4, offset: 0 }}>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                placeholder={L("PROJECT")}
                filterOption={false}
                className="w-100"
                onChange={(e) => {
                  if (!e) {
                    this.setState({ filters: { projectId: null } })
                    return
                  }
                  this.setState({ filters: { projectId: e } })
                  this.getFloorResult(e, "")
                }}
                onSearch={_.debounce((e) => this.getProject(e), 1000)}
                allowClear
                showSearch
              >
                {renderOptions(this.state.listProject)}
              </Select>
            </Col>
          )}
          {selectedType === tabKeys.listView && (
            <>
              <Col sm={{ span: 2, offset: 0 }}>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder={L("FLOOR")}
                  filterOption={false}
                  className="w-100"
                  allowClear
                  onChange={(value) => this.handleSearch("floorId", value)}
                  showSearch
                  disabled={!this.state.filters?.projectId}
                >
                  {renderOptions(this.state.listFloor)}
                </Select>
              </Col>
            </>
          )}
          <Col sm={{ span: 4, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("TYPE")}
              style={{ width: "100%" }}
              allowClear
              onChange={(value) => this.handleSearch("productTypeId", value)}
              // showSearch
            >
              {renderOptions(propertyTypes)}
            </Select>
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("UNIT_STATUS")}
              style={{ width: "100%" }}
              onChange={(value) => this.handleSearch("unitStatusId", value)}
              allowClear
              // showSearch
            >
              {renderOptions(unitStatus)}
            </Select>
          </Col>

          <Col sm={{ span: 4, offset: 0 }}>
            <RangePicker
              className="w-100"
              format={dateFormat}
              onChange={this.handleDateChange}
              disabled={!this.state.filters?.unitStatusId}
              // onChange={(value) => this.handleSearch('dateFromTo', value)}
              placeholder={rangePickerPlaceholder()}
            />
          </Col>
          {selectedType === tabKeys.listView && (
            <Col sm={{ span: 2, offset: 0 }}>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                placeholder={L("STATUS")}
                defaultValue="true"
                style={{ width: "100%" }}
                allowClear
                onChange={(value) => this.handleSearch("isActive", value)}
              >
                {renderOptions(activeStatus)}
              </Select>
            </Col>
          )}
          {/* <Radio.Group
            onChange={async (value) => {
              await this.setState({ selectedType: value.target.value })
              await this.props.changeTab(value)
            }}
            value={this.state.selectedType}
            buttonStyle="solid"
          >
            <Radio.Button
              key={this.props.tabKeys.gridView}
              value={this.props.tabKeys.gridView}
            >
              {this.props.tabKeys.gridView}
            </Radio.Button>
            <Radio.Button
              key={this.props.tabKeys.listView}
              value={this.props.tabKeys.listView}
            >
              {this.props.tabKeys.listView}
            </Radio.Button>
          </Radio.Group> */}
          <div style={{ position: "absolute", right: 10 }}>
            {/* <Button
              icon={<PlusCircleFilled />}
              className="button-secondary"
              onClick={() => this.props.onCreateProject()}
            >
              {L("PROJECT")}
            </Button> */}

            <Tooltip title={L("RELOAD")} placement="topLeft">
              <Button
                icon={<ReloadOutlined />}
                className="button-primary"
                onClick={() => this.props.onRefresh()}
              ></Button>
            </Tooltip>
          </div>
        </Row>
      </>
    )
  }
}

export default withRouter(UnitsFilterPanel)
