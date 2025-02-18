import { inject, observer } from "mobx-react"
import React from "react"
import CustomDrawer from "@components/Drawer/CustomDrawer"
import { L } from "@lib/abpUtility"
import {
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  // Table,
  Tabs,
} from "antd"
import withRouter from "@components/Layout/Router/withRouter"

import AppDataStore from "@stores/appDataStore"
import CompanyStore from "@stores/clientManagement/companyStore"
import Stores from "@stores/storeIdentifier"
import { AppComponentListBase } from "@components/AppComponentBase"
import { debounce } from "lodash"
import PhoneInput2 from "@components/Inputs/PhoneInput/PhoneInput2"
import { filterOptions, renderOptions } from "@lib/helper"
import rules from "./validation"
import TextArea from "antd/lib/input/TextArea"
import userService from "@services/administrator/user/userService"
import TabPane from "antd/lib/tabs/TabPane"
import InquirieContact from "../../contactsAndLead/components/tabInquire"
import AddressInput2 from "@components/Inputs/AddressInput2"
import CompanyContacts from "./CompanyContacts"
import { appPermissions, dateFormat, moduleNames } from "@lib/appconst"
import { validateMessages } from "@lib/validation"
import TabDocument from "@scenes/inquiriesManagement/inquiriesList/components/detailInquiry/tabDocument"
import TabContract from "@scenes/propertiesManagement/units/components/tabContract"
import CompanyAuditTrail from "./companyAuditTrail"

const tabKeys = {
  tabCompanyInfo: "TAB_COMPANY_INFO",
  tabCompanyDocuments: "TAB_COMPANY_DOCUMENTS",
  tabCompanyContacts: "TAB_COMPANY_CONTACTS",
  tabCompanyOpportunities: "TAB_COMPANY_OPPORTUNITIES",
  tabCompanyActivities: "TAB_COMPANY_ACTIVITIES",
  tabCompanyComments: "TAB_COMPANY_COMMENTS",
  tabActivity: "TAB_ACTIVITY",
  tabInquiry: "INQUIRIES",
  tabLeaseAgreement: "TAB_LEASE_AGREEMENT",
  tabAuditTrail: "TAB_AUDIT_TRAIL",
}
type Props = {
  visible: boolean
  id: any
  data: any
  onCancel: () => void
  appDataStore: AppDataStore
  companyStore: CompanyStore
}
type States = {
  industriesLv2: any
  parentCompanies: any
  isEdit: boolean
  assignedUsers: any
  tabActiveKey: any
}
inject(Stores.AppDataStore, Stores.CompanyStore)
observer
class CompanyModal extends AppComponentListBase<Props, States> {
  formRef = React.createRef<any>()
  state = {
    parentCompanies: [] as any,
    industriesLv2: [] as any,
    assignedUsers: [] as any,
    tabActiveKey: tabKeys.tabCompanyInfo,
    isEdit: false,
  }
  async componentDidMount() {
    if (this.props.data.id) {
      await console.log(this.formRef)
      await this.formRef.current?.setFieldsValue(this.props.data)
    } else {
      this.setState({ isEdit: true })

      this.formRef.current?.resetFields()
    }
    await this.updateIndustriesLv2(
      this.props.companyStore.editCompany.industryId
    )
  }

  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  }
  handleUpdate = async () => {
    const formValues = await this.formRef.current?.validateFields()
    const address = this.formRef.current?.getFieldValue("companyAddress")
    let res = {
      ...formValues,
    }
    if (Array.isArray(address)) {
      res = {
        ...res,
        id: this.props.data.id,
        companyAddress: address,
      }
    } else {
      res = {
        ...res,
        id: this.props.data.id,
        companyAddress: [address],
      }
    }

    if (address.length === 0) {
      delete res.companyAddress
    }
    await this.props.companyStore.createOrUpdate(res)
    this.setState({ isEdit: false })
  }
  handleCreate = async () => {
    const formValues = await this.formRef.current?.validateFields()
    const address = this.formRef.current?.getFieldValue("companyAddress")
    let res = formValues
    if (address) {
      res = { ...formValues, companyAddress: [address] }
    }
    await this.props.companyStore.createOrUpdate(res)
    await this.props.onCancel()
    this.handleClose()
  }
  handleEdit = () => {
    this.setState({ isEdit: true })
  }
  handleClose = () => {
    this.formRef.current?.resetFields()
    this.props.onCancel()
  }
  updateIndustriesLv2 = (industryId, isResetLv2?) => {
    const industriesLv2 = (this.props.appDataStore.industriesLv2 || []).filter(
      (item) => item.parentId === industryId
    )
    this.setState({ industriesLv2 })
    if (isResetLv2) {
      this.formRef.current?.setFieldsValue({ industryLevel2Id: undefined })
    }
  }
  findAssignedUsers = debounce(async (keyword) => {
    const result = await userService.findUsers({
      keyword,
      pageSize: 20,
      pageNumber: 1,
    })
    this.setState({ assignedUsers: result || [] })
  }, 200)

  render() {
    const {
      appDataStore: { countries, industriesLv1 },
      companyStore: { isLoading },
    } = this.props
    const { isEdit } = this.state
    return (
      <CustomDrawer
        useBottomAction
        title={this.props.data?.businessName ?? "CREATE"}
        visible={this.props.visible}
        onClose={this.handleClose}
        onEdit={this.props.data?.id ? this.handleEdit : undefined}
        onSave={this.handleUpdate}
        onCreate={this.props.data?.id ? undefined : this.handleCreate}
        //   getContainer={false}
        isEdit={this.state.isEdit}
        updatePermission={this.isGranted(appPermissions.company.update)}
        isLoading={isLoading}
      >
        <Tabs activeKey={this.state.tabActiveKey} onTabClick={this.changeTab}>
          <TabPane tab={L(tabKeys.tabCompanyInfo)} key={tabKeys.tabCompanyInfo}>
            <Card className="card-detail-modal">
              <Form
                ref={this.formRef}
                layout={"vertical"}
                validateMessages={validateMessages}
                //  onFinish={this.onSave}
                // validateMessages={validateMessages}
                size="middle"
              >
                <Row gutter={[8, 0]}>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("COMPANY_NAME")}
                      name="businessName"
                      rules={rules.businessName}
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("COMPANY_LEGAL_NAME")}
                      name="legalName"
                      rules={rules.legalName}
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 12 }}>
                    <Form.Item
                      label={L("COMPANY_LEGAL_NAME_VI")}
                      name="legalNameVi"
                      rules={rules.legalNameVi}
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("COMPANY_NATIONALITY")}
                      name="nationalityId"
                      rules={rules.nationalityId}
                    >
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        showSearch
                        allowClear
                        filterOption={filterOptions}
                        disabled={!isEdit}
                        className="full-width"
                      >
                        {renderOptions(countries)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("COMPANY_TAX_CODE")}
                      name="vatCode"
                      rules={rules.vatCode}
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  {/* <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item label={L("COMPANY_VAT_CODE")} name="vatCode">
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col> */}
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("COMPANY_INDUSTRY")}
                      name="industryId"
                      rules={rules.industryId}
                    >
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        showSearch
                        allowClear
                        filterOption={filterOptions}
                        className="full-width"
                        // onChange={(value) =>
                        //   this.updateIndustriesLv2(value, true)
                        // }
                        disabled={!isEdit}
                      >
                        {renderOptions(industriesLv1)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("COMPANY_WEBSITE")}
                      name="website"
                      rules={rules.website}
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }}>
                    <Form.Item
                      label={L("COMPANY_PHONE")}
                      name="companyPhone"
                      rules={rules.companyPhone}
                    >
                      <PhoneInput2 disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("COMPANY_ADDRESS")}
                      name="companyAddress"
                    >
                      <AddressInput2
                        value={this.props.data}
                        disabled={!isEdit}
                        hasAddressVi={true}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("COMPANY_NOTE")}
                      name="description"
                      rules={rules.description}
                    >
                      <TextArea disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Divider
                    orientation="left"
                    orientationMargin="0"
                    style={{ fontWeight: 600 }}
                  >
                    {L("INFO_ON_LEASE_AGREEMENT")}
                  </Divider>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item label={L("LICENSE_NUMBER")} name="licenseNumber">
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>

                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("LICENSE_ISSUED_BY")}
                      name="licenseIssued"
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("LICENSE_ISSUED_ON")}
                      name="licenseIssuedDate"
                    >
                      <DatePicker
                        className="full-width"
                        format={dateFormat}
                        disabled={!isEdit}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("LICENSE_NUMBER_VI")}
                      name="licenseNumberVi"
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("LICENSE_ISSUED_BY_VI")}
                      name="licenseIssuedVi"
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item label={L("CERTIFICATE")} name="certificate">
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 16 }}>
                    <Form.Item label={L("CERTIFICATE_VI")} name="certificateVi">
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("REPRESENTATIVE_BY")}
                      name="representative"
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item label={L("POSITION")} name="position">
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>

                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("REPRESENTATIVE_BY_VI")}
                      name="representativeVi"
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item label={L("POSITION_VI")} name="positionVi">
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Divider
                    orientation="left"
                    orientationMargin="0"
                    style={{ fontWeight: 600 }}
                  >
                    {L("BANK_INFO")}
                  </Divider>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("BANK_NUMBER")}
                      name="bankNumber"
                      rules={rules.bank}
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("BANK_ACCOUNT_NAME")}
                      name="bankAccountName"
                      rules={rules.bank}
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("BANK_BRANCH")}
                      name="bankBranch"
                      rules={rules.bank}
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("SWIFT_CODE")}
                      name="swiftCode"
                      rules={rules.bank}
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("BANK_ADDRESS")}
                      name="bankAddress"
                      rules={rules.bank}
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </TabPane>
          {this.props.data?.id && (
            <>
              {this.isGranted(appPermissions.inquiry.read) && (
                <Tabs.TabPane
                  tab={L(tabKeys.tabInquiry)}
                  key={tabKeys.tabInquiry}
                >
                  <InquirieContact
                    companyId={this.props.companyStore.editCompany?.id}
                  />
                </Tabs.TabPane>
              )}
              {this.isGranted(appPermissions.leaseAgreement.read) && (
                <Tabs.TabPane
                  tab={L(tabKeys.tabLeaseAgreement)}
                  key={tabKeys.tabLeaseAgreement}
                >
                  <TabContract
                    companyId={this.props.companyStore.editCompany?.id}
                  />
                </Tabs.TabPane>
              )}
              {this.isGranted(appPermissions.contact.read) && (
                <TabPane
                  tab={L(tabKeys.tabCompanyContacts)}
                  key={tabKeys.tabCompanyContacts}
                >
                  <CompanyContacts
                    companyId={this.props.companyStore.editCompany?.id}
                  />
                </TabPane>
              )}
              {this.props.companyStore.editCompany?.id && (
                <TabPane
                  tab={L(tabKeys.tabCompanyDocuments)}
                  key={tabKeys.tabCompanyDocuments}
                >
                  <TabDocument
                    moduleId={moduleNames.company}
                    inputId={this.props.companyStore.editCompany?.uniqueId}
                    createPermission={this.isGranted(
                      appPermissions.company.create
                    )}
                    updatePermission={this.isGranted(
                      appPermissions.company.update
                    )}
                    deletePermission={this.isGranted(
                      appPermissions.company.delete
                    )}
                  />
                </TabPane>
              )}
              {this.props.companyStore.editCompany?.id && (
                <Tabs.TabPane
                  tab={L(tabKeys.tabAuditTrail)}
                  key={tabKeys.tabAuditTrail}
                >
                  <CompanyAuditTrail
                    parentId={this.props.companyStore.editCompany?.id}
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

export default withRouter(CompanyModal)
