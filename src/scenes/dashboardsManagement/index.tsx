import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Tabs } from "antd"
import { L } from "@lib/abpUtility"
import Overviews from "./components/overview/overviews"
import Clients from "./components/clientsReport/clientsReport"
import Inquiries from "./components/inquiriesReport/inquiriesReport"
import Tasks from "./components/tasksReport/tasksReport"
import Staffs from "./components/staffsReport/staffsReport"
import PropertiesReport from "./components/propertiesReport/propertiesReport"
import LeaseAgreementReport from "./components/leaseAgreementReport/LeaseAgreementReport"
import AppConsts, { appPermissions } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import CommissionReport from "./components/commissionReport/commissionReport"
import Stores from "@stores/storeIdentifier"
import UserStore from "@stores/administrator/userStore"
import DepositReport from "./components/depositReport/depositReport"
import UnitOccReport from "./components/unitOcc/unitOccReport"
import AppUsageReport from "./components/appUsageReport/appUsageReport"
import RevenuePerformance from "./components/revenuePerformanceReport/revenuePerformance"
// import TestExcl from "./components/testExcl/testExcl"

const { itemDashboard } = AppConsts
type Props = {
  userStore: UserStore
}
const tabKeys = {
  tabOverview: "TAB_OVERVIEW",
  tabLeasing: "TAB_LEASING",
  tabClients: "TAB_CLIENTS",
  tabLeaseAgreement: "TAB_LEASE_AGREEMENT",
  tabInquiries: "TAB_INQUIRIES",
  tabTasks: "TAB_TASKS",
  tabStaff: "TAB_STAFF",
  tabProperties: "TAB_PROPERTIES",
  tabCommission: "TAB_COMMISSION_REPORT",
  tabDepoisit: "TAB_DEPOSIT_REPORT",
  tabUnitOcc: "TAB_UNIT_OCC",
  tabAppUsage: "TAB_APP_USAGE",
  tabRevenuePerformance: "TAB_OCC_RATE_&_REVENUE_PERFORMANCE",
  testExcl: "TestExcl",
}
@inject(Stores.UserStore)
@observer
class Dashboards extends AppComponentListBase<Props> {
  formRef: any = React.createRef()
  state = {
    tabActiveKey: tabKeys.tabOverview,
    selectItem: itemDashboard.overView,
  }

  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
    if (tabKey === tabKeys.tabOverview) {
      this.setState({ selectItem: itemDashboard.overView })
    }
    if (tabKey === tabKeys.tabProperties) {
      this.setState({ selectItem: itemDashboard.property })
    }
    if (tabKey === tabKeys.tabClients) {
      this.setState({ selectItem: itemDashboard.client })
    }
    if (tabKey === tabKeys.tabInquiries) {
      this.setState({ selectItem: itemDashboard.inquiry })
    }
    if (tabKey == tabKeys.tabTasks) {
      this.setState({ selectItem: itemDashboard.task })
    }
    if (tabKey === tabKeys.tabInquiries) {
      this.setState({ selectItem: itemDashboard.inquiry })
    }
    if (tabKey === tabKeys.tabStaff) {
      this.setState({ selectItem: itemDashboard.staff })
    }
    if (tabKey === tabKeys.tabLeaseAgreement) {
      this.setState({ selectItem: itemDashboard.LA })
    }
    if (tabKey === tabKeys.tabCommission) {
      this.setState({ selectItem: itemDashboard.commission })
    }
    if (tabKey === tabKeys.tabDepoisit) {
      this.setState({ selectItem: itemDashboard.deposit })
    }
    if (tabKey === tabKeys.tabUnitOcc) {
      this.setState({ selectItem: itemDashboard.unitOcc })
    }
  }
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
            {this.isGranted(appPermissions.report.overview) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabOverview)}
                key={tabKeys.tabOverview}
                className={"color-tab"}
              >
                <Overviews selectItem={this.state.selectItem} />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.report.property) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabProperties)}
                key={tabKeys.tabProperties}
                className={"color-tab"}
              >
                <PropertiesReport selectItem={this.state.selectItem} />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.report.client) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabClients)}
                key={tabKeys.tabClients}
              >
                <Clients selectItem={this.state.selectItem} />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.report.inquiry) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabInquiries)}
                key={tabKeys.tabInquiries}
              >
                <Inquiries selectItem={this.state.selectItem} />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.report.leaseAgreement) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabLeaseAgreement)}
                key={tabKeys.tabLeaseAgreement}
              >
                <LeaseAgreementReport selectItem={this.state.selectItem} />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.report.task) && (
              <Tabs.TabPane tab={L(tabKeys.tabTasks)} key={tabKeys.tabTasks}>
                <Tasks selectItem={this.state.selectItem} />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.report.staff) && (
              <Tabs.TabPane tab={L(tabKeys.tabStaff)} key={tabKeys.tabStaff}>
                <Staffs selectItem={this.state.selectItem} />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.report.commission) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabCommission)}
                key={tabKeys.tabCommission}
              >
                <CommissionReport selectItem={this.state.selectItem} />
              </Tabs.TabPane>
            )}
            {/* {this.isGranted(appPermissions.report.commission) && (
              <Tabs.TabPane tab={L(tabKeys.testExcl)} key={tabKeys.testExcl}>
                <TestExcl selectItem={this.state.selectItem} />
              </Tabs.TabPane>
            )} */}
            {this.isGranted(appPermissions.report.deposit) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabDepoisit)}
                key={tabKeys.tabDepoisit}
              >
                <DepositReport selectItem={this.state.selectItem} />
              </Tabs.TabPane>
            )}{" "}
            {this.isGranted(appPermissions.report.unitOcc) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabUnitOcc)}
                key={tabKeys.tabUnitOcc}
              >
                <UnitOccReport selectItem={this.state.selectItem} />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.report.appUsage) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabAppUsage)}
                key={tabKeys.tabAppUsage}
              >
                <AppUsageReport selectItem={this.state.selectItem} />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.report.budget) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabRevenuePerformance)}
                key={tabKeys.tabRevenuePerformance}
              >
                <RevenuePerformance selectItem={this.state.selectItem} />
              </Tabs.TabPane>
            )}
          </Tabs>
        </div>
      </>
    )
  }
}

export default withRouter(Dashboards)
