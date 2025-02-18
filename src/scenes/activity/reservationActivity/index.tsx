import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Col, Empty, Row, Spin } from "antd"
import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"
import BookingBoardItem from "./components/bookingBoardItem"
import CreateBookingModal from "./components/bookingModal"
import ReservationStore from "@stores/activity/reservationStore"
import DataTable from "@components/DataTable"

export interface IBookingProps {
  reservationStore: ReservationStore
  unitId: any
  inquiryId: any
  selectItem: any
  tabKey: any
}
export interface IBookingState {
  modalVisible: boolean
  maxResultCount: any
  filters: any
  skipCount: number
}

@inject(Stores.ReservationStore)
@observer
class Booking extends AppComponentListBase<IBookingProps, IBookingState> {
  formRef: any = React.createRef()

  constructor(props: IBookingProps) {
    super(props)
    this.state = {
      modalVisible: false,
      maxResultCount: 10,
      skipCount: 0,
      filters: {
        isActive: true,
      },
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
  handleFilterChange = async (filters) => {
    await this.setState({ filters }, this.getAll)
  }
  async componentDidMount() {
    await Promise.all([])
    this.getAll()
  }
  componentDidUpdate = async (prevProps) => {
    // if (prevProps.inquiryId !== this.props.inquiryId) {
    //   this.getAll()
    // }
    // if (prevProps.unitId !== this.props.unitId) {
    //   this.getAll()
    // }
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === this.props.tabKey) {
        await this.getAll()
      }
    }
  }
  getAll = () => {
    this.props.reservationStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
      unitId: this.props.unitId,
      inquiryId: this.props.inquiryId,
      unitOrder: true,
    })
  }
  goDetail = async (id?) => {
    if (id) {
      await this.props.reservationStore.get(id)
    } else {
      await this.props.reservationStore.createReservation()
    }
    await this.toggleModal()
  }
  toggleModal = () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))
  }
  handleOk = async () => {
    await this.getAll()
    this.toggleModal()
  }
  public render() {
    const {
      reservationStore: { tableData, isLoading },
    } = this.props
    return (
      <>
        <DataTable
          onCreate={() => {
            this.props.unitId ? false : this.goDetail()
          }}
          onRefresh={() => this.getAll()}
          handleSearch={this.handleFilterChange}
          pagination={{
            pageSize: this.state.maxResultCount,
            total: tableData === undefined ? 0 : tableData.totalCount,
            onChange: this.handleTableChange,
          }}
        >
          <Spin spinning={isLoading} className="h-100 w-100">
            <Row>
              {tableData.items.map((item, index) => (
                <Col key={index} sm={{ span: 24 }}>
                  <div
                    style={{ display: "flex" }}
                    onClick={() => {
                      this.props.unitId
                        ? console.log("")
                        : this.goDetail(item?.id)
                    }}
                  >
                    <BookingBoardItem key={index} data={item} />
                  </div>
                </Col>
              ))}
            </Row>
          </Spin>
          {tableData.totalCount < 1 && <Empty />}
        </DataTable>

        <CreateBookingModal
          inquiryId={this.props.inquiryId}
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        />
      </>
    )
  }
}

export default withRouter(Booking)
