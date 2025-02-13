import * as React from "react"

import { Button, Card, Col, Form, InputNumber, Row, Spin } from "antd"
import { inject, observer } from "mobx-react"

import AppComponentBase from "../../../components/AppComponentBase"

import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import Stores from "@stores/storeIdentifier"
import ReservationStore from "@stores/activity/reservationStore"

export interface Props {
  reservationStore: ReservationStore
  selectItem: any
  tabKey: any
}

@inject(Stores.ReservationStore)
@observer
class OtherConfigSetting extends AppComponentBase<Props> {
  formRef: any = React.createRef()

  state = {}

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
    await this.props.reservationStore.getSettingReservation()
    await this.formRef.current?.setFieldsValue(
      this.props.reservationStore.reservationSetting
    )
  }
  handleSave = async () => {
    const params = await this.formRef.current?.validateFields()
    this.props.reservationStore.updateSettingReservation(params)
  }
  public render() {
    return (
      <>
        <Spin spinning={this.props.reservationStore.isLoading}>
          <Card style={{ borderRadius: 12, minHeight: "40vh", padding: 20 }}>
            <Form layout={"vertical"} ref={this.formRef} size="middle">
              <Row gutter={[8, 0]}>
                <Col sm={{ span: 12, offset: 0 }}>
                  <Form.Item
                    label={L("NUM_OF_RESERVABLE_UNIT")}
                    name="maxUnitPerSeller"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      className="w-100"
                      placeholder={L("")}
                    ></InputNumber>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 12, offset: 0 }}>
                  <Form.Item
                    label={L("CANCELL_RESERVABLE_DAY")}
                    name="expireDay"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      className="w-100"
                      placeholder={L("")}
                    ></InputNumber>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 12, offset: 0 }}>
                  <Button className="button-primary" onClick={this.handleSave}>
                    {L("SAVE")}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Spin>
      </>
    )
  }
}

export default withRouter(OtherConfigSetting)
