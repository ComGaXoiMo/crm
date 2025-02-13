import { L } from "@lib/abpUtility"
import { Button, Col, Form, Modal, Row, Table } from "antd"
import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import _ from "lodash"
import DataTable from "@components/DataTable"
import AppConsts from "@lib/appconst"
import FormInput from "@components/FormItem/FormInput"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
const { align } = AppConsts
interface Props {
  visible: boolean
  onClose: () => void
  onOk: (params) => void
  unitInfo: any
  leaseAgreementStore: LeaseAgreementStore
}

interface State {
  maxResultCount: number
  skipCount: number
  filter: any
}

@inject(Stores.LeaseAgreementStore)
@observer
class UnitStatusModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      filter: {
        isAcive: true,
      },
      maxResultCount: 10,
      skipCount: 0,
    }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        console.log(this.props.unitInfo)
        this.formRef.current?.setFieldsValue(this.props.unitInfo[0])
        this.getAll()
      }
    }
  }
  getAll = () => {
    this.props.leaseAgreementStore.getLaByUnit({
      unitId: this.props.unitInfo[0]?.unitId,
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      isIncludeHistory: false,
      ...this.state.filter,
    })
  }
  render(): React.ReactNode {
    const {
      visible,
      onClose,
      leaseAgreementStore: { listLaByUnit },
    } = this.props

    const columns = [
      {
        title: L("LEASE_AGREEMENT_NAME"),
        dataIndex: "referenceNumber",
        key: "referenceNumber",
        width: 200,
        ellipsis: false,
        render: (referenceNumber: any) => referenceNumber,
      },
      {
        title: L("CONTACT_NAME"),
        dataIndex: "contactId",
        key: "contactId",
        width: 200,
        align: align.left,
        ellipsis: false,
        render: (contactId, row) => row.contact?.contactName,
      },
      {
        title: L("DEALER"),
        dataIndex: "dealer",
        key: "dealer",
        width: 200,
        ellipsis: false,
        render: (dealer, row) =>
          row.leaseAgreementUserIncharge?.find((item) => item.positionId === 0)
            ?.user?.displayName,
      },
      {
        title: L("COMMENCEMENT_DATE"),
        dataIndex: "commencementDate",
        key: "commencementDate",
        width: 150,
        align: align.center,
        ellipsis: false,
        render: this.renderDate,
      },
      {
        title: L("EXPIRY_DATE"),
        dataIndex: "expiryDate",
        key: "expiryDate",
        width: 150,
        align: align.center,
        ellipsis: false,
        render: this.renderDate,
      },
    ]

    return (
      this.props.visible && (
        <Modal
          style={{ top: 20 }}
          title={L("UNIT_INFORMATION")}
          visible={visible}
          // visible={true}
          width={"60%"}
          // onCancel={onClose}
          closable={false}
          footer={[
            <Button key="back" onClick={onClose}>
              {L("GO_BACK")}
            </Button>,
          ]}
        >
          <Form ref={this.formRef} layout={"vertical"} size="middle">
            <div className="w-100">
              <Row gutter={[16, 0]} style={{ alignItems: "center" }}>
                <Col sm={{ span: 12, offset: 0 }}>
                  <FormInput
                    label={L("PROJECT")}
                    name={["unit", "projectName"]}
                    disabled
                  />
                </Col>
                <Col sm={{ span: 12, offset: 0 }}>
                  <FormInput
                    label={L("UNIT_NO")}
                    name={["unit", "unitName"]}
                    disabled
                  />
                </Col>
                <Col sm={{ span: 24 }}>
                  <DataTable
                    pagination={{
                      pageSize: this.state.maxResultCount,
                      total:
                        listLaByUnit === undefined
                          ? 0
                          : listLaByUnit.totalCount,
                      // onChange: this.handleTableChange,
                    }}
                  >
                    <Table
                      size="middle"
                      className="custom-ant-row"
                      rowKey={(record) => record.id}
                      columns={columns}
                      pagination={false}
                      dataSource={listLaByUnit.items ?? []}
                      // loading={}
                      scroll={{ x: 600, scrollToFirstRowOnChange: true }}
                    />
                  </DataTable>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(UnitStatusModal)
