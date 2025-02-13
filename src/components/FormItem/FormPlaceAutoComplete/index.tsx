import React from 'react'
import { Form } from 'antd'
import { L } from '@lib/abpUtility'
import AppConsts, { AdministrativeLevel } from '@lib/appconst'
import PlaceAutocompleted from '@components/Inputs/PlaceAutocompleted'

const { formVerticalLayout } = AppConsts
interface FormPlaceAutoCompleteProps {
  label: string
  name: string
  retrieveLevel?: AdministrativeLevel
  initLabel?: string
  rule?
}

const FormPlaceAutoComplete: React.FC<FormPlaceAutoCompleteProps> = ({
  label,
  name,
  rule,
  retrieveLevel,
  initLabel
}) => {
  return (
    <Form.Item label={L(label)} name={name} rules={rule} {...formVerticalLayout}>
      <PlaceAutocompleted
        retrieveLevel={retrieveLevel || AdministrativeLevel.administrative_area_level_2}
        initLabel={initLabel}
      />
    </Form.Item>
  )
}

export default FormPlaceAutoComplete
