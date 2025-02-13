import { L } from "@lib/abpUtility"
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Upload,
} from "antd"
import React from "react"
// import TextArea from "antd/lib/input/TextArea";
import AppDataStore from "@stores/appDataStore"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import FormDatePicker from "@components/FormItem/FormDatePicker"
import dayjs from "dayjs"
import { UploadOutlined } from "@ant-design/icons"
import fileService from "@services/common/fileService"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import AppConsts, { moduleNames } from "@lib/appconst"
const { leaseStage } = AppConsts
interface Props {
  visible: boolean
  onClose: () => void
  onOk: (id) => void
  status?: any
  expriedDate: any
  leaseAgreementStore: LeaseAgreementStore
  appDataStore: AppDataStore
}
interface State {
  idChoose: any
  selectedType: any
  file: any
  isRequired: boolean
  haveDoc: any
}
@inject(Stores.AppDataStore, Stores.LeaseAgreementStore)
@observer
class TerminateModal extends AppComponentListBase<Props, State> {
  form: any = React.createRef()
  constructor(props) {
    super(props)
    this.state = {
      selectedType: tabKeys.terminate,
      idChoose: undefined,
      file: undefined,
      isRequired: false,
      haveDoc: undefined,
    }
  }
  async componentDidUpdate(prevProp, prevState) {
    if (prevProp.visible !== this.props.visible) {
      if (this.props.visible === true) {
        this.form.current?.setFieldValue(
          "terminationDate",
          dayjs(this.props.expriedDate)
        )
        this.setState({
          isRequired: this.state.selectedType === tabKeys.earlyTerminate,
        })
      }
    }
    if (
      prevState.selectedType !== this.state.selectedType ||
      prevState.haveDoc !== this.state.haveDoc
    ) {
      this.setState({
        isRequired:
          this.state.selectedType === tabKeys.earlyTerminate ||
          this.state.haveDoc,
      })
    }
  }

  uploadFile = async () => {
    const { leaseAgreementDetail } = this.props.leaseAgreementStore
    let formValues = await this.form.current?.validateFields()
    formValues = {
      documentName: formValues?.documentName,
      documentTypeId: formValues?.documentTypeId,
      uniqueId: leaseAgreementDetail?.uniqueId,
      uploadDate: dayjs().toJSON(),
    }
    await fileService.uploadDocument(
      moduleNames.contract,
      formValues,
      this.state.file
    )
  }
  handleOk = async () => {
    const resValue = await this.form.current?.validateFields()
    if (this.state.haveDoc) {
      await this.uploadFile()
    }
    const stageId =
      this.state.selectedType === tabKeys.terminate
        ? leaseStage.terminate
        : leaseStage.earlyTerminate
    const statusId = this.state.selectedType === tabKeys.terminate ? 18 : 19

    await this.props.onOk({
      terminationDate: resValue?.terminationDate,
      stageId: stageId,
      statusId: statusId,
    })
  }
  changeTab = (data) => {
    console.log(data)
  }
  handleBeforeUploadFile = (file?) => {
    this.setState({ file: file, haveDoc: file?.name })

    return false
  }
  handleRemoveFile = (file?) => {
    this.setState({ haveDoc: undefined })
  }
  render(): React.ReactNode {
    const {
      visible,
      onClose,
      appDataStore: { documentTypes },
    } = this.props

    return (
      this.props.visible && (
        <Modal
          open={visible}
          destroyOnClose
          title={L("TERMINATE_LA")}
          cancelText={L("BTN_CANCEL")}
          width={"40%"}
          onCancel={onClose}
          onOk={this.handleOk}
        >
          <Form layout={"vertical"} ref={this.form} size="middle">
            <Row gutter={[16, 8]}>
              <Col sm={{ span: 24 }}>
                <Radio.Group
                  size="middle"
                  onChange={async (value) => {
                    await this.setState({ selectedType: value.target.value })
                    await this.changeTab(value)
                  }}
                  value={this.state.selectedType}
                  buttonStyle="solid"
                  style={{ display: "flex" }}
                >
                  <Radio.Button
                    key={tabKeys.terminate}
                    value={tabKeys.terminate}
                  >
                    <div className="flex center-content">
                      {tabKeys.terminate}
                    </div>
                  </Radio.Button>
                  <Radio.Button
                    key={tabKeys.earlyTerminate}
                    value={tabKeys.earlyTerminate}
                  >
                    <div className="flex center-content">
                      {tabKeys.earlyTerminate}
                    </div>
                  </Radio.Button>
                </Radio.Group>
              </Col>
              <>
                <Col sm={{ span: 24 }}>
                  <FormDatePicker
                    label={L("TERMINATION_DATE")}
                    rule={[{ required: true }]}
                    name="terminationDate"
                    disabledDate={(current) =>
                      current > dayjs(this.props.expriedDate)
                    }
                  />
                </Col>
                <Col sm={{ span: 24 }}>
                  <Form.Item
                    label={L("DOC_NAME")}
                    name="documentName"
                    rules={[
                      {
                        required: this.state.isRequired,
                      },
                      { max: 200 },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col sm={{ span: 24 }}>
                  <Form.Item
                    label={L("DOC_TYPE")}
                    name="documentTypeId"
                    rules={[
                      {
                        required: this.state.isRequired,
                      },
                    ]}
                  >
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showArrow
                      placeholder={L("")}
                      // mode="multiple"
                      options={documentTypes}
                    ></Select>
                  </Form.Item>
                </Col>

                <Col sm={{ span: 24 }}>
                  <Form.Item
                    label={L("FILE_UPLOAD")}
                    name="uploadFile"
                    rules={[
                      {
                        required: this.state.isRequired,
                      },
                    ]}
                  >
                    <Upload
                      style={{ width: "100%" }}
                      maxCount={1}
                      beforeUpload={this.handleBeforeUploadFile}
                      onRemove={this.handleRemoveFile}
                    >
                      <Button icon={<UploadOutlined />}>{L("UPLOAD")}</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </>
            </Row>
          </Form>
          <style>
            {`
              .ant-modal-body{
                padding: 8px;
              }

            `}
          </style>
        </Modal>
      )
    )
  }
}
export default withRouter(TerminateModal)
const tabKeys = {
  terminate: L("TERMINATE"),
  earlyTerminate: L("EARLY_TERMINATE"),
}
