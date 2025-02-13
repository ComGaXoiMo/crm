import React, { useState, useEffect } from "react"
import Input from "antd/lib/input"
import {
  ICompanyItemModel,
  CompanyItemModel,
} from "@models/clientManagement/companyModel"
import isEqual from "lodash/isEqual"

import CompanySelect from "@components/Select/CompanySelect"
import { Button } from "antd"
import { L } from "@lib/abpUtility"
import { usePrevious } from "@lib/appconst"
interface CompaniesSelectProps {
  value?: ICompanyItemModel[]
  disabled?: boolean

  onChange?: (value) => void
  handleUseCompanyAddress?: (company) => void
  maxLength?: number
}

export const CompaniesSelect: React.FC<CompaniesSelectProps> = ({
  value = [],
  onChange,
  disabled,
  handleUseCompanyAddress,
}) => {
  const previousValue = usePrevious(value)
  const [currentValue, setCurrentValue] = useState(
    value?.length ? value : [new CompanyItemModel(true)]
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

  const onCompanyChange = (index, value, label) => {
    currentValue[index].companyId = value
    currentValue[index].businessName = label
    triggerChange(currentValue)
  }

  // const onChangePrimary = (index) => {
  //   currentValue.forEach(
  //     (item, companyIndex) => (item.isPrimary = index === companyIndex)
  //   );
  //   triggerChange([...currentValue]);
  // };

  const addCompany = () => {
    triggerChange([...currentValue, new CompanyItemModel(!currentValue.length)])
  }

  // const deleteCompany = (company, index) => {
  //   triggerChange([
  //     ...currentValue.filter((item, companyIndex) => index !== companyIndex),
  //   ]);
  // };

  // const onUseCompanyAddress = (company) => {
  //   if (handleUseCompanyAddress) {
  //     handleUseCompanyAddress(company.companyId);
  //   }
  // };

  // const companyActions = (company, index) => (
  //   <>
  //     {index === currentValue?.length - 1 && (
  //       <PlusOutlined onClick={addCompany} />
  //     )}
  //     {company.isPrimary && (
  //       <Tooltip placement="topLeft" title={L("USE_COMPANY_ADDRESS")}>
  //         <EnvironmentOutlined onClick={() => onUseCompanyAddress(company)} />
  //       </Tooltip>
  //     )}
  //     {company.isPrimary ? (
  //       <StarFilled />
  //     ) : (
  //       <StarOutlined onClick={() => onChangePrimary(index)} />
  //     )}
  //     <Button
  //       type="text"
  //       size="small"
  //       className="icon-button"
  //       disabled={company.isPrimary}
  //       onClick={() => deleteCompany(company, index)}
  //     >
  //       <DeleteOutlined />
  //     </Button>
  //   </>
  // );

  return (
    <>
      {(currentValue || []).map((company: any, index) => {
        return (
          <Input.Group compact key={index} className={index > 0 ? "mt-1" : ""}>
            {/* <span style={{ width: "calc(100% - 130px)", marginRight: "10px" }}> */}
            <CompanySelect
              disabled={disabled}
              onSelect={(value, label) => onCompanyChange(index, value, label)}
              company={{ ...company, ...company.company }}
            />
            {/* </span> */}
            {/* <Input
              suffix={companyActions(company, index)}
              disabled={disabled}
              style={{ width: "120px" }}
            /> */}
          </Input.Group>
        )
      })}
      {(!currentValue || !currentValue.length) && (
        <Button disabled={disabled} block onClick={addCompany}>
          {L("BTN_ADD")}
        </Button>
      )}
    </>
  )
}
