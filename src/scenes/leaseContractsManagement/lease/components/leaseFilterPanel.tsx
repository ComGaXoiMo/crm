import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { Button, DatePicker, Select, Tooltip } from "antd"
import Col from "antd/lib/col"
import Search from "antd/lib/input/Search"
import Row from "antd/lib/row"
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons"
import { filterOptions, renderOptions } from "@lib/helper"
import AppConsts, {
  appPermissions,
  dateFormat,
  rangePickerPlaceholder,
} from "@lib/appconst"
import companyService from "@services/clientManagement/companyService"
import contactService from "@services/clientManagement/contactService"
import _, { debounce } from "lodash"
import AppDataStore from "@stores/appDataStore"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import dayjs from "dayjs"
import userService from "@services/administrator/user/userService"
import projectService from "@services/projects/projectService"
const { RangePicker } = DatePicker
const { expiredIn, roles, activeStatus, filterCommissionStatus } = AppConsts
type Props = {
  handleSearch: (filters) => void
  filter: any
  onCreate: () => void
  onRefresh: () => void
  appDataStore: AppDataStore
}
@inject(Stores.AppDataStore)
@observer
class LeasesFilterPanel extends AppComponentListBase<Props> {
  constructor(props: Props) {
    super(props)
  }
  state = {
    listCompany: [] as any,
    listContact: [] as any,
    listDealer: [],
    listProject: [],
    listAdmin: [],
    filters: {
      isActive: true,
    } as any,
  }
  componentDidMount() {
    this.getCompany("")
    this.getContact("")
    this.getAdmin("")
    this.getProject("")
    this.getDealer("")
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
  getCompany = async (keyword) => {
    const listCompany = await companyService.getAll({
      isActive: true,
      maxResultCount: 10,
      skipCount: 0,
      keyword: keyword,
    })
    const res = listCompany.items?.map((i) => {
      return { id: i.id, name: i.businessName }
    })
    await this.setState({ listCompany: res })
  }

  getContact = async (keyword) => {
    const listContact = await contactService.getAll({
      isActive: true,
      maxResultCount: 10,
      skipCount: 0,
      keyword: keyword,
    })

    const res = listContact.items?.map((i) => {
      return { id: i.id, name: i.contactName }
    })
    this.setState({ listContact: res })
  }
  getAdmin = async (keyword) => {
    const res = await userService.getAll({
      maxResultCount: 10,
      skipCount: 0,
      roleId: roles.admin,
      keyword: keyword,
    })
    const lsitUser = [...res?.items]

    lsitUser.map((i) => {
      return { id: i.id, name: i.displayName }
    })
    this.setState({ listAdmin: lsitUser })
  }
  getDealer = async (keyword) => {
    const res = await userService.getAll({
      maxResultCount: 10,
      skipCount: 0,
      roleId: roles.dealer,
      keyword: keyword,
    })
    const lsitUser = [...res?.items]

    lsitUser.map((i) => {
      return { id: i.id, name: i.displayName }
    })
    this.setState({ listDealer: lsitUser })
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
          <Col sm={{ span: 5, offset: 0 }}>
            <Search
              onChange={(value) =>
                this.updateSearch("keyword", value.target?.value)
              }
              onSearch={(value) => this.handleSearch("keyword", value)}
              size="middle"
              placeholder={L("REFERENCE_NUMBER_UNIT_NO")}
            />
          </Col>
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
              }}
              onSearch={_.debounce((e) => this.getProject(e), 1000)}
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
              style={{ width: "100%" }}
              allowClear
              showSearch
              filterOption={filterOptions}
              onChange={(value) => this.handleSearch("companyId", value)}
              onSearch={_.debounce((e) => this.getCompany(e), 1000)}
            >
              {renderOptions(this.state.listCompany)}
            </Select>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("CONTACT")}
              style={{ width: "100%" }}
              allowClear
              showSearch
              filterOption={filterOptions}
              onChange={(value) => this.handleSearch("contactId", value)}
              onSearch={_.debounce((e) => this.getContact(e), 1000)}
            >
              {renderOptions(this.state.listContact)}
            </Select>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("ADMIN_INCHARGE")}
              style={{ width: "100%" }}
              allowClear
              showSearch
              filterOption={filterOptions}
              onChange={(value) => this.handleSearch("adminId", value)}
              onSearch={_.debounce((e) => this.getAdmin(e), 1000)}
            >
              {renderOptions(this.state.listAdmin)}
            </Select>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("DEALER_IN_CHARGE")}
              style={{ width: "100%" }}
              allowClear
              showSearch
              filterOption={filterOptions}
              onChange={(value) => this.handleSearch("dealerId", value)}
              onSearch={_.debounce((e) => this.getDealer(e), 1000)}
            >
              {renderOptions(this.state.listDealer)}
            </Select>
          </Col>
          <Col sm={{ span: 5, offset: 0 }}>
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
              placeholder={L("LEASE_AGREEMENT_STATUS")}
              style={{ width: "100%" }}
              onChange={(value) => this.handleSearch("statusId", value)}
              allowClear
              // showSearch
            >
              {renderOptions(this.props.appDataStore.leaseAgreementStatus)}
            </Select>
          </Col>

          <Col sm={{ span: 4, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("COMMISSION_STATUS")}
              style={{ width: "100%" }}
              allowClear
              onChange={(value) =>
                this.handleSearch("IsShareCommission", value)
              }
              showSearch
            >
              {renderOptions(filterCommissionStatus)}
            </Select>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("EXPIRED_IN")}
              style={{ width: "100%" }}
              onChange={(value) => this.handleSearch("expiredIn", value)}
              allowClear
              // showSearch
            >
              {renderOptions(expiredIn)}
            </Select>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
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
          <div style={{ position: "absolute", right: 10 }}>
            {this.isGranted(appPermissions.leaseAgreement.create) && (
              <Tooltip title={L("CREATE_LEASE_AGREEMENT")} placement="topLeft">
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
        </Row>
      </>
    )
  }
}

export default withRouter(LeasesFilterPanel)
