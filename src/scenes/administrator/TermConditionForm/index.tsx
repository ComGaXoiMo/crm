import React from "react"

import { Col, Form, Row, Card, Tabs, Input, Button, Modal } from "antd"
import { validateMessages } from "@lib/validation"
import AppConsts from "../../../lib/appconst"
import { inject, observer } from "mobx-react"
import Stores from "../../../stores/storeIdentifier"
import TermConditionStore from "../../../stores/administrator/termConditionStore"
import AppComponentBase from "../../../components/AppComponentBase"
import { L, LNotification } from "@lib/abpUtility"
import WrapPageScroll from "@components/WrapPageScroll"
import SyncfutionRichText from "@components/Inputs/SyncfusionRichText"

const { formVerticalLayout } = AppConsts
const { TabPane } = Tabs
const confirm = Modal.confirm

export interface ITermConditionFormProps {
  match: any
  history: any
  termConditionStore: TermConditionStore
}

@inject(Stores.TermConditionStore)
@observer
class TermConditionForm extends AppComponentBase<ITermConditionFormProps> {
  formRef: any = React.createRef()
  get languages() {
    return abp.localization.languages.filter((val: any) => {
      return !val.isDisabled
    })
  }
  state = {
    isDirty: false,
    parameters: [] as any,
  }

  async componentDidMount() {
    await this.init()
  }

  async init() {
    await this.props.termConditionStore.get()

    this.formRef.current.setFieldsValue({
      ...this.props.termConditionStore.editTermCondition,
    })
  }

  onSave = () => {
    const form = this.formRef.current

    form.validateFields().then(async (values: any) => {
      await this.props.termConditionStore.createOrUpdate({
        ...this.props.termConditionStore.editTermCondition,
        ...values,
      })
    })
  }

  onCancel = () => {
    if (this.state.isDirty) {
      confirm({
        title: LNotification("ARE_YOU_SURE"),
        okText: L("BTN_YES"),
        cancelText: L("BTN_NO"),
        onOk: () => {
          this.props.history.goBack()
        },
      })
      return
    }
    this.props.history.goBack()
  }

  renderActions = (isLoading?) => {
    return (
      <Row>
        <Col sm={{ span: 24, offset: 0 }}>
          <Button className="mr-1" onClick={this.onCancel} shape="round">
            {L("BTN_CANCEL")}
          </Button>

          <Button
            type="primary"
            onClick={this.onSave}
            loading={isLoading}
            shape="round"
          >
            {L("BTN_SAVE")}
          </Button>
        </Col>
      </Row>
    )
  }

  public render() {
    const { isLoading } = this.props.termConditionStore
    return (
      <WrapPageScroll renderActions={() => this.renderActions(isLoading)}>
        <Card bordered={false}>
          <Form
            ref={this.formRef}
            layout={"vertical"}
            validateMessages={validateMessages}
            size="large"
          >
            <Row gutter={[16, 0]}>
              <Col sm={{ span: 24, offset: 0 }}>
                <div>
                  {this.state.parameters.map((parameter, index) => {
                    return (
                      <span key={index}>
                        {index > 0 ? " - " : ""}
                        <span>
                          <b>{parameter.key}:</b> <i>{parameter.description}</i>
                        </span>
                      </span>
                    )
                  })}
                </div>
              </Col>
              <Col sm={{ span: 24, offset: 0 }}>
                <Tabs defaultActiveKey="vi">
                  {this.languages.map((item) => {
                    return (
                      <TabPane tab={item.displayName} key={item.name}>
                        <Row gutter={[16, 0]}>
                          <Col sm={{ span: 24, offset: 0 }}>
                            <Form.Item
                              label={L("SUBJECT")}
                              {...formVerticalLayout}
                              name={["subject", item.name]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col sm={{ span: 24, offset: 0 }}>
                            <Form.Item
                              label={L("TERM_CONDITION_CONTENT")}
                              {...formVerticalLayout}
                              name={["content", item.name]}
                            >
                              <SyncfutionRichText />
                            </Form.Item>
                          </Col>
                        </Row>
                      </TabPane>
                    )
                  })}
                </Tabs>
              </Col>
            </Row>
          </Form>
        </Card>
      </WrapPageScroll>
    )
  }
}

export default TermConditionForm
