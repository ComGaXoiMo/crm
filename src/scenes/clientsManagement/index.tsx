import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Tabs } from "antd"
import { L } from "@lib/abpUtility"
import ContactsAndLead from "./contactsAndLead"
import Company from "./company"
// import ClientsReport from "@scenes/dashboardsManagement/components/clientsReport/clientsReport";
import Stores from "@stores/storeIdentifier"
import AppDataStore from "@stores/appDataStore"
import AppConsts, { appPermissions } from "@lib/appconst"

const { itemDashboard } = AppConsts
export interface IClientsProps {
  appDataStore: AppDataStore;
}

const tabKeys = {
  tabContacts_Lead: "TAB_CONTACTS_LEAD",
  tabCompany: "TAB_COMPANY",
  tabTenant: "TAB_TENANT",
  tabReport: "TAB_REPORT",
}
@inject(Stores.AppDataStore)
@observer
class Clients extends AppComponentListBase<IClientsProps> {
  formRef: any = React.createRef();
  state = {
    tabActiveKey: tabKeys.tabContacts_Lead,
    showOverView: false,
    selectItem: undefined,
  };
  async componentDidMount() {
    await Promise.all([
      this.props.appDataStore.getCountries({}),
      this.props.appDataStore.getCountryFull(),
      this.props.appDataStore.getPositionLevels({}),
      this.props.appDataStore.GetListLeadSource(""),
      this.props.appDataStore.getListLAStatus({}),
      this.props.appDataStore.getIndustries({}),
      this.props.appDataStore.getDocumentType({}),
    ])
  }
  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
    if (tabKey === tabKeys.tabReport) {
      this.setState({ selectItem: itemDashboard.client })
    }
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
            {this.isGranted(appPermissions.contact.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabContacts_Lead)}
                key={tabKeys.tabContacts_Lead}
                className={"color-tab"}
              >
                <ContactsAndLead />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.company.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabCompany)}
                key={tabKeys.tabCompany}
              >
                <Company />
              </Tabs.TabPane>
            )}

            {/* <Tabs.TabPane tab={L(tabKeys.tabReport)} key={tabKeys.tabReport}>
              <ClientsReport selectItem={this.state.selectItem} />
            </Tabs.TabPane> */}
          </Tabs>
        </div>
      </>
    )
  }
}

export default Clients
