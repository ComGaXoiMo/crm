import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import Col from "antd/lib/col"
import Search from "antd/lib/input/Search"
import Row from "antd/lib/row"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Button, Tooltip } from "antd"
// import AppConsts from "@lib/appconst";
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons"
import { debounce } from "lodash"
// const { requestStatus } = AppConsts;
type Props = {
  handleSearch: (filters) => void;
  filter: any;
  changeTab: any;
  onCreate: () => void;
  onRefresh: () => void;
};

class associatePartyFilter extends AppComponentListBase<Props> {
  constructor(props: Props) {
    super(props)
  }
  state = {
    filters: {
      isActive: true,
    } as any,
  };
  componentDidMount() {
    this.searchTitleOptions("")
  }

  searchTitleOptions = async (keyword?) => {
    // your searchTitleOptions logic here
  };

  changeTab = async (event) => {
    const value = event.target.value
    await this.setState({ selectedType: value })
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
        <Row className="mb-3" gutter={[8, 8]}>
          <Col sm={{ span: 8, offset: 0 }}>
            <Search
              onChange={(value) =>
                this.updateSearch("keyword", value.target?.value)
              }
              onSearch={(value) => this.handleSearch("keyword", value)}
              size="middle"
              placeholder={L("FILTER_USER_NAME")}
            />
          </Col>

          {/* <Col sm={{ span: 5, offset: 0 }}>
              <Select
                      getPopupContainer={(trigger) => trigger.parentNode}             placeholder={L("TYPE")}
              style={{ width: "100%" }}
              allowClear
              // showSearch
            >
              {renderOptions(requestStatus)}
            </Select>
          </Col> */}
          <div style={{ position: "absolute", display: "flex", right: 10 }}>
            <Tooltip title={L("CREATE_ASSOCIATE_PARTY")}>
              <Button
                icon={<PlusCircleFilled />}
                className="button-primary"
                onClick={() => this.props.onCreate()}
              ></Button>
            </Tooltip>

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

export default withRouter(associatePartyFilter)
