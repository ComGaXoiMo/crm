import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Button, Col, Row, Table, message } from "antd"
import Stores from "@stores/storeIdentifier"
// import FileUploadWrap from "@components/FileUpload/FileUploadCRM";
import withRouter from "@components/Layout/Router/withRouter"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import DataTable from "@components/DataTable"
import gettColumns from "./components/leaseColumn"
import CreateContractModal from "./components/createContractModal"
import { renderDotActive } from "@lib/helper"
import AppConsts, { appPermissions } from "@lib/appconst"
import EditContractModal from "./components/editContractModal"
import InquiryStore from "@stores/communication/inquiryStore"

const { leaseStage } = AppConsts
export interface IContractProps {
  projectId?: any
  contactId?: any
  inquiryId?: any
  inquiryStore: InquiryStore
  companyId?: any
  contactEmail?: any
  unitId?: any
  leaseAgreementStore: LeaseAgreementStore
}
export interface IContractState {
  modalVisible: boolean
  maxResultCount: any
  filters: any
  skipCount: number
  isIncludeHistory: boolean
  hasLA: boolean
  leaseAgreementId: any
  modalCreateVisible: boolean
}

@inject(Stores.LeaseAgreementStore, Stores.InquiryStore)
@observer
class Contract extends AppComponentListBase<IContractProps, IContractState> {
  formRef: any = React.createRef()
  formRefProjectAddress: any = React.createRef()

  constructor(props: IContractProps) {
    super(props)
    this.state = {
      leaseAgreementId: undefined,
      hasLA: false,
      modalVisible: false,
      modalCreateVisible: false,
      maxResultCount: 10,
      skipCount: 0,

      isIncludeHistory: false,
      filters: {
        isActive: true,
      },
    }
  }

  async componentDidUpdate(prevProps) {
    if (
      prevProps.projectId !== this.props.projectId ||
      prevProps.contactId !== this.props.contactId ||
      prevProps.unitId !== this.props.unitId ||
      prevProps.companyId !== this.props.companyId ||
      prevProps.inquiryId !== this.props.inquiryId
    ) {
      await this.setState({ isIncludeHistory: false })
      await this.getAll()
    }
    if (prevProps.contactEmail !== this.props.contactEmail) {
      console.log(this.props.contactEmail?.length > 0)
    }
  }
  async componentDidMount() {
    await Promise.all([this.props.leaseAgreementStore.getListFeeType("")])
    this.getAll()
  }
  handleFilterChange = (filters) => {
    this.setState({ filters }, this.getAll)
  }
  checkCanCreateLA = async () => {
    const check = this.props.leaseAgreementStore.pageResult.items.findIndex(
      (item) => item.stageId !== leaseStage?.drop
    )
    if (check > -1) {
      this.setState({ hasLA: true })
    } else {
      this.setState({ hasLA: false })
    }
  }
  getAll = async () => {
    await this.props.leaseAgreementStore.getAll({
      projectId: this.props.projectId,
      contactId: this.props.contactId,
      companyId: this.props.companyId,
      unitId: this.props.unitId,
      InquiryId: this.props.inquiryId,
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      isIncludeHistory: this.state.isIncludeHistory,
      ...this.state.filters,
    })
    // this.setState({ data: this.props.leaseAgreementStore.pageResult.items });
    await this.checkCanCreateLA()
  }
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        skipCount: (pagination.current - 1) * this.state.maxResultCount!,
        maxResultCount: pagination.pageSize,
      },
      async () => await this.getAll()
    )
  }

  changeViewFull = async () => {
    await this.setState({
      isIncludeHistory: !this.state.isIncludeHistory,
    })
    await this.getAll()
  }
  gotoDetail = async (id) => {
    if (id) {
      await this.props.leaseAgreementStore.get(id)
      await this.setState({ leaseAgreementId: id })
      this.toggleModal()
    }
  }
  toggleModalCreate = () =>
    this.setState((prevState) => ({
      modalCreateVisible: !prevState.modalCreateVisible,
    }))
  toggleModal = () =>
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))

  handleOk = async () => {
    this.getAll()
    this.toggleModal()
  }
  handleOkCreateLA = async () => {
    this.toggleModalCreate()
    await this.getAll()
    await this.props.inquiryStore.UpdateComplete(this.props.inquiryId)
    await this.props.inquiryStore.get(this.props.inquiryId)
  }
  public render() {
    const {
      leaseAgreementStore: { pageResult, isLoading },
    } = this.props
    const columns = gettColumns({
      title: this.L("REFERENCE_NUMBER"),
      dataIndex: "referenceNumber",
      key: "referenceNumber",
      width: 250,
      fixed: "left",
      ellipsis: false,

      render: (referenceNumber: string, item: any) => (
        <Row>
          <Col sm={{ span: 24, offset: 0 }}>
            <a
              onClick={
                this.isGranted(appPermissions.leaseAgreement.detail)
                  ? () => this.gotoDetail(item.id)
                  : () => console.log()
              }
              className="link-text-table"
            >
              {renderDotActive(item?.isActive)} {referenceNumber}
            </a>
          </Col>
        </Row>
      ),
    })
    return (
      <>
        <DataTable
          actionComponent={
            <>
              {this.props.inquiryId &&
                this.isGranted(appPermissions.leaseAgreement.requestLa) && (
                  <Button
                    // icon={<BorderOutlined />}
                    className="button-primary"
                    disabled={this.state.hasLA}
                    onClick={() => {
                      this.props.contactEmail?.length > 0
                        ? this.toggleModalCreate()
                        : message.warning(
                            this.L(
                              "CANNOT_REQUEST_LA_FOR_CONTACT_NOT_HAVE_EMAIL"
                            )
                          )
                    }}
                  >
                    {this.L("REQUEST_TO_LEASE_AGREEMENT")}
                  </Button>
                )}
              <Button
                className="button-primary"
                onClick={() => this.changeViewFull()}
              >
                {this.state.isIncludeHistory
                  ? this.L("HIDEN_HISTORY")
                  : this.L("VIEW_FULL_HISTORY")}
              </Button>{" "}
            </>
          }
          onRefresh={this.getAll}
          pagination={{
            pageSize: this.state.maxResultCount,
            total: pageResult === undefined ? 0 : pageResult.totalCount,
            onChange: this.handleTableChange,
          }}
        >
          <Table
            size="middle"
            className="custom-ant-row"
            rowKey={(record) => `lad-${record?.id}`}
            columns={columns}
            loading={isLoading}
            pagination={false}
            dataSource={pageResult.items ?? []}
            scroll={{ x: 1000, scrollToFirstRowOnChange: true }}
          />
        </DataTable>
        <CreateContractModal
          visible={this.state.modalCreateVisible}
          onClose={this.toggleModalCreate}
          onOk={this.handleOkCreateLA}
        />
        <EditContractModal
          leaseAgreementId={this.state.leaseAgreementId}
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={() => {
            this.toggleModal(), this.getAll()
          }}
        />
      </>
    )
  }
}

export default withRouter(Contract)
