import { L } from "@lib/abpUtility"
import { Card, Col, Row, Spin } from "antd"
import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import CustomDrawer from "@components/Drawer/CustomDrawer"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import SyncfusionDocumentEditor from "@components/Inputs/SyncfusionDocumentEditor"
export interface Props {
  visible: boolean
  onClose: () => void
  onOk: () => Promise<any>
}
export interface State {
  isEdit: boolean
}
@inject(Stores.NotificationTemplateStore)
@observer
class EProposalTemplateModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = { isEdit: false }
  }
  componentDidUpdate = async (prevProps) => {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        console.log()
      }
    }
  }
  onEdit = async () => {
    this.setState({ isEdit: true })
  }

  onSave = async () => {
    const form = this.formRef.current
    form.validateFields().then(async (values: any) => {
      this.setState({ isEdit: false })

      this.props.onOk()
    })
  }

  renderEditDoc = () => {
    const { isEdit } = this.state

    return (
      <DelayedRender delay={50}>
        <SyncfusionDocumentEditor
          isNotEdit={!isEdit}
          visible={this.props.visible}
        />
      </DelayedRender>
    )
  }
  render(): React.ReactNode {
    const { visible, onClose } = this.props

    return (
      <CustomDrawer
        useBottomAction
        title={L("DETAIL")}
        visible={visible}
        onClose={() => {
          onClose()
        }}
        onEdit={this.onEdit}
        onSave={this.onSave}
        isEdit={this.state.isEdit}
        updatePermission={true} //TODO: add permission
      >
        <Card className="card-detail-modal">
          <Row gutter={[16, 0]}>
            <Col sm={{ span: 24, offset: 0 }}>
              {visible && <Col sm={{ span: 24 }}>{this.renderEditDoc()}</Col>}
            </Col>
          </Row>
        </Card>
      </CustomDrawer>
    )
  }
}
export default withRouter(EProposalTemplateModal)
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
        <Spin size="large" className="h-100 w-100 mt-30" />
      </div>
    )
  }
}
