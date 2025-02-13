import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Image, Col, Form, Row } from "antd"
import Stores from "@stores/storeIdentifier"
import ProjectStore from "@stores/projects/projectStore"
// import FileUploadWrap from "@components/FileUpload/FileUploadCRM";
import FileStore from "@stores/common/fileStore"
import UnitStore from "@stores/projects/unitStore"
import withRouter from "@components/Layout/Router/withRouter"
import AppDataStore from "@stores/appDataStore"
import FormInput from "@components/FormItem/FormInput"
import { L } from "@lib/abpUtility"
import TextArea from "antd/lib/input/TextArea"

export interface IInfoProps {
  projectStore: ProjectStore
  unitStore: UnitStore
  params: any
  appDataStore: AppDataStore
  fileStore: FileStore
}
export interface IInfoState {
  modalVisible: boolean
}

@inject(Stores.ProjectStore, Stores.UnitStore, Stores.AppDataStore)
@observer
class Info extends AppComponentListBase<IInfoProps, IInfoState> {
  formRef: any = React.createRef()
  formRefProjectAddress: any = React.createRef()

  constructor(props: IInfoProps) {
    super(props)
    this.state = {
      modalVisible: false,
    }
  }

  async componentDidMount() {
    await Promise.all([])
    this.initData()
  }
  initData = () => {
    console.log("init")
  }

  toggleModal = () =>
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))

  handleOk = async () => {
    this.toggleModal()
  }
  public render() {
    return (
      <>
        <Form
          ref={this.formRef}
          layout={"vertical"}
          //  onFinish={this.onSave}
          // validateMessages={validateMessages}
          size="middle"
        >
          <Row gutter={[8, 0]}>
            <Col sm={{ span: 24 }}>
              <strong>{L("LEASING_DETAIL")}</strong>
            </Col>
            <Col
              sm={{ span: 4 }}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Image
                width={133}
                height={100}
                style={{ borderRadius: "12px" }}
                src="https://noithatnhadepviet.vn/upload/product/biet-thu-12-8991.jpg"
              />
            </Col>
            <Col sm={{ span: 20 }}>
              <Row gutter={[16, 0]}>
                <Col sm={{ span: 8 }}>
                  <FormInput label="RENT" name={"rent"} />
                </Col>
                <Col sm={{ span: 8 }}>
                  <FormInput label="DEPOSIT" name={"deposit"} />
                </Col>
                <Col sm={{ span: 8 }}>
                  <FormInput label="AVALIABLE" name={"avaliable"} />
                </Col>
                <Col sm={{ span: 24 }}>
                  <FormInput label="CONTRACT" name={"contract"} />
                </Col>
              </Row>
            </Col>
            <Col sm={{ span: 24 }}>
              <strong>{L("UNIT_DETAILS")}</strong>
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <FormInput label="BED_ROOM" name="bedRoom" />
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <FormInput label="BATH_ROOM" name="bathRoom" />
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <FormInput label="UNIT_SIZE" name="size" />
            </Col>
            <Col sm={{ span: 24, offset: 0 }}>
              <Form.Item label={L("UNIT_DESCRIPTION")} name="description">
                <TextArea />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </>
    )
  }
}

export default withRouter(Info)
