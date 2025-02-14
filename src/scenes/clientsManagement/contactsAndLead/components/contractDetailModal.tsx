import React from "react"
import { inject, observer } from "mobx-react"
import CustomDrawer from "@components/Drawer/CustomDrawer"
import { Card, Tabs } from "antd"
import { L } from "@lib/abpUtility"
import ContactInfo from "./tabInfo/ContactInfo"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"

import InquirieContact from "./tabInquire"
import TabContract from "@scenes/propertiesManagement/units/components/tabContract"

import ContactStore from "@stores/clientManagement/contactStore"
import Stores from "@stores/storeIdentifier"
import _ from "lodash"
import { appPermissions, moduleNames } from "@lib/appconst"
import TabDocument from "@scenes/inquiriesManagement/inquiriesList/components/detailInquiry/tabDocument"
import TabAP from "./tabAP"
import AllActivity from "@scenes/activity/allActivity"
const tabKeys = {
  tabContactInfo: "CONTACT_INFO",
  tabActivity: "TAB_ACTIVITY",
  tabInquiries: "TAB_INQUIRIES",
  tabLeaseAgreement: "TAB_LEASE_AGREEMENT",
  tabDocuments: "TAB_DOCUMENT",
  tabAssociateParty: "TAB_ASSOCIATE_PARTY",
}

type Props = {
  id: any
  visible: boolean
  onCancel: any
  onOk: any
  paramValue: any
  contactStore: ContactStore
}
type States = {
  tabActiveKey: any
  isEdit: boolean
  isCreate: boolean
  data: any
  phoneCreate: any[]
}

@inject(Stores.ContactStore)
@observer
class ContractDetailModal extends AppComponentListBase<Props, States> {
  formRef = React.createRef<any>()

  state = {
    tabActiveKey: tabKeys.tabContactInfo,
    isEdit: false,
    isCreate: false,
    data: {} as any,
    phoneCreate: [],
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        if (this.props.id) {
          await this.setState({ data: this.props.contactStore?.editContact })
          await this.setState({ isEdit: false, isCreate: false })
        } else {
          this.setState({ data: {}, isEdit: false, isCreate: true })
        }

        await this.getDetail(this.props.id)
        if (this.props.paramValue?.IsAssociate === 1) {
          this.setState({ tabActiveKey: tabKeys.tabAssociateParty })
        }
      }
    }
  }
  getDetail = async (id?: number) => {
    if (!id) {
      this.formRef.current?.resetFields()
      await this.props.contactStore.createContact()
    } else {
      this.formRef.current?.setFieldsValue({
        ...this.props.contactStore.editContact,
      })
    }
  }
  changeTab = (tabKey: string) => {
    this.setState({
      tabActiveKey: tabKey,
    })
  }

  handleSave = async (id?) => {
    const formValues = await this.formRef.current?.validateFields()
    let res = formValues
    if (Array.isArray(res.contactAddress)) {
      res = { ...res, contactAddress: res.contactAddress[0] }
    }
    if (id) {
      res = { ...res, id: id }
    } else {
      res = { ...res, contactPhone: this.state.phoneCreate }
    }
    if (
      (formValues?.contactEmail && formValues?.contactEmail[0]?.email === "") ||
      (formValues?.contactEmail && formValues.contactEmail[0]?.email === null)
    ) {
      res = { ...res, contactEmail: undefined }
    }
    await this.props.contactStore.createOrUpdate(res)

    await this.props.onOk()

    this.setState({ isEdit: false })

    if (id) {
      await this.props.contactStore.get(this.props.id, false)
    }

    await this.formRef.current?.setFieldsValue({
      ...this.props.contactStore.editContact,
    })
    if (!id) {
      this.handleClose()
    }
  }
  handleClose = () => {
    this.formRef.current?.resetFields()
    this.props.onCancel()
    this.setState({
      tabActiveKey: tabKeys.tabContactInfo,
    })
    this.props.contactStore.resetExistContact()
  }
  clearFormOtherPhoneNumber = async () => {
    const ref = await this.formRef.current?.getFieldValue()
    let arr = await Object.getOwnPropertyNames(ref)
    arr = await _.without(arr, "contactPhone")
    await this.formRef.current?.resetFields(arr)
  }
  checkIsExistPhone = async (value) => {
    await this.setState({ isEdit: false })
    await this.formRef.current.validateFields(["contactPhone"])
    await this.setState({ isEdit: true })
    this.setState({ phoneCreate: [value] })
    await this.props.contactStore.checkExistContact({ phone: value?.phone })
    const { checkContact } = this.props.contactStore
    if (!this.props.contactStore.checkContact) {
      await this.clearFormOtherPhoneNumber()
      await this.setState({ isEdit: true })
    } else if (checkContact?.isOwner === true) {
      await this.formRef.current?.setFieldsValue({
        ...checkContact,
      })
      await this.setState({ isEdit: true })
    } else if (checkContact?.isOwner === false) {
      this.clearFormOtherPhoneNumber()
      await this.setState({ isEdit: false })
    }
  }
  render() {
    const { visible } = this.props
    const { tabActiveKey, data } = this.state
    const { checkContact, isLoading } = this.props.contactStore
    return (
      <CustomDrawer
        useBottomAction
        title={data?.contactName ?? ""}
        visible={visible}
        onCreate={
          this.props.id
            ? undefined
            : () =>
                this.handleSave(checkContact?.id ? checkContact?.id : undefined)
        }
        onClose={this.handleClose}
        onEdit={
          this.props.id
            ? () => {
                this.setState({ isEdit: true })
              }
            : undefined
        }
        onSave={() => this.handleSave(this.props.id)}
        //   getContainer={false}
        isEdit={this.state.isEdit}
        updatePermission={this.isGranted(appPermissions.contact.update)}
        isLoading={isLoading}
      >
        <Tabs
          activeKey={tabActiveKey}
          onTabClick={this.changeTab}
          className={" h-100"}
          type="card"
        >
          <Tabs.TabPane
            tab={L(tabKeys.tabContactInfo)}
            key={tabKeys.tabContactInfo}
          >
            <Card className="card-detail-modal">
              <ContactInfo
                id={this.props.id}
                onClose={this.handleClose}
                visible={visible}
                isEdit={this.state.isEdit}
                isCreate={this.state.isCreate}
                fomRef={this.formRef}
                onCheckPhone={this.checkIsExistPhone}
              />
            </Card>
          </Tabs.TabPane>
          {this.props.id && (
            <>
              {this.isGranted(appPermissions.inquiry.read) && (
                <Tabs.TabPane
                  tab={L(tabKeys.tabActivity)}
                  key={tabKeys.tabActivity}
                >
                  <AllActivity
                    contactId={this.props.id}
                    keyTab={tabKeys.tabActivity}
                    tabKeyChoose={this.state.tabActiveKey}
                  />
                </Tabs.TabPane>
              )}

              {this.isGranted(appPermissions.inquiry.read) && (
                <Tabs.TabPane
                  tab={L(tabKeys.tabInquiries)}
                  key={tabKeys.tabInquiries}
                >
                  <InquirieContact contactId={this.props.id} />
                </Tabs.TabPane>
              )}

              {this.isGranted(appPermissions.leaseAgreement.read) && (
                <Tabs.TabPane
                  tab={L(tabKeys.tabLeaseAgreement)}
                  key={tabKeys.tabLeaseAgreement}
                >
                  <TabContract contactId={this.props.id} />
                </Tabs.TabPane>
              )}

              <Tabs.TabPane
                tab={L(tabKeys.tabDocuments)}
                key={tabKeys.tabDocuments}
              >
                <TabDocument
                  moduleId={moduleNames.contact}
                  inputId={this.props.contactStore.editContact?.uniqueId}
                  createPermission={this.isGranted(
                    appPermissions.contact.create
                  )}
                  updatePermission={this.isGranted(
                    appPermissions.contact.update
                  )}
                  deletePermission={this.isGranted(
                    appPermissions.contact.delete
                  )}
                />
              </Tabs.TabPane>
              {this.isGranted(appPermissions.contact.associate) && (
                <Tabs.TabPane
                  tab={L(tabKeys.tabAssociateParty)}
                  key={tabKeys.tabAssociateParty}
                >
                  <TabAP
                    keyTab={tabKeys.tabAssociateParty}
                    tabKeyChoose={this.state.tabActiveKey}
                    contactId={this.props.id}
                  />
                </Tabs.TabPane>
              )}
            </>
          )}
        </Tabs>
      </CustomDrawer>
    )
  }
}

export default withRouter(ContractDetailModal)
