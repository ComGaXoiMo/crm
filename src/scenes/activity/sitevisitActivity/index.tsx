import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Card, Col, Empty, Row, Spin } from "antd"
import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"

import ActivityFilter from "./components/siteVisitFilter"
import SiteVisitBoardItem from "./components/siteVisitBoardItem"
import SiteVisitModal from "./components/sitevisitModal"
import SiteVisitStore from "@stores/activity/siteVisitStore"
import DataTable from "@components/DataTable"

export interface ISiteVisitProps {
  siteVisitStore: SiteVisitStore;
  inquiryId: any;
  unitId: any;
}
export interface ISiteVisitState {
  modalVisible: boolean;
  maxResultCount: any;
  filters: any;
  skipCount: number;
}

@inject(Stores.SiteVisitStore)
@observer
class SiteVisit extends AppComponentListBase<ISiteVisitProps, ISiteVisitState> {
  formRef: any = React.createRef();

  constructor(props: ISiteVisitProps) {
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

  async componentDidMount() {
    await Promise.all([])
    this.getAll()
  }
  componentDidUpdate = async (prevProps) => {
    if (prevProps.inquiryId !== this.props.inquiryId) {
      this.getAll()
    }
    if (prevProps.unitId !== this.props.unitId) {
      this.getAll()
    }
  };
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
  getAll = () => {
    this.props.siteVisitStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
      inquiryId: this.props.inquiryId,
      unitId: this.props.unitId,
    })
  };
  goDetail = async (id?) => {
    if (id) {
      await this.props.siteVisitStore.get(id)
    } else {
      await this.props.siteVisitStore.createSiteVisit()
    }
    await this.toggleModal()
  };
  toggleModal = () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))
  };
  handleOk = async () => {
    await this.getAll()
    this.toggleModal()
  };
  public render() {
    const {
      siteVisitStore: { tableData, isLoading },
    } = this.props
    return (
      <>
        <ActivityFilter
          onCreate={() => {
            this.goDetail()
          }}
          onRefesh={() => this.getAll()}
          create={this.props.unitId ? false : true}
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
                  <Row>
                    {tableData?.items.map((item, index) => (
                      <Col key={index} sm={{ span: 24 }}>
                        <div
                          style={{ display: "flex" }}
                          onClick={() => {
                            this.props.unitId
                              ? console.log("")
                              : this.goDetail(item?.id)
                          }}
                        >
                          <SiteVisitBoardItem key={index} data={item} />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Spin>
                {tableData.totalCount < 1 && <Empty />}
              </DataTable>
            </Card>
          </Col>
        </Row>
        <SiteVisitModal
          inquiryId={this.props.inquiryId}
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        />
      </>
    )
  }
}

export default withRouter(SiteVisit)
