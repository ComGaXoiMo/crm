import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { Button, DatePicker, Radio, Select, Tooltip } from "antd"
import Col from "antd/lib/col"
import Search from "antd/lib/input/Search"
import Row from "antd/lib/row"
import { filterOptions, renderOptions } from "@lib/helper"
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons"
import { appPermissions, dateFormat } from "@lib/appconst"
import AppDataStore from "@stores/appDataStore"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import { AppComponentListBase } from "@components/AppComponentBase"
import UserStore from "@stores/administrator/userStore"
import { debounce } from "lodash"
import moment from "moment"

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
          <Col sm={{ span: 4, offset: 0 }}>
            <Search
              onChange={(value) =>
                this.updateSearch("keyword", value.target?.value)
              }
              onSearch={(value) => this.handleSearch("keyword", value)}
              size="middle"
              placeholder={L("FILTER_KEYWORD_TASK")}
            />
          </Col>
          {!this.props.isMyTask && (
            <Col sm={{ span: 4, offset: 0 }}>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                placeholder={L("STAFF")}
                style={{ width: "100%" }}
                allowClear
                filterOption={filterOptions}
                showSearch
                showArrow
                // mode="multiple"
                onChange={(value) => this.handleSearch("userId", value)}
                onSearch={this.getStaff}
              >
                {renderOptions(this.state.listUser)}
              </Select>
            </Col>
          )}
          {this.state.selectedType === tabKeys.listView && (
            <Col sm={{ span: 3, offset: 0 }}>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                placeholder={L("STATUS")}
                style={{ width: "100%" }}
                allowClear
                onChange={(value) => this.handleSearch("statusId", value)}
                // showSearch
              >
                {renderOptions(this.props.appDataStore.taskStatus)}
              </Select>
            </Col>
          )}
          <Col sm={{ span: 3, offset: 0 }}>
            <DatePicker
              className="w-100"
              format={dateFormat}
              onChange={(value) =>
                this.handleSearch("fromDate", moment(value).toJSON())
              }
              placeholder={L("FROM_DATE")}
            />
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <DatePicker
              className="w-100"
              format={dateFormat}
              onChange={(value) =>
                this.handleSearch("toDate", moment(value).toJSON())
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
          <div style={{ position: "absolute", right: 10 }}>
            {this.isGranted(appPermissions.task.create) && (
              <Tooltip title={L("CREATE_TASK")} placement="topLeft">
                <Button
                  className="button-primary"
                  icon={<PlusCircleFilled />}
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

export default withRouter(AllTaskFilterPanel)
