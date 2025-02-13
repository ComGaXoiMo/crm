import { L } from "@lib/abpUtility"
import { Button, Col, Modal, Row, Spin } from "antd"
import React from "react"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"

import { inject, observer } from "mobx-react"
import _ from "lodash"
import SyncfusionDocView from "@components/Inputs/SyncfusionDocView"
import { WordIcon } from "@components/Icon"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import Stores from "@stores/storeIdentifier"

interface Props {
  visible: boolean
  title: any
  onClose: () => void
  formValue: any
  fileName: any
  leaseAgreementStore: LeaseAgreementStore
}

interface State {
  maxResultCount: number
  skipCount: number
  filters: any
}
@inject(Stores.LeaseAgreementStore)
@observer
class ExportFDReview extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      filters: { KeyWord: "", isActive: true },
    }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        await this.getTemplate()
      }
    }
  }
  getTemplate = async () => {
    console.log()
  }

  saveAsDocx = async () => {
    const documentEditorInstance = this.formRef?.current

    // Save the content as DOCX
    await documentEditorInstance.documentEditor.save(
      this.props.fileName,
      "Docx"
    )

    // Save the content to a Blob without actually saving it to a file
  }
  renderEditDoc = () => {
    const defaultDocx = this.props.formValue
    return (
      <DelayedRender delay={90}>
        <SyncfusionDocView
          initValue={defaultDocx}
          rteRef={this.formRef}
          visible={this.props.visible}
        />
      </DelayedRender>
    )
  }
  render(): React.ReactNode {
    const { visible, onClose } = this.props

    return (
      <>
        <Modal
          open={visible}
          destroyOnClose
          maskClosable={false}
          width={"65%"}
          style={{ top: 20 }}
          closable={false}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
          title={
            <Row gutter={[4, 0]}>
              <Col sm={{ span: 12 }}>
                <strong>{this.props.title}</strong>
              </Col>
              <Col sm={{ span: 12 }}>
                <div className="flex flex-row-reverse ">
                  <Button
                    icon={<WordIcon />}
                    className="button-primary"
                    onClick={this.saveAsDocx}
                  ></Button>
                  <Button className="custom-buttom-cancle" onClick={onClose}>
                    {L("CANCEL")}
                  </Button>
                </div>
              </Col>
            </Row>
          }
          onCancel={() => {
            onClose()
          }}
        >
          <Row gutter={[4, 0]}>
            <Col sm={{ span: 24 }}>{this.renderEditDoc()}</Col>
          </Row>
        </Modal>
        <style>{`
        .ant-modal-body{
          padding:0px
        }
        
        `}</style>
      </>
    )
  }
}
export default withRouter(ExportFDReview)
class DelayedRender extends AppComponentListBase {
  state = { shouldRender: false }
  timer: any
  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({ shouldRender: true })
    }, this.props.delay)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    return this.state.shouldRender ? (
      this.props.children
    ) : (
      <div>
        <Spin size="large" className="h-100 w-100 mt-3" />
      </div>
    )
  }
}
