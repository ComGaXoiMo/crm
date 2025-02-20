import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import Col from "antd/lib/col"
import Row from "antd/lib/row"
import { AppComponentListBase } from "@components/AppComponentBase"
import AppConsts from "@lib/appconst"
import UserStore from "@stores/administrator/userStore"
import Stores from "@stores/storeIdentifier"
import { inject } from "mobx-react"
import { debounce } from "lodash"
import FilterSelect from "@components/Filter/FilterSelect"
const { activeStatus } = AppConsts

type Props = {
  userStore: UserStore
  handleSearch: (filters) => void
}

@inject(Stores.UserStore)
class companyFilterPanel extends AppComponentListBase<Props, any> {
  constructor(props: Props) {
    super(props)
  }
  state = {
    filters: {
      isActive: true,
    } as any,
    listUser: [],
  }
  async componentDidMount() {
    await this.getStaff("")
  }

  getStaff = async (keyword) => {
    await this.props.userStore.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword: keyword,
    })
    const lsitUser = [...this.props.userStore.users.items]

    await lsitUser.map((i) => {
      return { id: i.id, name: i.name }
    })
    await this.setState({ listUser: lsitUser })
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
  render() {
    return (
      <>
        <Row gutter={[4, 8]}>
          <Col sm={{ span: 4, offset: 0 }}>
            <FilterSelect
              placeholder={L("DEALER")}
              onSearch={this.getStaff}
              selectProps={{ mode: "multiple" }}
              onChange={(value) => this.handleSearch("userIds", value)}
              options={this.state.listUser}
            />
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
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

export default withRouter(companyFilterPanel)
