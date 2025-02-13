import React from "react"
import withRouter from "@components/Layout/Router/withRouter"

import { Button, Tooltip } from "antd"

// import Search from "antd/lib/input/Search";
import Row from "antd/lib/row"
import { AppComponentListBase } from "@components/AppComponentBase"
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons"
import { L } from "@lib/abpUtility"

type Props = {
  handleSearch: any;
  onCreate: () => void;
  onRefresh: () => void;
  filter: any;
  createPermission: boolean;
};

class DocumentFilterPanel extends AppComponentListBase<Props> {
  constructor(props: Props) {
    super(props)
  }
  state = {};

  render() {
    return (
      <>
        <Row style={{ marginBottom: 30 }} gutter={[8, 8]}>
          {/* <Col sm={{ span: 10, offset: 0 }}>
            <Search size="middle" placeholder={L("FILTER_KEYWORD")} />
          </Col> */}

          {/* <Col sm={{ span: 3, offset: 0 }}>
              <Select
                      getPopupContainer={(trigger) => trigger.parentNode}             placeholder={L("TYPE")}
              style={{ width: "100%" }}
              allowClear
              // showSearch
            ></Select>
          </Col> */}
          <div style={{ position: "absolute", right: 10 }}>
            {this.props.createPermission && (
              <Tooltip title={L("CREATE_DOCUMENT")} placement="topLeft">
                <Button
                  icon={<PlusCircleFilled />}
                  className="button-primary"
                  onClick={() => this.props.onCreate()}
                />
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

export default withRouter(DocumentFilterPanel)
