import React, { Component } from "react"
import { Checkbox, Form } from "antd"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"

const { formVerticalLayout } = AppConsts

interface FormCheckboxProps {
  label: string;
  name: string | string[];
  rule?;
  disabled?: boolean;
}

class FormLabelCheckbox extends Component<FormCheckboxProps> {
  render() {
    const { label, name, rule } = this.props
    return (
      <Form.Item
        name={name}
        rules={rule}
        valuePropName="checked"
        {...formVerticalLayout}
      >
        <div className="checkbox-area w-100">
          {L(label)}
          <div style={{ right: 0 }}>
            <Checkbox />
          </div>
        </div>
      </Form.Item>
    )
  }
}

export default FormLabelCheckbox
