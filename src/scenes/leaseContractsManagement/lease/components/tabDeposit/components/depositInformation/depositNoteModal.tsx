import { L } from "@lib/abpUtility"
import { Col, DatePicker, Modal, Row, Select, Table } from "antd"
import React from "react"
import Form from "antd/lib/form"
// import { portalLayouts } from "@components/Layout/Router/router.config";
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"

import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import _ from "lodash"
import { validateMessages } from "@lib/validation"
import AppConsts, { dateFormat } from "@lib/appconst"
import moment from "moment"
import { inputCurrencyFormatter, renderOptions } from "@lib/helper"
import DepositStore from "@stores/activity/depositStore"
import NotificationTemplateStore from "@stores/notificationTemplate/notificationTemplateStore"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import DocxReview from "@components/SynfusionReview/docxReview"
const { notifiType } = AppConsts

interface Props {
  visible: boolean
  leaseAgreementId: any
  onClose: () => void
  depositStore: DepositStore
  notificationTemplateStore: NotificationTemplateStore
  leaseAgreementStore: LeaseAgreementStore
}

interface State {
  visible: boolean
  listDeposit: any[]
  maxResultCount: number
  skipCount: number
  filters: any
}
@inject(
  Stores.DepositStore,
  Stores.NotificationTemplateStore,
  Stores.LeaseAgreementStore
)
@observer
class DepositNoteModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      listDeposit: [] as any,
      maxResultCount: 10,
      skipCount: 0,
      filters: { KeyWord: "", isActive: true },
    }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.getDepositList()
        this.getTemplate()
      }
    }
  }
  getTemplate = async () => {
    await this.props.notificationTemplateStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      notificationTypeId: notifiType.deposit,
      ...this.state.filters,
    })
  }
  getDepositList = async () => {
    const listDeposit = this.props.depositStore.tableDepositData.map((item) => {
      return {
        id: item?.id,
        label: inputCurrencyFormatter(item?.depositAmount),
        disabled: !item.isActive,
      }
    })
    this.setState({ listDeposit })
  }
  onCloseReview = () => {
    this.setState({ visible: false })
    // this.props.onClose();
  }
  gotoCreate = async (templateId?) => {
    const formValue = await this.formRef.current?.validateFields()

    const params = {
      depositDate: moment(formValue.depositDate).toJSON(),
      payableDate: moment(formValue.payableDate).toJSON(),
      id: formValue.id,
      templateId: templateId,
    }
    await this.props.leaseAgreementStore.getDepositForm(params)

    await this.setState({ visible: true })
  }
  render(): React.ReactNode {
    const { visible, onClose } = this.props
    const columns = [
      {
        title: L("TITLE"),
        dataIndex: "notificationTemplate",
        key: "notificationTemplate",
        // ellipsis: false,
        render: (notificationTemplate, item: any) => (
          <Row>
            <Col sm={{ span: 21, offset: 0 }}>
              <a
                // onClick={() => {
                //   Modal.confirm({
                //     title: L("CREATE_BOOKING_FORM_WITH_ThIS_TEMPLATE"),
                //     onOk: () => this.gotoCreate(item.notificationTemplate.id),
                //   });
                // }}
                onClick={() => this.gotoCreate(item?.id)}
                className="link-text-table"
              >
                {notificationTemplate?.subject}
              </a>
            </Col>
          </Row>
        ),
      },
    ]
    const {
      notificationTemplateStore: { isLoading, notificationTemplates },
    } = this.props
    const { listDeposit } = this.state
    // const { dataItemplate } = this.state;
    return (
      <>
        <Modal
          open={visible}
          destroyOnClose
          width={"45%"}
          title={L("CREATE_DEPOSIT_NOTE")}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
          onCancel={() => {
            onClose()
          }}
          confirmLoading={isLoading}
        >
          <Form
            validateMessages={validateMessages}
            layout={"vertical"}
            ref={this.formRef}
            size="middle"
          >
            <Row gutter={[4, 0]}>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("DATE_OF_ISSUE")}
                  name="depositDate"
                >
                  <DatePicker
                    onChange={(value) => {
                      this.formRef.current?.setFieldValue(
                        "payableDate",
                        moment(value).add(3, "days")
                      )
                    }}
                    className="w-100"
                    format={dateFormat}
                  />
                </Form.Item>
              </Col>

              <Col sm={{ span: 24 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("CURRENT_DEPOSIT_AMOUNT")}
                  name="id"
                >
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    // showSearch
                    allowClear
                    filterOption={false}
                    className="full-width"
                    // onSearch={debounce((e) => this.getCompany(e), 1000)}
                  >
                    {renderOptions(listDeposit)}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("DEPOSIT_PAY_ON_FOR_BEFORE_DATE")}
                  name="payableDate"
                >
                  <DatePicker
                    placeholder={L("DATE_OF_ISSUE_ADD_3")}
                    className="w-100"
                    format={dateFormat}
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                {L("CHOOSE_ONE_TEMPLATE_TO_CREATE_DEPOSIT")}
                <Table
                  size="middle"
                  className="custom-ant-table"
                  rowKey={(record, index) => `${record?.id}_${index}`}
                  columns={columns}
                  loading={isLoading}
                  dataSource={notificationTemplates ?? []}
                  pagination={false}
                />
              </Col>
            </Row>
          </Form>
        </Modal>
        <DocxReview
          formValue={this.props.leaseAgreementStore.depositDataDetail}
          fileName={`deposit_${this.props.leaseAgreementStore.leaseAgreementDetail?.referenceNumber}`}
          visible={this.state.visible}
          onClose={this.onCloseReview}
        />
      </>
    )
  }
}
export default withRouter(DepositNoteModal)
