import { L } from "@lib/abpUtility"
import { Col, Input, Modal, Row, Form } from "antd"
import React, { useRef } from "react"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import FormSelect from "@components/FormItem/FormSelect"
import { validateMessages } from "@lib/validation"
import withRouter from "@components/Layout/Router/withRouter"
import NotificationTemplateStore from "@stores/notificationTemplate/notificationTemplateStore"
import FormListCodition from "./formListCodition"
import "./configFilterModal.less"

interface Iprops {
  notificationTemplateStore?: NotificationTemplateStore
  visible: boolean
  onClose: () => void
  filterlists: any
}

const ConfigFilterModal = ({
  notificationTemplateStore,
  visible,
  onClose,
  filterlists,
}: Iprops) => {
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
        className="config-filter-form"
        size="middle"
      >
        <Row gutter={[8, 0]}>
          <Col sm={{ span: 24 }} className="header-row">
            <span>List Information</span>
          </Col>
          <Col sm={{ span: 24 }}>
            <Form.Item label={L("List name")} name="name">
              <Input placeholder={L("Enter list name")} />
            </Form.Item>
          </Col>
          <Col sm={{ span: 12 }}>
            <FormSelect
              options={filterlists}
              label={L("Default sort column")}
              name="sortColumn"
            />
          </Col>{" "}
          <Col sm={{ span: 12 }}>
            <FormSelect
              options={[
                { id: 1, label: "Descending" },
                { id: 2, label: "Ascending" },
              ]}
              label={L("Default sort order")}
              name="sortOrder"
            />
          </Col>{" "}
          <Col sm={{ span: 24 }} className="header-row">
            <span>Choose List conditions</span>
          </Col>
          <Col sm={{ span: 24 }} className="sub-row">
            <span>All Conditions ( All conditions must be met )</span>
          </Col>
          <Col sm={{ span: 24 }}>
            <FormListCodition name={"allCondition"} filterlists={filterlists} />
          </Col>
          <Col sm={{ span: 24 }} className="sub-row">
            <span>
              Any Conditions ( At least one of the conditions must be met )
            </span>
          </Col>
          <Col sm={{ span: 24 }}>
            <FormListCodition name={"anyCondition"} filterlists={filterlists} />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default withRouter(inject(Stores.UserStore)(observer(ConfigFilterModal)))
