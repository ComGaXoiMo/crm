import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { Radio } from "antd"
import Col from "antd/lib/col"
import Row from "antd/lib/row"
import AppDataStore from "@stores/appDataStore"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import { AppComponentListBase } from "@components/AppComponentBase"
import UserStore from "@stores/administrator/userStore"
import { debounce } from "lodash"
import dayjs from "dayjs"
import FilterSelect from "@components/Filter/FilterSelect"
import FilterDatePicker from "@components/Filter/FilterDatePicker"

type Props = {
  isMyTask: boolean
  handleSearch: (filters) => void
  filter: any
  changeTab: any
  onCreate: () => void
  onRefresh: () => void
  userStore: UserStore
  appDataStore: AppDataStore
}

const tabKeys = {
  boardView: L("BOARD_VIEW"),
  listView: L("LIST_VIEW"),
}
@inject(Stores.AppDataStore, Stores.UserStore)
@observer
class AllTaskFilterPanel extends AppComponentListBase<Props> {
  constructor(props: Props) {
    super(props)
  }
  state = {
    selectedType: tabKeys.boardView,
    listUser: [],
    filters: {
      isActive: true,
    } as any,
  }
  async componentDidMount() {
    await Promise.all([this.getStaff("")])
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

  changeTab = async (event) => {
    const value = event.target.value
    await this.setState({ selectedType: value })
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
          {!this.props.isMyTask && (
            <Col sm={{ span: 4, offset: 0 }}>
              <FilterSelect
                placeholder={L("STAFF")}
                onChange={(value) => this.handleSearch("userId", value)}
                onSearch={this.getStaff}
                options={this.state.listUser}
              />
            </Col>
          )}
          {this.state.selectedType === tabKeys.listView && (
            <Col sm={{ span: 3, offset: 0 }}>
              <FilterSelect
                placeholder={L("STATUS")}
                onChange={(value) => this.handleSearch("statusId", value)}
                options={this.props.appDataStore.taskStatus}
              />
            </Col>
          )}
          <Col sm={{ span: 3, offset: 0 }}>
            <FilterDatePicker
              onChange={(value) =>
                this.handleSearch("fromDate", dayjs(value).toJSON())
              }
              placeholder={L("FROM_DATE")}
            />
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <FilterDatePicker
              onChange={(value) =>
                this.handleSearch("toDate", dayjs(value).toJSON())
              }
              placeholder={L("TO_DATE")}
            />
          </Col>
          <Radio.Group
            onChange={async (value) => {
              await this.setState({ selectedType: value.target.value })
              await this.props.changeTab(value)
            }}
            value={this.state.selectedType}
            buttonStyle="solid"
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

export default withRouter(AllTaskFilterPanel)
