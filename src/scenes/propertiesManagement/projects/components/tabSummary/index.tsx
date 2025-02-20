import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import {
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd"
import { L } from "@lib/abpUtility"
import Stores from "@stores/storeIdentifier"
import ProjectStore from "@stores/projects/projectStore"
import FileStore from "@stores/common/fileStore"
import AppConsts, {
  dateTimeFormat,
  moduleNames,
  yearFormat,
} from "@lib/appconst"
import UnitStore from "@stores/projects/unitStore"
import withRouter from "@components/Layout/Router/withRouter"
import { filterOptions, renderOptions } from "@lib/helper"
import _, { debounce } from "lodash"
import companyService from "@services/clientManagement/companyService"
import AppDataStore from "@stores/appDataStore"
import TextArea from "antd/lib/input/TextArea"
import ImageUploadWrapCRM from "@components/FileUpload/ImageUploadCRM"
import rules from "./components/validations"
import AddressInput2 from "@components/Inputs/AddressInput2"
import ProductAndUnitTypeSelect from "@components/Select/SelectProductAndUnitType/ProductAndUnitTypeSelect"
import { validateMessages } from "@lib/validation"
import ImageUploadLogoCRM from "@components/FileUpload/ImageUploadLogoCRM"

export interface ISummaryProps {
  projectStore: ProjectStore
  unitStore: UnitStore
  appDataStore: AppDataStore
  fileStore: FileStore
  id: any
  isEdit: any
  formRef: any
  visible: boolean
}

const { formVerticalLayout } = AppConsts

@inject(Stores.ProjectStore, Stores.UnitStore, Stores.AppDataStore)
@observer
class Summary extends AppComponentListBase<ISummaryProps, any> {
  formRef: any = this.props.formRef

  constructor(props: ISummaryProps) {
    super(props)
    this.state = {
      isDirty: false,
      companies: [],
      propertyManagements: [],
      contacts: [],
    }
  }
  componentDidMount = async () => {
    this.initData()
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.initData()
      }
    }
  }

  initData = () => {
    if (
      this.props.projectStore.editProject &&
      this.props.projectStore.editProject.id
    ) {
      const {
        contactId,
        contact,
        landlordId,
        landlord,
        propertyManagementId,
        propertyManagement,
      } = this.props.projectStore.editProject
      this.setState({
        contacts: contactId
          ? [{ id: contactId, name: contact.contactName }]
          : [],
        propertyManagements: propertyManagementId
          ? [{ ...propertyManagement, name: propertyManagement?.businessName }]
          : [],
        companies: landlordId
          ? [{ id: landlordId, name: landlord.businessName }]
          : [],
      })
    }
    this.findPropertyManagement("")
    this.findCompanies("")
  }

  findCompanies = debounce(async (keyword) => {
    const result = await companyService.getAll({
      keyword,
      maxResultCount: 10,
      skipCount: 0,
      isActive: true,
    })
    this.setState({ companies: result.items || [] })
  }, 300)
  findPropertyManagement = debounce(async (keyword) => {
    const result = await companyService.getAll({
      keyword,
      maxResultCount: 10,
      skipCount: 0,
      isActive: true,
    })
    this.setState({ propertyManagements: result.items || [] })
  }, 300)
  public render() {
    const {
      appDataStore: {
        countryFull,
        projectFacilities,
        propertyTypes,
        unitTypes,
      },
    } = this.props
    // const { companies, propertyManagements } = this.state;
    const groubData = _(this.props.projectStore?.editProject?.projectTypeMap)
      .groupBy("propertyTypeId")
      .map((items, key) => {
        return {
          propertyTypeId: parseInt(key),
          unitTypeId: _.map(items, "unitTypeId"),
        }
      })
      .value()
    return (
      <>
        <Form
          ref={this.formRef}
          onValuesChange={() => this.setState({ isDirty: true })}
          layout="vertical"
          disabled={!this.props.isEdit}
          validateMessages={validateMessages}
        >
          <Row gutter={[8, 0]}>
            <Col sm={{ span: 24 }}>
              <Card className="card-detail-modal">
                <Row gutter={[8, 0]}>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      rules={rules.projectName}
                      label={L("PROJECT_NAME")}
                      {...formVerticalLayout}
                      name="projectName"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      rules={rules.projectCode}
                      label={L("PROJECT_CODE")}
                      {...formVerticalLayout}
                      name="projectCode"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("PROJECT_SORT_NUMBER")}
                      {...formVerticalLayout}
                      name="sortNumber"
                      rules={rules.sortNumber}
                    >
                      <InputNumber
                        className="full-width"
                        min={0}
                        maxLength={2}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      rules={rules.projectCode}
                      label={L("PROJECT_OWNER")}
                      {...formVerticalLayout}
                      name="landlordName"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  {/* <Col sm={{ span: 6, offset: 0 }}>
                    <Form.Item
                      rules={rules.projectCode}
                      label={L("PROPERTY_MANAGER")}
                      {...formVerticalLayout}
                      name="propertyManagementName"
                    >
                      <Input />
                    </Form.Item>
                  </Col> */}
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("TOTAL_AREA")}
                      {...formVerticalLayout}
                      rules={rules.inputNumber}
                      name="totalSize"
                    >
                      <InputNumber
                        min={0}
                        className="w-100"
                        disabled={!this.props.isEdit}
                      />
                      {/* <AreaInput disabled={!this.props.isEdit} /> */}
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("YEAR_BUILD")}
                      {...formVerticalLayout}
                      name="builtDate"
                    >
                      <DatePicker
                        className="full-width"
                        format={yearFormat}
                        picker="year"
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("PRODUCT_TYPES")}
                      rules={rules.required}
                      {...formVerticalLayout}
                      name="projectTypeMap"
                    >
                      <ProductAndUnitTypeSelect
                        valuef={groubData}
                        propertyType={propertyTypes}
                        unitType={unitTypes}
                        // onChange={(e) => console.log(e)}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("COUNT_FLOOR")}
                      {...formVerticalLayout}
                      rules={rules.inputNumber}
                      name="numberOfFloors"
                    >
                      <InputNumber min={0} className="full-width" />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("COUNT_UNIT")}
                      {...formVerticalLayout}
                      name="numberOfUnits"
                      rules={rules.inputNumber}
                    >
                      <InputNumber min={0} className="full-width" />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("PROJECT_LINK")}
                      {...formVerticalLayout}
                      name="link"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("PROJECT_FACILITY")}
                      {...formVerticalLayout}
                      name={["projectFacilityIds"]}
                    >
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        showSearch
                        allowClear
                        filterOption={filterOptions}
                        className="full-width"
                        mode="multiple"
                      >
                        {renderOptions(projectFacilities)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("PROJECT_ADDRESS")}
                      name="projectAddress"
                      rules={rules.address}
                    >
                      <AddressInput2
                        required={true}
                        value={
                          this.props.projectStore?.editProject?.projectAddress
                        }
                        disabled={!this.props.isEdit}
                        countries={countryFull}
                        hasAddressVi={true}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("PROJECT_BANKING_INFO")}
                      {...formVerticalLayout}
                      name="bankInfo"
                      rules={rules.description}
                    >
                      <TextArea disabled={!this.props.isEdit} rows={4} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("PROJECT_DESCRIPTION")}
                      {...formVerticalLayout}
                      name="description"
                      rules={rules.description}
                    >
                      <TextArea disabled={!this.props.isEdit} rows={4} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      rules={rules.budget}
                      label={L("BUDGET_CODE")}
                      {...formVerticalLayout}
                      name="budgetCode"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      rules={rules.projectManager}
                      label={L("PROJECT_MANAGER")}
                      {...formVerticalLayout}
                      name="projectManagerName"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col
                    className="ant-drawer-header-title ant-drawer-title"
                    style={{ fontWeight: 700 }}
                  >
                    Lessor Information
                  </Col>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("LESSOR_ADDRESS")}
                      {...formVerticalLayout}
                      name="lessorAddress"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("LESSOR_ADDRESS_VI")}
                      {...formVerticalLayout}
                      name="lessorAddressVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("REPRESENTATIVE_OF")}
                      {...formVerticalLayout}
                      name="representativeOf"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("REPRESENTATIVE_OF_VI")}
                      {...formVerticalLayout}
                      name="representativeOfVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("POSITION")}
                      {...formVerticalLayout}
                      name="lessorPosition"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("POSITION_VI")}
                      {...formVerticalLayout}
                      name="lessorPositionVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("CERTIFICATE_NAME")}
                      {...formVerticalLayout}
                      name="lessorCertificateName"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("CERTIFICATE_NAME_VI")}
                      {...formVerticalLayout}
                      name="lessorCertificateNameVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("CERTIFICATE_NUMBER")}
                      {...formVerticalLayout}
                      name="lessorCertificateNumber"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("CERTIFICATE_NUMBER_VI")}
                      {...formVerticalLayout}
                      name="lessorCertificateNumberVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("CERTIFICATE_ISSUED_BY")}
                      {...formVerticalLayout}
                      name="lessorCertificateIssuedBy"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("CERTIFICATE_ISSUED_BY_VI")}
                      {...formVerticalLayout}
                      name="lessorCertificateIssuedByVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("REGISTER_ADDRESS")}
                      {...formVerticalLayout}
                      name="registerAddress"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("REGISTER_ADDRESS_VI")}
                      {...formVerticalLayout}
                      name="registerAddressVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("CERTIFICATE_ISSUED_DATE")}
                      {...formVerticalLayout}
                      name="lessorCertificateIssuedDate"
                    >
                      <DatePicker className="w-100" format={dateTimeFormat} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }} />
                  <Col
                    sm={{ span: 24, offset: 0 }}
                    className="ant-drawer-header-title ant-drawer-title"
                    style={{ fontWeight: 700 }}
                  >
                    Lessor's Representative
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }} />
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("REPRESENTATIVE_BY")}
                      {...formVerticalLayout}
                      name="representativeBy"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("REPRESENTATIVE_BY_VI")}
                      {...formVerticalLayout}
                      name="representativeByVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("POSITION")}
                      {...formVerticalLayout}
                      name="representativePosition"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("POSITION_VI")}
                      {...formVerticalLayout}
                      name="representativePositionVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("LOA_NUMBER")}
                      {...formVerticalLayout}
                      name="representativeCertificateNumber"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("LOA_NUMBER_VI")}
                      {...formVerticalLayout}
                      name="representativeCertificateNumberVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("CERTIFICATE_EXECUTE_BY")}
                      {...formVerticalLayout}
                      name="representativeExecuteBy"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("CERTIFICATE_EXECUTE_BY_VI")}
                      {...formVerticalLayout}
                      name="representativeExecuteByVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("CERTIFICATE_EFFECTIVE_DATE")}
                      {...formVerticalLayout}
                      name="representativeCertificateEffectiveDate"
                    >
                      <DatePicker className="w-100" format={dateTimeFormat} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }} />

                  <Col
                    sm={{ span: 24, offset: 0 }}
                    className="ant-drawer-header-title ant-drawer-title"
                    style={{ fontWeight: 700 }}
                  >
                    BANK INFO
                  </Col>
                  <Col sm={{ span: 16, offset: 0 }} />

                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("BANK_ACCOUNT")}
                      {...formVerticalLayout}
                      name="bankAccount"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("BANK_NAME")}
                      {...formVerticalLayout}
                      name="bankName"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8 }}>
                    <Form.Item
                      label={L("BANK_NAME_VI")}
                      {...formVerticalLayout}
                      name="bankNameVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("BANK_ADDRESS")}
                      {...formVerticalLayout}
                      name="bankAddress"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("BANK_ADDRESS_VI")}
                      {...formVerticalLayout}
                      name="bankAddressVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col
                    sm={{ span: 24, offset: 0 }}
                    className="ant-drawer-header-title ant-drawer-title"
                    style={{ fontWeight: 700 }}
                  >
                    BANK INFO 2
                  </Col>
                  <Col sm={{ span: 16, offset: 0 }} />
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("OPTIONAL_BANK_ACCOUNT")}
                      {...formVerticalLayout}
                      name="optionalBankAccount"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("OPTIONAL_BANK_NAME")}
                      {...formVerticalLayout}
                      name="optionalBankName"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8 }}>
                    <Form.Item
                      label={L("OPTIONAL_BANK_NAME_VI")}
                      {...formVerticalLayout}
                      name="optionalBankNameVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("OPTIONAL_BANK_ADDRESS")}
                      {...formVerticalLayout}
                      name="optionalBankAddress"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("OPTIONAL_BANK_ADDRESS_VI")}
                      {...formVerticalLayout}
                      name="optionalBankAddressVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col
                    className="ant-drawer-header-title ant-drawer-title"
                    style={{ fontWeight: 700 }}
                  >
                    Managing Agent Information
                  </Col>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("MANAGING_AGENT_COMPANY")}
                      {...formVerticalLayout}
                      name="managingAgentCompany"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("MANAGING_AGENT_COMPANY_VI")}
                      {...formVerticalLayout}
                      name="managingAgentCompanyVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("HOLDER_OF")}
                      {...formVerticalLayout}
                      name="holderOf"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("HOLDER_OF_VI")}
                      {...formVerticalLayout}
                      name="holderOfVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("CERTIFICATE_NUMBER")}
                      {...formVerticalLayout}
                      name="managingAgentCertificateNumber"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("CERTIFICATE_NUMBER_VI")}
                      {...formVerticalLayout}
                      name="managingAgentCertificateNumberVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("CERTIFICATE_ISSUED_DATE")}
                      {...formVerticalLayout}
                      name="managingAgentCertificateIssuedDate"
                    >
                      <DatePicker className="w-100" format={dateTimeFormat} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("MANAGING_AGENT_CERTIFICATE_ISSUED_BY")}
                      {...formVerticalLayout}
                      name="managingAgentCertificateIssuedBy"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }}>
                    <Form.Item
                      label={L("MANAGING_AGENT_CERTIFICATE_ISSUED_BY_VI")}
                      {...formVerticalLayout}
                      name="managingAgentCertificateIssuedByVi"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col
                    className="ant-drawer-header-title ant-drawer-title"
                    style={{ fontWeight: 700 }}
                    sm={{ span: 24, offset: 0 }}
                  >
                    Parking Fee
                  </Col>
                  <Col sm={{ span: 16, offset: 0 }} />
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("MOTOBIKE_COST")}
                      {...formVerticalLayout}
                      name="motorbikeCost"
                    >
                      <Input type="number" />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("DEDICATED_CAR_COST")}
                      {...formVerticalLayout}
                      name="dedicatedCarCost"
                    >
                      <Input type="number" />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <Form.Item
                      label={L("PET_FEES")}
                      {...formVerticalLayout}
                      name="petFees"
                    >
                      <Input type="number" />
                    </Form.Item>
                  </Col>
                  {this.props.id && (
                    <>
                      <Col sm={{ span: 24, offset: 0 }}>
                        <p>{L("PROJECT_IMAGE")}</p>
                        {/* <Form.Item name="image"> */}
                        <ImageUploadWrapCRM
                          moduleId={moduleNames.project}
                          parentId={
                            this.props.projectStore?.editProject?.uniqueId
                          }
                          type="IMAGE"
                        />
                        {/* </Form.Item> */}
                      </Col>
                      <Col sm={{ span: 24, offset: 0 }}>
                        <p>{L("PROJECT_LOGO")}</p>
                        <ImageUploadLogoCRM
                          moduleId={moduleNames.logoProject}
                          parentId={
                            this.props.projectStore?.editProject?.uniqueId
                          }
                          type="IMAGE"
                        />
                      </Col>
                    </>
                  )}
                </Row>
              </Card>
            </Col>
          </Row>
        </Form>
      </>
    )
  }
}

export default withRouter(Summary)
