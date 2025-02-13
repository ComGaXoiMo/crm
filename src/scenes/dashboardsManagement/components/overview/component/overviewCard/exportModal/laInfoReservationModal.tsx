import { L } from "@lib/abpUtility"
import { Button, Col, Modal, Table } from "antd"
import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import UserStore from "@stores/administrator/userStore"
import _ from "lodash"
import ProjectStore from "@stores/projects/projectStore"
import { handleDownloadPdf, tableToExcel } from "@lib/helper"
interface Props {
  visible: boolean
  dataTable: any
  userStore: UserStore
  projectStore: ProjectStore
  onClose: () => void
}

interface State {
  skipCount: number
}

@inject(Stores.UserStore, Stores.ProjectStore)
@observer
class LaInfoReservationModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef()
  printRef: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      skipCount: 0,
    }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        console.log()
      }
    }
  }
  handleDownloadPdfs = async (type) => {
    const element = this.printRef.current
    await handleDownloadPdf(element, type, "CommissionDashboard.pdf")
  }
  render(): React.ReactNode {
    const { visible, dataTable, onClose } = this.props

    const columns = [
      {
        title: L("INQUIRY_NAME"),
        dataIndex: "InquiryName",
        key: "InquiryName",
        width: 250,
        ellipsis: false,
        render: (InquiryName: any) => InquiryName,
      },
      {
        title: L("UNIT_NAME"),
        dataIndex: "UnitName",
        key: "UnitName",
        width: 150,
        ellipsis: false,
        render: (UnitName: any) => UnitName,
      },
      {
        title: L("CONTACT_NAME"),
        dataIndex: "ContactName",
        key: "ContactName",
        width: 170,
        ellipsis: false,
        render: (ContactName: any) => ContactName,
      },
      {
        title: L("Inquiry status"),
        dataIndex: "InquiryStatus",
        key: "InquiryStatus",
        width: 170,
        ellipsis: false,
        render: (InquiryStatus: any) => InquiryStatus,
      },

      {
        title: L("TYPE"),
        dataIndex: "DateType",
        key: "DateType",
        width: 130,
        ellipsis: false,
        render: (DateType: any) => L(DateType),
      },
    ]

    return (
      this.props.visible && (
        <Modal
          title={L("DATA_REVIEW")}
          visible={visible}
          maskClosable={false}
          width={"66%"}
          // onOk={() => tableToExcel("tblDepositReport")}
          // onCancel={onClose}
          closable={false}
          footer={
            <div className="flex justify-content-center">
              <div>
                <Button onClick={onClose}>{L("BTN_CANCEL")}</Button>
                <Button
                  className="button-primary"
                  onClick={() => tableToExcel("excel")}
                >
                  {L("BTN_EXPORT_EXCEL")}
                </Button>
              </div>
            </div>
          }
        >
          <Col sm={{ span: 24 }} id="excel">
            <Table
              size="middle"
              className="custom-ant-row"
              rowKey={(record, index) => `${record?.id}${index}`}
              columns={columns}
              pagination={false}
              dataSource={dataTable ?? []}
              scroll={{ x: 100, y: 500, scrollToFirstRowOnChange: true }}
            />
          </Col>
        </Modal>
      )
    )
  }
}
export default withRouter(LaInfoReservationModal)
