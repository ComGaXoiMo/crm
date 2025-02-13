import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { Button } from "antd"
import Row from "antd/lib/row"
import { AppComponentListBase } from "@components/AppComponentBase"

type Props = {
  handleSearch: any;
  filter: any;
  changeTab: any;
  onCreate: () => void;
};

class InquiriFilter extends AppComponentListBase<Props> {
  constructor(props: Props) {
    super(props)
  }
  state = {};
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
  render() {
    return (
      <>
        <Row className="mb-3" gutter={[8, 8]}>
          {/* <Col sm={{ span: 3, offset: 0 }}>
              <Select
                      getPopupContainer={(trigger) => trigger.parentNode}             placeholder={L("TYPE")}
              style={{ width: "100%" }}
              allowClear
              // showSearch
            ></Select>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
              <Select
                      getPopupContainer={(trigger) => trigger.parentNode}             placeholder={L("STATUS")}
defaultValue="true"
              style={{ width: "100%" }}
              allowClear
              // showSearch
            ></Select>
          </Col> */}

          <div style={{ position: "absolute", right: 40 }}>
            <Button
              className="button-primary"
              onClick={() => this.props.onCreate()}
            ></Button>
          </div>
        </Row>
      </>
    )
  }
}

export default withRouter(InquiriFilter)
