import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"

import { L } from "@lib/abpUtility"
import { Col, Form, Input, Row, Select } from "antd"
import TextArea from "antd/lib/input/TextArea"
import FormLabelCheckbox from "@components/FormItem/FormCheckbox/formLabelCheckBox"

export interface IProspectInfoProps {
  id: any;
}

@inject()
@observer
class ProspectInfo extends AppComponentListBase<IProspectInfoProps> {
  formRef: any = React.createRef();
  state = {};

  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  };
  public render() {
    return (
      <>
        <div className="proposal-info-element">
          <strong>{L("ProspectInfo")}</strong>
          <Form
            layout={"vertical"}
            //  onFinish={this.onSave}
            // validateMessages={validateMessages}
            size="large"
          >
            <Row gutter={[0, 0]}>
              <Col sm={{ span: 5 }}>
                <Col sm={{ span: 24 }}>
                  <FormLabelCheckbox label={"Contact Person Name"} name={""} />
                </Col>
                <Col sm={{ span: 24 }}>
                  <FormLabelCheckbox label={"Contact Company Name"} name={""} />
                </Col>
                <Col sm={{ span: 24 }}>
                  <FormLabelCheckbox label={"Contact Person Email"} name={""} />
                </Col>
                <Col sm={{ span: 24 }}>
                  <FormLabelCheckbox label={"Contact Person Email"} name={""} />
                </Col>
              </Col>
              <Col sm={{ span: 2 }}></Col>
              <Col sm={{ span: 12 }}>
                <Row gutter={[16, 8]}>
                  <Col sm={{ span: 24 }}>
                    <Form.Item label={L("Contact Person Name")} name="textArea">
                      <Select />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24 }}>
                    <Form.Item
                      label={L("Contact Company name")}
                      name="textArea"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24 }}>
                    <Form.Item
                      label={L("Contact Person Email")}
                      name="textArea"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24 }}>
                    <Form.Item
                      label={L("Contact Person Email")}
                      name="textArea"
                    >
                      <TextArea placeholder={L("")}></TextArea>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </div>
      </>
    )
  }
}

export default ProspectInfo
