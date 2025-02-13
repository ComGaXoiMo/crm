import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { Button, Select, Tooltip } from "antd"
import Col from "antd/lib/col"
import Search from "antd/lib/input/Search"
import Row from "antd/lib/row"
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons"
import { filterOptions, renderOptions } from "@lib/helper"
import Stores from "@stores/storeIdentifier"
import { inject } from "mobx-react"
import UserStore from "@stores/administrator/userStore"
import { AppComponentListBase } from "@components/AppComponentBase"
import { debounce } from "lodash"
import AppConsts, { appPermissions } from "@lib/appconst"
import { ExcelIcon } from "@components/Icon"

const { activeStatus, contactType } = AppConsts
type Props = {
  userStore: UserStore;
  handleSearch: (filters) => void;
  filter: any;
  onRefresh: () => void;
  onCreate: () => void;
  exportExcel: any;
};
@inject(Stores.UserStore)
class contactsAndLeadFilterPanel extends AppComponentListBase<Props, any> {
  constructor(props: Props) {
    super(props)
  }
  state = {
    filters: {
      isActive: true,
    } as any,
    listUser: [],
  };
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

    lsitUser.map((i) => {
      return { id: i.id, name: i.name }
    })
    this.setState({ listUser: lsitUser })
  };
  handleSearchStaff = debounce((keyword) => {
    this.getStaff(keyword)
  }, 400);

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
              onChange={(value) =>
                this.updateSearch("keyword", value.target?.value)
              }
              onSearch={(value) => this.handleSearch("keyword", value)}
              size="middle"
              placeholder={L("FILTER_KEYWORD_CONTACT")}
            />
          </Col>
          <Col sm={{ span: 5, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("DEALER")}
              style={{ width: "100%" }}
              allowClear
              showSearch
              onSearch={this.handleSearchStaff}
              filterOption={filterOptions}
              mode="multiple"
              onChange={(value) => this.handleSearch("userIds", value)}
            >
              {renderOptions(this.state.listUser)}
            </Select>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("FILTER_CONTACT_TYPE")}
              style={{ width: "100%" }}
              allowClear
              onChange={(value) => this.handleSearch("typeId", value)}
              // showSearch
            >
              {renderOptions(contactType)}
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
            {this.isGranted(appPermissions.contact.export) && (
              <Tooltip title={L("EXPORT_EXCEL")} placement="topLeft">
                <Button
                  icon={<ExcelIcon />}
                  className="button-primary"
                  onClick={() => this.props.exportExcel()}
                ></Button>
              </Tooltip>
            )}
            {this.isGranted(appPermissions.contact.create) && (
              <Tooltip title={L("CREATE_CONTACT")} placement="topLeft">
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

export default withRouter(contactsAndLeadFilterPanel)
