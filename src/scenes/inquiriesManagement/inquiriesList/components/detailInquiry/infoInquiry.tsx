import * as React from "react"

import { inject, observer } from "mobx-react"

import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { Tabs } from "antd"
import { L } from "@lib/abpUtility"

import Info from "./info"
import TabDocument from "./tabDocument"
import TabAuditTrail from "./tabAuditTrail"
import TabUnitMatching from "./tabUnitMatching"
import TabContract from "@scenes/propertiesManagement/units/components/tabContract"
import { appPermissions, moduleNames } from "@lib/appconst"
import InquiryStore from "@stores/communication/inquiryStore"
import Stores from "@stores/storeIdentifier"
import MailActivity from "@scenes/activity/mailActivity"
import CallActivity from "@scenes/activity/callActivity"
import ProposalActivity from "@scenes/activity/proposalActivity"
import SitevisitActivity from "@scenes/activity/sitevisitActivity"
import ReservationActivity from "@scenes/activity/reservationActivity"
import TaskActivity from "@scenes/activity/taskActivity"
import AllActivity from "@scenes/activity/allActivity"
export interface IinfoInquiryProps {
  id: any
  isEdit: any
  visible: boolean
  companies: any
  contactEmail: any
  isCreateContact: any
  location: any
  formRef: any
  onCheckPhone: any
  inquiryStore: InquiryStore
  contactType: number
  listProject: any
  listIqrStage: any
}

export interface IinfoInquiryState {
  tabActiveKey: any
}

@inject(Stores.InquiryStore)
@observer
class infoInquiry extends AppComponentListBase<
  IinfoInquiryProps,
  IinfoInquiryState
> {
  state = {
    tabActiveKey: tabKeys.tabInfo,
  }
  async componentDidMount() {
    this.props.location.search === "?proposal" &&
      this.setState({ tabActiveKey: tabKeys.tabProposal })
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.setState({ tabActiveKey: tabKeys.tabInfo })
      }
    }
  }
  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  }

  public render() {
    return (
      <>
        <Tabs
          activeKey={this.state.tabActiveKey}
          onTabClick={this.changeTab}
          className={"antd-tab-cusstom h-100"}
          type="card"
        >
          <Tabs.TabPane
            tab={L(tabKeys.tabInfo)}
            key={tabKeys.tabInfo}
            className={"color-tab"}
          >
            <Info
              formRef={this.props.formRef}
              id={this.props.id}
              contactType={this.props.contactType}
              companies={this.props.companies}
              visible={this.props.visible}
              isEdit={this.props.isEdit}
              isCreateContact={this.props.isCreateContact}
              onCheckPhone={this.props.onCheckPhone}
              listProject={this.props.listProject}
              listIqrStage={this.props.listIqrStage}
            />
          </Tabs.TabPane>
          {this.props.id && (
            <Tabs.TabPane
              tab={L(tabKeys.tabUnitMatching)}
              key={tabKeys.tabUnitMatching}
              className={"color-tab"}
            >
              <TabUnitMatching
                visible={this.props.visible}
                inquiryId={this.props.id}
              />
            </Tabs.TabPane>
          )}
          {this.props.id && (
            <>
              <Tabs.TabPane
                tab={L(tabKeys.tabActivity)}
                key={tabKeys.tabActivity}
                className={"color-tab"}
              >
                <AllActivity
                  inquiryId={this.props.id}
                  keyTab={tabKeys.tabActivity}
                  tabKeyChoose={this.state.tabActiveKey}
                />
              </Tabs.TabPane>
              {this.isGranted(appPermissions.task.read) && (
                <Tabs.TabPane
                  tab={L(tabKeys.tabTask)}
                  key={tabKeys.tabTask}
                  className={"color-tab"}
                >
                  <TaskActivity inquiryId={this.props.id} />
                </Tabs.TabPane>
              )}
              <Tabs.TabPane
                tab={L(tabKeys.tabMail)}
                key={tabKeys.tabMail}
                className={"color-tab"}
              >
                <MailActivity inquiryId={this.props.id} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={L(tabKeys.tabCall)}
                key={tabKeys.tabCall}
                className={"color-tab"}
              >
                <CallActivity inquiryId={this.props.id} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={L(tabKeys.tabProposal)}
                key={tabKeys.tabProposal}
                className={"color-tab"}
              >
                <ProposalActivity inquiryId={this.props.id} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={L(tabKeys.tabSiteVisit)}
                key={tabKeys.tabSiteVisit}
                className={"color-tab"}
              >
                <SitevisitActivity inquiryId={this.props.id} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={L(tabKeys.tabReservation)}
                key={tabKeys.tabReservation}
                className={"color-tab"}
              >
                <ReservationActivity
                  inquiryId={this.props.id}
                  selectItem={this.state.tabActiveKey}
                  tabKey={tabKeys.tabReservation}
                />
              </Tabs.TabPane>
              {this.isGranted(appPermissions.leaseAgreement.read) && (
                <Tabs.TabPane
                  tab={L(tabKeys.tabLeaseAgreement)}
                  key={tabKeys.tabLeaseAgreement}
                >
                  <TabContract
                    inquiryId={this.props.id}
                    contactEmail={this.props.contactEmail}
                  />
                </Tabs.TabPane>
              )}
              <Tabs.TabPane
                tab={L(tabKeys.tabDocument)}
                key={tabKeys.tabDocument}
                className={"color-tab"}
              >
                <TabDocument
                  moduleId={moduleNames.inquiry}
                  inputId={this.props.inquiryStore.inquiryDetail?.uniqueId}
                  createPermission={this.isGranted(
                    appPermissions.inquiry.create
                  )}
                  updatePermission={this.isGranted(
                    appPermissions.inquiry.update
                  )}
                  deletePermission={this.isGranted(
                    appPermissions.inquiry.delete
                  )}
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={L(tabKeys.tabAuditTrail)}
                key={tabKeys.tabAuditTrail}
                className={"color-tab"}
              >
                <TabAuditTrail
                  visible={this.props.visible}
                  parentId={this.props.id}
                />
              </Tabs.TabPane>
            </>
          )}
        </Tabs>
      </>
    )
  }
}

export default withRouter(infoInquiry)
const tabKeys = {
  tabInfo: "TAB_INFO",
  tabUnitMatching: "TAB_UNIT_MATCHING",
  tabActivity: "TAB_ACTIVITY",
  tabTask: "TAB_TASK",
  tabMatching: "TAB_MATCHING",
  tabMail: "TAB_MAIL",
  tabCall: "TAB_CALL",
  tabProposal: "TAB_PROPOSAL",
  tabOffer: "TAB_OFFER",
  tabLeaseAgr: "TAB_LEASE_AGREEMENT",
  tabSiteVisit: "TAB_SITE_VISIT",
  tabReservation: "TAB_RESERVATION",
  tabDocument: "TAB_DOCUMENT",
  tabAssociateParty: "TAB_ASSOCIATE_PARTY",
  tabAuditTrail: "TAB_AUDIT_TRAIL",
  tabLeaseAgreement: "TAB_LEASE_AGREEMENT",
}
