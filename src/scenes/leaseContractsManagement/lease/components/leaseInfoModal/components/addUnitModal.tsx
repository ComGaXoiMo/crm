import { L, LError } from "@lib/abpUtility"
import { Col, Form, Modal, Row, Table, message } from "antd"
import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import _ from "lodash"
import DataTable from "@components/DataTable"
import AppConsts from "@lib/appconst"
import UnitModalFilterPanel from "./unitModalFilterPanel"
import { formatCurrency, renderDate, renderDotActive } from "@lib/helper"
import UnitStore from "@stores/projects/unitStore"
import { RowSelectionType } from "antd/lib/table/interface"
const { align } = AppConsts
interface Props {
  visible: boolean
  onClose: () => void
  onOk: (params) => void
  data: any
  unitStore: UnitStore
}

interface State {
  maxResultCount: number
  skipCount: number
  dataTable: any
  filters: any
  selectedRowKeys: any[]
}

@inject(Stores.UnitStore)
@observer
class AddUnitModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      filters: {} as any,
      dataTable: [],
      selectedRowKeys: [] as any,
    }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        await this.setState({ skipCount: 0 })
        await this.getAll()
      }
    }
  }
  getAll = () => {
    this.props.unitStore.getAllRes({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
    })
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
    await this.getAll()
  }
  onSelectChange = (newSelectedRowKeys) => {
    this.setState({ selectedRowKeys: newSelectedRowKeys })
  }
  handleOk = (params) => {
    if (this.state.selectedRowKeys.length > 0) {
      this.props.onOk(params)
    } else {
      message.warning(LError("PLEASE_CHOOSE_ONE_UNIT"))
    }
  }
  render(): React.ReactNode {
    const {
      visible,
      onClose,

      unitStore: { tableData, isLoading },
    } = this.props
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys: this.state.selectedRowKeys,
      type: "radio" as RowSelectionType,
    }
    const columns = [
      {
        title: L("UNIT_NUMBER"),
        dataIndex: "unitName",
        key: "unitName",
        // fixed: "left",
        width: 120,
        ellipsis: false,
        render: (unitName: string, item: any) => (
          <>
            {renderDotActive(item.isActive)}
            {unitName}
          </>
        ),
      },
      {
        title: L("PROPERTY_TYPE"),
        dataIndex: "productTypeId",
        align: align.center,
        key: "productTypeId",
        width: "150px",
        ellipsis: false,
        render: (productTypeId, row) => <>{row.productType?.name ?? "--"}</>,
      },
      {
        title: L("STATUS"),
        dataIndex: "status",
        align: align.center,
        key: "status",
        width: "150px",
        ellipsis: false,
        render: (status) => <>{status?.name ?? "--"}</>,
      },
      {
        title: L("UNIT_TYPE"),
        dataIndex: "unitType",
        align: align.center,
        key: "unitType",
        width: 100,
        ellipsis: false,
        render: (unitType) => <>{unitType?.name ?? "--"}</>,
      },

      {
        title: L("ACTUAL_SIZE"),
        dataIndex: "actualSize",
        align: align.center,
        key: "actualSize",
        width: "150px",
        ellipsis: false,
        render: (actualSize) => <>{actualSize ?? "--"}</>,
      },
      {
        title: L("BALCONY_SIZE"),
        dataIndex: "balcony",
        align: align.center,
        key: "balcony",
        width: 100,
        // ellipsis: false,
        render: (balcony) => <>{balcony ?? "--"}</>,
      },

      {
        title: L("ASKING_RENT"),
        dataIndex: "askingRent",
        align: align.center,
        key: "askingRent",
        width: 120,
        ellipsis: false,
        render: (price) => <>{formatCurrency(price) ?? "--"}</>,
      },
      {
        title: L("COMMENCEMENT_DATE"),
        dataIndex: "commencementDate",
        align: align.center,
        key: "commencementDate",
        width: 130,
        // ellipsis: false,
        // render: renderDate,
        render: renderDate,
      },
      {
        title: L("EXPIRED_DATE"),
        dataIndex: "expiredDate",
        align: align.center,
        key: "expiredDate",
        width: 140,
        ellipsis: false,
        // render: renderDate,
        render: renderDate,
      },
    ]

    return (
      this.props.visible && (
        <Modal
          // style={{ top: 20 }}
          // title={L("PROJECT_ADD_USER_PERMISSION")}
          visible={visible}
          // visible={true}
          width={"70%"}
          onOk={() => this.handleOk(this.state.selectedRowKeys)}
          onCancel={onClose}
          closable={false}
        >
          <Form ref={this.formRef} layout={"vertical"} size="middle">
            <div className="w-100">
              <Row gutter={[8, 0]} style={{ alignItems: "center" }}>
                <Col sm={{ span: 24 }}>
                  <UnitModalFilterPanel
                    handleSearch={this.handleFilterChange}
                    onRefresh={() => {
                      this.getAll()
                    }}
                  />
                  <DataTable
                    pagination={{
                      pageSize: this.state.maxResultCount,
                      total: tableData === undefined ? 0 : tableData.totalCount,
                      onChange: this.handleTableChange,
                    }}
                  >
                    <Table
                      size="middle"
                      className="custom-ant-row"
                      rowKey={(record) => record.id}
                      columns={columns}
                      pagination={false}
                      rowSelection={rowSelection}
                      dataSource={tableData.items ?? []}
                      loading={isLoading}
                      scroll={{ x: 100, scrollToFirstRowOnChange: true }}
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
export default withRouter(AddUnitModal)
