import FormInput from "@components/FormItem/FormInput"
import FormSelect from "@components/FormItem/FormSelect"
import { L } from "@lib/abpUtility"
import appDataService from "@services/appDataService"
import AppDataStore from "@stores/appDataStore"
import Stores from "@stores/storeIdentifier"
import { Col, Row } from "antd"
import { inject, observer } from "mobx-react"
import React from "react"

type Props = {
  showCountry?: boolean
  appDataStore: AppDataStore
  groupName: string
}

const SelectAddress = inject(Stores.AppDataStore)(
  observer((props: Props) => {
    const [provinces, setProvinces] = React.useState<any[]>([])
    const [districts, setDistricts] = React.useState<any[]>([])
    const [countries, setCountries] = React.useState<any[]>([
      { id: 232, name: "VIETNAM" },
    ])

    React.useEffect(() => {
      appDataService
        .getProvinces(232)
        .then((provinces) => setProvinces(provinces))
      if (!props.appDataStore.countries?.length) {
        props.appDataStore.getCountries({})
      } else {
        setCountries(props.appDataStore.countries)
      }
    }, [])
    const handleChangeProvince = async (provinceId) => {
      const res = await appDataService.getDistricts(provinceId)
      setDistricts(res)
    }

    const handleChangeCountry = async (countryId) => {
      const res = await appDataService.getProvinces(countryId)
      setProvinces(res)
    }
    return (
      <Row gutter={[16, 0]}>
        {props.showCountry && (
          <Col sm={{ span: 12 }}>
            <FormSelect
              label={L("COUNTRY")}
              name={[props.groupName, "countryId"]}
              options={countries}
              onChange={handleChangeCountry}
            />
          </Col>
        )}
        <Col sm={{ span: 12 }}>
          <FormSelect
            label={L("PROVINCE")}
            name={[props.groupName, "provinceId"]}
            options={provinces}
            onChange={handleChangeProvince}
          />
        </Col>
        <Col sm={{ span: 12 }}>
          <FormSelect
            label={L("DISTRICT")}
            name={[props.groupName, "districtId"]}
            options={districts}
          />
        </Col>
        <Col sm={{ span: 24 }}>
          <FormInput label={L("ADDRESS")} name={[props.groupName, "address"]} />
        </Col>
      </Row>
    )
  })
)

export default SelectAddress
