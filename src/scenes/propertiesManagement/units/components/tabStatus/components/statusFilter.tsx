import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { Button, Tooltip } from "antd"
import Row from "antd/lib/row"
import { AppComponentListBase } from "@components/AppComponentBase"
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons"

type Props = {
  handleSearch: any;
  onCreate: () => void;
  filter: any;
  onRefresh: () => void;
};

class StatusFilterPanel extends AppComponentListBase<Props> {
  constructor(props: Props) {
    super(props)
  }
  state = {};

  render() {
    return (
      <>
        <Row className="mb-3" gutter={[8, 8]}>
          {/* <Col sm={{ span: 10, offset: 0 }}> */}
          {/* <Search size="middle" placeholder={L("FILTER_KEYWORD")} /> */}
          {/* </Col> */}
          {/* <Col sm={{ span: 3, offset: 0 }}>
              <Select
                      getPopupContainer={(trigger) => trigger.parentNode}             placeholder={L("TYPE")}
              style={{ width: "100%" }}
              allowClear
              // showSearch
            ></Select>
          </Col> */}
          <br />
          <div style={{ position: "absolute", right: 10 }}>
            <Tooltip title={L("CREATE_UNIT_STATUS")} placement="topLeft">
              <Button
                icon={<PlusCircleFilled />}
                className="button-primary"
                onClick={() => this.props.onCreate()}
              />
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

export default withRouter(StatusFilterPanel)
