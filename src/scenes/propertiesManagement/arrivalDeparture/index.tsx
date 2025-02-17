import * as React from "react"

import { inject, observer } from "mobx-react"
import DataTable from "@components/DataTable"
import gettColumns from "./components/arrivalDepartureColumn"
import { Table } from "antd"
import ArrivalDeparturesFilterPanel from "./components/arrivalDepartureFilterPanel"
import AppDataStore from "@stores/appDataStore"
import ProjectStore from "@stores/projects/projectStore"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"
import UnitStore from "@stores/projects/unitStore"
import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"
const { align } = AppConsts
export interface IProjectProps {
  history: any
  appDataStore: AppDataStore
  projectStore: ProjectStore
  unitStore: UnitStore
}

export interface IProjectState {
  maxResultCount: number
  skipCount: number
  filters: any
  projectProvinces: any[]
  projectId: number
}

@inject(Stores.UnitStore)
@observer
class ArrivalDeparture extends React.Component<any> {
  formRef: any = React.createRef()

  state = {
    maxResultCount: 10,
    skipCount: 0,
    projectId: 0,
    projectProvinces: [],
    filters: {},
  }

  async componentDidMount() {
    await this.getAll()

    await Promise.all([])
  }
  getAll = async () => {
    await this.props.unitStore.getAllRes({
      ProjectId: this.props.projectId,
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
  handleFilterChange = (filters) => {
    this.setState({ filters }, this.getAll)
  }

  gotoDetail = async (id?) => {
    if (id) {
      await this.props.unitStore.getUnitRes(id)
      await this.setState({ unitId: id, visible: true })
    } else {
      // this.setState({ idBatch: null })
      this.setState({ unitId: undefined, visible: true })
    }
  }
  public render() {
    const {
      unitStore: { isLoading, tableData },
    } = this.props
    const columns = gettColumns({
      title: L("UNIT_NO"),
      align: align.center,
      dataIndex: "unitName",
      key: "unitName",
      fixed: "left",
      width: 100,
      ellipsis: false,
      render: (unitName: string, item: any) => <>{unitName}</>,
      // (
      //   <Row>
      //     <Col
      //       sm={{ span: 19, offset: 0 }}
      //       style={{ overflow: "hidden", textOverflow: "ellipsis" }}
      //     >
      //       {/* <a
      //         onClick={
      //           // this.isGranted(appPermissions.unit.update)
      //           //   ? () => this.gotoDetail(item.id)
      //           //   : () => console.log()
      //           () => this.gotoDetail(item.id)
      //         }
      //         className="link-text-table"
      //       > */}
      //       {unitName}
      //       {/* </a> */}
      //     </Col>
      //     <Col sm={{ span: 1, offset: 0 }}></Col>
      //     <Col sm={{ span: 3, offset: 0 }}>
      //       <Dropdown
      //         trigger={["click"]}
      //         overlay={
      //           <Menu>
      //             {/* {this.isGranted(appPermissions.unit.delete) && ( */}
      //             <Menu.Item
      //               key={1}
      //               // onClick={() =>
      //               //   this.activateOrDeactivate(item.id, !item.isActive)
      //               // }
      //             >
      //               {L(item.isActive ? "BTN_DEACTIVATE" : "BTN_ACTIVATE")}
      //             </Menu.Item>
      //             {/* )} */}
      //           </Menu>
      //         }
      //         placement="bottomLeft"
      //       >
      //         <button className="button-action-hiden-table-cell">
      //           <MoreOutlined />
      //         </button>
      //       </Dropdown>
      //     </Col>
      //   </Row>
      // ),
    })
    return (
      <>
        <ArrivalDeparturesFilterPanel onRefresh={() => this.getAll()} />
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
            loading={isLoading}
            pagination={false}
            dataSource={tableData === undefined ? [] : tableData.items}
            scroll={{ x: 800, y: 500, scrollToFirstRowOnChange: true }}
          />
        </DataTable>
      </>
    )
  }
}
export default withRouter(ArrivalDeparture)
