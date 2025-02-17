import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import Col from "antd/lib/col"
import Row from "antd/lib/row"
import AppConsts from "@lib/appconst"
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
import FilterSelect from "@components/Filter/FilterSelect"
import FilterRangePicker from "@components/Filter/FilterRangePicker"
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
          <Col sm={{ span: 4, offset: 0 }}>
            <FilterSelect
              placeholder={L("PROJECT")}
              onSearch={_.debounce((e) => this.getProject(e), 1000)}
              onChange={(e) => {
                this.setState({ filters: { projectId: e } })
                this.handleSearch("projectId", e)
              }}
              options={this.state.listProject}
            />
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
            <FilterSelect
              placeholder={L("COMPANY")}
              onChange={(value) => this.handleSearch("companyId", value)}
              onSearch={_.debounce((e) => this.getCompany(e), 1000)}
              options={this.state.listCompany}
            />
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <FilterSelect
              placeholder={L("CONTACT")}
              onChange={(value) => this.handleSearch("contactId", value)}
              onSearch={_.debounce((e) => this.getContact(e), 1000)}
              options={this.state.listContact}
            />
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <FilterSelect
              placeholder={L("ADMIN_INCHARGE")}
              onChange={(value) => this.handleSearch("adminId", value)}
              onSearch={_.debounce((e) => this.getAdmin(e), 1000)}
              options={this.state.listAdmin}
            />
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <FilterSelect
              placeholder={L("DEALER_IN_CHARGE")}
              onChange={(value) => this.handleSearch("dealerId", value)}
              onSearch={_.debounce((e) => this.getDealer(e), 1000)}
              options={this.state.listDealer}
            />
          </Col>
          <Col sm={{ span: 5, offset: 0 }}>
            <FilterRangePicker onChange={this.handleDateChange} />
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
            <FilterSelect
              placeholder={L("LEASE_AGREEMENT_STATUS")}
              onChange={(value) => this.handleSearch("statusId", value)}
              options={this.props.appDataStore.leaseAgreementStatus}
            />
          </Col>

          <Col sm={{ span: 4, offset: 0 }}>
            <FilterSelect
              placeholder={L("COMMISSION_STATUS")}
              onChange={(value) =>
                this.handleSearch("IsShareCommission", value)
              }
              options={filterCommissionStatus}
            />
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <FilterSelect
              placeholder={L("EXPIRED_IN")}
              onChange={(value) => this.handleSearch("expiredIn", value)}
              options={expiredIn}
            />
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <FilterSelect
              placeholder={L("STATUS")}
              onChange={(value) => this.handleSearch("isActive", value)}
              defaultValue="true"
              options={activeStatus}
            />
          </Col>
        </Row>
      </>
    )
  }
}

export default withRouter(LeasesFilterPanel)
