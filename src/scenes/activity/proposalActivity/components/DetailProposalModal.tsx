import { L } from "@lib/abpUtility"
import { Button, Col, DatePicker, Input, Modal, Row } from "antd"
import React from "react"
import Form, { FormInstance } from "antd/lib/form"
import { portalLayouts } from "@components/Layout/Router/router.config"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import dayjs from "dayjs"
import { dateFormat } from "@lib/appconst"

interface Props {
  id: any
  history: any
  visible: boolean
  onClose: () => void
  onOk: (file, packageId) => Promise<any>
}

interface State {
  file?: any
  uploading?: boolean
}
const dataFake = {
  title: "001",
  date: dayjs("2023-04-04T08:07:31.5810056Z"),
}
class DetailProposalModal extends AppComponentListBase<Props, State> {
  form = React.createRef<FormInstance>()

  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      this.props.id
        ? await this.form.current?.setFieldsValue(dataFake)
        : await this.form.current?.resetFields()
    }
  }

  gotoDetail = (id?) => {
    const { history } = this.props
    history.push(portalLayouts.proposals.path.replace(":id", id))
  }
  render(): React.ReactNode {
    const { visible, onClose } = this.props

    return (
      this.props.visible && (
        <Modal
          open={visible}
          destroyOnClose
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
          title={L("EDIT_PROPOSAL")}
          onCancel={() => {
            onClose()
          }}
          confirmLoading={this.state.uploading}
        >
          <Form
            layout={"vertical"}
            ref={this.form}
            //  onFinish={this.onSave}
            // validateMessages={validateMessages}
            size="middle"
          >
            <Row gutter={[4, 4]}>
              <Col sm={{ span: 24 }}>
                <Form.Item label={L("PROPOSAL_TITLE")} name="title">
                  <Input placeholder={L("")}></Input>
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item label={L("PROPOSAL_DATE")} name="date">
                  <DatePicker className="w-100" format={dateFormat} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Button
                  style={{ width: "100%" }}
                  onClick={() => this.gotoDetail(this.props.id)}
                >
                  {L("VIEW")}
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(DetailProposalModal)
