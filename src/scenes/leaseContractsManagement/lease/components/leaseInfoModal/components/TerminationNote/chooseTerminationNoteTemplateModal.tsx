import { L } from "@lib/abpUtility"
import { Col, DatePicker, InputNumber, Modal, Row, Select, Table } from "antd"
import React from "react"
import Form from "antd/lib/form"
// import { portalLayouts } from "@components/Layout/Router/router.config";
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import NotificationTemplateStore from "@stores/notificationTemplate/notificationTemplateStore"

import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import _, { debounce } from "lodash"
import { validateMessages } from "@lib/validation"
import AppConsts, { dateFormat } from "@lib/appconst"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import dayjs from "dayjs"
import {
  filterOptions,
  inputCurrencyFormatter,
  renderOptions,
} from "@lib/helper"
import ExportFDReview from "../BookingForm/exportFDReview"
const { notifiType } = AppConsts

interface Props {
  visible: boolean
  leaseAgreementId: any
  onClose: () => void
  notificationTemplateStore: NotificationTemplateStore
  leaseAgreementStore: LeaseAgreementStore
}

interface State {
  maxResultCount: number
  skipCount: number
  filters: any
  dataItemplate: any[]
  visible: boolean
}
@inject(Stores.NotificationTemplateStore, Stores.LeaseAgreementStore)
@observer
class ChooseTerminationNoteTemplateModal extends AppComponentListBase<
  Props,
  State
> {
  formRef: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      filters: { KeyWord: "", isActive: true },
      dataItemplate: [] as any,
      visible: false,
    }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.getTemplate()
        this.getListLA()
      }
    }
  }

  getListLA = async (keyword?) => {
    this.props.leaseAgreementStore.getAllForSelect({
      keyword: keyword,
      isActive: true,
      maxResultCount: 10,
      skipCount: 0,
    })
  }
  getTemplate = async () => {
    await this.props.notificationTemplateStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      notificationTypeId: notifiType.terminateNote,
      ...this.state.filters,
    })
  }

  gotoCreate = async (templateId?) => {
    const formValue = await this.formRef.current?.validateFields()

    const params = {
      ...formValue,
      createTerminationDate: dayjs(formValue.createTerminationDate).toJSON(),
      terminationDate: dayjs(formValue.terminationDate).toJSON(),
      depositTransSignDate: dayjs(formValue.depositTransSignDate).toJSON(),
      id: this.props.leaseAgreementId,
      templateId: templateId,
      depositTransNo: this.props.leaseAgreementStore?.listLASelect.find(
        (item) => item.id === formValue?.depositTransNo
      )?.name,
    }

    await this.props.leaseAgreementStore.getTerminationNote(params)

    await this.setState({ visible: true })
  }
  onCloseReview = () => {
    this.setState({ visible: false })
    // this.props.onClose();
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
      leaseAgreementStore: { listLASelect },
    } = this.props
    // const { dataItemplate } = this.state;
    return (
      <>
        <Modal
          open={visible}
          destroyOnClose
          width={"45%"}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
          title={L("CREATE_TERMINATION_NOTE")}
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
                  label={L("DATE")}
                  name="createTerminationDate"
                >
                  <DatePicker className="w-100" format={dateFormat} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("TERMINATION_DATE")}
                  name="terminationDate"
                >
                  <DatePicker className="w-100" format={dateFormat} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item label={L("REFUND_AMONT")} name="refundAmount">
                  <InputNumber
                    min={0}
                    className="w-100"
                    formatter={(value) => inputCurrencyFormatter(value)}
                  />
                </Form.Item>
              </Col>{" "}
              <Col sm={{ span: 24 }}>
                <Form.Item label={L("FORFEIT_AMONT")} name="forfeitAmount">
                  <InputNumber
                    min={0}
                    className="w-100"
                    formatter={(value) => inputCurrencyFormatter(value)}
                  />
                </Form.Item>
              </Col>{" "}
              <Col sm={{ span: 24 }}>
                <Form.Item label={L("OFFSET_AMONT")} name="offsetAmount">
                  <InputNumber
                    min={0}
                    className="w-100"
                    formatter={(value) => inputCurrencyFormatter(value)}
                  />
                </Form.Item>
              </Col>{" "}
              <Col sm={{ span: 24 }}>
                <Form.Item label={L("TRANSFER_AMONT")} name="transferAmount">
                  <InputNumber
                    min={0}
                    className="w-100"
                    formatter={(value) => inputCurrencyFormatter(value)}
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  label={L("DEPOSIT_TO_BE_TRANSFERRED_TO_LA")}
                  name="depositTransNo"
                >
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    allowClear
                    // disabled={!this.props.isEdit}
                    filterOption={filterOptions}
                    className="full-width"
                    onSearch={debounce((e) => this.getListLA(e), 1000)}
                  >
                    {renderOptions(listLASelect)}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  label={L("LA_RECEIVES_THE_TRANSFERRED_TO_LA")}
                  name="depositTransSignDate"
                >
                  <DatePicker className="w-100" format={dateFormat} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                {L("CHOOSE_ONE_TEMPLATE_TO_CREATE_TERMINATION_NOTE")}
                <Table
                  size="middle"
                  className=""
                  // rowKey={(record) => record.id}
                  columns={columns}
                  loading={isLoading}
                  dataSource={notificationTemplates ?? []}
                  pagination={false}
                />
              </Col>
            </Row>
          </Form>
        </Modal>
        <ExportFDReview
          formValue={this.props.leaseAgreementStore.terminationNoteDetail}
          title={L("EXPORT_TERMINATION_NOTE")}
          fileName={
            this.props.leaseAgreementStore.leaseAgreementDetail?.referenceNumber
          }
          visible={this.state.visible}
          onClose={this.onCloseReview}
        />
      </>
    )
  }
}
export default withRouter(ChooseTerminationNoteTemplateModal)
