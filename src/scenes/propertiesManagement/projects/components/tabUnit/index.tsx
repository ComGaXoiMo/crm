import * as React from "react"
import gettColumns from "./column"

import { inject, observer } from "mobx-react"
import UnitFilterPanel from "./unitFilterPanel"
import { L } from "@lib/abpUtility"
import { Table } from "antd"
import DataTable from "@components/DataTable"
import Stores from "@stores/storeIdentifier"
import UnitStore from "@stores/projects/unitStore"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { renderDotActive } from "@lib/helper"
// import StackPland from "@scenes/propertiesManagement/units/components/stackPland";

export interface IUnitProps {
  history: any
  projectId: any
  unitStore: UnitStore
}

export interface IUnitState {
  maxResultCount: number
  skipCount: number
  filters: any
  visible: boolean
  unitId: any
  visibleDetailProject: boolean
  projectId: any
}

@inject(Stores.AppDataStore, Stores.UnitStore)
@observer
class UnitInProject extends AppComponentListBase<IUnitProps, IUnitState> {
  formRef: any = React.createRef()
  state = {
    maxResultCount: 10,
    skipCount: 0,
    unitId: undefined,
    filters: {
      isActive: true,
    },
    visible: false,
    projectId: null,
    visibleDetailProject: false,
  }

  async componentDidMount() {
    await this.getAll()
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.projectId !== this.props.projectId) {
      await this.getAll()
    }
  }
  getAll = async () => {
    await this.props.unitStore.getAllUnitInProject({
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
  handleFilterChange = async (filters) => {
    await this.setState({ filters })
    await this.getAll()
  }

  public render() {
    const {
      unitStore: { isLoading, listUnitInProject },
    } = this.props
    const columns = gettColumns({
      title: L("UNIT_NUMBER"),

      dataIndex: "unitName",
      key: "unitName",
      fixed: "left",
      width: 150,
      ellipsis: false,
      render: (unitName: string, item: any) => (
        <div className="flex gap-1">
          {renderDotActive(item.isActive)}
          {unitName}
        </div>
      ),
    })
    return (
      <>
        <div>
          <DataTable
            filterComponent={
              <UnitFilterPanel
                projectId={this.props.projectId}
                handleSearch={this.handleFilterChange}
              />
            }
            onRefresh={() => {
              this.getAll()
            }}
            handleSearch={this.handleFilterChange}
            pagination={{
              pageSize: this.state.maxResultCount,
              total:
                listUnitInProject === undefined
                  ? 0
                  : listUnitInProject.totalCount,
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
              dataSource={
                listUnitInProject === undefined ? [] : listUnitInProject.items
              }
              scroll={{
                x: 1000,
                y: "calc(100vh - 23rem)",
                scrollToFirstRowOnChange: true,
              }}
            />
          </DataTable>
        </div>
      </>
    )
  }
}

export default withRouter(UnitInProject)
