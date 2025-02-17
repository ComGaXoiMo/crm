import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Card, Col, Row, Table, Tag } from "antd"
import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"
import ActivityFilter from "./components/bookingFilter"
import CreateBookingModal from "./components/bookingModal"
import ReservationStore from "@stores/activity/reservationStore"
import DataTable from "@components/DataTable"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"
import { renderDate } from "@lib/helper"
import { UserOutlined } from "@ant-design/icons"
const { align, unitReservationStatus } = AppConsts

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
class ReservationListing extends AppComponentListBase<
  IBookingProps,
  IBookingState
> {
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
      reservationStore: { tableData },
    } = this.props

    const columns = [
      {
        title: L("INQUIRY_NAME"),
        dataIndex: "inquiry",
        key: "inquiry",
        width: 140,
        ellipsis: true,
        fixed: align.left,
        render: (inquiry, record) => <>{inquiry?.inquiryName}</>,
      },
      {
        title: L("RESERVATION_DESCRIPTION"),
        dataIndex: "description",
        key: "description",
        width: 140,
        ellipsis: true,
        fixed: align.left,
        render: (description, record) => <>{description}</>,
      },
      {
        title: L("RESERVATION_UNIT"),
        dataIndex: "reservationUnit",
        key: "reservationUnit",
        width: 150,
        ellipsis: false,
        align: align.center,
        render: (reservationUnit, record) => (
          <>
            {reservationUnit?.map((item, index) => {
              let color = "default"
              switch (item.unitStatusId) {
                case unitReservationStatus.close:
                  color = "#87d068"
                  break
                case unitReservationStatus.new:
                  color = "blue"
                  break
                case unitReservationStatus.cancel:
                  color = "red"
                  break
                case unitReservationStatus.expried:
                  color = "red"
                  break
                case unitReservationStatus.userCancel:
                  color = "red"
                  break

                default:
                  color = "default"
              }
              let CLASSNAME = ""
              switch (item.unitStatusId) {
                case unitReservationStatus.cancel:
                  CLASSNAME = "strike-text"
                  break
                case unitReservationStatus.userCancel:
                  CLASSNAME = "strike-text"
                  break
                default:
                  CLASSNAME = ""
              }
              return (
                <Tag key={`as${index}`} className={CLASSNAME} color={color}>
                  {item.unitStatusId === unitReservationStatus.userCancel && (
                    <UserOutlined />
                  )}
                  {item?.unit?.projectCode} - {item?.unit?.unitName}
                  {item?.number > 0 && `- (${item?.number})`}
                </Tag>
              )
            })}
          </>
        ),
      },
      {
        title: L("RESERVATION_DATE_TIME"),
        dataIndex: "reservationTime",
        key: "reservationTime",
        width: 150,
        ellipsis: false,
        align: align.center,
        render: renderDate,
      },
      {
        title: L("EXPRIY_DATE"),
        dataIndex: "expiryDate",
        key: "expiryDate",
        width: 150,
        ellipsis: false,
        align: align.center,
        render: renderDate,
      },
      {
        title: L("CREATE_BY_CREATE_DATE"),
        dataIndex: "createBy",
        key: "createBy",
        width: 170,
        align: align.center,
        render: (createBy, item) => (
          <>
            {item?.creatorUser?.displayName} <br />
            {renderDate(item?.creationTime)}
          </>
        ),
      },
    ]
    return (
      <>
        <ActivityFilter
          onCreate={() => {
            this.goDetail()
          }}
          create={this.props.unitId ? false : true}
          onRefesh={() => this.getAll()}
          handleSearch={this.handleFilterChange}
        />

        <Row gutter={[8, 0]}>
          <Col sm={{ span: 24 }}>
            <Card className="card-detail-modal">
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
                  dataSource={tableData.items ?? []}
                  scroll={{ x: 800, y: 500, scrollToFirstRowOnChange: true }}
                />
              </DataTable>
            </Card>
          </Col>
        </Row>
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

export default withRouter(ReservationListing)
