import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import {
  Button,
  DatePicker,
  Dropdown,
  Menu,
  Radio,
  Select,
  Tooltip,
} from "antd"
import Col from "antd/lib/col"
import Search from "antd/lib/input/Search"
import Row from "antd/lib/row"
import projectService from "@services/projects/projectService"
import { renderOptions } from "@lib/helper"
import _, { debounce } from "lodash"
import {
  FilePdfOutlined,
  PlusCircleFilled,
  ReloadOutlined,
} from "@ant-design/icons"
import AppDataStore from "@stores/appDataStore"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import ProjectStore from "@stores/projects/projectStore"
import { AppComponentListBase } from "@components/AppComponentBase"
import AppConsts, {
  appPermissions,
  dateFormat,
  rangePickerPlaceholder,
} from "@lib/appconst"
import dayjs from "dayjs"
import { ExcelIcon } from "@components/Icon"
import ReactToPrint from "react-to-print"
import UnitStore from "@stores/projects/unitStore"
const { activeStatus, activityTypes, unitStatus } = AppConsts
const { RangePicker } = DatePicker
type Props = {
  handleSearch: (filters) => void
  tabKeys: any
  filter: any
  changeTab: any
  projectId: any
  onCreate: () => void
  onCreateProject: () => void
  onCreateActiviy: (type) => void
  appDataStore: AppDataStore
  projectStore: ProjectStore
  unitStore: UnitStore
  onRefresh: () => void
  numberUnitChoose: number
  exportExcel: any
  printRef: any
}

// type States = {
//   selectedType: any;
//   filters: any;
//   listProject: any[];
// };
@inject(Stores.AppDataStore, Stores.ProjectStore, Stores.UnitStore)
@observer
class UnitsFilterPanel extends AppComponentListBase<Props, any> {
  constructor(props: Props) {
    super(props)
  }
  state = {
    selectedType: this.props.tabKeys.listView,
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

    // const { filters } = this.state
    // await this.setState({ filters: { ...filters, fromDate: startDate } })
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
                  // if (!e) {
                  //   this.setState({ filters: { projectId: null } });
                  //   return;
                  // }
                  this.setState({ filters: { projectId: e } })
                  this.handleSearch("projectId", e)

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
              <Col sm={{ span: 3, offset: 0 }}>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder={L("FLOOR")}
                  filterOption={false}
                  className="w-100"
                  allowClear
                  showSearch
                  onChange={(value) => this.handleSearch("floorId", value)}
                  disabled={!this.state.filters?.projectId}
                >
                  {renderOptions(floors)}
                </Select>
              </Col>
            </>
          )}
          <Col sm={{ span: 3, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("PRODUCT_TYPE")}
              style={{ width: "100%" }}
              allowClear
              onChange={(value) => this.handleSearch("productTypeId", value)}
              // showSearch
            >
              {renderOptions(propertyTypes)}
            </Select>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("UNIT_TYPE")}
              style={{ width: "100%" }}
              allowClear
              showArrow
              mode="multiple"
              onChange={(value) => this.handleSearch("unitTypeIds", value)}
              // showSearch
            >
              {renderOptions(this.props.appDataStore.unitTypes)}
            </Select>
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

          <Col
            sm={{ span: selectedType === tabKeys.listView ? 3 : 10, offset: 0 }}
          ></Col>
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
              // onChange={(value) => this.handleSearch('dateFromTo', value)}
              placeholder={rangePickerPlaceholder()}
              disabled={!this.state.filters?.unitStatusId}
            />
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("UNIT_VIEW")}
              filterOption={false}
              className="w-100"
              allowClear
              showSearch
              onChange={(value) => this.handleSearch("ViewIds", value)}
            >
              {renderOptions(view)}
            </Select>
          </Col>
          <Radio.Group
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
          </Radio.Group>
          <div style={{ position: "absolute", display: "flex", right: 10 }}>
            {this.isGranted(appPermissions.inquiry.create) &&
              this.state.selectedType === this.props.tabKeys.gridView && (
                <>
                  <ReactToPrint
                    onBeforeGetContent={() => {
                      this.setState({ isConvertting: true })

                      return Promise.resolve()
                    }}
                    onAfterPrint={() => this.setState({ isConvertting: false })}
                    trigger={() => (
                      <Tooltip title={L("REVIEW_PDF")} placement="topLeft">
                        <Button
                          icon={<FilePdfOutlined />}
                          className="button-primary"
                        ></Button>
                      </Tooltip>
                    )}
                    documentTitle={L("STACKING_PLAN")}
                    pageStyle="@page { size:  19.8in 14in  }"
                    removeAfterPrint
                    content={() => this.props.printRef.current}
                  />
                </>
              )}

            {this.isGranted(appPermissions.inquiry.create) &&
              this.state.selectedType === this.props.tabKeys.listView && (
                <Dropdown
                  trigger={["click"]}
                  disabled={this.props.numberUnitChoose < 1}
                  overlay={
                    <Menu className="ant-dropdown-cusstom">
                      <Menu.Item
                        key={1}
                        disabled={this.props.numberUnitChoose > 3}
                        onClick={() =>
                          this.props.onCreateActiviy(activityTypes.proposal)
                        }
                      >
                        {L("CREATE_PROPOSAL")}
                      </Menu.Item>
                      <Menu.Item
                        key={2}
                        onClick={() =>
                          this.props.onCreateActiviy(activityTypes.siteVisit)
                        }
                      >
                        {L("CREATE_SITE_VISIT")}
                      </Menu.Item>
                      <Menu.Item
                        key={3}
                        disabled={this.state.disableReservation}
                        onClick={() =>
                          this.props.onCreateActiviy(activityTypes.reservation)
                        }
                      >
                        {L("CREATE_RESERVATION_FROM")}
                      </Menu.Item>
                    </Menu>
                  }
                  placement="bottomLeft"
                >
                  <Button className="button-primary">
                    {L("UNIT_CREATE_ACTIVITY")}
                  </Button>
                </Dropdown>
              )}
            {this.isGranted(appPermissions.unit.export) &&
              this.state.selectedType === this.props.tabKeys.listView && (
                <Tooltip title={L("EXPORT_EXCEL")} placement="topLeft">
                  <Button
                    icon={<ExcelIcon />}
                    className="button-primary"
                    onClick={() => this.props.exportExcel()}
                  ></Button>
                </Tooltip>
              )}
            {this.isGranted(appPermissions.unit.create) && (
              <Tooltip title={L("CREATE_UNIT")} placement="topLeft">
                <Button
                  icon={<PlusCircleFilled />}
                  className="button-primary"
                  onClick={() => this.props.onCreate()}
                >
                  {/* {L("UNIT")} */}
                </Button>
              </Tooltip>
            )}
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
