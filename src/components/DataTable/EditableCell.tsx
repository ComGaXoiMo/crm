import * as React from "react"
import { InputNumber, Form, Checkbox, Input } from "antd"
import appConsts, { dateFormat, monthFormat } from "@lib/appconst"
import DatePicker from "antd/lib/date-picker"
import CurrencyInput from "@components/Inputs/CurrencyInput"
import Select from "antd/lib/select"
import PercentInput from "@components/Inputs/PercentInput"
import TextArea from "antd/lib/input/TextArea"
import moment from "moment"
import { filterOptionsWithNotSpace, inputNumberFormatter } from "@lib/helper"
const { formHorizontalLayout } = appConsts

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  record: any;
  inputType:
    | "number"
    | "percent"
    | "checkbox"
    | "text"
    | "date"
    | "month"
    | "currency"
    | "select"
    | "selectMulti"
    | "selectStatus"
    | "select2"
    | "textarea"
    | "none";
  dataIndex: string;
  title: any;

  editing: boolean;
  index: number;
  children: React.ReactNode;
  options: any[];
  required: any;
  dateDisable: any;
  onBlur?: (value) => void;
  onOptionSearch?: (value) => void;
}

export const buildEditableCell = (
  record,
  inputType,
  dataIndex,
  title,
  isEditing,
  options?,
  required?,
  dateDisable?,
  onBlur?,
  onOptionSearch?
) => ({
  record,
  inputType,
  dataIndex,
  title,
  editing: isEditing(record),
  options,
  required,
  dateDisable,
  onBlur,
  onOptionSearch,
})

export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options,
  required,
  dateDisable,
  onBlur,
  onOptionSearch,

  ...restProps
}) => {
  const disabledDate = (current) => {
    return dateDisable
      ? current < moment(dateDisable.startDate).startOf("day") ||
          current > moment(dateDisable.endDate).endOf("day")
      : false
  }
  let inputNode
  switch (inputType) {
    case "number": {
      inputNode = (
        <InputNumber
          min={0}
          formatter={(value) => inputNumberFormatter(value)}
          // max={999999999999}
          className="full-width"
        />
      )
      break
    }
    case "percent": {
      inputNode = <PercentInput onChange={onBlur} />
      break
    }
    case "checkbox": {
      inputNode = (
        <Checkbox onChange={onBlur} defaultChecked={record[dataIndex]} />
      )
      break
    }
    case "currency": {
      inputNode = <CurrencyInput />
      break
    }
    case "date": {
      inputNode = (
        <DatePicker
          disabledDate={disabledDate}
          className="full-width"
          format={dateFormat}
          onChange={() => onBlur}
        />
      )
      break
    }
    case "month": {
      inputNode = (
        <DatePicker
          format={monthFormat}
          picker="month"
          className="full-width"
          disabledDate={disabledDate}
        />
      )
      break
    }
    case "textarea": {
      inputNode = <TextArea autoSize={{ maxRows: 5 }} />
      break
    }
    case "select": {
      inputNode = (
        <Select onSearch={onOptionSearch} showSearch className="full-width">
          {(options || []).map((option, index) => (
            <Select.Option
              key={index}
              value={option.id || option.value || option.name}
            >
              {option.label || option.name}
            </Select.Option>
          ))}
        </Select>
      )
      break
    }
    case "selectMulti": {
      inputNode = (
        <Select
          onSearch={onOptionSearch}
          mode="multiple"
          showSearch
          className="full-width"
        >
          {(options || []).map((option, index) => (
            <Select.Option
              key={index}
              value={option.id || option.value || option.name}
            >
              {option.label || option.name}
            </Select.Option>
          ))}
        </Select>
      )
      break
    }
    case "select2": {
      inputNode = (
        <Select
          filterOption={filterOptionsWithNotSpace}
          onSearch={onOptionSearch}
          showSearch
          className="full-width"
        >
          {(options || []).map((option, index) => (
            <Select.Option
              key={index}
              value={option.id || option.value}
              // {`${option.id}#$${option.label || option.name}`}
            >
              {option.label || option.name}
            </Select.Option>
          ))}
        </Select>
      )
      break
    }
    case "selectStatus": {
      inputNode = (
        <Select onSearch={onOptionSearch} showSearch className="full-width">
          {(options || []).map((option, index) => (
            <Select.Option key={index} value={option.id}>
              {option.label || option.name}
            </Select.Option>
          ))}
        </Select>
      )
      break
    }
    case "none": {
      inputNode = children
      break
    }
    default: {
      inputNode = <Input />
    }
  }

  return (
    <td {...restProps}>
      {editing ? (
        inputType === "checkbox" ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={required}
            label={title}
            valuePropName="checked"
            {...formHorizontalLayout}
          >
            <div>{inputNode}</div>
          </Form.Item>
        ) : (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={required}
            label={title}
            // {...formHorizontalLayout}
          >
            {inputNode}
          </Form.Item>
        )
      ) : (
        children
      )}
    </td>
  )
}
