import React, { useEffect, useState } from "react"
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService"
import "./index.less"
import { L } from "@lib/abpUtility"
import Select from "antd/lib/select"
import debounce from "lodash/debounce"
import {
  AdministrativeLevel,
  AppConfiguration,
  retrieveTypes,
  usePrevious,
} from "@lib/appconst"
import isEqual from "lodash/isEqual"

const { Option } = Select

interface IPlaceAutocompletedProps {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  country?: string;
  retrieveLevel?: AdministrativeLevel;
  initLabel?: string;
  disabled?: boolean;
}

const PlaceAutocompleted: React.FC<IPlaceAutocompletedProps> = ({
  onChange,
  placeholder,
  country = "vn",
  retrieveLevel = "administrative_area_level_1",
  initLabel,
  disabled = false,
}) => {
  const previousValue = usePrevious(initLabel)
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = useGoogle({
    apiKey: AppConfiguration.googleMapKey, //process.env.REACT_APP_GOOGLE,
    debounce: 500,
    options: {
      types: retrieveTypes[retrieveLevel],
      componentRestrictions: { country },
    },
    language: "vi",
  })

  const [textValue, setTextValue] = useState(initLabel)

  useEffect(() => {
    if (!isEqual(previousValue, initLabel)) {
      setTextValue(initLabel)
    }
  }, [initLabel])

  const handleSearch = debounce((keyword) => {
    getPlacePredictions({ input: keyword })
  }, 400)

  const changeCurrentValue = (placeId) => {
    if (placeId && placeId.length) {
      placesService?.getDetails({ placeId }, retrievePlaceInfo)
    } else {
      onChange && onChange(undefined)
    }
  }

  const retrievePlaceInfo = (placeDetail) => {
    const isExistingRetrieveLevel =
      placeDetail.address_components.findIndex(
        (item) =>
          (item.types || []).findIndex((type) => type === retrieveLevel) !== -1
      ) !== -1
    if (!isExistingRetrieveLevel) {
      onChange && onChange(undefined)
      return
    }
    const province = (placeDetail.address_components || []).find(
      (item) =>
        item.types.findIndex(
          (type) => type === AdministrativeLevel.administrative_area_level_1
        ) !== -1
    )
    const district = (placeDetail.address_components || []).find(
      (item) =>
        item.types.findIndex(
          (type) => type === AdministrativeLevel.administrative_area_level_2
        ) !== -1
    )

    let combinedValue: any = undefined
    switch (retrieveLevel) {
      case AdministrativeLevel.administrative_area_level_1: {
        combinedValue = {
          code: province.short_name,
          name: province.long_name,
          locationName: province.long_name,
        }
        break
      }
      case AdministrativeLevel.administrative_area_level_2: {
        combinedValue = {
          province: { code: province?.short_name, name: province?.long_name },
          district: { code: district?.short_name, name: district?.long_name },
          locationName: `${district?.long_name}, ${province?.long_name}`,
        }
      }
      case AdministrativeLevel.administrative_area_level_3: {
        combinedValue = {
          province: { code: province?.short_name, name: province?.long_name },
          district: { code: district?.short_name, name: district?.long_name },
          locationName: `${district?.long_name}, ${province?.long_name}`,
          placeId: placeDetail.place_id,
          formattedAddress: placeDetail.formatted_address,
          geometry: {
            lat: placeDetail.geometry.location.lat(),
            lng: placeDetail.geometry.location.lng(),
          },
        }
      }
    }
    onChange && onChange(combinedValue)
    if (combinedValue) {
      setTextValue(combinedValue.locationName)
    }
  }

  const onClear = () => {
    setTextValue("")
  }

  return (
    <Select
      getPopupContainer={(trigger) => trigger.parentNode}
      allowClear
      showSearch
      placeholder={placeholder ? L(placeholder) : ""}
      onSearch={handleSearch}
      loading={isPlacePredictionsLoading}
      disabled={disabled}
      onChange={changeCurrentValue}
      onClear={onClear}
      filterOption={false}
      value={textValue}
    >
      {(placePredictions || []).map((item: any, index) => (
        <Option key={index} value={item.place_id}>
          {item.description}
        </Option>
      ))}
    </Select>
  )
}

export default PlaceAutocompleted
