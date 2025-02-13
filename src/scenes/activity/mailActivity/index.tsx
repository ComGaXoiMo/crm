import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Card, Col, Empty, Row, Spin } from "antd"
import Stores from "@stores/storeIdentifier"
// import FileUploadWrap from "@components/FileUpload/FileUploadCRM";
import withRouter from "@components/Layout/Router/withRouter"
import ActivityFilter from "./components/mailFilter"
import MailBoardItem from "./components/mailBoardItem"
import MailModal from "./components/mailModal"
import MailStore from "@stores/activity/mailStore"
import DataTable from "@components/DataTable"

export interface IMailProps {
  mailStore: MailStore;
  inquiryId: any;
}
export interface IMailState {
  modalVisible: boolean;
  maxResultCount: any;
  filters: any;
  skipCount: number;
}

@inject(Stores.MailStore)
@observer
class Mail extends AppComponentListBase<IMailProps, IMailState> {
  formRef: any = React.createRef();
  formRefProjectAddress: any = React.createRef();

  constructor(props: IMailProps) {
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
  };
  getAll = () => {
    this.props.mailStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
      inquiryId: this.props.inquiryId,
    })
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
  toggleModal = () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))
  };
  goDetail = async (id?) => {
    if (id) {
      await this.props.mailStore.get(id)
    } else {
      await this.props.mailStore.createMail()
    }
    await this.toggleModal()
  };
  handleOk = async () => {
    this.toggleModal()
    this.getAll()
  };
  public render() {
    const {
      mailStore: { tableData, isLoading },
    } = this.props
    return (
      <>
        <ActivityFilter
          onCreate={() => {
            this.goDetail()
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
                  <Row>
                    {tableData?.items.map((item, index) => (
                      <Col key={index} sm={{ span: 24 }}>
                        <div
                          style={{ display: "flex" }}
                          onClick={() => this.goDetail(item?.id)}
                        >
                          <MailBoardItem key={index} data={item} />
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
        <MailModal
          inquiryId={this.props.inquiryId}
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        />
      </>
    )
  }
}

export default withRouter(Mail)
