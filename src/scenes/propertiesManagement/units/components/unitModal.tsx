import { inject, observer } from "mobx-react"
import * as React from "react"
import CustomDrawer from "@components/Drawer/CustomDrawer"
import { Tabs } from "antd"
import { L } from "@lib/abpUtility"
// import TabInfo from "./tabInfo";
import withRouter from "@components/Layout/Router/withRouter"
import Stores from "@stores/storeIdentifier"
import UnitStore from "@stores/projects/unitStore"
import UnitInfo from "./tabInfo/unitResDetail"
import TabContract from "./tabContract"
import TabStatus from "./tabStatus"
import { AppComponentListBase } from "@components/AppComponentBase"
import { appPermissions, moduleNames } from "@lib/appconst"
import TabDocument from "@scenes/inquiriesManagement/inquiriesList/components/detailInquiry/tabDocument"
import TabUntiInquiry from "./tabUntiInquiry"
import SitevisitActivity from "@scenes/activity/sitevisitActivity"
import AllActivity from "@scenes/activity/allActivity"
import TabMoveInOut from "@scenes/propertiesManagement/tenants/components/tabMoveInOut"
import ReservationListing from "@scenes/activity/reservationActivity/reservationListing"

type Props = {
  visible: boolean
  id: any
  onCancel: () => void
  onOk: () => void
  unitStore: UnitStore
}
type State = {
  tabActiveKey: any
  isEdit: boolean
  data: any
  isCreate: boolean
}
const tabKeys = {
  tabInfo: "TAB_INFO",
  tabActivity: "TAB_ACTIVITY",
  tabReservation: "TAB_RESERVATION",
  tabSiteVisit: "TAB_SITE_VISITS",
  tabMoveInOut: "TAB_GUEST_UNIT",
  tabLeaseAgreement: "TAB_LEASE_AGREEMENT",
  tabInquiry: "TAB_UNIT_RECOMMENDATION",
  tabInquiryReservation: "TAB_INQUIRY_RESERVATION",
  tabStatus: "TAB_UNIT_STATUS",

  tabDocuments: "TAB_DOCUMENTS",
}
@inject(Stores.UnitStore)
@observer
class UnitModal extends AppComponentListBase<Props, State> {
  formRef = React.createRef<any>()

  constructor(props: Props) {
    super(props)
    this.state = {
      tabActiveKey: tabKeys.tabInfo,
      isEdit: false,
      isCreate: false,
      data: {} as any,
    }
    this.changeTab = this.changeTab.bind(this)
  }
  componentDidUpdate = async (prevProps: Props) => {
    const {
      unitStore: { editUnitRes },
    } = this.props
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        if (this.props.id) {
          await this.props.unitStore.getProjectPropertyType(
            editUnitRes?.projectId
          )
          await this.props.unitStore.getListUnitTypeByProject(
            editUnitRes?.projectId,
            editUnitRes?.productTypeId
          )
          await this.setState({ data: editUnitRes })
          this.setState({ isEdit: false, isCreate: false })
        } else {
          this.setState({ data: {}, isEdit: true, isCreate: true })
        }
      }
    }
  }

  changeTab(tabKey: string) {
    this.setState({
      tabActiveKey: tabKey,
    })
  }
  handleClose = async () => {
    await this.formRef.current?.resetFields()
    this.setState({
      tabActiveKey: tabKeys.tabInfo,
    })
    await this.props.onCancel()
  }

  handleEdit = () => {
    this.setState({ isEdit: true })
  }
  handleSave = async (id?) => {
    let formValues = await this.formRef.current?.validateFields()
    if (id) {
      formValues = { ...formValues, id: id }
    }
    await this.props.unitStore.CreateOrUpdateRes(formValues, undefined)
    this.setState({
      tabActiveKey: tabKeys.tabInfo,
    })
    await this.props.onOk()
    this.setState({ isEdit: false })
    if (!id) {
      this.handleClose()
    }
  }

  render() {
    const {
      visible,
      unitStore: { editUnitRes, isLoading },
    } = this.props
    const { tabActiveKey } = this.state
    return (
      <CustomDrawer
        useBottomAction
        title={
          this.props.id
            ? `${editUnitRes?.projectCode}-${editUnitRes?.unitName}`
            : L("NEW_UNIT")
        }
        visible={visible}
        onClose={() => this.handleClose()}
        isEdit={this.state.isEdit}
        onCreate={this.props.id ? undefined : () => this.handleSave()}
        onEdit={this.props.id ? this.handleEdit : undefined}
        onSave={() => this.handleSave(this.props.id)}
        loading={isLoading}
        updatePermission={this.isGranted(appPermissions.unit.update)}
      >
        <Tabs
          activeKey={tabActiveKey}
          onTabClick={this.changeTab}
          className={"antd-tab-cusstom h-100"}
          type="card"
        >
          <Tabs.TabPane
            tab={L(tabKeys.tabInfo)}
            key={tabKeys.tabInfo}
            className={"color-tab h-100"}
            style={{ paddingBottom: "10px" }}
          >
            <UnitInfo
              isCreate={this.state.isCreate}
              isEdit={this.state.isEdit}
              formRef={this.formRef}
              id={this.props?.id}
              unitRes={editUnitRes}
              visible={this.props.visible}
            />
          </Tabs.TabPane>
          {this.props.id && (
            <>
              <Tabs.TabPane
                tab={L(tabKeys.tabActivity)}
                key={tabKeys.tabActivity}
              >
                <AllActivity
                  unitId={this.props.id}
                  keyTab={tabKeys.tabActivity}
                  tabKeyChoose={this.state.tabActiveKey}
                />
              </Tabs.TabPane>
              {this.isGranted(appPermissions.inquiry.read) && (
                <Tabs.TabPane
                  tab={L(tabKeys.tabInquiry)}
                  key={tabKeys.tabInquiry}
                >
                  <TabUntiInquiry unitId={this.props.id} />
                </Tabs.TabPane>
              )}
              {this.isGranted(appPermissions.leaseAgreement.read) && (
                <Tabs.TabPane
                  tab={L(tabKeys.tabLeaseAgreement)}
                  key={tabKeys.tabLeaseAgreement}
                >
                  <TabContract unitId={this.props.id} />
                </Tabs.TabPane>
              )}
              {this.isGranted(appPermissions.inquiry.read) && (
                <Tabs.TabPane
                  tab={L(tabKeys.tabSiteVisit)}
                  key={tabKeys.tabSiteVisit}
                >
                  <SitevisitActivity unitId={this.props.id} />
                </Tabs.TabPane>
              )}
              {/* {this.isGranted(appPermissions.inquiry.read) && (
                <Tabs.TabPane
                  tab={L(tabKeys.tabReservation)}
                  key={tabKeys.tabReservation}
                >
                  <ReservationActivity
                    unitId={this.props.id}
                    selectItem={this.state.tabActiveKey}
                    tabKey={tabKeys.tabReservation}
                  />
                </Tabs.TabPane>
              )} */}
              {this.isGranted(appPermissions.inquiry.read) && (
                <Tabs.TabPane
                  tab={L(tabKeys.tabInquiryReservation)}
                  key={tabKeys.tabInquiryReservation}
                >
                  <ReservationListing
                    unitId={this.props.id}
                    selectItem={this.state.tabActiveKey}
                    tabKey={tabKeys.tabInquiryReservation}
                  />
                </Tabs.TabPane>
              )}
              <Tabs.TabPane
                tab={L(tabKeys.tabMoveInOut)}
                key={tabKeys.tabMoveInOut}
              >
                <TabMoveInOut
                  unitId={this.props.id}
                  keyTab={tabKeys.tabMoveInOut}
                  tabKeyChoose={this.state.tabActiveKey}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab={L(tabKeys.tabStatus)} key={tabKeys.tabStatus}>
                <TabStatus visible={this.props.visible} id={this.props.id} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={L(tabKeys.tabDocuments)}
                key={tabKeys.tabDocuments}
              >
                <TabDocument
                  moduleId={moduleNames.unit}
                  inputId={this.props.unitStore.editUnitRes?.uniqueId}
                  createPermission={this.isGranted(appPermissions.unit.create)}
                  updatePermission={this.isGranted(appPermissions.unit.update)}
                  deletePermission={this.isGranted(appPermissions.unit.delete)}
                />
              </Tabs.TabPane>
            </>
          )}
        </Tabs>
      </CustomDrawer>
    )
  }
}
export default withRouter(UnitModal)
