import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"

import { Tabs } from "antd"
import { L } from "@lib/abpUtility"
import Units from "./units"
import Projects from "./projects"
import UnitStore from "@stores/projects/unitStore"
import AppDataStore from "@stores/appDataStore"
import Stores from "@stores/storeIdentifier"
import { appPermissions } from "@lib/appconst"
import Tenants from "./tenants"

export interface IPropertiesProps {
  projectId: any

  unitStore: UnitStore
  appDataStore: AppDataStore
}

const tabKeys = {
  tabProjects: "TAB_PROJECT",
  tabUnits: "TAB_UNITS",
  tabTenant: "TAB_GUEST",
  tabArrival_Departure: "TAB_ARRIVAL_DEPARTURE",
  tabSiteVisit: "TAB_SITE_VISIT",
  tabReport: "TAB_REPORT",
}
@inject(Stores.AppDataStore, Stores.UnitStore)
@observer
class Properties extends AppComponentListBase<IPropertiesProps> {
  formRef: any = React.createRef()
  state = {
    tabActiveKey: tabKeys.tabUnits,
    showOverView: false,
  }
  async componentDidMount() {
    await Promise.all([
      this.props.unitStore?.getFacing(),
      this.props.unitStore?.getView(),
      this.props.appDataStore.getCountryFull(),
      this.props.appDataStore.getCountries({}),
      this.props.appDataStore.GetListUnitStatus(""),
      this.props.appDataStore.GetListUnitType(""),
      this.props.appDataStore.GetListUnitFacility(""),
      this.props.appDataStore.getDocumentType(""),
      this.props.appDataStore.GetListProjectFacility(""),
      this.props.appDataStore.getListLAStatus({}),
      this.props.appDataStore.GetListPropertyType(""),
    ])
  }

  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  }

  public render() {
    return (
      <>
        <Tabs activeKey={this.state.tabActiveKey} onTabClick={this.changeTab}>
          {this.isGranted(appPermissions.project.page) && (
            <Tabs.TabPane
              tab={L(tabKeys.tabProjects)}
              key={tabKeys.tabProjects}
            >
              <Projects />
            </Tabs.TabPane>
          )}
          {this.isGranted(appPermissions.unit.page) && (
            <Tabs.TabPane tab={L(tabKeys.tabUnits)} key={tabKeys.tabUnits}>
              <Units />
            </Tabs.TabPane>
          )}
          {this.isGranted(appPermissions.userTenant.page) && (
            <Tabs.TabPane tab={L(tabKeys.tabTenant)} key={tabKeys.tabTenant}>
              <Tenants />
            </Tabs.TabPane>
          )}
        </Tabs>
      </>
    )
  }
}

export default Properties
