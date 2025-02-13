import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { Button, Select, Tooltip } from "antd"
import Col from "antd/lib/col"
import Search from "antd/lib/input/Search"
import Row from "antd/lib/row"
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons"
import { renderOptions } from "@lib/helper"
import { AppComponentListBase } from "@components/AppComponentBase"
import AppConsts, { appPermissions } from "@lib/appconst"
import UserStore from "@stores/administrator/userStore"
import Stores from "@stores/storeIdentifier"
import { inject } from "mobx-react"
import { debounce } from "lodash"
import { ExcelIcon } from "@components/Icon"
const { activeStatus } = AppConsts

type Props = {
  userStore: UserStore;
  handleSearch: (filters) => void;
  filter: any;
  changeTab: any;
  onCreate: () => void;
  onRefresh: () => void;
  exportExcel: any;
};

@inject(Stores.UserStore)
class companyFilterPanel extends AppComponentListBase<Props, any> {
  constructor(props: Props) {
    super(props)
  }
  state = {
    selectedType: "",
    filters: {
      isActive: true,
    } as any,
    listUser: [],
  };
  async componentDidMount() {
    await this.getStaff("")
  }

  changeTab = async (event) => {
    const value = event.target.value
    console.log("checked", value)
    await this.setState({ selectedType: value })
  };
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
  };
  handleSearch = async (name, value) => {
    {
      // this.setState({ [name]: value });
      await this.setState({
        filters: { ...this.state.filters, [name]: value },
      })
      await this.props.handleSearch(this.state.filters)
    }
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
          <Col sm={{ span: 5, offset: 0 }}>
            <Search
              size="middle"
              placeholder={L("FILTER_KEYWORD_COMPANY_NAME")}
              onChange={(value) =>
                this.updateSearch("keyword", value.target?.value)
              }
              onSearch={(value) => this.handleSearch("keyword", value)}
            />
          </Col>

          {/* <Col sm={{ span: 2, offset: 0 }}>
              <Select
                      getPopupContainer={(trigger) => trigger.parentNode}             placeholder={L("STATUS")}
defaultValue="true"
              style={{ width: "100%" }}
              allowClear
              // showSearch
            ></Select>
          </Col> */}

          <Col sm={{ span: 5, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("DEALER")}
              style={{ width: "100%" }}
              allowClear
              // showSearch
              showArrow
              mode="multiple"
              onChange={(value) => this.handleSearch("userIds", value)}
            >
              {renderOptions(this.state.listUser)}
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
          <div style={{ position: "absolute", display: "flex", right: 10 }}>
            {this.isGranted(appPermissions.company.export) && (
              <Tooltip title={L("EXPORT_EXCEL")} placement="topLeft">
                <Button
                  icon={<ExcelIcon />}
                  className="button-primary"
                  onClick={() => this.props.exportExcel()}
                ></Button>
              </Tooltip>
            )}
            {this.isGranted(appPermissions.company.create) && (
              <Tooltip title={L("CREATE_COMPANY")} placement="topLeft">
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

export default withRouter(companyFilterPanel)
