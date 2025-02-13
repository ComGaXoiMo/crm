import React from "react"
import { Button, Col, DatePicker, Form, Row } from "antd"
import { L } from "@lib/abpUtility"
import AppConsts, { dateFormat } from "@lib/appconst"
import { DisconnectOutlined, EditOutlined } from "@ant-design/icons"
const { formVerticalLayout } = AppConsts
interface FormDatePickerProps {
  label: string
  name: string | string[]
  rule?
  disabled?: boolean
  onChange?: any
  onSelect?: any
  placeholder?: string
  dateTimeFormat?: string
  disabledDate?: any
}

const FormDatePickerPrefix: React.FC<FormDatePickerProps> = ({
  label,
  name,
  rule,
  disabled,
  onChange,
  onSelect,
  placeholder,
  dateTimeFormat = dateFormat,
  disabledDate,
}) => {
  const [canEdit, setCanEdit] = React.useState(false)

  return (
    <Row gutter={[2, 0]} className="w-100">
      <Col sm={{ span: 21 }}>
        <Form.Item
          label={L(label)}
          name={name}
          rules={rule}
          {...formVerticalLayout}
        >
          <DatePicker
            className="full-width"
            format={dateTimeFormat}
            placeholder={placeholder ? L(placeholder) : ""}
            disabled={!canEdit}
            disabledDate={disabledDate}
            onChange={onChange}
          />
        </Form.Item>
      </Col>
      <Col sm={{ span: 3 }}>
        <Form.Item label={<div style={{ color: "#ffffff" }}>{L("_")}</div>}>
          <Button
            // style={{ height: "100%" }}
            disabled={disabled}
            icon={canEdit ? <DisconnectOutlined /> : <EditOutlined />}
            type="text"
            onClick={() => setCanEdit(!canEdit)}
          ></Button>
        </Form.Item>
      </Col>
    </Row>
  )
}

export default FormDatePickerPrefix
