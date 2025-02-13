import { L } from "@lib/abpUtility"
import { Col, DatePicker, Modal, Row, Table } from "antd"
import React from "react"
import Form from "antd/lib/form"
// import { portalLayouts } from "@components/Layout/Router/router.config";
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import NotificationTemplateStore from "@stores/notificationTemplate/notificationTemplateStore"

import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import _ from "lodash"
import { validateMessages } from "@lib/validation"
import AppConsts, { dateFormat } from "@lib/appconst"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import dayjs from "dayjs"
import ExportFDReview from "./exportFDReview"
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
class ChooseBFTemplateModal extends AppComponentListBase<Props, State> {
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
        await this.getTemplate()
      }
    }
  }
  getTemplate = async () => {
    await this.props.notificationTemplateStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      notificationTypeId: notifiType.bookingForm,
      ...this.state.filters,
    })
  }

  gotoCreate = async (templateId?) => {
    const formValue = await this.formRef.current?.validateFields()

    const params = {
      bookingDate: dayjs(formValue.bookingDate).toJSON(),
      id: this.props.leaseAgreementId,
      templateId: templateId,
    }
    console.log(params)
    await this.props.leaseAgreementStore.getBookingForm(params)

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
          title={L("SELECT_BOOKING_FORM_TEMPLATE")}
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
                  label={L("BOOKING_DATE")}
                  name="bookingDate"
                >
                  <DatePicker className="w-100" format={dateFormat} />
                </Form.Item>
              </Col>

              <Col sm={{ span: 24 }}>
                {L("CHOOSE_ONE_TEMPLATE_TO_CREATE_BOOKING_FORM")}
                <Table
                  size="middle"
                  className="custom-ant-table"
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
          formValue={this.props.leaseAgreementStore.bookingDataDetail}
          title={L("EXPORT_BOOKING_FORM")}
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
export default withRouter(ChooseBFTemplateModal)
