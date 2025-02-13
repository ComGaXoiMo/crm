import * as React from "react"
import { InputNumber, Form, Checkbox, Input, FormInstance } from "antd"
import { dateFormat, monthFormat } from "@lib/appconst"
import DatePicker from "antd/lib/date-picker"
import CurrencyInput from "@components/Inputs/CurrencyInput"
import Select from "antd/lib/select"
import PercentInput from "@components/Inputs/PercentInput"
import TextArea from "antd/lib/input/TextArea"
import dayjs from "dayjs"

interface EditableRowProps {
  index: number
}
const EditableContext = React.createContext<FormInstance<any> | null>(null)
export const EditableRowOnClick: React.FC<EditableRowProps> = ({
  index,
  ...props
}) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}
interface EditTableCellProps extends React.HTMLAttributes<HTMLElement> {
  record: any
  inputType:
    | "number"
    | "percent"
    | "checkbox"
    | "text"
    | "date"
    | "currency"
    | "select"
    | "textarea"
    | "dateRange"
  dataIndex: string
  title: any
  editable: boolean
  handleSave: (record: any) => void
  index: number
  children: React.ReactNode
  options: any[]
  required: any
  onBlur?: (value) => void
  locale?: string
  symbol?: string
}

export const buildEditTableCellOnClick = (
  record,
  inputType,
  dataIndex,
  title,
  editable,
  handleSave,
  options?,
  required?,
  onBlur?,
  locale?,
  symbol?
) => ({
  record,
  inputType,
  dataIndex,
  title,
  editable,
  handleSave,
  options,
  required,
  onBlur,
  locale,
  symbol,
})

export const EditTableCellOnClick: React.FC<EditTableCellProps> = ({
  dataIndex,
  title,
  inputType,
  record,
  index,
  editable,
  handleSave,
  children,
  options,
  required,
  onBlur,
  locale,
  symbol,
  ...restProps
}) => {
  const disabledDate = (current) => {
    return options
      ? current >= dayjs(record.startDate) || current <= dayjs(record.endDate)
      : false
  }
  let inputNode
  const [editing, setEditing] = React.useState(false)
  const inputRef = React.useRef<any>(null)
  const form = React.useContext(EditableContext)!
  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()

      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log("Save failed:", errInfo)
    }
  }
  switch (inputType) {
    case "number": {
      inputNode = (
        <InputNumber
          min={0}
          // max={999999999999}
          className="full-width"
          onPressEnter={save}
          onBlur={save}
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
      inputNode = <CurrencyInput locale={locale} symbol={symbol} />
      break
    }
    case "date": {
      inputNode = <DatePicker format={dateFormat} onBlur={save} />
      break
    }
    case "dateRange": {
      inputNode = (
        <DatePicker
          className="full-width"
          format={monthFormat}
          picker="month"
          disabledDate={disabledDate}
          onBlur={save}
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
        <Select className="full-width">
          {(options || []).map((option, index) => (
            <Select.Option
              key={index}
              value={option.value || option.id || option.name}
            >
              {option.label || option.name}
            </Select.Option>
          ))}
        </Select>
      )
      break
    }
    default: {
      inputNode = <Input ref={inputRef} onPressEnter={save} onBlur={save} />
    }
  }

  const toggleEdit = () => {
    setEditing(!editing)
  }
  let childNode = children
  if (inputType === "dateRange") {
    if (record[dataIndex]) {
      children = dayjs(record[dataIndex]).format("MM/YYYY")
    }
  }

  if (editable) {
    childNode = editing ? (
      <Form.Item
        name={dataIndex}
        style={{ margin: 0 }}
        rules={required ?? false}
        label={title}
      >
        {inputNode}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24, height: 30 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }
  return <td {...restProps}>{childNode}</td>
}
