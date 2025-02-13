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
  history: any;
  projectId: any;
  unitStore: UnitStore;
}

export interface IUnitState {
  maxResultCount: number;
  skipCount: number;
  filters: any;
  visible: boolean;
  tabView: string;
  unitId: any;
  visibleDetailProject: boolean;
  projectId: any;
}
const tabKeys = {
  gridView: L("GRID_VIEW"),
  listView: L("LIST_VIEW"),
}
@inject(Stores.AppDataStore, Stores.UnitStore)
@observer
class UnitInProject extends AppComponentListBase<IUnitProps, IUnitState> {
  formRef: any = React.createRef();
  state = {
    maxResultCount: 10,
    skipCount: 0,
    unitId: undefined,
    filters: {
      isActive: true,
    },
    visible: false,
    tabView: tabKeys.listView,
    projectId: null,
    visibleDetailProject: false,
  };

  async componentDidMount() {
    await this.getAll()
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.projectId !== this.props.projectId) {
      await this.getAll()
    }
    if (prevState.tabView !== this.state.tabView) {
      if (this.state.tabView === tabKeys.listView) {
        await this.getAll()
      }
    }
  }
  getAll = async () => {
    await this.props.unitStore.getAllUnitInProject({
      ProjectId: this.props.projectId,
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
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
    await this.setState({ filters })
    if (this.state.tabView === tabKeys.listView) {
      await this.getAll()
    }
  };
  changeTab = async (value) => {
    await this.setState({ tabView: value.target.value })
  };
  gotoDetailProject = (id?) => {
    if (id) {
      this.setState({ projectId: id })
      this.setState({ visibleDetailProject: true })
    } else {
      this.setState({ projectId: null })
      this.setState({ visibleDetailProject: true })
    }
  };
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
        <>
          {renderDotActive(item.isActive)}
          {unitName}
        </>
      ),
    })
    return (
      <>
        <div>
          <UnitFilterPanel
            projectId={this.props.projectId}
            tabKeys={tabKeys}
            changeTab={this.changeTab}
            handleSearch={this.handleFilterChange}
            onCreateProject={() => {
              this.gotoDetailProject()
            }}
            onRefresh={() => {
              this.getAll()
            }}
          />
          {this.state.tabView === tabKeys.listView && (
            <DataTable
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
                scroll={{ x: 800, y: 500, scrollToFirstRowOnChange: true }}
                bordered
              />
            </DataTable>
          )}
          {/* {this.state.tabView === tabKeys.gridView && (
            <div style={{ maxHeight: "75vh", overflow: "hidden" }}>
              <StackPland
                loading={isLoading}
                projectId={this.props.projectId}
                filter={this.state.filters}
              />
            </div>
          )} */}
        </div>
      </>
    )
  }
}

export default withRouter(UnitInProject)
