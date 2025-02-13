import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Card, Col, Empty, Row, Spin } from "antd"
import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"
import InquiriFilter from "./components/inquiriFilter"
import InquiriItem from "./components/inquiriItem"
import InquiryModal from "./components/inquiryModal"
import InquiryStore from "@stores/communication/inquiryStore"
import DataTable from "@components/DataTable"

export interface IIquiryProps {
  inquiryStore: InquiryStore
  projectId?: any
  contactId?: any
  companyId?: any
  unitId?: any
}
export interface IIquiryState {
  modalVisible: boolean
  maxResultCount: any
  data: any[]
  filters: any
  skipCount: number
}

@inject(Stores.InquiryStore)
@observer
class InquirieContacts extends AppComponentListBase<
  IIquiryProps,
  IIquiryState
> {
  formRef: any = React.createRef()

  constructor(props: IIquiryProps) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      modalVisible: false,
      filters: {
        isActive: true,
      },
      data: [] as any,
    }
  }
  async componentDidUpdate(prevProps) {
    if (
      prevProps.projectId !== this.props.projectId ||
      prevProps.contactId !== this.props.contactId ||
      prevProps.unitId !== this.props.unitId ||
      prevProps.companyId !== this.props.companyId
    ) {
      this.getAll()
    }
  }
  async componentDidMount() {
    await Promise.all([])
    this.getAll()
  }
  getAll = async () => {
    await this.props.inquiryStore.getAll({
      projectId: this.props.projectId,
      contactId: this.props.contactId,
      companyId: this.props.companyId,
      unitId: this.props.unitId,
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
    })
    this.setState({ data: this.props.inquiryStore.pageResult.items })
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
  toggleModal = () =>
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))

  handleOk = async () => {
    this.toggleModal()
  }
  public render() {
    const { data } = this.state
    const {
      inquiryStore: { pageResult },
    } = this.props
    return (
      <>
        <InquiriFilter
          onCreate={() => {
            this.toggleModal()
          }}
        />
        <Spin
          spinning={this.props.inquiryStore.isLoading}
          className="h-100 w-100"
        >
          <Row gutter={[8, 0]}>
            <Col sm={{ span: 24 }}>
              <Card className="card-detail-modal">
                <DataTable
                  pagination={{
                    pageSize: this.state.maxResultCount,
                    total: pageResult === undefined ? 0 : pageResult.totalCount,
                    onChange: this.handleTableChange,
                  }}
                >
                  {pageResult.items.map((item, index) => (
                    <Col key={index} sm={{ span: 24 }}>
                      {/* <div
                    onClick={() => {
                      this.toggleModal();
                    }}
                  > */}
                      <InquiriItem data={item} />
                      {/* </div> */}
                    </Col>
                  ))}
                  {!data.length && <Empty />}
                </DataTable>
              </Card>
            </Col>
          </Row>
        </Spin>
        <InquiryModal
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        />
      </>
    )
  }
}

export default withRouter(InquirieContacts)
