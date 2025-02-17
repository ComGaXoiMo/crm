import { L } from "@lib/abpUtility"
import { Col, Modal, Row, Table } from "antd"
import React from "react"
import Form from "antd/lib/form"
// import { portalLayouts } from "@components/Layout/Router/router.config";
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import NotificationTemplateStore from "@stores/notificationTemplate/notificationTemplateStore"

import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import { validateMessages } from "@lib/validation"
import AppConsts from "@lib/appconst"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"

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
  loading: boolean
  visible: boolean
}
@inject(Stores.NotificationTemplateStore, Stores.LeaseAgreementStore)
@observer
class ChooseLATemplateModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      filters: { KeyWord: "", isActive: true },
      dataItemplate: [] as any,
      visible: false,
      loading: false,
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
      notificationTypeId: notifiType.leaseAgreement,
      ...this.state.filters,
    })
  }

  gotoCreate = async (templateId?) => {
    const params = {
      id: this.props.leaseAgreementId,
      templateId: templateId,
    }

    this.setState({ loading: true })
    await this.props.leaseAgreementStore
      .getLAExport(params)
      .finally(() => this.setState({ loading: false }))

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
    const { loading } = this.state
    return (
      <>
        <Modal
          open={visible}
          destroyOnClose
          width={"45%"}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
          title={L("CREATE_LEASE_AGREEMENT_EXPORT")}
          onCancel={() => {
            onClose()
          }}
        >
          <Form
            validateMessages={validateMessages}
            layout={"vertical"}
            ref={this.formRef}
            size="middle"
          >
            <Row gutter={[4, 0]}>
              <Col sm={{ span: 24 }}>
                {L("CHOOSE_ONE_TEMPLATE_TO_CREATE_LEASE_AGREEMENT")}
                <Table
                  size="middle"
                  className=""
                  // rowKey={(record) => record.id}
                  columns={columns}
                  loading={isLoading || loading}
                  dataSource={notificationTemplates ?? []}
                  pagination={false}
                />
              </Col>
            </Row>
          </Form>
        </Modal>
        <ExportFDReview
          formValue={this.props.leaseAgreementStore.leaseAgreementExportDetail}
          title={L("EXPORT_LEASE_AGREEMENT")}
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
export default withRouter(ChooseLATemplateModal)
