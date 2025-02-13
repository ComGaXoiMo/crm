import React from "react"
import withRouter from "@components/Layout/Router/withRouter"

import { Button } from "antd"
// import Search from "antd/lib/input/Search";
import Row from "antd/lib/row"
import { AppComponentListBase } from "@components/AppComponentBase"
import { PlusCircleFilled } from "@ant-design/icons"

type Props = {
  handleSearch: any;
  onCreate: () => void;
  filter: any;
};

class DocumentFilterPanel extends AppComponentListBase<Props> {
  constructor(props: Props) {
    super(props)
  }
  state = {};

  render() {
    return (
      <>
        <Row gutter={[8, 8]} style={{ marginBottom: 40 }}>
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
            <Button
              icon={<PlusCircleFilled />}
              className="button-primary"
              onClick={() => this.props.onCreate()}
            />
          </div>
        </Row>
      </>
    )
  }
}

export default withRouter(DocumentFilterPanel)
