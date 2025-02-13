import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Card, Col, Empty, Row, Spin } from "antd"
import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"
import MoveInOutFilter from "./components/moveInOutFilter"
import MoveInOutBoardItem from "./components/moveInOutBoardItem"
import CreateMoveInOutModal from "./components/createMoveInOutModal"
import MoveOutModal from "./components/moveOutModal"
import TenantStore from "@stores/administrator/tenantStore"
import DataTable from "@components/DataTable"

export interface IMoveInOutProps {
  tenantStore: TenantStore
  tenantId: any
  unitId: any
  keyTab: any
  tabKeyChoose: any
}
export interface IMoveInOutState {
  modalVisible: boolean
  moveOutModalVisible: boolean
  maxResultCount: any
  filters: any
  skipCount: number
  moveOutData: any
}

@inject(Stores.TenantStore)
@observer
class TenantMoveInOut extends AppComponentListBase<
  IMoveInOutProps,
  IMoveInOutState
> {
  formRef: any = React.createRef()
  formRefProjectAddress: any = React.createRef()

  constructor(props: IMoveInOutProps) {
    super(props)
    this.state = {
      modalVisible: false,
      moveOutModalVisible: false,
      maxResultCount: 10,
      skipCount: 0,
      filters: {
        isUnitActive: true,
      },
      moveOutData: {} as any,
    }
  }

  async componentDidMount() {
    await Promise.all([])
    this.getAll()
  }
  componentDidUpdate = async (prevProps) => {
    if (
      prevProps.unitId !== this.props.unitId ||
      prevProps.tenantId !== this.props.tenantId
    ) {
      this.getAll()
    }
    if (prevProps.tabKeyChoose !== this.props.tabKeyChoose) {
      console.log(this.props.tabKeyChoose, this.props.keyTab)
      if (this.props.tabKeyChoose === this.props.keyTab) {
        this.getAll()
      }
    }
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
  getAll = async () => {
    this.props.tenantStore.getAllunitTenant({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
      userTenantId: this.props.tenantId,
      unitId: this.props.unitId,
    })
  }

  toggleModal = () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))
  }

  handleOk = async () => {
    this.toggleModal()
    this.getAll()
  }

  toggleMoveOutModal = () => {
    this.setState((prevState) => ({
      moveOutModalVisible: !prevState.moveOutModalVisible,
    }))
  }
  handleMoveOutOpen = async (data) => {
    this.toggleMoveOutModal()
    this.setState({ moveOutData: data })
  }

  handleMoveOutOk = async () => {
    this.setState({ moveOutData: {} })
    this.getAll()
    this.toggleMoveOutModal()
  }
  handleFilterChange = async (filters) => {
    await this.setState({ filters }, this.getAll)
  }
  public render() {
    const {
      tenantStore: { tableMoveOutInData, isLoading },
    } = this.props
    return (
      <>
        <MoveInOutFilter
          onCreate={() => {
            this.toggleModal()
          }}
          onRefesh={() => this.getAll()}
          handleSearch={this.handleFilterChange}
        />
        <Row gutter={[8, 0]}>
          <Col sm={{ span: 24 }}>
            <Card className="card-detail-modal">
              <DataTable
                pagination={{
                  pageSize: this.state.maxResultCount,
                  total:
                    tableMoveOutInData === undefined
                      ? 0
                      : tableMoveOutInData.totalCount,
                  onChange: this.handleTableChange,
                }}
              >
                <Spin spinning={isLoading} className="h-100 w-100">
                  <Row>
                    {tableMoveOutInData?.items.map((item, index) => (
                      <Col key={index} sm={{ span: 24 }}>
                        <div style={{ display: "flex" }}>
                          <MoveInOutBoardItem
                            data={item}
                            moveOut={this.handleMoveOutOpen}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                  {tableMoveOutInData.totalCount < 1 && <Empty />}
                </Spin>
              </DataTable>
            </Card>
          </Col>
        </Row>
        <CreateMoveInOutModal
          tenantId={this.props.tenantId}
          unitId={this.props.unitId}
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        />
        <MoveOutModal
          moveOutData={this.state.moveOutData}
          visible={this.state.moveOutModalVisible}
          onClose={this.toggleMoveOutModal}
          onOk={this.handleMoveOutOk}
        />
      </>
    )
  }
}

export default withRouter(TenantMoveInOut)
