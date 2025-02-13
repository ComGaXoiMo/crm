import React, { useState, useEffect, useRef } from "react"
import Input from "antd/lib/input"
import {
  IContactItemModel,
  ContactItemModel,
} from "@models/clientManagement/contactModel"
import isEqual from "lodash/isEqual"
import {
  DeleteOutlined,
  PlusOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons/lib"
import ContactSelect from "@components/Select/ContactSelect"
import Button from "antd/es/button"
import { L } from "@lib/abpUtility"

interface ContactsSelectProps {
  value?: IContactItemModel[];
  onChange?: (value: IContactItemModel[]) => void;
  maxLength?: number;
  companyId?: number;
}

const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export const ContactsSelect: React.FC<ContactsSelectProps> = ({
  value = [new ContactItemModel(true)],
  onChange,
  companyId,
}) => {
  const previousValue = usePrevious(value)
  const [currentValue, setCurrentValue] = useState(
    value?.length ? value : [new ContactItemModel(true)]
  )

  useEffect(() => {
    if (previousValue && !isEqual(previousValue, value)) {
      setCurrentValue(value)
    }
  }, [value])

  const triggerChange = (value) => {
    setCurrentValue(value)
    if (onChange) {
      onChange(value)
    }
  }

  const onContactChange = (index, value, label) => {
    currentValue[index].contactId = value
    currentValue[index].contactName = label
    triggerChange(currentValue)
  }

  const onChangePrimary = (index) => {
    currentValue.forEach(
      (item, contactIndex) => (item.isPrimary = index === contactIndex)
    )
    triggerChange([...currentValue])
  }

  const addContact = () => {
    triggerChange([
      ...currentValue,
      new ContactItemModel(!currentValue.length),
    ])
  }

  const deleteContact = (contact, index) => {
    triggerChange([
      ...currentValue.filter((item, contactIndex) => index !== contactIndex),
    ])
  }

  const contactActions = (contact, index) => (
    <>
      {index === currentValue?.length - 1 && (
        <PlusOutlined onClick={addContact} />
      )}
      {contact.isPrimary ? (
        <StarFilled />
      ) : (
        <StarOutlined onClick={() => onChangePrimary(index)} />
      )}
      <Button
        type="text"
        size="small"
        disabled={contact.isPrimary}
        onClick={() => deleteContact(contact, index)}
      >
        <DeleteOutlined />
      </Button>
    </>
  )

  return (
    <>
      {(currentValue || []).map((contact: any, index) => {
        return (
          <Input.Group compact key={index} className="mb-1">
            <span style={{ width: "calc(100% - 104px)", marginRight: "4px" }}>
              <ContactSelect
                onSelect={(value, label) =>
                  onContactChange(index, value, label)
                }
                contact={contact}
                contactId={contact.contactId}
                companyId={companyId}
              />
            </span>
            <Input
              suffix={contactActions(contact, index)}
              style={{ width: "100px" }}
            />
          </Input.Group>
        )
      })}
      {(!currentValue || !currentValue.length) && (
        <Button type="dashed" block onClick={addContact}>
          {L("BTN_ADD")}
        </Button>
      )}
    </>
  )
}
