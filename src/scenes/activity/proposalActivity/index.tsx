import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Card, Col, Empty, Row, Spin } from "antd"
import Stores from "@stores/storeIdentifier"
import ActivityFilter from "./components/proposalFilter"
import ProposalBoardItem from "./components/proposalBoardItem"
// import DetailProposalModal from "./components/DetailProposalModal";
import ProposalStore from "@stores/activity/proposalStore"
import DataTable from "@components/DataTable"
import withRouter from "@components/Layout/Router/withRouter"
// import { portalLayouts } from "@components/Layout/Router/router.config";
import CreateProposalModal from "./components/createProposalModal"
import AppConsts from "@lib/appconst"
import GoDetailModal from "./components/goDetailModal"
import { portalLayouts } from "@components/Layout/Router/router.config"
const { proposalTemplateType } = AppConsts

export interface IProposalProps {
  history: any;
  proposalStore: ProposalStore;
  inquiryId: any;
}
export interface IProposalState {
  modalVisible: boolean;
  maxResultCount: any;
  filters: any;
  goDetailModalVisible: any;
  skipCount: number;
  proposalId: any;
}

@inject(Stores.ProposalStore)
@observer
class Proposal extends AppComponentListBase<IProposalProps, IProposalState> {
  formRef: any = React.createRef();
  formRefProjectAddress: any = React.createRef();

  constructor(props: IProposalProps) {
    super(props)
    this.state = {
      modalVisible: false,
      goDetailModalVisible: false,
      maxResultCount: 10,
      skipCount: 0,
      filters: {
        isActive: true,
      },
      proposalId: undefined,
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
  };
  handleFilterChange = async (filters) => {
    await this.setState({ filters }, this.getAll)
  };
  async componentDidMount() {
    await Promise.all([])
    this.getAll()
  }
  componentDidUpdate = async (prevProps) => {
    if (prevProps.inquiryId !== this.props.inquiryId) {
      this.getAll()
    }
  };
  getAll = () => {
    this.props.proposalStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
      inquiryId: this.props.inquiryId,
    })
  };

  onCreateProposal = async (param) => {
    const model = {
      ...param,
      inquiryId: this.props.inquiryId,
    }
    await this.props.proposalStore.createOrUpdate(model)
    if (
      this.props.proposalStore.proposalDetail?.proposalType ===
      proposalTemplateType.unit
    ) {
      await this.props.proposalStore.getUnitTemplate(
        this.props.proposalStore.proposalDetail?.id
      )
    } else if (
      this.props.proposalStore.proposalDetail?.proposalType ===
      proposalTemplateType.project
    ) {
      await this.props.proposalStore.getProjectTemplate(
        this.props.proposalStore.proposalDetail?.id
      )
    }
    await this.goDetail(this.props.proposalStore.proposalDetail.id)
    await this.props.history.push(
      portalLayouts.proposalEditTemplate.path.replace(
        ":id",
        this.props.proposalStore.proposalDetail.id
      )
    )
    this.toggleModal()
  };
  goDetail = async (id?) => {
    // await this.props.history.push(
    //   portalLayouts.proposalEditTemplate.path.replace(":id", id)
    // );
    this.setState({ proposalId: id })
    this.setState({ goDetailModalVisible: true })
  };
  toggleModal = () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))
  };

  public render() {
    const {
      proposalStore: { tableData, isLoading },
    } = this.props
    return (
      <>
        <ActivityFilter
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
                  total: tableData === undefined ? 0 : tableData.totalCount,
                  onChange: this.handleTableChange,
                }}
              >
                <Spin spinning={isLoading} className="h-100 w-100">
                  {tableData.items.map((item, index) => (
                    <Col key={index} sm={{ span: 24 }}>
                      <div
                        style={{ display: "flex" }}
                        onClick={() => this.goDetail(item?.id)}
                      >
                        <ProposalBoardItem data={item} />
                      </div>
                    </Col>
                  ))}
                </Spin>
                {tableData.totalCount < 1 && <Empty />}
              </DataTable>
            </Card>
          </Col>
        </Row>
        <CreateProposalModal
          withChooseUnit={true}
          visible={this.state.modalVisible}
          onClose={() => this.toggleModal()}
          onOk={this.onCreateProposal}
        />
        <GoDetailModal
          id={this.state.proposalId}
          visible={this.state.goDetailModalVisible}
          onClose={() => this.setState({ goDetailModalVisible: false })}
        />
        {/*<DetailProposalModal
          visible={false}
          // onClose={() => this.setState({ showDetail: false })}
          // onOk={this.handleOk}
          id={1}
        /> */}
      </>
    )
  }
}

export default withRouter(Proposal)
