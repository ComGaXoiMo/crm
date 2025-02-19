import * as React from "react"

import { inject, observer } from "mobx-react"
import DataTable from "@components/DataTable"
import gettColumns from "./components/leaseColumn"
import { Col, Dropdown, Menu, Modal, Row, Table } from "antd"
import AppDataStore from "@stores/appDataStore"
import { L, LNotification } from "@lib/abpUtility"
import LeaseFilterPanel from "./components/leaseFilterPanel"

import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"
import LeaseDetailModal from "./components/leaseDetailModal"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import { formatNumberFloat, renderDotActive } from "@lib/helper"
import { AppComponentListBase } from "@components/AppComponentBase"
import { appPermissions } from "@lib/appconst"
import { MoreOutlined } from "@ant-design/icons"

export interface ILeaseProps {
  history: any
  appDataStore: AppDataStore
  leaseAgreementStore: LeaseAgreementStore
}

export interface ILeaseState {
  maxResultCount: number
  skipCount: number
  filters: any
  modalVisible: boolean
  leaseAgreementId: any
  isRenew: boolean
}

@inject(Stores.AppDataStore, Stores.LeaseAgreementStore)
@observer
class Leases extends AppComponentListBase<ILeaseProps, ILeaseState> {
  formRef: any = React.createRef()

  state = {
    maxResultCount: 10,
    skipCount: 0,
    modalVisible: false,
    leaseAgreementId: undefined,
    filters: {
      isActive: true,
    } as any,
    isRenew: false,
  }

  async componentDidMount() {
    await this.getAll()

    this.props.appDataStore.getPositionLevels({}),
      this.props.appDataStore.getCountries({}),
      this.props.appDataStore.getListLAStatus({}),
      this.props.leaseAgreementStore.getListFeeType(""),
      this.props.leaseAgreementStore.getListLeaseAgreementPaymentScheduleStatus(),
      this.props.appDataStore.getDocumentType(""),
      this.props.appDataStore.getDepositRefundTypes(""),
      this.props.appDataStore.getTaskStatus(),
      this.props.appDataStore.getListAmendmentType()
  }
  getAll = async () => {
    await this.props.leaseAgreementStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
    })
    await this.props.leaseAgreementStore.getTotalCommission({
      fromDate: this.state.filters.fromDate,
      toDate: this.state.filters.toDate,
    })
  }
  toggleModal = () =>
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))

  reNewLa = async (id) => {
    await this.toggleModal()

    await this.gotoDetail(null, id)
  }
  handleOk = async () => {
    await this.getAll()
    this.toggleModal()
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
  handleFilterChange = async (filters) => {
    await this.setState({ filters })
    await this.handleTableChange({
      current: 1,
      pageSize: this.state.maxResultCount,
    })
  }
  gotoDetail = async (id, reNew?) => {
    if (id) {
      await this.props.leaseAgreementStore.get(id)

      await this.setState({ leaseAgreementId: id })
    } else {
      await this.props.leaseAgreementStore.isCreate()
      await this.setState({ leaseAgreementId: undefined })
    }
    if (reNew) {
      await this.props.leaseAgreementStore.get(reNew)
      await this.props.leaseAgreementStore.isRenewLA()

      this.setState({ isRenew: true })
    } else this.setState({ isRenew: false })
    await this.setState({ modalVisible: true })
  }
  activateOrDeactivate = async (id: number, isActive) => {
    const self = this
    Modal.confirm({
      title: LNotification(
        isActive
          ? "DO_YOU_WANT_TO_ACTIVATE_THIS_ITEM"
          : "DO_YOU_WANT_TO_DEACTIVATE_THIS_ITEM"
      ),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        await self.props.leaseAgreementStore.activateOrDeactivate(id, isActive)
        self.handleTableChange({
          current: 1,
          pageSize: this.state.maxResultCount,
        })
      },
    })
  }
  public render() {
    const {
      leaseAgreementStore: { pageResult, isLoading },
    } = this.props
    const columns = gettColumns({
      title: L("REFERENCE_NUMBER"),
      dataIndex: "referenceNumber",
      key: "referenceNumber",
      width: 250,
      fixed: "left",
      ellipsis: false,

      render: (referenceNumber: string, item: any) => (
        <Row>
          <Col sm={{ span: 21, offset: 0 }}>
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
          <Col sm={{ span: 3, offset: 0 }}>
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu>
                  {this.isGranted(appPermissions.inquiry.delete) && (
                    <Menu.Item
                      key={1}
                      onClick={() =>
                        this.activateOrDeactivate(item.id, !item.isActive)
                      }
                    >
                      {L(item.isActive ? "BTN_DEACTIVATE" : "BTN_ACTIVATE")}
                    </Menu.Item>
                  )}
                </Menu>
              }
              placement="bottomLeft"
            >
              <button className="button-action-hiden-table-cell">
                <MoreOutlined />
              </button>
            </Dropdown>
          </Col>
        </Row>
      ),
    })
    return (
      <>
        <div className="m-1 text-height">
          {L("TOTAL_BILLED_COMMISSION")}&ensp;
          {formatNumberFloat(this.props.leaseAgreementStore.totalCommission)}
        </div>
        <DataTable
          filterComponent={
            <LeaseFilterPanel handleSearch={this.handleFilterChange} />
          }
          handleSearch={this.handleFilterChange}
          searchPlaceholder={"REFERENCE_NUMBER_UNIT_NO"}
          onCreate={() => {
            this.gotoDetail(null)
          }}
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
            rowKey={(record) => `${record.id}`}
            columns={columns}
            loading={isLoading}
            pagination={false}
            dataSource={pageResult.items ?? []}
            scroll={{
              x: 1000,
              y: "calc(100vh - 27rem)",
              scrollToFirstRowOnChange: true,
            }}
          />
        </DataTable>

        <LeaseDetailModal
          leaseAgreementId={this.state.leaseAgreementId}
          appDataStore={this.props.appDataStore}
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          reNewLa={this.reNewLa}
          isRenew={this.state.isRenew}
          onOk={() => {
            this.getAll(), this.gotoDetail(this.state.leaseAgreementId)
          }}
          onAmendOk={() => {
            this.getAll(), this.toggleModal()
          }}
        />
      </>
    )
  }
}
export default withRouter(Leases)
