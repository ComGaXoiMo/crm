import React from "react"
import { inject, observer } from "mobx-react"
import CustomDrawer from "@components/Drawer/CustomDrawer"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"

import ContactStore from "@stores/clientManagement/contactStore"
import Stores from "@stores/storeIdentifier"
import _, { debounce } from "lodash"
import AppConsts, { GENDERS, appPermissions } from "@lib/appconst"
import { Card, Col, Form, Input, Row, Select } from "antd"
import { validateMessages } from "@lib/validation"
import { L } from "@lib/abpUtility"
import rules from "./validation"
import PhoneCheckInput from "@components/Inputs/PhoneInput/PhoneCheckInput"
import { addItemToList, filterOptions, renderOptions } from "@lib/helper"
import AppDataStore from "@stores/appDataStore"
import PhonesInput2 from "@components/Inputs/PhoneInput/PhoneInput2"
import EmailsInput from "@components/Inputs/EmailsInput"
import AddressInput2 from "@components/Inputs/AddressInput2"
import TextArea from "antd/lib/input/TextArea"
import companyService from "@services/clientManagement/companyService"
const { contactType, formVerticalLayout } = AppConsts

type Props = {
  id: any
  visible: boolean
  leaseAgreementId: any
  onCancel: any
  onOk: any
  contactStore: ContactStore
  appDataStore: AppDataStore
}
type States = {
  isEdit: boolean
  isCreate: boolean
  companyType: any
  data: any
  listCompany: any[]
  phoneCreate: any[]
}

@inject(Stores.ContactStore, Stores.AppDataStore)
@observer
class OtherContractDetailModal extends AppComponentListBase<Props, States> {
  formRef = React.createRef<any>()

  state = {
    isEdit: false,
    isCreate: false,
    data: {} as any,
    companyType: undefined,
    listCompany: [] as any,
    phoneCreate: [] as any,
  }
  async componentDidMount() {
    this.initData()
    this.getListCompany("")
  }

  initData = () => {
    if (
      this.props.contactStore.editContact &&
      this.props.contactStore.editContact.id
    ) {
      const { typeId } = this.props.contactStore.editContact

      this.setState({ companyType: typeId })
      const newListCompany = [...this.state.listCompany]
      addItemToList(newListCompany, {
        id: this.props.contactStore.editContact?.companyId,
        name: this.props.contactStore.editContact?.company?.businessName,
      })
      this.setState({ listCompany: newListCompany })
    }
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
    await this.props.contactStore.createOrUpdate({
      ...res,
      leaseAgreementId: this.props.leaseAgreementId,
    })

    await this.props.onOk()

    this.setState({ isEdit: false })

    this.handleClose()
  }
  handleClose = () => {
    this.formRef.current?.resetFields()
    this.props.onCancel()

    this.props.contactStore.resetExistContact()
  }
  getListCompany = async (keyword) => {
    const result = await companyService.getAll({
      keyword,
      maxResultCount: 10,
      skipC0unt: 0,
    })
    const listCompany = [...result?.items]

    listCompany.map((i) => {
      return { id: i.id, name: i.businessName }
    })
    await this.setState({ listCompany: listCompany })
  }
  findCompanies = debounce(async (keyword) => {
    this.getListCompany(keyword)
  }, 200)
  onChangeCompany = async (value) => {
    const res = await companyService.get(value)
    value = res.companyAddress[0]

    this.formRef.current?.setFieldsValue({
      contactAddress: [{ ...value, id: undefined }],
    })
  }
  clearFormOtherPhoneNumber = async () => {
    const ref = await this.formRef.current?.getFieldValue()
    let arr = await Object.getOwnPropertyNames(ref)
    arr = await _.without(arr, "contactPhone")
    await this.formRef.current?.resetFields(arr)
  }
  checkPhone = async (phone) => {
    // await this.props.onCheckPhone(phone);
    await this.formRef.current.validateFields(["contactPhone"])
    await this.props.contactStore.checkExistContact({ phone: phone?.phone })
    this.setState({ phoneCreate: [phone] })
    if (this.props.contactStore.checkContact) {
      this.setState({
        companyType: this.props.contactStore.checkContact.typeId,
      })
      await this.formRef.current?.setFieldsValue({
        ...this.props.contactStore.checkContact,
      })
      await this.setState({ isEdit: true })
      if (this.props.contactStore.checkContact?.companyId) {
        const newListCompany = [...this.state.listCompany]
        const newItem = {
          id: this.props.contactStore.checkContact?.companyId,
          name: this.props.contactStore.checkContact?.company?.businessName,
        }
        addItemToList(newListCompany, newItem)
        this.setState({ listCompany: newListCompany })
      }
    } else {
      await this.clearFormOtherPhoneNumber()
      await this.setState({ isEdit: true })
    }
  }
  render() {
    const { visible } = this.props
    const { data } = this.state
    const { checkContact, isLoading } = this.props.contactStore
    const {
      appDataStore: { nationality, countryFull, positionLevels, leadSource },
    } = this.props
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
        <Card className="card-detail-modal-lv2 ">
          <Form
            layout="vertical"
            ref={this.formRef}
            validateMessages={validateMessages}
          >
            <Row gutter={[8, 0]}>
              <Col sm={{ span: 24, offset: 0 }}>
                <Row gutter={[8, 0]}>
                  {!this.props.id && (
                    <Col
                      sm={{ span: 24, offset: 0 }}
                      style={{ lineHeight: "0.2", marginBottom: 7 }}
                    >
                      <Form.Item
                        label={L("CONTACT_PHONE")}
                        name="contactPhone"
                        rules={rules.contactPhone}
                      >
                        <PhoneCheckInput
                          onChange={() =>
                            this.props.contactStore.resetExistContact()
                          }
                          onCheckPhone={this.checkPhone}
                        />
                      </Form.Item>
                    </Col>
                  )}
                  <Col sm={{ span: 4, offset: 0 }}>
                    <Form.Item
                      label={L("CONTACT_GENDER")}
                      name="gender"
                      rules={rules.gender}
                    >
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        disabled={!this.state.isEdit}
                        allowClear
                        filterOption={false}
                        className="full-width"
                      >
                        {renderOptions(GENDERS)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("CONTACT_NAME")}
                      name="contactName"
                      rules={rules.contactName}
                    >
                      <Input disabled={!this.state.isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("CONTACT_NATIONALITY")}
                      name="nationalityId"
                      rules={rules.nationalityId}
                    >
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        showSearch
                        allowClear
                        filterOption={filterOptions}
                        className="full-width"
                        disabled={!this.state.isEdit}
                      >
                        {renderOptions(nationality)}
                      </Select>
                    </Form.Item>
                  </Col>
                  {this.props.id && (
                    <Col sm={{ span: 12, offset: 0 }}>
                      <Form.Item
                        label={L("CONTACT_PHONE")}
                        name="contactPhone"
                        rules={rules.contactPhone}
                      >
                        <PhonesInput2
                          disabled={!this.state.isCreate && !this.state.isEdit}
                          suffix={!this.state.isCreate}
                        />
                      </Form.Item>
                    </Col>
                  )}
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("CONTACT_EMAIL")}
                      name="contactEmail"
                      rules={rules.contactEmail}
                    >
                      <EmailsInput disabled={!this.state.isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("CONTACT_TYPE")}
                      name="typeId"
                      rules={[{ required: true }]}
                    >
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        showSearch
                        allowClear
                        disabled={!this.state.isEdit}
                        onChange={(value) =>
                          this.setState({ companyType: value })
                        }
                        filterOption={filterOptions}
                        className="full-width"
                      >
                        {renderOptions(contactType)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("CONTACT_SOURCE")}
                      {...formVerticalLayout}
                      name="leadSourceId"
                    >
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        showSearch
                        allowClear
                        disabled={!this.state.isEdit}
                        filterOption={filterOptions}
                        className="full-width"
                      >
                        {renderOptions(leadSource)}
                      </Select>
                    </Form.Item>
                  </Col>
                  {this.state.companyType === 2 && (
                    <>
                      <Col sm={{ span: 24, offset: 0 }}>
                        <Form.Item
                          rules={rules.required}
                          label={L("COMPANY")}
                          {...formVerticalLayout}
                          name="companyId"
                        >
                          <Select
                            getPopupContainer={(trigger) => trigger.parentNode}
                            showSearch
                            disabled={!this.state.isEdit}
                            onSearch={this.findCompanies}
                            filterOption={filterOptions}
                            onChange={(value) => this.onChangeCompany(value)}
                            className="full-width"
                          >
                            {renderOptions(this.state.listCompany)}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col sm={{ span: 12, offset: 0 }}>
                        <Form.Item
                          label={L("CONTACT_POSITION_LEVEL")}
                          {...formVerticalLayout}
                          name="levelId"
                        >
                          <Select
                            getPopupContainer={(trigger) => trigger.parentNode}
                            allowClear
                            filterOption={filterOptions}
                            disabled={!this.state.isEdit}
                            className="full-width"
                          >
                            {renderOptions(positionLevels)}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col sm={{ span: 12, offset: 0 }}>
                        <Form.Item
                          label={L("CONTACT_POSITION_TITLE")}
                          {...formVerticalLayout}
                          name="title"
                        >
                          <Input maxLength={50} disabled={!this.state.isEdit} />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                </Row>

                <Row gutter={[8, 0]}>
                  {/* ---- */}
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("CONTACT_LOCATION")}
                      {...formVerticalLayout}
                      name="contactAddress"
                    >
                      <AddressInput2
                        disabled={!this.state.isEdit}
                        countries={countryFull}
                      />
                    </Form.Item>
                  </Col>

                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("CONTACT_DESCRIPTION")}
                      {...formVerticalLayout}
                      name="description"
                      rules={rules.contactDescription}
                    >
                      <TextArea disabled={!this.state.isEdit} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card>
      </CustomDrawer>
    )
  }
}

export default withRouter(OtherContractDetailModal)
