import React from "react"
import { inject, observer } from "mobx-react"
import CustomDrawer from "@components/Drawer/CustomDrawer"
import { Card, Tabs } from "antd"
import { L } from "@lib/abpUtility"
import TabDocument from "@scenes/inquiriesManagement/inquiriesList/components/detailInquiry/tabDocument"
// import TenantInfo from "./tabInfo/ContactInfo";
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"

import TenantInfo from "./tabInfo/tenantInfo"
// import TabMoveInOut from "./tabMoveInOut"
import TenantStore from "@stores/administrator/tenantStore"
import Stores from "@stores/storeIdentifier"
import { appPermissions, moduleNames } from "@lib/appconst"

const tabKeys = {
  tabContactInfo: "CONTACT_INFO",
  tabMoveInOut: "TAB_TENANT_MOVE_IN_MOVE_OUT",

  tabDocuments: "TAB_DOCUMENT",
}

type Props = {
  visible: boolean
  tenantStore: TenantStore
  id: any
  onCancel: () => void
  onOk: () => void
}
interface State {
  isEdit: boolean
  tabActiveKey: any
}
@inject(Stores.TenantStore)
@observer
class TenantDetailModal extends AppComponentListBase<Props, State> {
  formRef = React.createRef<any>()

  state = {
    tabActiveKey: tabKeys.tabContactInfo,
    isEdit: false,
  }

  componentDidUpdate(prevProps: Props) {
    const { tenantStore } = this.props
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.formRef.current?.resetFields()
        if (this.props.id) {
          this.formRef.current?.setFieldsValue(tenantStore?.tenantModel)
          this.setState({ isEdit: false })
        } else {
          this.formRef.current?.resetFields()
          this.setState({ isEdit: true })
        }
      }
    }
  }

  changeTab = (tabKey: string) => {
    this.setState({
      tabActiveKey: tabKey,
    })
  }
  handleEdit = () => {
    this.setState({ isEdit: true })
  }
  handleSave = async (id?) => {
    let formValues = await this.formRef.current?.validateFields()
    if (id) {
      formValues = { ...formValues, id: id }
    }
    await this.props.tenantStore.CreateOrUpdate(formValues)
    this.setState({
      tabActiveKey: tabKeys.tabContactInfo,
    })
    await this.props.onOk()
    this.setState({ isEdit: false })
    if (!id) {
      this.handleCancel()
    }
  }
  handleCancel = async () => {
    this.setState({
      tabActiveKey: tabKeys.tabContactInfo,
    })
    await this.props.onCancel()
  }
  render() {
    const { visible, id, tenantStore } = this.props
    const { tabActiveKey } = this.state

    return (
      <CustomDrawer
        useBottomAction
        title={id ? tenantStore?.tenantModel?.name : L("CREATE_TENANT")}
        visible={visible}
        isEdit={this.state.isEdit}
        onClose={() => this.handleCancel()}
        onCreate={this.props.id ? undefined : () => this.handleSave()}
        onEdit={this.props.id ? this.handleEdit : undefined}
        onSave={() => this.handleSave(this.props.id)}
        updatePermission={this.isGranted(appPermissions.userTenant.update)}
      >
        <Tabs
          activeKey={tabActiveKey}
          onTabClick={this.changeTab}
          className={"antd-tab-cusstom h-100"}
          type="card"
        >
          <Tabs.TabPane
            tab={L(tabKeys.tabContactInfo)}
            key={tabKeys.tabContactInfo}
          >
            <Card className="card-detail-modal">
              <TenantInfo isEdit={this.state.isEdit} formRef={this.formRef} />
            </Card>
          </Tabs.TabPane>
          {this.props.id && (
            <>
              {/* <Tabs.TabPane
                tab={L(tabKeys.tabMoveInOut)}
                key={tabKeys.tabMoveInOut}
              >
                <TabMoveInOut
                  tenantId={this.props.id}
                  keyTab={tabKeys.tabMoveInOut}
                  tabKeyChoose={this.state.tabActiveKey}
                />
              </Tabs.TabPane> */}
              <Tabs.TabPane
                tab={L(tabKeys.tabDocuments)}
                key={tabKeys.tabDocuments}
              >
                <TabDocument
                  moduleId={moduleNames.tenant}
                  inputId={this.props.tenantStore.tenantModel?.uniqueId}
                  createPermission={this.isGranted(
                    appPermissions.userTenant.create
                  )}
                  updatePermission={this.isGranted(
                    appPermissions.userTenant.update
                  )}
                  deletePermission={this.isGranted(
                    appPermissions.userTenant.delete
                  )}
                />
              </Tabs.TabPane>
            </>
          )}
        </Tabs>
      </CustomDrawer>
    )
  }
}

export default withRouter(TenantDetailModal)
