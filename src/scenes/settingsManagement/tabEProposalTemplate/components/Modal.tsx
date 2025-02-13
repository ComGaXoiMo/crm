import { L } from "@lib/abpUtility"
import { Card, Col, Form, Input, Row } from "antd"
import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import CustomDrawer from "@components/Drawer/CustomDrawer"
import NotificationTemplateStore from "@stores/notificationTemplate/notificationTemplateStore"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import SyncfutionRichText from "@components/Inputs/SyncfusionRichText"
export interface Props {
  visible: boolean
  onClose: () => void
  notificationTemplateStore: NotificationTemplateStore
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
        this.init()
        this.setState({ isEdit: false })
      }
    }
  }
  onEdit = async () => {
    this.setState({ isEdit: true })
  }

  onSave = async () => {
    const form = this.formRef.current
    form.validateFields().then(async (values: any) => {
      if (!this.props.notificationTemplateStore.editTemplate?.id) {
        await this.props.notificationTemplateStore.create(values)
      } else {
        const { notificationTemplates, ...bodyNotTemplate } =
          this.props.notificationTemplateStore.editTemplate
        const body = {
          ...bodyNotTemplate,
          notificationTemplates: [
            { ...values, languageName: "en", templateName: values.subject },
          ],
        }

        await this.props.notificationTemplateStore.update(body)
      }
      this.setState({ isEdit: false })
      this.props.onOk()
    })
  }
  init = async () => {
    this.formRef.current.setFieldsValue({
      ...this.props.notificationTemplateStore.editTemplate
        ?.notificationTemplates[0],
    })
  }
  render(): React.ReactNode {
    const {
      notificationTemplateStore: { editTemplate },
      visible,
      onClose,
    } = this.props
    const { isEdit } = this.state

    return (
      <CustomDrawer
        useBottomAction
        title={L(editTemplate?.notificationTemplates[0]?.templateName ?? "")}
        visible={visible}
        onClose={() => {
          onClose()
        }}
        onEdit={
          this.props.notificationTemplateStore?.editTemplate?.id
            ? this.onEdit
            : undefined
        }
        onSave={
          this.props.notificationTemplateStore?.editTemplate?.id
            ? this.onSave
            : undefined
        }
        isEdit={this.state.isEdit}
        updatePermission={true} //TODO: add permission
      >
        <Card className="card-detail-modal">
          <Form ref={this.formRef} layout={"vertical"} size="middle">
            <Row gutter={[16, 0]}>
              <Col sm={{ span: 24, offset: 0 }}>
                <Row gutter={[16, 0]}>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item label={L("TITLE")} name={["subject"]}>
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  {visible && (
                    <Col sm={{ span: 24 }}>
                      <Form.Item label={L("TEMPLATE")} name={"templateContent"}>
                        <SyncfutionRichText isNotEdit={!isEdit} />
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          </Form>
        </Card>
      </CustomDrawer>
    )
  }
}
export default withRouter(EProposalTemplateModal)
