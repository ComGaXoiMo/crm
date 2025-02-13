import * as React from "react"

import { inject, observer } from "mobx-react"

import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { Card, Col, DatePicker, Divider, Form, Input, Row, Select } from "antd"
import { L } from "@lib/abpUtility"
import InquiryStore from "@stores/communication/inquiryStore"
import UnitStore from "@stores/projects/unitStore"
import AppDataStore from "@stores/appDataStore"
import Stores from "@stores/storeIdentifier"
import FormSelect from "@components/FormItem/FormSelect"
import FormRangeInput from "@components/FormItem/FormRangeInput"
import FormTextArea from "@components/FormItem/FormTextArea"
import projectService from "@services/projects/projectService"
import rules from "../validations"
import AppConsts, { GENDERS, dateFormat } from "@lib/appconst"
import { filterOptions, renderOptions } from "@lib/helper"
import AddressInput2 from "@components/Inputs/AddressInput2"
import { validateMessages } from "@lib/validation"
import FormInput from "@components/FormItem/FormInput"
import PhoneCheckInput from "@components/Inputs/PhoneInput/PhoneCheckInput"
import EmailsInput from "@components/Inputs/EmailsInput"
import companyService from "@services/clientManagement/companyService"
import ContactStore from "@stores/clientManagement/contactStore"
// import unitService from "@services/projects/unitService";
import LocaltionInput from "@components/Inputs/LocaltionInput"
import RequestModal from "@scenes/clientsManagement/contactsAndLead/components/tabInfo/requestModal"
import TaskModal from "../../../../activity/taskActivity/components/taskModal"
import moment from "moment"
import TaskStore from "@stores/activity/taskStore"
import { debounce } from "lodash"
// import { debounce } from "lodash";

const { contactType, formVerticalLayout } = AppConsts
export interface IGeneralProps {
  id: any
  isEdit: any
  companies: any[]
  isCreateContact: any
  inquiryStore: InquiryStore
  visible: boolean
  unitStore: UnitStore
  appDataStore: AppDataStore
  contactStore: ContactStore
  formRef: any
  taskStore: TaskStore
  contactType: number
  onCheckPhone: any
  listProject: any
  listIqrStage: any
}

export interface IGeneralState {
  isChangeSubStage: boolean
  listProject: any[]
  // listUnit: any[];
  isExistsPhone: boolean
  taskModalVisible: boolean
  existPhoneVisible: boolean
  companyType: any
  dueDate: any
  multiFilterStatus: any
  companyList: any[]
}

@inject(
  Stores.AppDataStore,
  Stores.InquiryStore,
  Stores.UnitStore,
  Stores.ContactStore,
  Stores.TaskStore
)
@observer
class info extends AppComponentListBase<IGeneralProps, IGeneralState> {
  formRef: any = this.props.formRef
  formRequest = React.createRef<any>()

  state = {
    listProject: [],
    // listUnit: [],
    isExistsPhone: false,
    isChangeSubStage: false,
    taskModalVisible: false,
    stage: [],
    dueDate: undefined,
    existPhoneVisible: false,
    companyType: undefined,
    multiFilterStatus: {
      projectIds: [] as any,
      propertyTypeIds: [] as any,
      unitTypeIds: [] as any,
    } as any,
    companyList: [] as any,
  }

  async componentDidMount() {
    await Promise.all([
      this.getProject("", true),
      this.getPropertyType(),
      this.getUnitType(),
      this.getCompany(""),
      // this.getUnit([]),
    ])
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.contactType !== this.props.contactType) {
      this.setState({ companyType: this.props.contactType })
    }
    if (prevProps.listProject !== this.props.listProject) {
      this.setState({ listProject: this.props.listProject })
    }
  }

  getProject = async (keyword, first?) => {
    const res = await projectService.getAll({
      pageSize: 10,
      keyword,
      isActive: true,
      propertyTypeIds: first
        ? []
        : this.state.multiFilterStatus.propertyTypeIds,
      unitTypeIds: first ? [] : this.state.multiFilterStatus.unitTypeIds,
    })
    const newProjects = res.items.map((i) => {
      return { id: i.id, name: i.projectCode }
    })

    await this.setState({ listProject: newProjects })

    // let formProject = await this.formRef.current
    //   ?.getFieldValue("projectIds")
    //   ?.filter((item) => newProjects?.find((prj) => prj.id === item));

    // await this.formRef.current?.setFieldValue("projectIds", formProject);
  }
  getCompany = async (keyword) => {
    const res = await companyService.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword,
      isActive: true,
    })
    const newList = res.items.map((i) => {
      return { id: i.id, name: i.businessName }
    })
    this.setState({ companyList: newList })
  }
  getPropertyType = async () => {
    await this.props.unitStore.getPropertyTypeByListProject(
      this.state.multiFilterStatus.projectIds,
      this.state.multiFilterStatus.unitTypeIds
    )
    const formPropertyType =
      this.formRef.current?.getFieldValue("propertyTypeIds")
    const propertyTypeWithRemove = formPropertyType?.filter((item) =>
      this.props.unitStore.propertyTypeByListProject.find(
        (data) => data.id === item
      )
    )
    this.formRef.current?.setFieldValue(
      "propertyTypeIds",
      propertyTypeWithRemove
    )
  }
  getUnitType = async () => {
    await this.props.unitStore.getListUnitTypeByListProject(
      this.state.multiFilterStatus.projectIds,
      this.state.multiFilterStatus.propertyTypeIds
    )
    const formUnitType = this.formRef.current?.getFieldValue("unitTypeIds")
    const unitTypeWithRemove = formUnitType?.filter((item) =>
      this.props.unitStore.unitTypeByListProject.find(
        (data) => data.id === item
      )
    )
    this.formRef.current?.setFieldValue("unitTypeIds", unitTypeWithRemove)
  }
  onChangeCompany = async (value) => {
    const res = await companyService.get(value)
    const paramvalue = res.companyAddress[0]

    this.formRef.current?.setFieldsValue({
      contact: { contactAddress: [{ ...paramvalue, id: undefined }] },
    })
    if (this.props.contactStore.checkContact?.isOwner) {
      const infoCompany = this.props.companies.find(
        (item) => item?.id === value
      )
      this.formRef.current?.setFieldsValue({
        contact: { levelId: infoCompany?.levelId, title: infoCompany?.title },
      })
    }
  }

  findSubStage = async (id?) => {
    await this.props.appDataStore.getInquirySubStage(id)
  }
  changeStage = async (id?) => {
    if (this.props.id) {
      const dueDate = await this.props.inquiryStore.getDueDate({
        statusId: id,
        date: moment().toJSON(),
      })
      await this.setState({ dueDate: dueDate })
      this.props.taskStore.createTask()
      this.toggleTaskModal()
    }
    this.findSubStage(id)
    this.formRef.current.resetFields(["statusDetailId"])
  }
  toggleExistPhoneModal = () => {
    this.setState((prevState) => ({
      existPhoneVisible: !prevState.existPhoneVisible,
    }))
  }

  handleOk = async () => {
    const formValues = await this.formRequest.current?.validateFields()
    const res = {
      ...formValues,
      contactId: this.props.contactStore?.checkContact?.id,
    }

    await this.props.contactStore.createRequestShareByUser(res)
    await this.toggleExistPhoneModal()
    // await this.props.onClose();
  }

  toggleTaskModal = () =>
    this.setState((prevState) => ({
      taskModalVisible: !prevState.taskModalVisible,
    }))

  taskModalHandleOk = async () => {
    await this.props.taskStore.getAll({
      maxResultCount: 10,
      skipCount: 0,
      inquiryId: this.props.id,
    })
    this.toggleTaskModal()
  }

  public render() {
    const { checkContact } = this.props.contactStore
    const {
      unitStore: {
        facing,
        view,
        propertyTypeByListProject,
        unitTypeByListProject,
      },
      appDataStore: {
        countries,
        positionLevels,
        countryFull,
        unitFacilities,
        inquirySubStageByStage,

        inquirySources,
        unitServiceTypes,
      },
      companies,
      listIqrStage,
    } = this.props
    const { companyList } = this.state
    return (
      <>
        <Card
          style={{
            backgroundColor: "white",
            minHeight: "76vh",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <Form
            ref={this.formRef}
            validateMessages={validateMessages}
            layout="vertical"
            size="middle"
            // disabled={!this.props.isEdit}
          >
            <Row gutter={[8, 0]}>
              <Row gutter={[8, 0]} className="full-width">
                <Col
                  sm={{ span: 24, offset: 0 }}
                  style={{ lineHeight: "0.2", marginBottom: 7 }}
                >
                  <Form.Item
                    label={L("CONTACT_PHONE")}
                    {...formVerticalLayout}
                    name={["contact", "contactPhone"]}
                    rules={rules.contactPhone}
                  >
                    <PhoneCheckInput
                      disabled={this.props.id && !this.props.isEdit}
                      onChange={() =>
                        this.props.contactStore.resetExistContact()
                      }
                      onCheckPhone={this.props.onCheckPhone}
                    />
                  </Form.Item>
                  {this.props.id
                    ? (!checkContact || checkContact?.isOwner === false) && (
                        <div>
                          <span style={{ color: "red" }}>
                            {L("THIS_PHONE_NUMBER_NOT_IN_YOUR_CONTACT")}
                          </span>
                        </div>
                      )
                    : checkContact?.isOwner === false && (
                        <div>
                          <a style={{ color: "red " }}>
                            Phone Number already exists.
                            <a
                              onClick={() => {
                                this.setState({ existPhoneVisible: true })
                              }}
                              style={{
                                textDecoration: "underline",
                                fontWeight: 600,
                                color: "red",
                              }}
                            >
                              View More
                            </a>
                          </a>
                        </div>
                      )}
                </Col>

                {/* <Col sm={{ span: 12, offset: 0 }} /> */}
                <Col sm={8}>
                  <FormSelect
                    label={L("GENDER")}
                    name={["contact", "gender"]}
                    disabled={this.props.id || !this.props.isCreateContact}
                    options={GENDERS}
                    rule={rules.required}
                  />
                </Col>

                <Col sm={8}>
                  <Form.Item
                    label={L("CONTACT_NAME")}
                    name={["contact", "contactName"]}
                    rules={rules.contactName}
                  >
                    <Input
                      disabled={this.props.id || !this.props.isCreateContact}
                    />
                  </Form.Item>
                </Col>
                <Col sm={{ span: 8, offset: 0 }}>
                  <Form.Item
                    label={L("CONTACT_NATIONALITY")}
                    {...formVerticalLayout}
                    name={["contact", "nationalityId"]}
                    // rules={rules.nationalityId}
                  >
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showSearch
                      allowClear
                      filterOption={filterOptions}
                      className="full-width"
                      disabled={this.props.id || !this.props.isCreateContact}
                    >
                      {renderOptions(countries)}
                    </Select>
                  </Form.Item>
                </Col>
                {/* {this.props.id && (
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("CONTACT_PHONE")}
                      {...formVerticalLayout}
                      name={["contact", "contactPhone"]}
                      rules={rules.contactPhone}
                    >
                      <PhonesInput2
                        // disabled={!this.props.isCreate && !this.props.isEdit}
                        disabled
                        suffix={!this.props.isCreateContact}
                      />
                    </Form.Item>
                  </Col>
                )} */}
                <Col sm={12}>
                  <Form.Item
                    label={L("CONTACT_EMAIL")}
                    name={["contact", "contactEmail"]}
                    rules={rules.contactEmail}
                  >
                    <EmailsInput
                      disabled={this.props.id || !this.props.isCreateContact}
                    />
                  </Form.Item>
                </Col>
                <Col sm={{ span: 12, offset: 0 }}>
                  <Form.Item
                    label={L("CONTACT_TYPE")}
                    {...formVerticalLayout}
                    name={["contact", "typeId"]}
                    rules={rules.required}
                  >
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showSearch
                      allowClear
                      disabled={this.props.id || !this.props.isCreateContact}
                      onSelect={(value) =>
                        this.setState({ companyType: value })
                      }
                      filterOption={filterOptions}
                      className="full-width"
                    >
                      {renderOptions(contactType)}
                    </Select>
                  </Form.Item>
                </Col>
                {this.props.id && (
                  <Col sm={{ span: 24 }}>
                    <Form.Item label={L("COMPANY")} name="companyId">
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        showSearch
                        allowClear
                        className="full-width"
                        disabled={
                          !this.props.isEdit ||
                          this.props.companies?.length === 0
                        }
                      >
                        {renderOptions(companies)}
                      </Select>
                    </Form.Item>
                  </Col>
                )}
                {!this.props.id && (
                  <>
                    {this.state.companyType === 2 && (
                      <>
                        <Col sm={{ span: 24, offset: 0 }}>
                          <Form.Item
                            label={L("COMPANY")}
                            name={["contact", "companyId"]}
                          >
                            <Select
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              showSearch
                              allowClear
                              filterOption={filterOptions}
                              className="full-width"
                              onSearch={debounce(
                                (e) => this.getCompany(e),
                                500
                              )}
                              onChange={(value) => this.onChangeCompany(value)}
                              // disabled={!checkContact?.isOwner}
                            >
                              {renderOptions(
                                checkContact?.isOwner ? companies : companyList
                              )}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col sm={{ span: 12, offset: 0 }}>
                          <Form.Item
                            label={L("CONTACT_POSITION_LEVEL")}
                            {...formVerticalLayout}
                            name={["contact", "levelId"]}
                          >
                            <Select
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              allowClear
                              filterOption={filterOptions}
                              disabled={!this.props.isCreateContact}
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
                            name={["contact", "title"]}
                          >
                            <Input disabled={!this.props.isCreateContact} />
                          </Form.Item>
                        </Col>
                      </>
                    )}
                    <Col sm={{ span: 24, offset: 0 }}>
                      <Form.Item
                        label={L("CONTACT_LOCATION")}
                        {...formVerticalLayout}
                        name={["contact", "contactAddress"]}
                      >
                        <AddressInput2
                          disabled={!this.props.isCreateContact}
                          value={this.props.contactStore.editContact}
                          countries={countryFull}
                        />
                      </Form.Item>
                    </Col>
                  </>
                )}
              </Row>
              <Divider
                orientation="left"
                orientationMargin="0"
                style={{ fontWeight: 600 }}
              >
                {L("INQUIRY_INQUIRY_INFO")}
              </Divider>
              <Row gutter={[8, 0]}>
                <Col sm={{ span: 8, offset: 0 }}>
                  <FormInput
                    disabled={!this.props.isEdit}
                    label={L("INQUIRY_NAME")}
                    name="inquiryName"
                    rule={rules.inquiryName}
                  />
                </Col>

                <Col sm={{ span: 8, offset: 0 }}>
                  <Form.Item label={L("PROJECT_CODE")} name="projectIds">
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showSearch
                      allowClear
                      mode="multiple"
                      onChange={async (ids) => {
                        await this.setState({
                          multiFilterStatus: {
                            ...this.state.multiFilterStatus,
                            projectIds: ids,
                          },
                        })
                        await this.getPropertyType()
                        await this.getUnitType()
                      }}
                      filterOption={filterOptions}
                      className="full-width"
                      onSearch={debounce((e) => this.getProject(e), 1000)}
                      disabled={!this.props.isEdit}
                    >
                      {renderOptions(this.state.listProject)}
                    </Select>
                  </Form.Item>
                </Col>

                <Col sm={8}>
                  <FormSelect
                    disabled={!this.props.isEdit}
                    options={propertyTypeByListProject}
                    label={L("PROPERTY_TYPE")}
                    onChange={async (ids) => {
                      await this.setState({
                        multiFilterStatus: {
                          ...this.state.multiFilterStatus,
                          propertyTypeIds: ids,
                        },
                      })
                      await this.getUnitType()
                      await this.getProject("")
                    }}
                    name={["propertyTypeIds"]}
                    selectProps={{ mode: "multiple" }}
                  />
                </Col>

                <Col sm={{ span: 8, offset: 0 }}>
                  <FormSelect
                    disabled={!this.props.isEdit}
                    options={unitTypeByListProject}
                    label={L("UNIT_TYPE")}
                    onChange={async (ids) => {
                      await this.setState({
                        multiFilterStatus: {
                          ...this.state.multiFilterStatus,
                          unitTypeIds: ids,
                        },
                      })
                      await this.getProject("")
                      await this.getPropertyType()
                    }}
                    selectProps={{ mode: "multiple" }}
                    name={["unitTypeIds"]}
                  />
                </Col>
                <Col sm={{ span: 8, offset: 0 }}>
                  <FormSelect
                    disabled={!this.props.isEdit}
                    options={listIqrStage}
                    label={L("INQUIRY_STATUS")}
                    name="statusId"
                    rule={[{ required: true }]}
                    onChange={(id) => this.changeStage(id)}
                  />
                </Col>
                <Col sm={{ span: 8, offset: 0 }}>
                  <FormSelect
                    disabled={!this.props.isEdit}
                    options={inquirySubStageByStage}
                    label={L("INQUIRY_DETAIL_STATUS")}
                    onChange={() => this.setState({ isChangeSubStage: true })}
                    name="statusDetailId"
                    rule={[{ required: true }]}
                  />
                </Col>
                <Col sm={{ span: 8, offset: 0 }}>
                  <FormSelect
                    disabled={!this.props.isEdit}
                    options={inquirySources}
                    label={L("SOURCE")}
                    name="sourceId"
                    rule={rules.required}
                  />
                </Col>
                <Col sm={{ span: 8, offset: 0 }}>
                  <FormInput
                    disabled={!this.props.isEdit}
                    label={L("OCCUPIER_NAME")}
                    name="occupierName"
                  />
                </Col>
                <Col sm={{ span: 8, offset: 0 }}>
                  <Form.Item label={L("MOVE_IN_DATE")} name="moveInDate">
                    <DatePicker
                      disabled={!this.props.isEdit}
                      className="w-100"
                      format={dateFormat}
                    />
                  </Form.Item>
                </Col>

                <Col sm={8}>
                  <FormSelect
                    disabled={!this.props.isEdit}
                    options={facing}
                    selectProps={{ mode: "multiple" }}
                    label={L("INQUIRY_FACING")}
                    name="facingIds"
                    // rule={rules.required}
                  />
                </Col>
                <Col sm={{ span: 8, offset: 0 }}>
                  <FormSelect
                    options={view}
                    label={L("INQUIRY_VIEW")}
                    disabled={!this.props.isEdit}
                    selectProps={{ mode: "multiple" }}
                    name="viewIds"
                  />
                </Col>

                <Col sm={{ span: 8, offset: 0 }}>
                  <FormSelect
                    disabled={!this.props.isEdit}
                    options={unitServiceTypes}
                    label={L("UNIT_SERVICE_TYPE")}
                    name="serviceTypeIds"
                    selectProps={{ mode: "multiple" }}
                    // rule={rules.req
                  />
                </Col>

                <Col sm={{ span: 24, offset: 0 }}>
                  <FormSelect
                    label={L("UNIT_FACILITIES")}
                    disabled={!this.props.isEdit}
                    selectProps={{ mode: "multiple" }}
                    name={"unitFacilityIds"}
                    options={unitFacilities}
                  />
                </Col>

                <Col sm={12}>
                  <FormRangeInput
                    disabled={!this.props.isEdit}
                    label={L("AREA_FROM_TO")}
                    name="fromSize"
                    seccondName="toSize"
                  />
                </Col>
                <Col sm={12}>
                  <FormRangeInput
                    disabled={!this.props.isEdit}
                    isCurrency
                    label={L("BUDGET_FROM_TO")}
                    name="fromPrice"
                    seccondName="toPrice"
                  />
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <Form.Item
                    label={L("INQUIRY_LOCATION")}
                    {...formVerticalLayout}
                    name="inquiryAddress"
                  >
                    <LocaltionInput
                      value={this.props.contactStore.editContact}
                      disabled={!this.props.isEdit}
                      countries={countryFull}
                    />
                  </Form.Item>
                </Col>
                <Col sm={{ span: 24 }}>
                  <FormTextArea
                    disabled={!this.props.isEdit}
                    label={L("DESCRIPTION")}
                    name="description"
                  />
                </Col>
              </Row>
            </Row>
          </Form>
        </Card>
        <RequestModal
          visible={this.state.existPhoneVisible}
          onClose={this.toggleExistPhoneModal}
          // data={editUnitStatusConfig}
          onOk={this.handleOk}
          formRef={this.formRequest}
          isLoading={this.props.contactStore.isLoading}
        />
        <TaskModal
          dueDate={this.state.dueDate}
          inquiryId={this.props.id}
          visible={this.state.taskModalVisible}
          onClose={this.toggleTaskModal}
          onOk={this.taskModalHandleOk}
        />
      </>
    )
  }
}
export default withRouter(info)
