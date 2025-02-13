import { L } from "@lib/abpUtility"
import { Col, DatePicker, Form, InputNumber, Modal, Row, Select } from "antd"
import React from "react"
// import { portalLayouts } from "@components/Layout/Router/router.config";
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"

import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import _ from "lodash"
import { validateMessages } from "@lib/validation"
import { dateFormat } from "@lib/appconst"
import moment from "moment"
import {
  filterOptions,
  formatNumber,
  inputCurrencyFormatter,
  renderOptions,
} from "@lib/helper"
import FormInput from "@components/FormItem/FormInput"
import DepositStore from "@stores/activity/depositStore"
import { FormInstance } from "antd/es/form/Form"
import AppDataStore from "@stores/appDataStore"
import TextArea from "antd/lib/input/TextArea"

interface Props {
  visible: boolean
  leaseAgreementId: any
  onClose: () => void
  onCreate: () => void
  depositStore: DepositStore
  appDataStore: AppDataStore
}

interface State {
  visible: boolean
}
@inject(Stores.DepositStore, Stores.AppDataStore)
@observer
class CreateRefundModal extends AppComponentListBase<Props, State> {
  formRef = React.createRef<FormInstance>()

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.initData()
      }
    }
  }

  initData = async () => {
    console.log()
  }

  gotoCreate = async () => {
    const formValue = await this.formRef.current?.validateFields()

    const params = {
      ...formValue,
      leaseAgreementId: this.props.leaseAgreementId,
      voucherDate: formValue.voucherDate
        ? moment(formValue.voucherDate).toJSON()
        : undefined,
    }
    await this.props.depositStore.createOrUpdateRefund(params)
    await this.props.onCreate()
    this.setState({ visible: true })
  }
  onCloseReview = () => {
    this.setState({ visible: false })
    // this.props.onClose();
  }
  render(): React.ReactNode {
    const { visible, onClose } = this.props

    const {
      appDataStore: { depositRefundTypes },
      depositStore: { dashboardDeposit },
    } = this.props

    const maxRefundInput =
      dashboardDeposit?.totalCollected - dashboardDeposit?.totalRefund
    // const { dataItemplate } = this.state;
    return (
      this.props.visible && (
        <>
          <Modal
            open={visible}
            destroyOnClose
            width={"45%"}
            title={L("REFUND")}
            onCancel={() => {
              onClose()
            }}
            onOk={this.gotoCreate}
            //   confirmLoading={isLoading}
          >
            <Form
              validateMessages={validateMessages}
              layout={"vertical"}
              ref={this.formRef}
              size="middle"
            >
              <Row gutter={[4, 0]}>
                <Col sm={{ span: 24, offset: 0 }}>
                  <FormInput label={L("VOUCHER_NO")} name={"voucherNo"} />
                </Col>
                <Col sm={{ span: 24 }}>
                  <Form.Item label={L("VOUCHER_DATE")} name="voucherDate">
                    <DatePicker className="w-100" format={dateFormat} />
                  </Form.Item>
                </Col>
                <Col sm={{ span: 24 }}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                      },
                      {
                        validator: (rule, value) => {
                          if (value <= maxRefundInput) {
                            return Promise.resolve()
                          }
                          return Promise.reject(
                            `${L("MAX_REFUND_IS")} ${formatNumber(
                              maxRefundInput
                            )}`
                          )
                        },
                      },
                    ]}
                    label={L("REFUND_AMOUNT")}
                    name="refundAmount"
                  >
                    <InputNumber
                      min={0}
                      className="w-100"
                      formatter={(value) => inputCurrencyFormatter(value)}
                    />
                  </Form.Item>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <Form.Item
                    label={L("REFUND_DESCRIPTION")}
                    name={["refundTypeIds"]}
                    rules={[{ required: true }]}
                  >
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showSearch
                      allowClear
                      filterOption={filterOptions}
                      className="full-width"
                      mode="multiple"
                    >
                      {renderOptions(depositRefundTypes)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <Form.Item
                    label={L("REMARK")}
                    name="remark"
                    rules={[{ required: false }, { max: 1000 }]}
                  >
                    <TextArea rows={2} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </>
      )
    )
  }
}
export default withRouter(CreateRefundModal)
