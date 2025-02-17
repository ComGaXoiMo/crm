import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Tabs } from "antd"
import { L } from "@lib/abpUtility"
import Task from "./allTask"
import AppDataStore from "@stores/appDataStore"
import Stores from "@stores/storeIdentifier"
import { appPermissions } from "@lib/appconst"

export interface ITasksProps {
  appDataStore: AppDataStore
}

const tabKeys = {
  tabMyTask: L("TAB_MY_TASK"),
  tabAll: L("TAB_ALL"),
}
@inject(Stores.AppDataStore)
@observer
class Tasks extends AppComponentListBase<ITasksProps> {
  formRef: any = React.createRef()
  state = {
    tabActiveKey: tabKeys.tabMyTask,
  }
  async componentDidMount() {
    this.props.appDataStore.getTaskStatus()
    await Promise.all([])
  }
  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  }
  public render() {
    return (
      <>
        <div className="container-element">
          <Tabs activeKey={this.state.tabActiveKey} onTabClick={this.changeTab}>
            {this.isGranted(appPermissions.task.page) && (
              <Tabs.TabPane tab={L(tabKeys.tabMyTask)} key={tabKeys.tabMyTask}>
                {this.state.tabActiveKey === tabKeys.tabMyTask && (
                  <Task isMyTask={true} />
                )}
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.task.page) &&
              this.isGranted(appPermissions.task.allTask) && (
                <Tabs.TabPane tab={L(tabKeys.tabAll)} key={tabKeys.tabAll}>
                  {this.state.tabActiveKey === tabKeys.tabAll && (
                    <Task isMyTask={false} />
                  )}
                </Tabs.TabPane>
              )}
          </Tabs>
        </div>
      </>
    )
  }
}

export default Tasks
