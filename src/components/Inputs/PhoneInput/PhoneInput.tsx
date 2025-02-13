import { L } from "@lib/abpUtility"
import { Input, Select, Form } from "antd"
import React from "react"

interface Props {
  suffix?: any;
  disabled?: boolean;
  fieldName?: string;
  onChange?: any;
  label?: string;
}

const PhoneInput = (props: Props) => {
  // const check = (e?) => {
  //   console.log(e.target);
  // };
  const selectBefore = (
    <Form.Item
      name={props.fieldName ? `prefix${props.fieldName}` : "prefix"}
      noStyle
    >
      <Select
        getPopupContainer={(trigger) => trigger.parentNode}
        defaultValue={"+84"}
        style={{ width: 60 }}
        disabled={props.disabled}
        showArrow={false}
      >
        <Select.Option value="+84">
          {/* <i className="icon famfamfam-flags vn" /> */}
          +84
        </Select.Option>
        <Select.Option value="+1">
          {/* <i className="icon famfamfam-flags us" /> */}
          +1
        </Select.Option>
        <Select.Option value="+44">
          {/* <i className="icon famfamfam-flags gb" /> */}
          +44
        </Select.Option>
        <Select.Option value="+862">
          {/* <i className="icon famfamfam-flags cn" /> */}
          +86
        </Select.Option>
      </Select>
    </Form.Item>
  )
  return (
    <>
      <Form.Item
        name={props.fieldName ?? "phoneNumber"}
        rules={[{ required: true }]}
        label={props.label ?? L("PHONE_NUMBER")}
      >
        <Input
          disabled={props.disabled}
          addonBefore={selectBefore}
          type="number"
          showCount
          maxLength={9}
          onChange={props.onChange}
          size="middle"
          style={{ backgroundColor: "white" }}
          addonAfter={props.suffix}
        />
      </Form.Item>
      <style>{`
        .ant-input-group-addon:first-child {
          border-radius: 8px 0 0 8px !important
        }
  `}</style>
    </>
  )
}

export default PhoneInput
