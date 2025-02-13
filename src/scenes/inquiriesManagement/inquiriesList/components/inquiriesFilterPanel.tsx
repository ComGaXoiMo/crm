import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { Button, DatePicker, Form, Radio, Select, Tooltip } from "antd"
import Col from "antd/lib/col"
import Search from "antd/lib/input/Search"
import Row from "antd/lib/row"
import { AppComponentListBase } from "@components/AppComponentBase"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import { filterOptions, renderOptions } from "@lib/helper"
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons"
import UserStore from "@stores/administrator/userStore"
import projectService from "@services/projects/projectService"
import { debounce } from "lodash"
import AppConsts, {
  appPermissions,
  dateFormat,
  rangePickerPlaceholder,
} from "@lib/appconst"
import { validateMessages } from "@lib/validation"
import moment from "moment"
import companyService from "@services/clientManagement/companyService"
const { activeStatus } = AppConsts
const { RangePicker } = DatePicker
type Props = {
  handleSearch: (filters) => void;
  filter: any;
  changeTab: any;
  onCreate: () => void;
  appDataStore: any;
  userStore: UserStore;
  onRefresh: () => void;
};

const tabKeys = {
  boardView: L("BOARD_VIEW"),
  listView: L("LIST_VIEW"),
}
@inject(Stores.AppDataStore, Stores.UserStore)
@observer
class InquiryFilterPanel extends AppComponentListBase<Props> {
  formRef = React.createRef<any>();
  constructor(props: Props) {
    super(props)
  }
  state = {
    selectedType: tabKeys.listView,
    listUser: [],
    filters: {
      isActive: true,
    } as any,
    listProject: [],
    listCompany: [],
    subStage: [],
  };
  async componentDidMount() {
    await Promise.all([
      this.getStaff(""),
      this.getProject(""),
      this.getCompany(""),
    ])
  }
  handleSearch = async (name, value) => {
    {
      // this.setState({ [name]: value });
      await this.setState({
        filters: { ...this.state.filters, [name]: value },
      })
      await this.props.handleSearch(this.state.filters)
    }
  };
  changeStage = async (id?) => {
    this.findSubStage(id)
    await this.setState({
      filters: { ...this.state.filters, statusDetailId: undefined },
    })
    this.formRef.current.resetFields()
  };
  findSubStage = async (id?) => {
    const subStage = this.props.appDataStore.inquirySubStage.filter(
      (item) => item.parentId === id
    )
    this.setState({ subStage })
  };
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
  };
  getCompany = async (keyword) => {
    const res = await companyService.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword,
      isActive: true,
    })
    const newList = res.items.map((i) => {
      return { id: i.id, name: i.businessName }
    })
    this.setState({ listCompany: newList })
  };
  getStaff = async (keyword) => {
    await this.props.userStore.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword: keyword,
    })
    const lsitUser = [...this.props.userStore.users.items]

    lsitUser.map((i) => {
      return { id: i.id, name: i.name }
    })
    this.setState({ listUser: lsitUser })
  };

  handleDateChange = async (value) => {
    console.log(value)
    const startDate =
      value && value.length ? moment(value[0]).startOf("day").toJSON() : null
    // await this.handleSearch("fromDate", startDate);
    const { filters } = this.state
    await this.setState({ filters: { ...filters, fromDate: startDate } })
    const endDate =
      value && value.length ? moment(value[1]).endOf("day").toJSON() : null

    await this.handleSearch("toDate", endDate)
  };

  changeTab = async (event) => {
    await this.setState({ selectedType: event.target.value })
    this.handleSearch("statusDetailId", undefined)
    await this.props.changeTab(event)
  };
  updateSearch = debounce((name, value) => {
    const { filters } = this.state
    this.setState({ filters: { ...filters, [name]: value } })
    if (value?.length === 0) {
      this.handleSearch("keyword", value)
    }
  }, 100);
  render() {
    return (
      <>
        <Row gutter={[4, 8]}>
          <Col sm={{ span: 22, offset: 0 }}>
            <Row gutter={[4, 8]}>
              <Col sm={{ span: 4, offset: 0 }}>
                <Search
                  onChange={(value) =>
                    this.updateSearch("keyword", value.target?.value)
                  }
                  onSearch={(value) => this.handleSearch("keyword", value)}
                  size="middle"
                  placeholder={L("FILTER_KEYWORD_INQUIRY")}
                />
              </Col>
              {this.state.selectedType === tabKeys.listView && (
                <>
                  <Col sm={{ span: 4, offset: 0 }}>
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      placeholder={L("INQUIRY_STATUS")}
                      style={{ width: "100%" }}
                      allowClear
                      // showSearch
                      onChange={async (value) => {
                        await this.changeStage(value),
                          await this.handleSearch("statusId", value)
                      }}
                    >
                      {renderOptions(this.props.appDataStore?.inquiryStatus)}
                    </Select>
                  </Col>
                  <Col sm={{ span: 4, offset: 0 }}>
                    <Form
                      ref={this.formRef}
                      validateMessages={validateMessages}
                      layout="vertical"
                      size="middle"
                      // disabled={!this.props.isEdit}
                    >
                      <Form.Item style={{ margin: 0 }} name="displayName">
                        <Select
                          getPopupContainer={(trigger) => trigger.parentNode}
                          placeholder={L("INQUIRY_DETAIL_STATUS")}
                          style={{ width: "100%" }}
                          disabled={!this.state.filters?.statusId}
                          allowClear
                          onChange={(value) =>
                            this.handleSearch("statusDetailId", value)
                          }
                          // showSearch
                        >
                          {renderOptions(this.state.subStage)}
                        </Select>
                      </Form.Item>
                    </Form>
                  </Col>
                </>
              )}
              <Col sm={{ span: 4, offset: 0 }}>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder={L("STAFF")}
                  style={{ width: "100%" }}
                  allowClear
                  filterOption={filterOptions}
                  showSearch
                  showArrow
                  mode="multiple"
                  onChange={(value) => this.handleSearch("userIds", value)}
                  onSearch={debounce((e) => this.getStaff(e), 1000)}
                >
                  {renderOptions(this.state.listUser)}
                </Select>
              </Col>
              <Col sm={{ span: 4, offset: 0 }}>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder={L("PROJECT")}
                  filterOption={filterOptions}
                  className="w-100"
                  onChange={(value) => this.handleSearch("projectId", value)}
                  onSearch={debounce((e) => this.getProject(e), 1000)}
                  allowClear
                  showSearch
                >
                  {renderOptions(this.state.listProject)}
                </Select>
              </Col>
              <Col sm={{ span: 4, offset: 0 }}>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder={L("COMPANY")}
                  filterOption={filterOptions}
                  className="w-100"
                  onChange={(value) => this.handleSearch("companyId", value)}
                  onSearch={debounce((e) => this.getCompany(e), 1000)}
                  allowClear
                  showSearch
                >
                  {renderOptions(this.state.listCompany)}
                </Select>
              </Col>

              <Col sm={{ span: 4, offset: 0 }}>
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
              <Col sm={{ span: 4, offset: 0 }}>
                <RangePicker
                  className="w-100"
                  format={dateFormat}
                  onChange={this.handleDateChange}
                  placeholder={rangePickerPlaceholder()}
                />
              </Col>
              <Col sm={{ span: 4, offset: 0 }}>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder={L("STATUS")}
                  defaultValue="true"
                  style={{ width: "100%" }}
                  allowClear
                  onChange={(value) => this.handleSearch("isActive", value)}
                  showSearch
                >
                  {renderOptions(activeStatus)}
                </Select>
              </Col>
              <Radio.Group
                onChange={async (value) => {
                  this.changeTab(value)
                }}
                value={this.state.selectedType}
                buttonStyle="solid"
                style={{ display: "flex" }}
              >
                <Radio.Button key={tabKeys.boardView} value={tabKeys.boardView}>
                  {tabKeys.boardView}
                </Radio.Button>
                <Radio.Button key={tabKeys.listView} value={tabKeys.listView}>
                  {tabKeys.listView}
                </Radio.Button>
              </Radio.Group>
            </Row>
          </Col>
          <Col sm={{ span: 2, offset: 0 }}>
            <div style={{ position: "absolute", display: "flex", right: 10 }}>
              {this.isGranted(appPermissions.inquiry.create) && (
                <Tooltip title={L("CREATE_INQUIRY")} placement="topLeft">
                  <Button
                    icon={<PlusCircleFilled />}
                    className="button-primary"
                    onClick={() => this.props.onCreate()}
                  ></Button>
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
          </Col>
        </Row>
      </>
    )
  }
}

export default withRouter(InquiryFilterPanel)
