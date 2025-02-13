import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import Col from "antd/lib/col"
import Row from "antd/lib/row"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Button, Select, Tooltip } from "antd"
import { ReloadOutlined } from "@ant-design/icons"
import AppConsts from "@lib/appconst"
const { listActivityType } = AppConsts

type Props = {
  handleSearch: any;
  filter: any;
  changeTab: any;
  onRefesh: () => void;
};

class ActivityFilterPanel extends AppComponentListBase<Props> {
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
  handleSearch = async (name, value) => {
    {
      // this.setState({ [name]: value });
      await this.setState({
        filters: { ...this.state.filters, [name]: value },
      })
      await this.props.handleSearch(this.state.filters)
    }
  };

  render() {
    return (
      <>
        <Row className="mb-3" gutter={[8, 8]}>
          {/* <Col sm={{ span: 10, offset: 0 }}>
            <Search size="middle" placeholder={L("FILTER_KEYWORD")} />
          </Col> */}
          <Col sm={{ span: 6, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("ACTIVITY_TYPE")}
              style={{ width: "100%" }}
              allowClear
              onChange={(value) => this.handleSearch("activityType", value)}
              // showSearch
            >
              {this.renderOptions(listActivityType)}
            </Select>
          </Col>

          <div style={{ position: "absolute", right: 10 }}>
            <Tooltip title={this.L("RELOAD")} placement="topLeft">
              <Button
                icon={<ReloadOutlined />}
                className="button-primary"
                onClick={() => this.props.onRefesh()}
              ></Button>
            </Tooltip>
          </div>
        </Row>
      </>
    )
  }
}

export default withRouter(ActivityFilterPanel)
