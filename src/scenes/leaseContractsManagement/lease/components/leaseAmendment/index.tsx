import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import _ from "lodash"

// import FormTextArea from "@components/FormItem/FormTextArea";
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import DataTable from "@components/DataTable"
import { Col, Empty, Row, Spin } from "antd"
import AmendmentCardItem from "./components/amendmentCardItem"
import AmendmentLAModal from "./components/amendmentLAModal"
interface Props {
  leaseAgreementId: any
  leaseAgreementStore: LeaseAgreementStore
  thisTabKey: any
  parentTabKeyChoose: any
  onCloseDrawer: () => any
}

interface State {
  modalVisible: boolean
  maxResultCount: any
  skipCount: number
  leaseAgreementId: any
  amendmentId: any
  listAmendmentItem: any[]
}

@inject(Stores.LeaseAgreementStore)
@observer
class LeaseAmendmentList extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      maxResultCount: 3,
      skipCount: 0,
      leaseAgreementId: undefined,
      amendmentId: undefined,
      listAmendmentItem: [] as any,
    }
  }
  componentDidMount(): void {
    this.getListAmendmentForLA()
  }
  componentDidUpdate = async (prevProps: any) => {
    if (this.props.parentTabKeyChoose !== prevProps.parentTabKeyChoose) {
      if (this.props.parentTabKeyChoose === this.props.thisTabKey) {
        this.getListAmendmentForLA()
      }
    }
  }
  toggleModal = () =>
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))

  getListAmendmentForLA = async () => {
    await this.props.leaseAgreementStore.getAllAmendmentForLA({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      leaseAgreementAmendmentId: this.props.leaseAgreementId,
    })
  }
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        skipCount: (pagination.current - 1) * this.state.maxResultCount!,
        maxResultCount: pagination.pageSize,
      },
      async () => await this.getListAmendmentForLA()
    )
  }

  goDetail = async (amendment) => {
    await this.setState({
      leaseAgreementId: amendment?.id,
      amendmentId: amendment?.id,
      listAmendmentItem:
        amendment?.leaseAgreementAmendmentTypeMap?.map(
          (item) => item?.amendmentTypeId
        ) ?? [],
    })

    await this.props.leaseAgreementStore.get(amendment?.id)
    await this.toggleModal()
  }
  render(): React.ReactNode {
    const {
      leaseAgreementStore: { listAmendment, isLoading },
    } = this.props

    return (
      <>
        <Spin spinning={isLoading} className="w-100 h-100">
          <DataTable
            pagination={{
              pageSize: this.state.maxResultCount,
              total: listAmendment === undefined ? 0 : listAmendment.totalCount,
              onChange: this.handleTableChange,
            }}
          >
            <Row gutter={[8, 16]}>
              {listAmendment?.items.map((item, index) => (
                <Col key={index} sm={{ span: 24 }}>
                  <AmendmentCardItem data={item} viewInfo={this.goDetail} />
                </Col>
              ))}
            </Row>
            {listAmendment.totalCount < 1 && <Empty />}
          </DataTable>
        </Spin>
        <AmendmentLAModal
          leaseAgreementId={this.state.leaseAgreementId}
          amendmentId={this.state.leaseAgreementId}
          listAmendmentItem={this.state.listAmendmentItem}
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={async () => {
            await this.getListAmendmentForLA(), await this.toggleModal()
          }}
          onConfirmAmendment={() => {
            this.toggleModal(), this.props.onCloseDrawer()
          }}
        />
      </>
    )
  }
}
export default withRouter(LeaseAmendmentList)
