import { L } from "@lib/abpUtility"
import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import CustomDrawer from "@components/Drawer/CustomDrawer"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import SyncfusionDocumentEditor from "@components/Inputs/SyncfusionDocumentEditor"
import NotificationTemplateStore from "@stores/notificationTemplate/notificationTemplateStore"
import { Spin } from "antd"
export interface Props {
  visible: boolean
  notificationTemplateStore: NotificationTemplateStore
  onClose: () => void
  onOk: () => Promise<any>
}
export interface State {
  isEdit: boolean
  isLoading: boolean
}
@inject(Stores.NotificationTemplateStore)
@observer
class TerminateNoteTemplateModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef()
  rteRef: any = React.createRef()

  constructor(props) {
    super(props)

    this.state = { isEdit: false, isLoading: false }
  }
  componentDidUpdate = async (prevProps) => {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        await this.setState({ isLoading: true })
        this.setState({ isEdit: false })
      }
    }
  }
  async componentDidMount() {
    await this.setState({ isLoading: true })
  }

  loadFinally = async (data) => {
    await this.setState({ isLoading: false })
  }
  onEdit = async () => {
    this.rteRef.current.documentEditor.isReadOnly = !this.state.isEdit

    this.setState({ isEdit: true })
  }
  updateTemplate = async () => {
    const documentEditorInstance = this.rteRef?.current
    // Serialize the content
    const sfdtBlob = await documentEditorInstance.documentEditor.saveAsBlob(
      "Sfdt"
    )

    // Save the content to a Blob without actually saving it to a file
    const reader = new FileReader()
    reader.onload = async () => {
      const contentAsString = reader.result

      const { notificationTemplates, ...bodyNotTemplate } =
        this.props.notificationTemplateStore.editTemplate

      const body = {
        ...bodyNotTemplate,
        notificationTemplates: [
          {
            ...notificationTemplates[0],
            templateContent: contentAsString,
          },
        ],
      }

      await this.props.notificationTemplateStore.update(body)
    }
    reader.readAsText(sfdtBlob)
  }
  onSave = async () => {
    this.updateTemplate().then(async () => {
      this.setState({ isEdit: false })

      this.props.onOk()
    })
  }

  renderEditDoc = () => {
    const { isEdit } = this.state
    const defaultDocx =
      this.props.notificationTemplateStore.editTemplate
        ?.notificationTemplates[0].templateContent
    return (
      <DelayedRender delay={50}>
        <SyncfusionDocumentEditor
          rteRef={this.rteRef}
          isNotEdit={!isEdit}
          visible={this.props.visible}
          initValue={defaultDocx}
          loadFinally={this.loadFinally}
        />
      </DelayedRender>
    )
  }
  render(): React.ReactNode {
    const {
      visible,
      onClose,
      notificationTemplateStore: { editTemplate },
    } = this.props

    return (
      <CustomDrawer
        useBottomAction
        title={L(editTemplate?.notificationTemplates[0]?.templateName ?? "")}
        visible={visible}
        onClose={() => {
          onClose()
        }}
        onEdit={this.onEdit}
        onSave={this.onSave}
        isEdit={this.state.isEdit}
        updatePermission={true} //TODO: add permission
      >
        {/* <Spin spinning={this.state.isLoading} className="h-100 w-100"> */}
        {visible && <>{this.renderEditDoc()}</>}
        {/* </Spin> */}
      </CustomDrawer>
    )
  }
}
export default withRouter(TerminateNoteTemplateModal)
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
