import * as React from "react"

import { Button, Card, Col, Form, InputNumber, Row, Spin, Switch } from "antd"
import { inject, observer } from "mobx-react"

import AppComponentBase from "../../../components/AppComponentBase"

import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import Stores from "@stores/storeIdentifier"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"

export interface Props {
  leaseAgreementStore: LeaseAgreementStore;
  selectItem: any;
  tabKey: any;
}

@inject(Stores.LeaseAgreementStore)
@observer
class LaReminderSetting extends AppComponentBase<Props> {
  formRef: any = React.createRef();

  state = {};

  async componentDidMount() {
    await this.initValue()
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === this.props.tabKey) {
        await this.initValue()
      }
    }
  }
  async initValue() {
    await this.props.leaseAgreementStore.getLASettingAsync()
    await this.formRef.current?.setFieldsValue(
      this.props.leaseAgreementStore.laReminderSetting
    )
  }
  handleSave = async () => {
    const params = await this.formRef.current?.validateFields()
    await this.props.leaseAgreementStore.updateLASettingAsync(params)
  };

  handleChangeSwitch = async (value: boolean) => {
    const params = {
      notificationDay:
        this.props.leaseAgreementStore.laReminderSetting?.notificationDay,
      isNotify: value,
    }
    await this.props.leaseAgreementStore.updateLASettingAsync(params)
  };
  public render() {
    return (
      <>
        <Spin spinning={this.props.leaseAgreementStore.isLoading}>
          <Card
            style={{
              borderRadius: 12,
              width: "50%",
              minHeight: "40vh",
              padding: 20,
            }}
          >
            <Form layout={"vertical"} ref={this.formRef} size="middle">
              <Row gutter={[8, 0]}>
                <Col sm={{ span: 24, offset: 0 }}>
                  <Form.Item
                    label={L("NUM_DAY_TO_REMINDER_LA")}
                    name="notificationDay"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      className="w-100"
                      placeholder={L("")}
                    ></InputNumber>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 24, offset: 0 }} className="text-right">
                  <Button className="button-primary" onClick={this.handleSave}>
                    {L("SAVE")}
                  </Button>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <Form.Item
                    label={L("LA_NOTIFICATION_CHECKED")}
                    valuePropName="checked"
                    name={"isNotify"}
                  >
                    <Switch onChange={this.handleChangeSwitch} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Spin>
      </>
    )
  }
}

export default withRouter(LaReminderSetting)
