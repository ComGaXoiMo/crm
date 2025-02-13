import React, { useState, useEffect } from "react"
import { Input, Select } from "antd"
import { arrayToObject } from "@lib/helper"
import { ILanguageValue } from "@models/global"
import { usePrevious } from "@lib/appconst"
import isEqual from "lodash/isEqual"

const { Option } = Select

interface MultiLanguageInputProps {
  value?: ILanguageValue[];
  onChange?: (value: ILanguageValue[]) => void;
  maxLength?: number;
}

const currentLanguage = abp.localization.currentLanguage.name

const MultiLanguageInput: React.FC<MultiLanguageInputProps> = ({
  value = [],
  onChange,
  maxLength,
}) => {
  const previousValue = usePrevious(value)
  const [languageValue, setLanguageValue] = useState(
    arrayToObject(value, "languageName", "value")
  )
  const [selectedLanguage, setSelectedLanguage] = useState(
    currentLanguage && currentLanguage.length
      ? currentLanguage
      : value && value.length
      ? value[0].languageName
      : ""
  )

  useEffect(() => {
    if (previousValue && !isEqual(previousValue, value)) {
      setLanguageValue(arrayToObject(value, "languageName", "value"))
      setSelectedLanguage(
        currentLanguage && currentLanguage.length
          ? currentLanguage
          : value && value.length
          ? value[0].languageName
          : ""
      )
    }
  }, [value])

  const triggerChange = () => {
    const changedValue = (value || []).map((lang) => {
      return { ...lang, value: languageValue[lang.languageName] as string }
    })
    if (onChange) {
      onChange(changedValue)
    }
  }

  const onTextChange = (e) => {
    setLanguageValue({ ...languageValue, [selectedLanguage]: e.target.value })
  }

  const selectLanguage = (
    <Select
      getPopupContainer={(trigger) => trigger.parentNode}
      value={selectedLanguage}
      className="select-before"
      onChange={(language) => setSelectedLanguage(language)}
      style={{ width: "80px" }}
    >
      {(value || []).map((language, index) => (
        <Option key={index} value={language.languageName}>
          <i className={language.icon} /> {language.languageName}
        </Option>
      ))}
    </Select>
  )

  return (
    <Input
      value={languageValue[selectedLanguage]}
      addonBefore={selectLanguage}
      onChange={onTextChange}
      onBlur={triggerChange}
      maxLength={maxLength}
      aria-rowspan={2}
      size="large"
    />
  )
}

export default MultiLanguageInput
