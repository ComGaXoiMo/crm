import { L } from "@lib/abpUtility"
import { Col, Input, Modal, Row, Form } from "antd"
import React, { useState, useRef } from "react"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import FormSelect from "@components/FormItem/FormSelect"
import { validateMessages } from "@lib/validation"
import AppConsts from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import NotificationTemplateStore from "@stores/notificationTemplate/notificationTemplateStore"
import FormListCodition from "./formListCodition"

const { listProposalType } = AppConsts
interface Iprops {
  notificationTemplateStore?: NotificationTemplateStore
  visible: boolean
  onClose: () => void
}

const ConfigFilterModal = ({
  notificationTemplateStore,
  visible,
  onClose,
}: Iprops) => {
  const [proposalType, setProposalType] = useState(1)
  const formRef = useRef(null)

  return (
    <Modal
      open={visible}
      width="50%"
      // okButtonProps={{ style: { display: "none" } }}
      maskClosable={false}
      cancelButtonProps={{ style: { display: "none" } }}
      title={L("FILTER NAME")}
      onCancel={onClose}
      okText="Save"
      confirmLoading={notificationTemplateStore?.isLoading}
    >
      <Form
        validateMessages={validateMessages}
        layout="vertical"
        ref={formRef}
        size="middle"
      >
        <Row gutter={[8, 8]}>
          <Col sm={{ span: 24 }}>
            <span>Choose List conditions</span>
          </Col>
          <Col sm={{ span: 24 }}>
            <span>All Conditions ( All conditions must be met )</span>
          </Col>
          <Col sm={{ span: 24 }}>
            <FormListCodition name={"allCondition"} />
          </Col>
          <Col sm={{ span: 24 }}>
            <span>
              Any Conditions ( At least one of the conditions must be met )
            </span>
          </Col>
          <Col sm={{ span: 24 }}>
            <FormListCodition name={"anyCondition"} />
          </Col>
          <Col sm={{ span: 24 }}>
            <FormSelect
              options={listProposalType}
              label={L("PROPOSAL_FOR")}
              defaultValue={proposalType}
              onChange={setProposalType}
              name="proposalType"
            />
          </Col>
          <Col sm={{ span: 24 }}>
            <Form.Item label={L("PROPOSAL_TITLE")} name="title">
              <Input placeholder={L("")} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default withRouter(inject(Stores.UserStore)(observer(ConfigFilterModal)))
