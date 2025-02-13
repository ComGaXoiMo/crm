import * as React from "react"

import { inject, observer } from "mobx-react"

import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { Button, Col, Divider, Form, Input, Row, Spin } from "antd"
import { L } from "@lib/abpUtility"
import InquiryStore from "@stores/communication/inquiryStore"
import ListingStore from "@stores/projects/listingStore"
import UnitStore from "@stores/projects/unitStore"
import AppDataStore from "@stores/appDataStore"
import Stores from "@stores/storeIdentifier"
import FormSelect from "@components/FormItem/FormSelect"
import { debounce } from "lodash"
import FormRangeInput from "@components/FormItem/FormRangeInput"
import FormTextArea from "@components/FormItem/FormTextArea"
import AddressSelectMulti from "@components/Inputs/AddressSelect"
import { EditOutlined, SaveOutlined } from "@ant-design/icons"
import projectService from "@services/projects/projectService"
import FormInput from "@components/FormItem/FormInput"
import FormDatePicker from "@components/FormItem/FormDatePicker"
import CreateTaskModal from "@scenes/activity/taskActivity/components/taskModal"
export interface IGeneralProps {
  id: any;
  inquiryStore: InquiryStore;
  listingStore: ListingStore;
  unitStore: UnitStore;
  appDataStore: AppDataStore;
}

export interface IGeneralState {
  assignedUsers: any;
  subStage: any[];
  isChangeSubStage: boolean;
  isEdit: boolean;
  listProject: any[];
  isLA: boolean;
  taskModalVisible: boolean;
}

@inject(
  Stores.AppDataStore,
  Stores.InquiryStore,
  Stores.UnitStore,
  Stores.ListingStore
)
@observer
class general extends AppComponentListBase<IGeneralProps, IGeneralState> {
  formRef: any = React.createRef();

  state = {
    assignedUsers: [],
    subStage: [] as any,
    isEdit: false,
    listProject: [],
    isLA: false,
    isChangeSubStage: false,
    taskModalVisible: false,
  };
  async componentDidMount() {
    await Promise.all([
      this.props.appDataStore.getCountryFull(),
      // this.props.appDataStore.getInquiryTypes({}),
      this.props.appDataStore.getInquirySourceAndStatus(),
      this.props.unitStore.getFacing(),
      this.props.unitStore.getView(),
    ])
    await this.initData(this.props.id ?? 0)
    await this.getProject("")
    await this.checkLA()
    await this.findSubStage(this.props.inquiryStore.inquiryDetail.statusId)
  }
  initData = async (id?) => {
    await this.props.inquiryStore.get(id)
    this.setState({
      assignedUsers: this.props.inquiryStore.inquiryDetail.users,
    })
    if (this.props.inquiryStore.inquiryDetail.contact) {
      this.props.appDataStore.contacts = [
        this.props.inquiryStore.inquiryDetail.contact,
      ]
    }
    if (this.props.inquiryStore.inquiryDetail.client) {
      this.props.appDataStore.clients = [
        this.props.inquiryStore.inquiryDetail?.client,
      ]
    }
    this.formRef.current.setFieldsValue({
      ...this.props.inquiryStore.inquiryDetail,
      sourceId: "Email",
    })
  };
  getProject = async (keyword) => {
    const res = await projectService.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword,
      isActive: true,
    })
    const newProjects = res.items.map((i) => {
      return { id: i.id, name: i.projectName }
    })
    this.setState({ listProject: newProjects })
  };
  findSubStage = async (id?) => {
    const subStage = this.props.appDataStore.inquirySubStage.filter(
      (item) => item.parentId === id
    )
    this.setState({ subStage })
  };
  changeStage = async (id?) => {
    this.findSubStage(id)
    this.checkLA()
  };
  toggleTaskModal = () =>
    this.setState((prevState) => ({
      taskModalVisible: !prevState.taskModalVisible,
    }));

  taskModalHandleOk = async () => {
    this.toggleTaskModal()
  };
  checkLA = () => {
    const check = this.formRef.current.getFieldValue("statusId") === 91 //hard code status Id === LA
    this.setState({ isLA: check })
  };
  public render() {
    const {
      unitStore: { facilities },
    } = this.props

    return (
      <>
        <Form
          ref={this.formRef}
          onValuesChange={() => this.setState({})}
          layout="vertical"
        >
          {this.props.inquiryStore.isLoading && (
            <>
              <Spin />
            </>
          )}
          {!this.props.inquiryStore.isLoading && (
            <Row gutter={[8, 0]}>
              <Row gutter={[8, 8]}>
                <Row gutter={[8, 0]}>
                  <Divider
                    orientation="left"
                    orientationMargin="0"
                    style={{ fontWeight: 600 }}
                  >
                    {L("Contact info")}
                  </Divider>
                  <div style={{ position: "absolute", right: 40 }}>
                    {this.state.isEdit && (
                      <Button
                        style={{
                          borderRadius: "8px",
                          backgroundColor: "#ffffff",
                          marginRight: 3,
                        }}
                        onClick={() => {
                          this.setState({ isEdit: !this.state.isEdit })
                        }}
                      >
                        <>{L("CANCEL")}</>
                      </Button>
                    )}

                    {this.state.isEdit ? (
                      <>
                        <Button
                          style={{
                            borderRadius: "8px",
                            backgroundColor: "#DEE3ED",
                          }}
                          onClick={() => {
                            if (this.state.isChangeSubStage) {
                              this.toggleTaskModal()
                            }
                            this.setState({ isEdit: !this.state.isEdit })
                          }}
                        >
                          <SaveOutlined />
                          {L("SAVE")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          style={{
                            borderRadius: "8px",
                            backgroundColor: "#DEE3ED",
                          }}
                          onClick={() => {
                            this.setState({ isEdit: !this.state.isEdit })
                          }}
                        >
                          <EditOutlined />
                          {L("EDIT")}
                        </Button>
                      </>
                    )}
                  </div>
                </Row>
                <Row gutter={[8, 0]}>
                  <Col sm={8}>
                    <FormSelect
                      disabled={!this.state.isEdit}
                      options={this.props.appDataStore?.contacts}
                      selectProps={{
                        onSearch: debounce(
                          this.props.appDataStore.getContacts,
                          300
                        ),
                      }}
                      label={L("CONTACT")}
                      name="contactId"
                    />
                  </Col>
                  <Col sm={16}>
                    <Form.Item label={L("INQUIRY_NAME")} name="">
                      <Input disabled={!this.state.isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={8}>
                    <Form.Item label={L("PHONE")} name="">
                      <Input disabled={!this.state.isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={8}>
                    <Form.Item label={L("EMAIL")} name="">
                      <Input disabled={!this.state.isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={8}>
                    <FormSelect
                      disabled={!this.state.isEdit}
                      selectProps={{
                        onSearch: debounce(
                          this.props.appDataStore.getClients,
                          300
                        ),
                      }}
                      options={this.props.appDataStore.clients}
                      label={L("COMPANY_NAME")}
                      name="clientId"
                    />
                  </Col>

                  {/* <Col sm={{ span: 8, offset: 0 }}>
                      <FormSelect
                        options={this.props.appDataStore.inquiryTypes}
                        disabled={!this.state.isEdit}
                        label={L("CATEGORY")}
                        name="typeId"
                        // rule={rules.required}
                      />
                    </Col> */}
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormSelect
                      disabled={!this.state.isEdit}
                      options={this.props.appDataStore.inquirySources}
                      label={L("SOURCE")}
                      name="sourceId"
                    />
                  </Col>

                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormSelect
                      disabled={!this.state.isEdit}
                      options={this.props.appDataStore.inquiryStatus}
                      label={L("STAGE")}
                      name="statusId"
                      onChange={(id) => this.changeStage(id)}
                    />
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormSelect
                      disabled={!this.state.isEdit}
                      options={this.state.subStage}
                      label={L("SUB_STAGE")}
                      onChange={() => this.setState({ isChangeSubStage: true })}
                      name="subStage"
                      // rule={rules.required}
                    />
                  </Col>
                </Row>
              </Row>
              {this.state.isLA && (
                <Row gutter={[8, 0]} className="w-100">
                  <Col sm={{ span: 12, offset: 0 }}>
                    <FormSelect
                      disabled={!this.state.isEdit}
                      options={[
                        { label: "Booking name 1" },
                        { label: "Booking name 2" },
                      ]}
                      label={L("BOOKING_NO")}
                      name="bookingNo"
                      // rule={rules.required}
                    />
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <FormSelect
                      disabled={!this.state.isEdit}
                      options={[{ label: "Unit 1" }, { label: "Unit 2" }]}
                      label={L("UNIT_NO")}
                      name="unitNo"
                      // rule={rules.required}
                    />
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormInput
                      rule={[
                        {
                          required: false,
                        },
                        { max: 50 },
                      ]}
                      disabled={!this.state.isEdit}
                      label="REFERENCE_NUMBER"
                      name={"referenceNumber"}
                    />
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormInput
                      disabled={!this.state.isEdit}
                      label="COMPANY_CONTACT"
                      name={"companyContact"}
                    />
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormSelect
                      disabled={!this.state.isEdit}
                      options={[
                        { label: "1 year" },
                        { label: "2 year" },
                        { label: "3 year" },
                      ]}
                      label={L("LEASE_TERM")}
                      name="leaseTerm"
                    />
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormSelect
                      disabled={!this.state.isEdit}
                      options={[
                        { label: "Monthly" },
                        { label: "Quaterly" },
                        { label: "Yearly" },
                      ]}
                      label={L("PAYMENT_TERM")}
                      name="paymentTerm"
                    />
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormInput
                      disabled={!this.state.isEdit}
                      label="CONTRACT_AMOUNT"
                      name={"contractAmount"}
                    />
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormInput
                      disabled={!this.state.isEdit}
                      label="RENT_ONLY"
                      name={"rentOnly"}
                    />
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormInput
                      disabled={!this.state.isEdit}
                      label="VAT"
                      name={"VAT"}
                    />
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormInput
                      disabled={!this.state.isEdit}
                      label="ALLOWANCE"
                      name={"allowance"}
                    />
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormInput
                      disabled={!this.state.isEdit}
                      label="SAP_ALLOWANCE"
                      name={"sapAllowance"}
                    />
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormInput
                      disabled={!this.state.isEdit}
                      label="SECURITY_DEPOSIT"
                      name={"secureDeposit"}
                    />
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormDatePicker
                      disabled={!this.state.isEdit}
                      label="START_DATE"
                      name={"startDate"}
                    />
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormDatePicker
                      disabled={!this.state.isEdit}
                      label="EXPIRED_DATE"
                      name={"expireDate"}
                    />
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormDatePicker
                      disabled={!this.state.isEdit}
                      label="EST_MOVE_IN"
                      name={"unitEstMoveIn"}
                    />
                  </Col>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormDatePicker
                      disabled={!this.state.isEdit}
                      label="DEADLINE_DEPOSIT"
                      name={"deadlineDeposit"}
                    />
                  </Col>
                  <Col sm={{ span: 24 }}>
                    <FormTextArea
                      disabled={!this.state.isEdit}
                      label={L("LEASE_DESCRIPTION")}
                      name="leaseDescription"
                    />
                  </Col>
                </Row>
              )}
              <Divider
                orientation="left"
                orientationMargin="0"
                style={{ fontWeight: 600 }}
              >
                {L("Contact info")}
              </Divider>
              <Row gutter={[8, 0]}>
                <Col sm={{ span: 8, offset: 0 }}>
                  <FormSelect
                    disabled={!this.state.isEdit}
                    options={this.state.listProject}
                    selectProps={{ mode: "multiple" }}
                    label={L("PROJECT")}
                    name="project"
                    // rule={rules.required}
                  />
                </Col>
                <Col sm={8}>
                  <FormSelect
                    disabled={!this.state.isEdit}
                    options={[
                      { label: "Service Apartment" },
                      { label: "Townhouse" },
                      { label: "Villa" },
                    ]}
                    label={L("PROPERTY_TYPE")}
                    name={["propertyType", "name"]}
                    selectProps={{ mode: "multiple" }}
                    // rule={rules.required}
                  />
                </Col>

                <Col sm={{ span: 8, offset: 0 }}>
                  <FormSelect
                    disabled={!this.state.isEdit}
                    options={[
                      { label: "1:1" },
                      { label: "2:2" },
                      { label: "2:3" },
                      { label: "4:3" },
                      { label: "4:4" },
                    ]}
                    label={L("UNIT_TYPE")}
                    selectProps={{ mode: "multiple" }}
                    name="unitType"
                    // rule={rules.required}
                  />
                </Col>
                <Col sm={8}>
                  <FormSelect
                    disabled={!this.state.isEdit}
                    options={this.props.unitStore.facing}
                    selectProps={{ mode: "multiple" }}
                    label={L("FACING")}
                    name="facing"
                    // rule={rules.required}
                  />
                </Col>
                {/* <Col sm={12}>
                        <Form.Item label={L("PROPERTY_TYPE")} name="">
                          <Input disabled={!this.state.isEdit} />
                        </Form.Item>
                      </Col> */}

                <Col sm={{ span: 8, offset: 0 }}>
                  <FormSelect
                    options={this.props.unitStore.view}
                    label={L("VIEWS")}
                    disabled={!this.state.isEdit}
                    selectProps={{ mode: "multiple" }}
                    name="viewIds"
                  />
                </Col>

                <Col sm={{ span: 8, offset: 0 }}>
                  <FormSelect
                    disabled={!this.state.isEdit}
                    options={[{ label: "Furnished" }, { label: "Serviced" }]}
                    label={L("UNIT_SERVICE_TYPE")}
                    name="unitServiceType"
                    selectProps={{ mode: "multiple" }}
                    // rule={rules.required}
                  />
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <FormSelect
                    label={L("UNIT_FACILITIES")}
                    selectProps={{ mode: "multiple" }}
                    name={"facilityIds"}
                    options={facilities}
                  />
                </Col>

                <Col sm={6}>
                  <FormRangeInput
                    disabled={!this.state.isEdit}
                    label={L("AREA")}
                    name="fromSize"
                    seccondName="toSize"
                  />
                </Col>
                <Col sm={6}>
                  <FormRangeInput
                    disabled={!this.state.isEdit}
                    isCurrency
                    label={L("BUDGET")}
                    name="fromPrice"
                    seccondName="toPrice"
                  />
                </Col>
                <Col sm={{ span: 12, offset: 0 }}>
                  <Form.Item
                    label={L("COMPANY_LOCATION")}
                    name="inquiryAddress"
                  >
                    <AddressSelectMulti
                      disabled={!this.state.isEdit}
                      countries={this.props.appDataStore.countryFull}
                    />
                  </Form.Item>

                  {/* <SelectAddress
                            groupName="inquiryAddress"
                            appDataStore={props.appDataStore}
                          /> */}
                </Col>

                <Col sm={{ span: 24 }}>
                  <FormTextArea
                    disabled={!this.state.isEdit}
                    label={L("DESCRIPTION")}
                    name="description"
                  />
                </Col>
              </Row>
            </Row>
          )}
        </Form>
        <CreateTaskModal
          visible={this.state.taskModalVisible}
          onClose={() => {
            this.setState({ taskModalVisible: false })
          }}
          onOk={this.taskModalHandleOk}
        />
      </>
    )
  }
}
export default withRouter(general)
