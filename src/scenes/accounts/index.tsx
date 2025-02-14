import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"

import MyProfile from "./AccountConfig/MyProfile"

const tabKeys = {
  tabInfomation: "TAB_INFOMATION",
  tabDecentrallization: "TAB_DECENTRALLIZATION",
}
@inject()
@observer
class AccountConfig extends AppComponentListBase<any, any> {
  formRef: any = React.createRef()
  state = {
    tabActiveKey: tabKeys.tabInfomation,
  }

  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  }
  public render() {
    return (
      <div style={{ padding: 20 }}>
        {/* <Tabs
          activeKey={this.state.tabActiveKey}
          onTabClick={this.changeTab}
          
          type="card"
        >
          <Tabs.TabPane
            tab={L(tabKeys.tabInfomation)}
            key={tabKeys.tabInfomation}
            
          > */}
        <MyProfile />
        {/* </Tabs.TabPane>
        </Tabs> */}
      </div>
    )
  }
}

export default AccountConfig
