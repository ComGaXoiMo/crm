import { L } from "@lib/abpUtility"
import { Col, DatePicker, Form, InputNumber, Modal, Row } from "antd"
import React from "react"
// import { portalLayouts } from "@components/Layout/Router/router.config";
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"

import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import _ from "lodash"
import { validateMessages } from "@lib/validation"
import { dateFormat } from "@lib/appconst"
import dayjs from "dayjs"
import { formatNumber, inputCurrencyFormatter } from "@lib/helper"
import FormInput from "@components/FormItem/FormInput"
import DepositStore from "@stores/activity/depositStore"
import { FormInstance } from "antd/es/form/Form"
import TextArea from "antd/lib/input/TextArea"

interface Props {
  visible: boolean
  leaseAgreementId: any
  onClose: () => void
  onCreate: () => void
  depositStore: DepositStore
}

interface State {
  data: any
}
@inject(Stores.DepositStore)
@observer
class CollectDepositModal extends AppComponentListBase<Props, State> {
  formRef = React.createRef<FormInstance>()

  constructor(props) {
    super(props)
    this.state = { data: undefined }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.initData()
      }
    }
  }

  initData = async () => {
    const { depositDetail } = this.props.depositStore
    const initValue = {
      leaseAgreementDeposit: `${depositDetail?.id} - ${formatNumber(
        depositDetail?.depositAmount
      )}VND`,
    }

    this.formRef?.current?.setFieldsValue({
      ...initValue,
    })
  }

  gotoCreate = async () => {
    const formValue = await this.formRef.current?.validateFields()

    const params = {
      ...formValue,
      leaseAgreementDepositId: this.props.depositStore.depositDetail?.id,
      leaseAgreementId: this.props.leaseAgreementId,
      receiptDate: formValue.receiptDate
        ? dayjs(formValue.receiptDate).toJSON()
        : undefined,
      paymentDate: formValue.paymentDate
        ? dayjs(formValue.paymentDate).toJSON()
        : undefined,
    }
    await this.props.depositStore.createOrUpdateCollect(params)

    await this.props.onCreate()
  }
  onCloseReview = () => {
    // this.props.onClose();
  }
  render(): React.ReactNode {
    const {
      visible,
      onClose,
      depositStore: { depositDetail },
    } = this.props

    // const { dataItemplate } = this.state;
    const maxAmount =
      depositDetail?.depositAmount - depositDetail?.collectAmount
    return (
      this.props.visible && (
        <>
          <Modal
            open={visible}
            destroyOnClose
            width={"45%"}
            title={L("COLLECT_DEPOSIT")}
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
                  <FormInput
                    label={L("DEPOSIT_ID")}
                    name={"leaseAgreementDeposit"}
                    disabled
                  />
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <FormInput
                    rule={[{ required: false }, { max: 100 }]}
                    label={L("RECEIPT_NO")}
                    name={"receiptNo"}
                  />
                </Col>
                <Col sm={{ span: 24 }}>
                  <Form.Item
                    rules={[{ required: false }]}
                    label={L("RECEIPT_DATE")}
                    name="receiptDate"
                  >
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
                          if (value <= maxAmount) {
                            return Promise.resolve()
                          }
                          return Promise.reject(
                            L("THE_VALUE_MUST_BE_LESS_THAN_DEPOSIT_AMOUNT")
                          )
                        },
                      },
                    ]}
                    label={L("CURRENT_DEPOSIT_AMOUNT_VND")}
                    name="receiptAmount"
                  >
                    <InputNumber
                      min={0}
                      className="w-100"
                      formatter={(value) => inputCurrencyFormatter(value)}
                    />
                  </Form.Item>
                </Col>
                <Col sm={{ span: 24 }}>
                  <Form.Item
                    rules={[{ required: false }]}
                    label={L("PAYMENT_DATE")}
                    name="paymentDate"
                  >
                    <DatePicker className="w-100" format={dateFormat} />
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
export default withRouter(CollectDepositModal)
