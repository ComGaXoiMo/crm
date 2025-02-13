import React from "react"
import SelectBoxItem from "@components/FormItem/FormSelectBox/SelectBoxItem"
import { OptionModel } from "@models/global"
import "./SelectBoxItem.less"

interface SelectBoxItemsProps {
  value?: any;
  onChange?: (value) => void;
  options: OptionModel[];
}

const SelectBoxItems: React.FC<SelectBoxItemsProps> = ({
  value,
  onChange,
  options,
}) => {
  const handleSelect = (selectedValue) => {
    if (onChange) {
      onChange(selectedValue)
    }
  }

  return (
    <div className="wrap-select-box">
      {(options || []).map((item, index) => {
        return (
          <SelectBoxItem
            value={item.value ?? ""}
            label={item.code ?? ""}
            icon={item.icon}
            selectedValue={value}
            key={index}
            onChange={handleSelect}
          />
        )
      })}
    </div>
  )
}

export default SelectBoxItems
