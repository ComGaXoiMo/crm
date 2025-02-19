import { inject, observer } from "mobx-react"
import React from "react"
import { L } from "@lib/abpUtility"
import { Button, Col, Form, Row, Switch } from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import AppDataStore from "@stores/appDataStore"
import Stores from "@stores/storeIdentifier"
import { AppComponentListBase } from "@components/AppComponentBase"
import FileStore from "@stores/common/fileStore"
import FormInput from "@components/FormItem/FormInput"
import FormSelect from "@components/FormItem/FormSelect"
import FormDatePicker from "@components/FormItem/FormDatePicker"
import FormTextArea from "@components/FormItem/FormTextArea"
import GenerateModal from "./generateModal"
import LeaseDeposit from "./leaseDeposit"
import LeaseDealer from "./leaseDealer"
const tabKeys = {
  tabInformation: "TAB_INFORMATION",
  tabSchedulePayment: "TAB_SCHEDULE_PAYMENT",
}
type Props = {
  id: any
  data: any
  history: any
  onClose: () => void
  appDataStore: AppDataStore
  fileStore: FileStore
}
type States = {
  assignedUsers: any
  tabActiveKey: any
  modalVisible: boolean
  isFromReservation: boolean
  dataGenerate: any
}
inject(Stores.AppDataStore)
observer
class LeaseAgreementDetail extends AppComponentListBase<Props, States> {
  formRef = React.createRef<any>()
  state = {
    assignedUsers: [] as any,
    modalVisible: false,
    tabActiveKey: tabKeys.tabInformation,
    isFromReservation: true,
    dataGenerate: {} as any,
  }
  async componentDidMount() {
    if (this.props.data.id) {
      this.formRef.current?.setFieldsValue(this.props.data)
    } else {
      this.formRef.current?.resetFields()
    }
    await Promise.all([])
  }
  toggleModal = () =>
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))

  handleOk = async () => {
    this.toggleModal()
  }
  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  }
  handleSave = () => {
    console.log(this.props.id)
  }
  handleGenerate = () => {
    const form = this.formRef.current?.getFieldsValue()
    const data = {
      leaseTerm: form.leaseTerm,
      paymentTerm: form.paymentTerm,
      rentOnly: form.rentOnly,
    }
    this.setState({ dataGenerate: data })
    this.toggleModal()
  }

  render() {
    return (
      <>
        <Form
          ref={this.formRef}
          layout={"vertical"}
          //  onFinish={this.onSave}
          // validateMessages={validateMessages}
          size="small"
        >
          {/* <Card style={{ borderRadius: 8, marginBottom: 2 }}>
                <Row gutter={[8, 0]} className="w-100">
                  <Col sm={{ span: 24 }}>
                    <strong>{L("CLIENT")}</strong>
                  </Col>
                  
                </Row>
              </Card> */}
          <Row gutter={[8, 0]} className="w-100">
            <Col sm={{ span: 24 }}>
              <strong>{L("CONTRACT_INFO")}</strong>
            </Col>
            <Col sm={{ span: 8 }}>
              <FormSelect
                options={[
                  { label: "New" },
                  { label: "Renew" },
                  { label: "Termination" },
                  { label: "Early Termination" },
                ]}
                label={L("CONTRACT_STATUS")}
                name="contractStatus"
              />
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <FormInput label="REFERENCE_NUMBER" name={"referenceNumber"} />
            </Col>
            <Col sm={{ span: 8 }}>
              <FormSelect
                options={[
                  { label: "My Huyen" },
                  { label: "Nhat Lan" },
                  { label: "Hoai Linh" },
                ]}
                label={L("COMPANY_CONTACT")}
                name="companyContact"
              />
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <FormDatePicker label="START_DATE" name={"startDate"} />
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <FormDatePicker label="EXPIRED_DATE" name={"expireDate"} />
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <FormDatePicker label="TERMINATE_DATE" name={"terminalDate"} />
            </Col>
            <Col sm={{ span: 24 }}>
              <FormTextArea
                label={L("LEASE_DESCRIPTION")}
                name="leaseDescription"
              />
            </Col>
          </Row>

          <Row gutter={[8, 0]} className="w-100">
            <Col sm={{ span: 24 }}>
              <strong>{L("UNIT_INFO")}</strong>
            </Col>
            <Col md={{ span: 4 }}>
              <Form.Item label={L("FROM_RESERVATION")} valuePropName="checked">
                <Switch
                  defaultChecked
                  onChange={() =>
                    this.setState({
                      isFromReservation: !this.state.isFromReservation,
                    })
                  }
                />
              </Form.Item>
            </Col>
            {this.state.isFromReservation ? (
              <Col sm={{ span: 10, offset: 0 }}>
                <FormSelect
                  options={[
                    { label: "Reservation 1" },
                    { label: "Reservation 2" },
                  ]}
                  label={L("RESERVATION_NO")}
                  name="reservationNo"
                  // rule={rules.required}
                />
              </Col>
            ) : (
              <Col sm={{ span: 10, offset: 0 }}>
                <FormSelect
                  options={[
                    { label: "THE WATERFRONT" },
                    { label: "THE CRESCENT RESIDENCE 1" },
                  ]}
                  label={L("PROJECT")}
                  name="reservationNo"
                  // rule={rules.required}
                />
              </Col>
            )}
            <Col sm={{ span: 10, offset: 0 }}>
              <FormSelect
                options={[{ label: "Unit 1" }, { label: "Unit 2" }]}
                label={L("UNIT_NO")}
                name="unitNo"
                // rule={rules.required}
              />
            </Col>
          </Row>
          <LeaseDealer />
          <LeaseDeposit />
          <Row gutter={[8, 0]} className="w-100">
            <Col sm={{ span: 24 }}>
              <strong>{L("TERM_AND_PAYMENT")}</strong>
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <FormSelect
                options={[
                  { id: 1, value: "1 year", label: "1 year" },
                  { id: 2, value: "2 year", label: "2 year" },
                  { id: 3, value: "3 year", label: "3 year" },
                ]}
                label={L("LEASE_TERM")}
                name="leaseTerm"
              />
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <FormSelect
                options={[
                  { value: "Monthly", label: "Monthly" },
                  { value: "Bi monthly", label: "Bi monthly" },
                  { value: "Quaterly", label: "Quaterly" },
                  { value: "Yearly", label: "Yearly" },
                ]}
                label={L("PAYMENT_TERM")}
                name="paymentTerm"
              />
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <FormInput label="RENT_ONLY_AMOUNT" name={"rentOnly"} />
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <FormInput label="VAT" name={"VAT"} />
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <FormInput label="SAP_ALLOWING" name={"SAPAllowing"} />
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <FormInput label="CONTRACT_AMOUNT" name={"contractAmount"} />
            </Col>
            <div style={{}}>
              <Button
                onClick={() => this.handleGenerate()}
                className="button-primary"
              >
                {L("GENERATE")}
              </Button>
            </div>
          </Row>
        </Form>

        <GenerateModal
          visible={this.state.modalVisible}
          onClose={() => {
            this.setState({ modalVisible: false })
          }}
          data={this.state.dataGenerate}
          onOk={this.handleOk}
        />
      </>
    )
  }
}

export default withRouter(LeaseAgreementDetail)
