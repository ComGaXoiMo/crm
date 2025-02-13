import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { Button, Tooltip } from "antd"
import Col from "antd/lib/col"
import Search from "antd/lib/input/Search"
import Row from "antd/lib/row"
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons"
import _ from "lodash"
import { AppComponentListBase } from "@components/AppComponentBase"
import { appPermissions } from "@lib/appconst"
// import { PlusCircleFilled } from "@ant-design/icons";

type Props = {
  handleSearch: any
  filter: any
  onRefresh: () => void
  onCreate: () => void
  changeTab: any
}

class TenantsFilterPanel extends AppComponentListBase<Props> {
  constructor(props: Props) {
    super(props)
  }
  state = {
    selectedType: "",
    filters: {
      // isUnitActive: true
    } as any,
    listUnit: [] as any,
  }
  componentDidMount() {
    this.searchTitleOptions("")
  }

  searchTitleOptions = async (keyword?) => {
    // your searchTitleOptions logic here
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

  updateSearch = _.debounce((name, value) => {
    const { filters } = this.state
    this.setState({ filters: { ...filters, [name]: value } })
    if (value?.length === 0) {
      this.handleSearch("keyword", value)
    }
  }, 100)
  changeTab = async (event) => {
    const value = event.target.value
    await this.setState({ selectedType: value })
  }
  render() {
    return (
      <>
        <Row gutter={[4, 8]}>
          <Col sm={{ span: 6, offset: 0 }}>
            <Search
              onChange={(value) =>
                this.updateSearch("keyword", value.target?.value)
              }
              onSearch={(value) => this.handleSearch("keyword", value)}
              size="middle"
              placeholder={L("FILTER_KEYWORD_TENENT")}
            />
          </Col>

          <div style={{ position: "absolute", right: 10 }}>
            {this.isGranted(appPermissions.userTenant.create) && (
              <Tooltip title={L("CREATE_TENANT")} placement="topLeft">
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

export default withRouter(TenantsFilterPanel)
