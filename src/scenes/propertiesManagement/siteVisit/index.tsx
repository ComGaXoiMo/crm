import * as React from "react"

import { inject, observer } from "mobx-react"
import DataTable from "@components/DataTable"
import gettColumns from "./components/siteVisitColumn"
import { Col, Dropdown, Menu, Row, Table } from "antd"
import SiteVisitFilterPanel from "./components/siteVisitFilterPanel"
import AppDataStore from "@stores/appDataStore"
import ProjectStore from "@stores/projects/projectStore"
import { L } from "@lib/abpUtility"
import { MoreOutlined } from "@ant-design/icons"
import withRouter from "@components/Layout/Router/withRouter"
// import CreateSiteVisitModal from "../units/components/tabSiteVisit/components/createSitevisitModal";

export interface IProjectProps {
  history: any
  appDataStore: AppDataStore
  projectStore: ProjectStore
}

export interface IProjectState {
  maxResultCount: number
  skipCount: any
  modalVisible: any
}

@inject()
@observer
class SiteVisit extends React.Component<IProjectProps, IProjectState> {
  formRef: any = React.createRef()

  state = {
    maxResultCount: 10,
    skipCount: 0,
    modalVisible: false,
  }

  async componentDidMount() {
    await this.getAll()

    await Promise.all([])
  }
  getAll = async () => {
    console.log("getAll")
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

  gotoDetail = (id) => {
    this.setState({ modalVisible: true })
  }
  toggleModal = () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))
  }

  handleOk = async () => {
    this.toggleModal()
  }
  public render() {
    const columns = gettColumns({
      title: L("PROPERTY"),
      dataIndex: "property",
      key: "property",
      width: "20%",
      ellipsis: false,
      // render: (property) => <>{property}</>,
      render: (property: string, item: any) => (
        <Row>
          <Col sm={{ span: 20, offset: 0 }}>
            <a
              onClick={
                // this.isGranted(appPermissions.unit.update)
                //   ? () => this.gotoDetail(item.id)
                //   : () => console.log()
                () => this.gotoDetail(item.id)
              }
              className="link-text-table"
            >
              {property}
            </a>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu>
                  {/* {this.isGranted(appPermissions.unit.delete) && ( */}
                  <Menu.Item
                    key={1}
                    // onClick={() =>
                    //   this.activateOrDeactivate(item.id, !item.isActive)
                    // }
                  >
                    {L(item.isActive ? "BTN_DEACTIVATE" : "BTN_ACTIVATE")}
                  </Menu.Item>
                  {/* )} */}
                </Menu>
              }
              placement="bottomLeft"
            >
              <button className="button-action-hiden-table-cell">
                <MoreOutlined />
              </button>
            </Dropdown>
          </Col>
        </Row>
      ),
    })
    return (
      <>
        <SiteVisitFilterPanel />
        <DataTable
          pagination={{
            pageSize: this.state.maxResultCount,
            onChange: this.handleTableChange,
          }}
        >
          <Table
            size="middle"
            className="custom-ant-row"
            rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            dataSource={dataFake === undefined ? [] : dataFake.items}
            bordered
            scroll={{ x: 1000, scrollToFirstRowOnChange: true }}
          />
        </DataTable>
        {/* <CreateSiteVisitModal
          dataSend={1}
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        /> */}
      </>
    )
  }
}
export default withRouter(SiteVisit)

const dataFake = {
  items: [
    {
      id: 11,
      property: "THE CRESCENT RESIDENCE 2",
      unit: "1324",
      agent: "Agent 01",
      date: "29/12/2022 - 12:00",
      occupierName: "Minh Thu",
      companyName: "JBO",
    },
    {
      id: 12,
      property: "THE CRESCENT RESIDENCE 3",
      unit: "1321",
      agent: "Agent 02",
      date: "29/12/2022 - 12:00",
      occupierName: "Hoang Minh",
      companyName: "BES",
    },
    {
      id: 13,
      property: "THE CRESCENT RESIDENCE 5",
      unit: "1322",
      agent: "Agent 03",
      date: "29/12/2022 - 12:00",
      occupierName: "Ngoc Hoang",
      companyName: "TWEE",
    },
    {
      id: 14,
      property: "THE CRESCENT RESIDENCE 1",
      unit: "1328",
      agent: "Agent 04",
      date: "29/12/2022 - 12:00",
      occupierName: "Thu Ngoc",
      companyName: "RQV",
    },
  ],
}
