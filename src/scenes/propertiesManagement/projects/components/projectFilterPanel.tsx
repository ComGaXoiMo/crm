import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { Button, Select, Tooltip } from "antd"
import Col from "antd/lib/col"
import Search from "antd/lib/input/Search"
import Row from "antd/lib/row"
import _, { debounce } from "lodash"
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons"
import AppDataStore from "@stores/appDataStore"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import { renderOptions } from "@lib/helper"
import { AppComponentListBase } from "@components/AppComponentBase"
import AppConsts, { appPermissions } from "@lib/appconst"
import { ExcelIcon } from "@components/Icon"
const { activeStatus } = AppConsts
type Props = {
  handleSearch: (filters) => void;
  onCreate: () => void;
  appDataStore: AppDataStore;
  onRefresh: () => void;
  createUserPermission: () => void;
  createProposal: () => void;
  disableCreateProposal: boolean;
};
type States = { filters: any };
@inject(Stores.AppDataStore)
@observer
class projectsFilterPanel extends AppComponentListBase<Props, States> {
  constructor(props: Props) {
    super(props)
  }
  state = {
    filters: {
      isActive: true,
    } as any,
  };
  handleSearch = async (name, value) => {
    {
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
    const {
      appDataStore: { propertyTypes },
    } = this.props
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
              placeholder={L("PROJECT_NAME")}
            />
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("PRODUCT_TYPE")}
              style={{ width: "100%" }}
              allowClear
              // showSearch
              onChange={(value) => this.handleSearch("PropertyTypeId", value)}
            >
              {renderOptions(propertyTypes)}
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
            {this.isGranted(appPermissions.inquiry.create) && (
              <Button
                className="button-primary"
                disabled={this.props.disableCreateProposal}
                onClick={() => this.props.createProposal()}
              >
                {L("PROJECT_CREATE_PROPOSAL")}
              </Button>
            )}
            {this.isGranted(appPermissions.project.userPermission) && (
              <Button
                className="button-primary"
                onClick={() => this.props.createUserPermission()}
              >
                {L("PROJECT_USER_PERMISSION")}
              </Button>
            )}
            {this.isGranted(appPermissions.project.export) && (
              <Tooltip title={L("EXPORT_EXCEL")} placement="topLeft">
                <Button
                  icon={<ExcelIcon />}
                  className="button-primary"
                ></Button>
              </Tooltip>
            )}
            {this.isGranted(appPermissions.project.create) && (
              <Tooltip title={L("PROJECT_CREATE")} placement="topLeft">
                <Button
                  icon={<PlusCircleFilled />}
                  className="button-primary"
                  onClick={() => this.props.onCreate()}
                >
                  {/* {L("PROJECT_CREATE")} */}
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

export default withRouter(projectsFilterPanel)
