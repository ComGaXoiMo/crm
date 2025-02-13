import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Table, message } from "antd"
import { L } from "@lib/abpUtility"
import Stores from "@stores/storeIdentifier"
// import FileUploadWrap from "@components/FileUpload/FileUploadCRM";
import UnitStore from "@stores/projects/unitStore"
import withRouter from "@components/Layout/Router/withRouter"
import StatusFilter from "./components/statusFilter"
import gettColumns from "./components/column"
import DataTable from "@components/DataTable"
import CreateStatusModal from "./components/createStatusModal"
import AppConsts, { appPermissions } from "@lib/appconst"
const { align } = AppConsts
export interface IStatusProps {
  unitStore: UnitStore
  visible: boolean
  id: any
}
export interface IStatusState {
  maxResultCount: number
  skipCount: number
  filters: any
  visible: boolean
  modalVisible: boolean
  title: string
}

@inject(Stores.UnitStore)
@observer
class Status extends AppComponentListBase<IStatusProps, IStatusState> {
  formCreate: any = React.createRef()

  constructor(props: IStatusProps) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      filters: {},
      visible: false,
      title: L("CREATE"),
      modalVisible: false,
    }
  }

  async componentDidMount() {
    await Promise.all([])
    this.initData()
  }
  componentDidUpdate = async (prevProps) => {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        this.initData()
      }
    }
  }
  initData = () => {
    this.props.unitStore.getUnitStatusConfig({ unitId: this.props.id })
  }
  toggleModal = () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))
  }

  handleOk = async (id) => {
    const formValues = await this.formCreate.current?.validateFields()
    let res = { ...formValues, unitId: this.props.id }
    if (id) {
      res = { ...res, id: id }
    }
    await this.props.unitStore.createOrUpdateUnitStautusConfig(res)
    await this.toggleModal()
    await this.initData()
  }
  gotoDetail = async (record?) => {
    if (record) {
      await this.props.unitStore.getUnitStautusConfig(record?.id)
    } else {
      this.props.unitStore.createUnitStautusConfig()
    }
    await this.setState({ modalVisible: true })
  }
  handleTableChange = (pagination: any) => {
    this.setState(
      { skipCount: (pagination.current - 1) * this.state.maxResultCount! },
      async () => await this.initData()
    )
  }
  public render() {
    const {
      unitStore: { unitStatusTableData, editUnitStatusConfig },
    } = this.props
    const columns = gettColumns({
      title: L("STATUS"),
      dataIndex: "status",
      key: "status",
      width: 140,
      ellipsis: false,
      fixed: align.left,
      render: (status, record) => (
        <>
          <a
            onClick={
              this.isGranted(appPermissions.unit.update)
                ? () => this.gotoDetail(record)
                : () => {
                    message.warning(L("NOT_PERMISSION"))
                  }
            }
            className="link-text-table"
          >
            {status?.name}
          </a>
        </>
      ),
    })

    return (
      <>
        <StatusFilter
          onCreate={() => {
            this.gotoDetail()
          }}
          onRefresh={() => {
            this.initData()
          }}
        />

        <DataTable
          pagination={{
            onChange: this.handleTableChange,
            pageSize: this.state.maxResultCount,
            total:
              unitStatusTableData === undefined
                ? 0
                : unitStatusTableData.totalCount,
          }}
        >
          <Table
            size="middle"
            className="custom-ant-row"
            rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            dataSource={unitStatusTableData?.items ?? []}
            scroll={{ x: 800, y: 500, scrollToFirstRowOnChange: true }}
            bordered
          />
        </DataTable>

        <CreateStatusModal
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          data={editUnitStatusConfig}
          onOk={this.handleOk}
          formRef={this.formCreate}
          isLoading={this.props.unitStore.isLoading}
        />
      </>
    )
  }
}

export default withRouter(Status)
