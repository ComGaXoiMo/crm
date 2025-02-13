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
import { formatNumber, handleDownloadPdf, tableToExcel } from "@lib/helper"
import AppConsts from "@lib/appconst"
const { align } = AppConsts
interface Props {
  visible: boolean
  dataTable: any
  userStore: UserStore
  projectStore: ProjectStore
  onClose: () => void
  isDropped: boolean
  isTotalLACard: boolean
}

interface State {
  skipCount: number
}

@inject(Stores.UserStore, Stores.ProjectStore)
@observer
class RevenueModal extends AppComponentListBase<Props, State> {
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
    const { visible, dataTable, onClose, isTotalLACard } = this.props

    const columns = [
      {
        title: L("REFERENCE_NUMBER"),
        dataIndex: "ReferenceNumber",
        key: "ReferenceNumber",
        width: 250,
        ellipsis: false,

        render: (ReferenceNumber: any) => ReferenceNumber,
      },
      {
        title: L("UNIT_NAME"),
        dataIndex: "UnitName",
        key: "UnitName",
        width: 120,
        ellipsis: false,
        render: (UnitName: any) => UnitName,
      },

      {
        title: L("COMMENCEMENT_DATE"),
        dataIndex: "CommencementDate",
        key: "CommencementDate",
        width: 135,
        ellipsis: false,
        align: align.center,
        render: this.renderDate,
      },
      {
        title: L("TERMINATION_DATE"),
        dataIndex: "TerminationDate",
        key: "TerminationDate",
        width: isTotalLACard ? 135 : 0,
        ellipsis: true,
        align: align.center,
        render: this.renderDate,
      },
      {
        title: L("EXPIRY_DATE"),
        dataIndex: "ExpiryDate",
        key: "ExpiryDate",
        width: 170,
        ellipsis: false,
        align: align.center,
        render: this.renderDate,
      },
      {
        title: this.props.isDropped ? L("LA_STATUS_NAME") : L("STATUS_NAME"),
        dataIndex: this.props.isDropped ? "LAStatusName" : "StatusName",
        key: this.props.isDropped ? "LAStatusName" : "StatusName",
        width: 150,
        ellipsis: false,
        align: this.props.isDropped ? align.left : align.left,
        render: (data: any) => data,
      },
      {
        title: L("TOTAL_CONTRACT_VALUE_EXCL_VAT"),
        dataIndex: "ContractAmount",
        key: "ContractAmount",
        width: 180,
        ellipsis: false,
        align: align.right,
        render: (ContractAmount: any) => formatNumber(ContractAmount),
      },
      {
        title: L("AMOUNT_PER_DAY"),
        dataIndex: "AmountPerDay",
        key: "AmountPerDay",
        width: isTotalLACard ? 135 : 0,
        ellipsis: false,
        align: align.right,
        render: (AmountPerDay: any) => formatNumber(AmountPerDay),
      },
      {
        title: L("TOTAL_DAY"),
        dataIndex: "TotalDay",
        key: "TotalDay",
        width: isTotalLACard ? 120 : 0,
        ellipsis: true,
        align: align.right,
        render: (TotalDay: any) => formatNumber(TotalDay),
      },
      {
        title: L("TYPE"),
        dataIndex: "DateType",
        key: "DateType",
        width: 150,
        ellipsis: false,
        align: align.center,
        render: (DateType: any) => L(DateType),
      },
    ]

    return (
      this.props.visible && (
        <Modal
          title={L("DATA_REVIEW")}
          visible={visible}
          maskClosable={false}
          width={"86%"}
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
              scroll={{ x: 300, y: 500, scrollToFirstRowOnChange: true }}
            />
          </Col>
        </Modal>
      )
    )
  }
}
export default withRouter(RevenueModal)
