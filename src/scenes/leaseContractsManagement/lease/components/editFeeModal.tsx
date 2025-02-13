import { L } from "@lib/abpUtility"
import { Col, Form, InputNumber, Modal, Row, Select } from "antd"
import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import _ from "lodash"
import {
  filterOptions,
  inputNumberFormatter,
  renderOptions,
} from "@lib/helper"
// import FormTextArea from "@components/FormItem/FormTextArea";
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
interface Props {
  visible: boolean;
  onClose: () => void;
  onOk: (params) => void;
  dataToEditFee: any;
  leaseAgreementStore: LeaseAgreementStore;
}

interface State {
  dataToGenerate: any[];
}

@inject(Stores.LeaseAgreementStore)
@observer
class EditFeeModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      dataToGenerate: [] as any,
    }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        const genrData = [] as any
        this.props.dataToEditFee.map((item, index) => {
          this.props.dataToEditFee[
            index
          ]?.leaseAgreementPaymentScheduleDetails?.map((feeType) =>
            genrData.push({
              amount: feeType.amount,
              feeTypeId: feeType.feeTypeId,
              startDate: item?.startDate,
              endDate: item?.endDate,
              rowIndex: index,
            })
          )
        })
        this.setState({ dataToGenerate: genrData })
      }
    }
  }
  onOk = async () => {
    const form = await this.formRef.current?.validateFields()
    const dataByType = await this.state.dataToGenerate.filter(
      (item) => item.feeTypeId === form?.feeTypeId
    )
    const dataAddNewAmount = await dataByType.map((item) => {
      return { ...item, amountIncludeVat: form?.newValue }
    })
    await this.props.leaseAgreementStore.genVATAmountByFeeType(
      dataAddNewAmount
    )
    const initData = [...this.props.dataToEditFee]
    await initData.map((parentValue, index) => {
      const feeItem = this.props.leaseAgreementStore.paymentGenerate.find(
        (item) =>
          item.startDate === parentValue.startDate &&
          item.endDate === parentValue.endDate
      )
      const indexLAScheduleDetail = initData[
        index
      ].leaseAgreementPaymentScheduleDetails.findIndex(
        (va) => va?.feeTypeId === feeItem?.feeTypeId
      )
      initData[index].leaseAgreementPaymentScheduleDetails[
        indexLAScheduleDetail
      ] = {
        ...initData[index].leaseAgreementPaymentScheduleDetails[
          indexLAScheduleDetail
        ],
        amount: feeItem.amount,
        amountIncludeVat: feeItem.amountIncludeVat,
        vatAmount: feeItem.vatAmount,
      }
    })
    const laTb = initData.map((item) => {
      return {
        ...item,
        amount: _.reduce(
          item.leaseAgreementPaymentScheduleDetails,
          function (sum, n) {
            return sum + n.amountIncludeVat
          },
          0
        ),
      }
    })
    await this.props.leaseAgreementStore.createOrUpdatePaymentSchedule(laTb)
    this.props.onOk("")
  };
  render(): React.ReactNode {
    const { visible, onClose } = this.props

    return (
      this.props.visible && (
        <Modal
          title={
            <div>
              <Row gutter={[8, 8]} style={{ alignItems: "center" }}>
                <Col sm={{ span: 24 }}>
                  <strong>{L("CHANGE_FEE_AMOUNT")}</strong>
                </Col>
                <Col sm={{ span: 24 }}>
                  <label>{L("YOU_CAN_ONLY_UPDATE_THE_UNPAID_FEES")}</label>
                </Col>
              </Row>
            </div>
          }
          visible={visible}
          // visible={true}
          width={"30%"}
          onOk={() => this.onOk()}
          onCancel={onClose}
          closable={false}
        >
          <Form ref={this.formRef} layout={"vertical"} size="middle">
            <div className="w-100">
              <Row gutter={[8, 0]} style={{ alignItems: "center" }}>
                <Col sm={{ span: 24 }}>
                  <Form.Item
                    rules={[{ required: true }]}
                    label={L("FEE_TYPE")}
                    name="feeTypeId"
                  >
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showSearch
                      allowClear
                      filterOption={filterOptions}
                      className="full-width"
                    >
                      {renderOptions(
                        this.props.leaseAgreementStore.listFeeType.filter(
                          (item) => item.typeId === 0 || item.typeId === 1
                        )
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                {/* <Col sm={{ span: 24 }}>
                  <Form.Item label={L("OLD_VALUE")} name="oldValue">
                    <InputNumber className="full-width" />
                  </Form.Item>
                </Col> */}
                <Col sm={{ span: 24 }}>
                  <Form.Item
                    label={L("NEW_VALUE")}
                    name="newValue"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      formatter={(value) => inputNumberFormatter(value)}
                      className="full-width"
                    />
                  </Form.Item>
                </Col>
                {/* <Col sm={{ span: 24 }}>
                  <FormTextArea label={L("REASON")} name="reason" />
                </Col> */}
              </Row>
            </div>
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(EditFeeModal)
