import { L } from "@lib/abpUtility"
import { Col, Form, Modal, Row } from "antd"
import React from "react"
import { FormInstance } from "antd/lib/form"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import _ from "lodash"
import FormInput from "@components/FormItem/FormInput"
import CompanyStore from "@stores/clientManagement/companyStore"

interface Props {
  visible: boolean;
  companyStore: CompanyStore;
  companyId: any;
  onClose: () => void;
  onOk: (params) => void;
}

@inject(Stores.CompanyStore)
@observer
class EditCompanyModal extends AppComponentListBase<Props> {
  form = React.createRef<FormInstance>();

  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        if (this.props.companyId) {
          await this.props.companyStore.get(this.props.companyId)

          await this.form.current?.setFieldsValue({
            ...this.props.companyStore.editCompany,
          })
        }
      }
    }
  }

  onOk = async () => {
    const formValue = await this.form.current?.validateFields()
    const params = await {
      ...this.props.companyStore.editCompany,
      id: this.props.companyId,
      ...formValue,
    }

    await this.props.companyStore.createOrUpdate(params)
    await this.props.onOk({ ...formValue, id: this.props.companyId })
  };
  render(): React.ReactNode {
    const { visible, onClose } = this.props

    return (
      this.props.visible && (
        <Modal
          open={visible}
          width={"50%"}
          title={L("EDIT_COMPANY_MODAL")}
          cancelText={L("BTN_CANCEL")}
          onCancel={() => {
            onClose()
          }}
          onOk={this.onOk}
        >
          <Form layout={"vertical"} ref={this.form} size="middle">
            <Row gutter={[8, 0]}>
              <Col sm={{ span: 12, offset: 0 }}>
                <FormInput name="businessName" label={L("COMPANY_NAME")} />
              </Col>
              <Col sm={{ span: 12, offset: 0 }}>
                <FormInput name="legalName" label={L("COMPANY_LEGAL_NAME")} />
              </Col>
            </Row>
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(EditCompanyModal)
