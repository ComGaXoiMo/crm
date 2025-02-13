import http from "./httpService"
import { AppConfiguration } from "@lib/appconst"
import axios from "axios"

class AppDataService {
  public async getAppConfiguration(): Promise<any> {
    const httpTemp = axios.create()
    console.log(process.env.REACT_APP_CONFIG)

    const result = await httpTemp.get("/assets/configuration.json")
    AppConfiguration.remoteServiceBaseUrl = process.env.REACT_APP_APP_API_URL!
    AppConfiguration.appBaseUrl = process.env.REACT_APP_APP_BASE_URL!
    AppConfiguration.appLayoutConfig = result.data.appLayoutConfig
    AppConfiguration.googleMapKey =
      result.data.googleMapKey || AppConfiguration.googleMapKey
    http.defaults.baseURL = process.env.REACT_APP_APP_API_URL!
  }
  public async getLinkDashboard(): Promise<any> {
    const res = await http.get("api/Statistic/GetLinkDashboard")
    const { result } = res.data
    return result
  }

  public async getCountries(params: any): Promise<any> {
    const res = await http.get("api/services/app/Category/GetListCountry", {
      ...params,
    })
    const { result } = res.data
    // return (result || []).map((item) => {
    //   item.phoneCodeName = `${item.countryCode} (+${item.phoneCode})`;
    //   item.name = item.countryName;
    //   item.label = item.countryName;
    //   item.value = item.id;
    //   item.isLeaf = false; // for Cascader
    //   return item;
    // });
    return result
  }

  public async getCountryFull(params: any): Promise<any> {
    const res = await http.get("api/services/app/Category/GetListCountryFull", {
      ...params,
    })
    const { result } = res.data
    return (result || []).map((item) => {
      item.name = item.countryName
      item.label = item.countryName
      item.value = item.id
      item.isLeaf = false // for Cascader
      item.children = (item.provinces || []).map((item) => ({
        ...item,
        name: item.provinceName,
        label: item.provinceName,
        value: item.id,
        isLeaf: false,
        children: (item.districts || []).map((item) => ({
          ...item,
          name: item.districtName,
          label: item.districtName,
          value: item.id,
        })),
      }))
      return item
    })
  }

  public async getProvinces(countryId: any): Promise<any> {
    const res = await http.get(`api/services/app/Category/GetListProvince`, {
      params: { countryId },
    })
    const { result } = res.data
    return (result || []).map((item) => {
      item.name = item.provinceName
      item.label = item.provinceName
      item.value = item.id
      return item
    })
  }

  public async getDistricts(provinceId): Promise<any> {
    const res = await http.get(`api/services/app/Category/GetListDistrict`, {
      params: { provinceId },
    })
    const { result } = res.data
    return (result || []).map((item) => {
      item.name = item.districtName
      item.label = item.districtName
      item.value = item.id
      return item
    })
  }
  public async getProjectProvinces(countryId: any): Promise<any> {
    const res = await http.get(
      `api/services/app/Category/GetListProjectProvince`,
      {
        params: { countryId },
      }
    )
    const { result } = res.data
    return (result || []).filter((item) => {
      if (item !== null) {
        item.name = item.provinceName
        item.label = item.provinceName
        item.value = item.id
      } else {
        return
      }
      return item
    })
  }

  public async getProjectDistricts(provinceId): Promise<any> {
    const res = await http.get(
      `api/services/app/Category/GetListProjectDistrict`,
      {
        params: { provinceId },
      }
    )
    const { result } = res.data
    return (result || []).filter((item) => {
      if (item !== null) {
        item.name = item?.districtName
        item.label = item?.districtName
        item.value = item?.id
      } else {
        return
      }
      return item
    })
  }
  public async getWards(params: any): Promise<any> {
    const res = await http.get("api/services/app/Category/GetListWards", {
      params,
    })
    const { result } = res.data
    return (result || []).map((item) => {
      item.name = item.wardName
      item.label = item.wardName
      item.value = item.id
      return item
    })
  }

  public async getOffices(params: any): Promise<any> {
    const res = await http.get(
      "api/services/app/OrganizationUnit/GetListOffice",
      {
        ...params,
      }
    )
    const { result } = res.data
    return (result.items || []).map((item) => {
      item.name = item.displayName
      return item
    })
  }

  public async getDepartments(params: any): Promise<any> {
    const res = await http.get(
      "api/services/app/OrganizationUnit/GetOrganizationUnits",
      {
        ...params,
      }
    )
    const { result } = res.data
    return (result.items || []).map((item) => {
      item.name = item.displayName
      item.label = item.displayName
      item.value = item.id
      return item
    })
  }

  public async getIndustries(params: any): Promise<any> {
    const res = await http.get("api/services/app/Category/GetListIndustry", {
      ...params,
    })
    const { result } = res.data
    return (result || []).map((item) => {
      item.name = item.industryName
      return item
    })
  }

  public async getDocumentType(params: any): Promise<any> {
    const res = await http.get(
      "api/services/app/Category/GetListDocumentType",
      {
        params,
      }
    )
    const { result } = res.data
    return result || []
  }
  public async getOtherTypes(params: any): Promise<any> {
    const res = await http.get(
      "api/services/app/Category/GetListOtherCategory",
      {
        ...params,
      }
    )
    const { result } = res.data
    return result || []
  }

  public async getOpportunityCategories(params: any): Promise<any> {
    const res = await http.get(
      "api/services/app/Category/GetListOpportunityCategories",
      {
        params,
      }
    )
    const { result } = res.data
    return result
  }

  public async getAdvisoryStage(params: any): Promise<any> {
    const res = await http.get(
      "api/services/app/Category/GetListStageAdvisory",
      {
        params,
      }
    )
    const { result } = res.data
    return result
  }

  public async getCommercialStage(params: any): Promise<any> {
    const res = await http.get(
      "api/services/app/Category/GetListStageCommercial",
      { params }
    )
    const { result } = res.data
    return result
  }

  public async getAdvisoryDealStatus(params: any): Promise<any> {
    const res = await http.get(
      "api/services/app/Category/GetListDealStatusAdvisory",
      {
        params,
      }
    )
    const { result } = res.data
    return result
  }

  public async getCommercialDealStatus(params: any): Promise<any> {
    const res = await http.get(
      "api/services/app/Category/GetListDealStatusCommercial",
      {
        params,
      }
    )
    const { result } = res.data
    return result
  }

  public async getPositionLevels(params: any): Promise<any> {
    const res = await http.get("api/services/app/Category/GetListLevel", {
      params,
    })
    const { result } = res.data
    return (result || []).map((item) => {
      item.name = item.levelName
      return item
    })
  }

  public async getAssetClass(params: any): Promise<any> {
    const res = await http.get("api/services/app/Category/GetListAssetClass", {
      params,
    })
    const { result } = res.data
    return (result || []).map((item) => {
      item.name = item.assetClassName
      return item
    })
  }

  public async getInstructions(params: any): Promise<any> {
    const res = await http.get("api/services/app/Category/GetListInstruction", {
      params,
    })
    const { result } = res.data
    return (result || []).map((item) => {
      item.name = item.instructionName
      return item
    })
  }

  public async getExchangeRates(params: any): Promise<any> {
    const res = await http.get("api/Statistic/ExchangeRate", { params })
    const { result } = res.data

    const exchangeRates = {}
    Object.keys(result || {}).forEach((key) => {
      exchangeRates[key.toUpperCase()] = result[key]
    })

    return exchangeRates
  }

  // Project

  public async getClients(keyword): Promise<any> {
    const res = await http.get("api/services/app/Company/GetAll", {
      params: { keyword },
    })
    const result = (res.data.result?.items || []).map((item) => {
      return { id: item.id, label: item.businessName }
    })
    return result
  }
  public async getContacts(keyword): Promise<any> {
    const res = await http.get("api/services/app/Contact/GetAll", {
      params: { keyword },
    })
    const result = (res.data.result?.items || []).map((item) => {
      return { id: item.id, label: item.contactName }
    })
    return result
  }
  public async getInquiryTypes(keyword): Promise<any> {
    const res = await http.get(
      "api/services/app/Category/GetListListingCategory",
      { params: { keyword } }
    )
    const result = res.data.result || []
    return result
  }
  public async getInquirySourceAndStatus(): Promise<any> {
    const res = await http.get(
      "api/services/app/Category/GetListInquiryCategory"
    )
    const result = res.data.result || []
    return result
  }
  public async getRequiredAreaOption(params: any): Promise<any> {
    const res = await http.get(
      "api/Category/GetListFacilityRequirementCategories",
      { params }
    )
    const { result } = res.data

    return result
  }

  //PMH
  //Unit
  public async GetListUnitStatus(params: any): Promise<any> {
    const res = await http.get("/api/services/app/Category/GetListUnitStatus", {
      params,
    })
    const { result } = res.data

    return result
  }
  public async GetListUnitType(params: any): Promise<any> {
    const res = await http.get("/api/services/app/Category/GetListUnitType", {
      params,
    })
    const { result } = res.data

    return result
  }
  public async GetListUnitFacility(params: any): Promise<any> {
    const res = await http.get(
      "/api/services/app/Category/GetListUnitFacility",
      {
        params,
      }
    )
    const { result } = res.data

    return result
  }
  public async GetListLeadSource(params: any): Promise<any> {
    const res = await http.get("api/services/app/Category/GetListLeadSource", {
      params,
    })
    const { result } = res.data

    return result
  }
  //Project
  public async GetListPropertyType(params: any): Promise<any> {
    const res = await http.get(
      "/api/services/app/Category/GetListPropertyType",
      {
        params,
      }
    )
    const { result } = res.data

    return result
  }
  public async GetListProjectFacility(params: any): Promise<any> {
    const res = await http.get(
      "/api/services/app/Category/GetListProjectFacility",
      {
        params,
      }
    )
    const { result } = res.data

    return result
  }
  public async getInquirySource(): Promise<any> {
    const res = await http.get("api/services/app/Category/GetListInquirySource")
    const result = res.data.result || []
    return result
  }
  public async getUnitServiceType(): Promise<any> {
    const res = await http.get(
      "api/services/app/Category/GetListInquiryServiceType"
    )
    const result = res.data.result || []
    return result
  }
  public async getListLAStatus(params: any): Promise<any> {
    const res = await http.get(
      "/api/services/app/Category/GetListLeaseAgreementStatus",
      {
        params,
      }
    )
    const { result } = res.data

    return result
  }
  public async getDepositsStatus(params: any): Promise<any> {
    const res = await http.get(
      "/api/services/app/Category/GetListLeaseAgreementStatus",
      {
        params,
      }
    )
    const { result } = res.data

    return result
  }
  public async getTaskStatus(): Promise<any> {
    const res = await http.get(
      "api/services/app/Category/GetListInquiryTaskStatus"
    )
    const result = res.data.result || []
    return result
  }

  public async getDepositRefundTypes(params: any): Promise<any> {
    const res = await http.get(
      "api/services/app/Category/GetListDepositRefundTypeType",
      {
        params,
      }
    )
    const { result } = res.data
    return result || []
  }

  public async getListAmendmentType(): Promise<any> {
    const res = await http.get(
      "api/services/app/Category/GetListAmendmentType",
      {}
    )
    const { result } = res.data
    return result || []
  }
}
export default new AppDataService()
