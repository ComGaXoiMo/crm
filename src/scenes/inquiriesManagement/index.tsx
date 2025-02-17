import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Tabs } from "antd"
import { L } from "@lib/abpUtility"
import InquiriesList from "./inquiriesList"
import Stores from "@stores/storeIdentifier"
import { appPermissions } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import AppDataStore from "@stores/appDataStore"
import UnitStore from "@stores/projects/unitStore"
import ReservationStore from "@stores/activity/reservationStore"
// import InquiriesReport from "@scenes/dashboardsManagement/components/inquiriesReport/inquiriesReport";

export interface IInquiriesProps {
  id: any
  appDataStore: AppDataStore
  unitStore: UnitStore
  reservationStore: ReservationStore
}

const tabKeys = {
  tabInquiriesList: L("TAB_INQUIRIES_LIST"),
  tabReports: L("TAB_REPORTS"),
}
@inject(Stores.UnitStore, Stores.AppDataStore, Stores.ReservationStore)
@observer
class Inquiries extends AppComponentListBase<IInquiriesProps, any> {
  formRef: any = React.createRef()
  state = {
    tabActiveKey: tabKeys.tabInquiriesList,
  }
  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  }
  async componentDidMount() {
    try {
      await Promise.all([
        this.props.appDataStore.getCountryFull(),
        this.props.appDataStore.getContacts(""),
        this.props.appDataStore.getClients(""),
        this.props.appDataStore.getInquirySourceAndStatus(),

        this.props.appDataStore.getPositionLevels(""),
        this.props.appDataStore.getCountries(""),
        this.props.appDataStore.GetListPropertyType(""),
        this.props.appDataStore.GetListUnitStatus(""),

        this.props.appDataStore.GetListUnitFacility(""),
        this.props.appDataStore.getListLAStatus({}),
        this.props.appDataStore.GetListUnitType(""),
        this.props.appDataStore.getInquirySource(),
        this.props.appDataStore.getDocumentType(""),
        this.props.reservationStore.getSettingReservation(),
        this.props.appDataStore.getUnitServiceType(),
        this.props.unitStore.getView(),
        this.props.unitStore.getFacing(),
        this.props.appDataStore.getTaskStatus(),
      ])
    } catch (error) {
      console.error("An error occurred during data fetching:", error)
    }
  }
  public render() {
    return (
      <>
        <div className="container-element">
          <Tabs activeKey={this.state.tabActiveKey} onTabClick={this.changeTab}>
            {this.isGranted(appPermissions.inquiry.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabInquiriesList)}
                key={tabKeys.tabInquiriesList}
              >
                <InquiriesList />
              </Tabs.TabPane>
            )}
            {/* <Tabs.TabPane tab={L(tabKeys.tabReports)} key={tabKeys.tabReports}>
              <InquiriesReport />
            </Tabs.TabPane> */}
          </Tabs>
        </div>
      </>
    )
  }
}

export default withRouter(Inquiries)
