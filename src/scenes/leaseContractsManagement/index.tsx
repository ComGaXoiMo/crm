import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Tabs } from "antd"
import { L } from "@lib/abpUtility"
import Lease from "./lease"

// import LeaseAgreementReport from "@scenes/dashboardsManagement/components/leaseAgreementReport/LeaseAgreementReport";
import { appPermissions } from "@lib/appconst"

export interface ILeaseContractsProps {
  id: any;
}

const tabKeys = {
  tabLease: "TAB_LEASE",
  tabDeposit: "TAB_DEPOSIT",
  tabPayment: "TAB_PAYMENT",
  tabReport: "TAB_REPORT",
}
@inject()
@observer
class LeaseContracts extends AppComponentListBase<ILeaseContractsProps, any> {
  formRef: any = React.createRef();
  state = {
    tabActiveKey: tabKeys.tabLease,
  };

  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  };
  public render() {
    return (
      <>
        <div className="container-element">
          <Tabs
            activeKey={this.state.tabActiveKey}
            onTabClick={this.changeTab}
            className={"antd-tab-cusstom"}
            type="card"
          >
            {this.isGranted(appPermissions.leaseAgreement.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabLease)}
                key={tabKeys.tabLease}
                className={"color-tab"}
              >
                <Lease />
              </Tabs.TabPane>
            )}

            {/* <Tabs.TabPane tab={L(tabKeys.tabReport)} key={tabKeys.tabReport}>
              <LeaseAgreementReport />
            </Tabs.TabPane> */}
          </Tabs>
        </div>
      </>
    )
  }
}

export default LeaseContracts
