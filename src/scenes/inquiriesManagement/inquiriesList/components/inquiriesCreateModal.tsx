import { L } from "@lib/abpUtility"
import { Card, Col, Form, Input, Modal, Row } from "antd"
import React from "react"
import { FormInstance } from "antd/lib/form"
import InquiryStore from "@stores/communication/inquiryStore"
import ListingStore from "@stores/projects/listingStore"
import AppDataStore from "@stores/appDataStore"
import UnitStore from "@stores/projects/unitStore"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import FormSelect from "@components/FormItem/FormSelect"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import { debounce } from "lodash"
import FormRangeInput from "@components/FormItem/FormRangeInput"
import FormTextArea from "@components/FormItem/FormTextArea"
import rules from "./validations"
import AddressSelectMulti from "@components/Inputs/AddressSelect"
import PhoneInput from "@components/Inputs/PhoneInput/PhoneInput"
import projectService from "@services/projects/projectService"
import Monition from "@scenes/activity/allActivity/components/Monition"

interface Props {
  visible: boolean
  onClose: () => void
  onOk: () => void
  // onOk: (file, packageId) => Promise<any>;
  inquiryStore: InquiryStore
  listingStore: ListingStore
  unitStore: UnitStore
  appDataStore: AppDataStore
}

interface State {
  file?: any
  uploading?: boolean
  subStage: any[]
  isExistsPhone: boolean
  idUser: any
  disabledForm: boolean
  visible: boolean
  listProject: any[]
}
@inject(
  Stores.AppDataStore,
  Stores.InquiryStore,
  Stores.UnitStore,
  Stores.ListingStore
)
@observer
class InquiriesCreateModal extends AppComponentListBase<Props, State> {
  formref = React.createRef<FormInstance>()

  constructor(props) {
    super(props)
    this.state = {
      subStage: [],
      isExistsPhone: false,
      idUser: undefined,
      visible: false,
      disabledForm: true,
      listProject: [],
    }
  }
  async componentDidMount() {
    await Promise.all([
      this.props.unitStore.getFacing(),
      this.props.unitStore.getView(),
    ])
    await this.getProject("")
  }
  onCreate = async () => {
    const values = await this.formref.current?.validateFields()
    const body = {
      ...values,
    }
    await this.props.inquiryStore.createOrUpdate(body)
    await this.props.onOk
  }
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
  }
  findSubStage = async (id?) => {
    const subStage = this.props.appDataStore.inquirySubStage.filter(
      (item) => item.parentId === id
    )
    this.setState({ subStage })
  }

  checkPhone = async (e?) => {
    const { value } = e.target
    if (value === "123456789") {
      this.setState({ isExistsPhone: true })
    } else if (value === "123456788") {
      this.formref.current?.setFieldsValue({
        contact: "Phan Han",
        email: "han@mail.com",
        client: "Phu My Hung",
        inquiriesName: "Iqr PH",
        statusId: 89,
        subStage: "New lead",
      })
      this.setState({ disabledForm: false })
    } else if (value.length === 9) {
      this.setState({ disabledForm: false })
    } else {
      this.setState({ isExistsPhone: false, disabledForm: true })
    }
  }
  render(): React.ReactNode {
    const { visible, onClose } = this.props

    return (
      <Modal
        width={"60%"}
        open={visible}
        destroyOnClose
        style={{ top: 20 }}
        title={L("CREATE_NEW_INQUIRIES")}
        cancelText={L("BTN_CANCEL")}
        onOk={this.onCreate}
        bodyStyle={{ height: "80vh", overflowY: "scroll" }}
        onCancel={() => {
          onClose()
        }}
        confirmLoading={this.state.uploading}
      >
        <Form
          ref={this.formref}
          layout={"vertical"}
          //  onFinish={this.onSave}
          // validateMessages={validateMessages}
          size="middle"
        >
          <Row gutter={[8, 0]}>
            <Col sm={{ span: 24 }}>
              <strong>General</strong>
            </Col>

            <Col sm={{ span: 8 }}>
              {/* <Input placeholder={L("")}></Input>
               */}
              <PhoneInput onChange={this.checkPhone} fieldName="phone" />
              {this.state.isExistsPhone && (
                <div>
                  <a style={{ color: "red " }}>
                    Phone Number already exists.
                    <a
                      onClick={() => {
                        this.setState({ isExistsPhone: false, visible: true })
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
            <Col sm={{ span: 16 }}>
              <Form.Item
                label={L("INQUIRIES_NAME")}
                name="inquiriesName"
                rules={rules.required}
              >
                <Input
                  disabled={this.state.disabledForm}
                  placeholder={L("")}
                ></Input>
              </Form.Item>
            </Col>
            <Col sm={{ span: 8 }}>
              <Form.Item
                label={L("CONTACT")}
                name="contact"
                rules={rules.required}
              >
                <Input disabled={this.state.disabledForm} />
              </Form.Item>
            </Col>
            <Col sm={{ span: 8 }}>
              <Form.Item label={L("EMAIL")} name="email" rules={rules.required}>
                {/* <Select placeholder={L("")}></Select> */}
                <Input disabled={this.state.disabledForm} />
              </Form.Item>
            </Col>
            <Col sm={{ span: 8 }}>
              <FormSelect
                disabled={this.state.disabledForm}
                selectProps={{
                  onSearch: debounce(this.props.appDataStore.getClients, 300),
                }}
                options={this.props.appDataStore.clients}
                label={L("COMPANY_NAME")}
                name="client"
                rule={rules.required}
              />
            </Col>

            {/* <Col sm={{ span: 6 }}>
              <FormSelect
                disabled={this.state.disabledForm}
                options={this.props.appDataStore.inquiryTypes}
                label={L("CATEGORY")}
                name="typeId"
                rule={rules.required}
              />
            </Col> */}
            <Col sm={{ span: 8 }}>
              <FormSelect
                disabled={this.state.disabledForm}
                options={this.props.appDataStore.inquirySources}
                label={L("SOURCE")}
                name="sourceId"
                rule={rules.required}
              />
            </Col>
            <Col sm={{ span: 8 }}>
              <FormSelect
                disabled={this.state.disabledForm}
                options={this.props.appDataStore?.inquiryStatus}
                label={L("STATUS")}
                name="statusId"
                rule={rules.required}
                onChange={(id) => this.findSubStage(id)}
              />
            </Col>
            <Col sm={{ span: 8 }}>
              <FormSelect
                disabled={this.state.disabledForm}
                options={this.state.subStage}
                label={L("SUB_STAGE")}
                name="subStage"
                // rule={rules.required}
              />
            </Col>
            <Col sm={{ span: 24 }}>
              <strong>{L("INQUIRY_DETAIL")}</strong>
            </Col>
            <Row gutter={[8, 0]}>
              <Col sm={{ span: 8, offset: 0 }}>
                <FormSelect
                  disabled={this.state.disabledForm}
                  options={this.state.listProject}
                  label={L("PROJECT")}
                  name="project"
                  // rule={rules.required}
                />
              </Col>
              <Col sm={8}>
                <FormSelect
                  disabled={this.state.disabledForm}
                  options={[
                    { label: "Service Apartment" },
                    { label: "Townhouse" },
                    { label: "Villa" },
                  ]}
                  label={L("PROPERTY_TYPE")}
                  name={["propertyType", "name"]}
                  // rule={rules.required}
                />
              </Col>

              <Col sm={{ span: 8, offset: 0 }}>
                <FormSelect
                  disabled={this.state.disabledForm}
                  options={[
                    { label: "1:1" },
                    { label: "2:2" },
                    { label: "2:3" },
                    { label: "4:3" },
                    { label: "4:4" },
                  ]}
                  label={L("UNIT_TYPE")}
                  name="unitType"
                  // rule={rules.required}
                />
              </Col>
              <Col sm={8}>
                <FormSelect
                  disabled={this.state.disabledForm}
                  options={this.props.unitStore.facing}
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
                  disabled={this.state.disabledForm}
                  name="viewIds"
                />
              </Col>

              <Col sm={{ span: 8, offset: 0 }}>
                <FormSelect
                  disabled={this.state.disabledForm}
                  options={[{ label: "Furnished" }, { label: "Serviced" }]}
                  label={L("UNIT_SERVICE_TYPE")}
                  name="unitServiceType"
                  selectProps={{ mode: "multiple" }}
                  // rule={rules.required}
                />
              </Col>
              <Col sm={24}>
                <FormSelect
                  options={[
                    {
                      label: "Balcony",
                    },
                    {
                      label: "FamilyRoom",
                    },
                    {
                      label: "Study Room",
                    },
                    {
                      label: "Maid Room",
                    },
                    {
                      label: "BathRoom",
                    },
                    {
                      value: "Bathub",
                      id: 123,
                      label: "Bathub",
                      code: "1",
                    },
                    {
                      value: "Dulex",
                      id: 42,
                      label: "Dulex",
                      code: "1",
                    },
                    {
                      value: "1 storey",
                      id: 124,
                      label: "1 storey",
                      code: "1",
                    },
                    {
                      value: "2 storey",
                      id: 412,
                      label: "2 storey",
                      code: "1",
                    },
                    {
                      value: "garage",
                      id: 123,
                      label: "garage",
                      code: "1",
                    },
                    {
                      value: "Private garden",
                      id: 123,
                      label: "Private garden",
                      code: "1",
                    },
                  ]}
                  disabled={this.state.disabledForm}
                  label={L("SPECIAL_REQUEST")}
                  selectProps={{ mode: "multiple" }}
                  name="facilityIds"
                />
              </Col>

              <Col sm={6}>
                <FormRangeInput
                  disabled={this.state.disabledForm}
                  label={L("AREA")}
                  name="fromSize"
                  seccondName="toSize"
                />
              </Col>
              <Col sm={6}>
                <FormRangeInput
                  disabled={this.state.disabledForm}
                  isCurrency
                  label={L("BUDGET")}
                  name="fromPrice"
                  seccondName="toPrice"
                />
              </Col>
              <Col sm={{ span: 12, offset: 0 }}>
                <Form.Item label={L("COMPANY_LOCATION")} name="inquiryAddress">
                  <AddressSelectMulti
                    disabled={this.state.disabledForm}
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
                  disabled={this.state.disabledForm}
                  label={L("DESCRIPTION")}
                  name="description"
                />
              </Col>
            </Row>
          </Row>
        </Form>
        <Modal
          title={L("INFOMATION")}
          visible={this.state.visible}
          // visible={true}
          onCancel={() => this.setState({ visible: false })}
          closable={false}
        >
          <div className="w-100">
            <Row gutter={[8, 0]}>
              {/* <Col sm={{ span: 24 }}>Owner: Nguyễn Hoa Mĩ Chi</Col> */}
              <Col sm={{ span: 24 }}>
                <Card
                  style={{
                    backgroundColor: "white",
                    minHeight: "60vh",
                    height: "max-content",
                    padding: "10px",
                    borderRadius: "16px",
                  }}
                >
                  <Row>
                    {fakedata.map((item, index) => (
                      <Monition key={index} data={item.data} />
                    ))}
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        </Modal>
      </Modal>
    )
  }
}
export default withRouter(InquiriesCreateModal)
const fakedata = [
  {
    data: {
      activityName: "Reservation Confirmation",
      createDate: "26/04/2023",
      createUser: "Viet Nguyen",
      type: 1,
      color: "#7aae27",
    },
  },
  {
    data: {
      activityName: "Mail Confirmation",
      createDate: "16/04/2023",
      createUser: "Bao Le",
      type: 3,
      color: "#2783ae",
    },
  },
  {
    data: {
      activityName: "Proposal ",
      createDate: "15/04/2023",
      createUser: "Tien Trinh",
      type: 2,
      color: "#6d27ae",
    },
  },

  {
    data: {
      activityName: "Reservation Confirmation",
      createDate: "23/03/2023",
      createUser: "Hoang Nguyen",
      type: 1,
      color: "#7aae27",
    },
  },
]
