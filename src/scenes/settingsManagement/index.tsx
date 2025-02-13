import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Tabs } from "antd"
import { L } from "@lib/abpUtility"
import User from "./tabUser"
import Role from "./tabRole"
import TabLanguage from "./tabLanguage"

import TabEProposalTemplate from "./tabEProposalTemplate"
import TabOtherConfig from "./tabOtherConfig"
import TabTeam from "./tabTeam"
import { appPermissions } from "@lib/appconst"
import ProjectStore from "@stores/projects/projectStore"
import Stores from "@stores/storeIdentifier"
import UserStore from "@stores/administrator/userStore"
import { GetRoles } from "@services/administrator/user/dto/getRolesOuput"
import TabVatConfig from "./tabVatConfig"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import TabLaReminderSetting from "./tabLaReminderSetting"
import TabLaStatusControl from "./tabLaStatusControl"
import TabBookingFormTemplate from "./tabBookingFormTemplate"
import TabDepositTemplate from "./tabDepositTemplate"
import TabTerminateNoteTemplate from "./tabTerminateNoteTemplate"
import TabLeaseAgreementTemplate from "./tabLeaseAgreementTemplate"
import TabBudget from "./tabBudget"
export interface ISettingsProps {
  projectStore: ProjectStore
  userStore: UserStore
  leaseAgreementStore: LeaseAgreementStore
}

export interface ISettingsState {
  listRole: any[]
  tabActiveKey: any
}
const tabKeys = {
  tabUser: "TAB_USER",
  tabRole: "TAB_ROLE",
  tabLanguage: "TAB_LANGUAGE",
  tabDepartment: "TAB_DEPARTMENT",
  tabEProposalTemplate: "TAB_E_PROPOSAL_TEMPLATE",
  tabOfferLetterTemplate: "TAB_OFFER_LETTER_TEMPLATE",
  tabBookingFormTemplate: "TAB_BOOKING_FORM_TEMPLATE",
  tabTerminateNoteTemplate: "TAB_TERMINATE_NOTE_TEMPLATE",
  tabLeaseAgreementTemplate: "TAB_LEASE_AGREEMENT_TEMPLATE",
  tabDepositTemplate: "TAB_DEPOSIT_TEMPLATE",
  tabUnitSetting: "TAB_UNIT_SETTING",
  tabSubStageInquiry: "TAB_SUBSTAGE_INQUIRY",
  tabTaskAlertDay: "TAB_TASK_ALERT_DAY",
  tabOtherConfig: "TAB_OTHER_CONFIG",
  tabVATConfig: "TAB_VAT_CONFIG",
  tabLaReminder: "TAB_LA_REMINDER",
  tabLaStatusControl: "TAB_LA_STATUS_CONTROL",
  testSynf: "testSynf",
  tabBudgetApp: "TAB_BUDGET_APP",
}
@inject(Stores.ProjectStore, Stores.UserStore, Stores.LeaseAgreementStore)
@observer
class Settings extends AppComponentListBase<ISettingsProps, ISettingsState> {
  formRef: any = React.createRef()
  state = {
    tabActiveKey: tabKeys.tabUser,
    listRole: [] as any,
  }
  async componentDidMount() {
    await this.props.userStore.getRoles()
    await this.props.userStore.getTeam("")
    await this.props.leaseAgreementStore.getListFeeType("")

    const listRoleFilter = this.props.userStore.roles.map((x: GetRoles) => {
      return { label: x.displayName, value: x.id }
    })
    await this.setState({ listRole: listRoleFilter })
  }

  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
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
            {this.isGranted(appPermissions.staff.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabUser)}
                key={tabKeys.tabUser}
                className={"color-tab"}
              >
                <User listRoleFilter={this.state.listRole} />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.adminTeam.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabDepartment)}
                key={tabKeys.tabDepartment}
              >
                <TabTeam />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.adminRole.page) && (
              <Tabs.TabPane tab={L(tabKeys.tabRole)} key={tabKeys.tabRole}>
                <Role />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.setting.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabEProposalTemplate)}
                key={tabKeys.tabEProposalTemplate}
              >
                <TabEProposalTemplate
                  selectItem={this.state.tabActiveKey}
                  tabKey={tabKeys.tabEProposalTemplate}
                />
              </Tabs.TabPane>
            )}
            {/* {this.isGranted(appPermissions.setting.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabOfferLetterTemplate)}
                key={tabKeys.tabOfferLetterTemplate}
              >
                <TabOLTemplate />
              </Tabs.TabPane>
            )} */}
            {this.isGranted(appPermissions.setting.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabBookingFormTemplate)}
                key={tabKeys.tabBookingFormTemplate}
              >
                <TabBookingFormTemplate
                  selectItem={this.state.tabActiveKey}
                  tabKey={tabKeys.tabBookingFormTemplate}
                />
              </Tabs.TabPane>
            )}{" "}
            {this.isGranted(appPermissions.setting.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabTerminateNoteTemplate)}
                key={tabKeys.tabTerminateNoteTemplate}
              >
                <TabTerminateNoteTemplate
                  selectItem={this.state.tabActiveKey}
                  tabKey={tabKeys.tabTerminateNoteTemplate}
                />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.setting.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabDepositTemplate)}
                key={tabKeys.tabDepositTemplate}
              >
                <TabDepositTemplate
                  selectItem={this.state.tabActiveKey}
                  tabKey={tabKeys.tabDepositTemplate}
                />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.setting.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabLeaseAgreementTemplate)}
                key={tabKeys.tabLeaseAgreementTemplate}
              >
                <TabLeaseAgreementTemplate
                  selectItem={this.state.tabActiveKey}
                  tabKey={tabKeys.tabLeaseAgreementTemplate}
                />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.setting.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabOtherConfig)}
                key={tabKeys.tabOtherConfig}
              >
                <TabOtherConfig
                  selectItem={this.state.tabActiveKey}
                  tabKey={tabKeys.tabOtherConfig}
                />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.setting.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabLaReminder)}
                key={tabKeys.tabLaReminder}
              >
                <TabLaReminderSetting
                  selectItem={this.state.tabActiveKey}
                  tabKey={tabKeys.tabLaReminder}
                />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.setting.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabVATConfig)}
                key={tabKeys.tabVATConfig}
              >
                <TabVatConfig />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.adminLanguage.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabLanguage)}
                key={tabKeys.tabLanguage}
              >
                <TabLanguage />
              </Tabs.TabPane>
            )}
            {this.isGranted(appPermissions.setting.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabLaStatusControl)}
                key={tabKeys.tabLaStatusControl}
              >
                <TabLaStatusControl
                  selectItem={this.state.tabActiveKey}
                  tabKey={tabKeys.tabLaReminder}
                />
              </Tabs.TabPane>
            )}
            {/* TODO: add role */}
            {this.isGranted(appPermissions.budget.page) && (
              <Tabs.TabPane
                tab={L(tabKeys.tabBudgetApp)}
                key={tabKeys.tabBudgetApp}
              >
                <TabBudget />
              </Tabs.TabPane>
            )}
          </Tabs>
        </div>
      </>
    )
  }
}

export default Settings
