import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { Form, Radio } from "antd"
import Col from "antd/lib/col"
import Row from "antd/lib/row"
import { AppComponentListBase } from "@components/AppComponentBase"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import UserStore from "@stores/administrator/userStore"
import projectService from "@services/projects/projectService"
import { debounce } from "lodash"
import AppConsts from "@lib/appconst"
import { validateMessages } from "@lib/validation"
import dayjs from "dayjs"
import companyService from "@services/clientManagement/companyService"
import FilterSelect from "@components/Filter/FilterSelect"
import FilterRangePicker from "@components/Filter/FilterRangePicker"
const { activeStatus } = AppConsts
type Props = {
  handleSearch: (filters) => void
  filter: any
  changeTab: any
  onCreate: () => void
  appDataStore: any
  userStore: UserStore
  onRefresh: () => void
}

const tabKeys = {
  boardView: L("BOARD_VIEW"),
  listView: L("LIST_VIEW"),
}
@inject(Stores.AppDataStore, Stores.UserStore)
@observer
class InquiryFilterPanel extends AppComponentListBase<Props> {
  formRef = React.createRef<any>()
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
  }
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
  }
  changeStage = async (id?) => {
    this.findSubStage(id)
    await this.setState({
      filters: { ...this.state.filters, statusDetailId: undefined },
    })
    this.formRef.current.resetFields()
  }
  findSubStage = async (id?) => {
    const subStage = this.props.appDataStore.inquirySubStage.filter(
      (item) => item.parentId === id
    )
    this.setState({ subStage })
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
  }
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
  }

  handleDateChange = async (value) => {
    console.log(value)
    const startDate =
      value && value.length ? dayjs(value[0]).startOf("day").toJSON() : null
    // await this.handleSearch("fromDate", startDate);
    const { filters } = this.state
    await this.setState({ filters: { ...filters, fromDate: startDate } })
    const endDate =
      value && value.length ? dayjs(value[1]).endOf("day").toJSON() : null

    await this.handleSearch("toDate", endDate)
  }

  changeTab = async (event) => {
    await this.setState({ selectedType: event.target.value })
    this.handleSearch("statusDetailId", undefined)
    await this.props.changeTab(event)
  }
  updateSearch = debounce((name, value) => {
    const { filters } = this.state
    this.setState({ filters: { ...filters, [name]: value } })
    if (value?.length === 0) {
      this.handleSearch("keyword", value)
    }
  }, 100)
  render() {
    return (
      <>
        <Row gutter={[4, 8]}>
          {this.state.selectedType === tabKeys.listView && (
            <>
              <Col sm={{ span: 4, offset: 0 }}>
                <FilterSelect
                  placeholder={L("INQUIRY_STATUS")}
                  onChange={async (value) => {
                    await this.changeStage(value),
                      await this.handleSearch("statusId", value)
                  }}
                  options={this.props.appDataStore?.inquiryStatus}
                />
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
                    <FilterSelect
                      placeholder={L("INQUIRY_DETAIL_STATUS")}
                      disabled={!this.state.filters?.statusId}
                      onChange={(value) =>
                        this.handleSearch("statusDetailId", value)
                      }
                      options={this.state.subStage}
                    />
                  </Form.Item>
                </Form>
              </Col>
            </>
          )}
          <Col sm={{ span: 4, offset: 0 }}>
            <FilterSelect
              placeholder={L("STAFF")}
              onChange={(value) => this.handleSearch("userIds", value)}
              onSearch={debounce((e) => this.getStaff(e), 1000)}
              selectProps={{ mode: "multiple" }}
              options={this.state.listUser}
            />
          </Col>
          <Col sm={{ span: 5, offset: 0 }}>
            <FilterSelect
              placeholder={L("PROJECT")}
              onChange={(value) => this.handleSearch("projectId", value)}
              onSearch={debounce((e) => this.getProject(e), 1000)}
              options={this.state.listProject}
            />
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
            <FilterSelect
              placeholder={L("COMPANY")}
              onChange={(value) => this.handleSearch("companyId", value)}
              onSearch={debounce((e) => this.getCompany(e), 1000)}
              options={this.state.listCompany}
            />
          </Col>

          <Col sm={{ span: 4, offset: 0 }}>
            <FilterSelect
              placeholder={L("UNIT_TYPE")}
              selectProps={{ mode: "multiple" }}
              onChange={(value) => this.handleSearch("unitTypeIds", value)}
              options={this.props.appDataStore.unitTypes}
            />
          </Col>
          <Col sm={{ span: 6, offset: 0 }}>
            <FilterRangePicker onChange={this.handleDateChange} />
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
            <FilterSelect
              placeholder={L("STATUS")}
              defaultValue="true"
              onChange={(value) => this.handleSearch("isActive", value)}
              options={activeStatus}
            />
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
      </>
    )
  }
}

export default withRouter(InquiryFilterPanel)
