import { action, observable } from "mobx"
import DEFAULT_CURRENCY from "@lib/appconst"
import groupBy from "lodash/groupBy"
import appDataService from "@services/appDataService"
import { OtherTypeModel } from "@models/category"
import AppConsts from "@lib/appconst"
const {taskStatusForNew}= AppConsts
class AppDataStore {
  @observable isLoading!: boolean
  @observable countries!: any
  @observable nationality!: any
  @observable linkDashboard!: any
  @observable countryFull!: any
  @observable offices!: any
  @observable departments!: any
  @observable leadSources!: any
  @observable industries!: any
  @observable industriesLv1!: any
  @observable industriesLv2!: any
  @observable clientTypes!: any
  @observable otherTypes!: OtherTypeModel
  @observable opportunityCategories!: any
  @observable opportunityStatus!: any
  @observable opportunityStages!: any
  @observable advisoryStages!: any
  @observable commercialStages!: any
  @observable advisoryDealStatus!: any
  @observable commercialDealStatus!: any
  @observable unitCategories!: any
  @observable unitStatus!: any
  @observable unitStatusOtherVacant!: any
  @observable unitTypes!: any
  @observable unitFacilities!: any
  @observable leadSource!: any
  @observable documentTypes!: any
  @observable depositRefundTypes!: any
  @observable amendmentType!: any []

  @observable dealStages!: any
  @observable paymentStatus!: any
  @observable requestTypes!: any
  @observable positionLevels!: any
  @observable assetClass!: any
  @observable instructions!: any
  @observable exchangeRates!: any
  @observable facilityRequiredOption!: any
  @observable requiredAreaOption!: any
  @observable expctedLeasingPeriodOption!: any
  @observable requiredWorkerOption!: any
  @observable requiredPowerOption!: any
  @observable wasteOption!: any
  @observable capabilityOption!: any
  @observable utilityOption!: any
  @observable stateOption!: any
  @observable closingOption!: any
  @observable closingReasonOption!: any
  @observable statusOption!: any
  @observable facilityTypeOption!: any

  @observable leaseAgreementStatus!: any
  @observable depositsStatus!: any
  @observable laStage!: any

  @observable taskStatus!: any
  @observable taskStatusForBoardView!: any

  // Project
  @observable propertyTypes!: any
  @observable facilities!: any
  @observable grades!: any
  @observable projectFacilities!: any

  @observable transportations!: any
  @observable clients: any[] = []
  @observable contacts: any[] = []
  @observable inquiryTypes: any[] = []
  @observable inquirySources: any[] = []
  @observable inquiryStatus: any[] = []
  @observable inquirySubStage: any[] = []
  @observable inquirySubStageByStage: any[] = []
  @observable provinceOption: any[] = []
  @observable unitServiceTypes: any[] = []
  constructor() {
    // this.getDepartments({});
    // this.getOffices({});
    this.otherTypes = new OtherTypeModel()
  }
  @action getInquirySourceAndStatus = async () => {
    const res = await appDataService.getInquirySourceAndStatus()
    this.inquiryStatus = res.filter((item) => item.code === "InquiryStatus")
    this.inquirySubStage = res.filter((item) => item.code === "InquiryStage")
  }

  @action getInquirySubStage = async (id) => {
    this.inquirySubStageByStage = this.inquirySubStage.filter(
      (item) => item.parentId === id
    )
  }
  @action getInquirySource = async () => {
    this.inquirySources = await appDataService.getInquirySource()
  }
  @action getUnitServiceType = async () => {
    this.unitServiceTypes = await appDataService.getUnitServiceType()
  }
  @action getInquiryTypes = async (keyword) => {
    const res = await appDataService.getInquiryTypes(keyword)
    this.inquiryTypes = res.filter((item) => item.code === "ListingType")
  }
  @action getClients = async (keyword) => {
    this.clients = await appDataService.getClients(keyword)
  }
  @action getContacts = async (keyword) => {
    this.contacts = await appDataService.getContacts(keyword)
  }

  @action
  async getLinkDashboard() {
    this.linkDashboard = await appDataService.getLinkDashboard()
  }

  @action
  async getCountries(params) {
    const res = await appDataService.getCountries(params)

    this.countries = (res || []).map((item) => {
      item.phoneCodeName = `${item.countryCode} (+${item.phoneCode})`
      item.name = item.countryName
      item.label = item.countryName
      item.value = item.id
      item.isLeaf = false // for Cascader
      return item
    })
    this.nationality = (res || []).map((item) => {
      item.phoneCodeName = `${item.countryCode} (+${item.phoneCode})`
      item.name = item.nationalityName
      item.label = item.nationalityName
      item.value = item.id
      item.isLeaf = false // for Cascader
      return item
    })
  }

  @action
  async getOffices(params) {
    this.offices = await appDataService.getOffices(params)
  }

  @action
  async getDepartments(params) {
    this.departments = await appDataService.getDepartments(params)
  }

  @action
  async getIndustries(params) {
    this.industries = await appDataService.getIndustries(params)

    this.industriesLv1 = (this.industries || []).filter(
      (item) => item.typeCode === "level1"
    )
    this.industriesLv2 = (this.industries || []).filter(
      (item) => item.typeCode === "level2"
    )
  }

  @action
  async getOtherTypes(params) {
    const data = await appDataService.getOtherTypes(params)
    const groupData = groupBy(data, "typeCode")
    this.otherTypes = OtherTypeModel.assign({
      requestTypes: groupData.RequestType,
      phoneTypes: groupData.PhoneType,
      contactTypes: groupData.ContactType,
      requestStatus: groupData.RequestStatus,
      requestSource: groupData.RequestSource,
      requestGrade: groupData.RequestGrade,
      requirementType: groupData.RequirementType,
    })
  }

  @action
  async getDocumentType(params) {
    const res = await appDataService.getDocumentType(params)
    const rel = res.filter((item) => item.id !== 8)
    this.documentTypes = rel.map((item) => {
      return { id: item?.id, value: item?.id, label: item?.name }
    })
  }
  @action
  async getAssetClass(params) {
    this.assetClass = await appDataService.getAssetClass(params)
  }

  @action
  async getInstructions(params) {
    this.instructions = await appDataService.getInstructions(params)
  }

  @action
  async getOpportunityCategories(params) {
    this.opportunityCategories = await appDataService.getOpportunityCategories(
      params
    )
    this.opportunityStages = (this.opportunityCategories || []).filter(
      (item) => item.typeCode === "OpportunityStage"
    )
    this.opportunityStatus = (this.opportunityCategories || []).filter(
      (item) => item.typeCode === "OpportunityStatus"
    )
    this.paymentStatus = (this.opportunityCategories || []).filter(
      (item) => item.typeCode === "PaymentStatus"
    )
    this.dealStages = (this.opportunityCategories || []).filter(
      (item) => item.typeCode === "DealStage"
    )
  }

  @action
  async getAdvisoryStage(params) {
    this.advisoryStages = await appDataService.getAdvisoryStage(params)
  }

  @action
  async getCommercialStage(params) {
    this.commercialStages = await appDataService.getCommercialStage(params)
  }

  @action
  async getAdvisoryDealStatus(params) {
    this.advisoryDealStatus = await appDataService.getAdvisoryDealStatus(params)
  }

  @action
  async getCommercialDealStatus(params) {
    this.commercialDealStatus = await appDataService.getCommercialDealStatus(
      params
    )
  }

  @action
  async getPositionLevels(params) {
    this.positionLevels = await appDataService.getPositionLevels(params)
  }

  @action
  async getExchangeRate() {
    this.exchangeRates = await appDataService.getExchangeRates({
      basic: DEFAULT_CURRENCY,
    })
  }

  @action
  async getCountryFull() {
    this.countryFull = await appDataService.getCountryFull({})
  }

  // Project

  @action
  async getSelectOption(params) {
    const res = await appDataService.getRequiredAreaOption(params)
    this.facilityRequiredOption = res
    this.requiredAreaOption = res.filter(
      (item) => item.typeCode === "RequiredArea"
    )
    this.expctedLeasingPeriodOption = res.filter(
      (item) => item.typeCode === "ExpectedLeasingPeriod"
    )
    this.requiredWorkerOption = res.filter(
      (item) => item.typeCode === "RequiredWorker"
    )
    this.requiredPowerOption = res.filter(
      (item) => item.typeCode === "RequiredPower"
    )
    this.wasteOption = res.filter((item) => item.typeCode === "Waste")
    this.capabilityOption = res.filter((item) => item.typeCode === "Capability")
    this.utilityOption = res.filter((item) => item.typeCode === "Utilities")
    this.stateOption = res.filter((item) => item.typeCode === "Stage")
    this.closingOption = res.filter((item) => item.typeCode === "Closing")
    this.closingReasonOption = res.filter(
      (item) => item.typeCode === "ClosingReason"
    )
    this.statusOption = res.filter(
      (item) => item.typeCode === "OpportunityStatus"
    )
    this.facilityTypeOption = res.filter(
      (item) => item.typeCode === "FacilityType"
    )
  }

  @action async getProvince(countryId) {
    this.provinceOption = await appDataService.getProvinces(countryId)
  }

  //PMH
  //Unit
  @action async GetListUnitStatus(keyword) {
    const res = await appDataService.GetListUnitStatus(keyword)
    this.unitStatus = res
    this.unitStatusOtherVacant = res?.filter((item) => item.id !== 1)
  }

  @action async GetListUnitType(keyword) {
    this.unitTypes = await appDataService.GetListUnitType(keyword)
  }
  @action async GetListUnitFacility(keyword) {
    this.unitFacilities = await appDataService.GetListUnitFacility(keyword)
  }
  @action async GetListLeadSource(keyword) {
    this.leadSource = await appDataService.GetListLeadSource(keyword)
  }
  //project
  @action async GetListPropertyType(keyword) {
    this.propertyTypes = await appDataService.GetListPropertyType(keyword)
  }
  @action async GetListProjectFacility(keyword) {
    this.projectFacilities = await appDataService.GetListProjectFacility(
      keyword
    )
  }
  @action async getListLAStatus(keyword) {
    const res = await appDataService.getListLAStatus(keyword)
    this.laStage = res?.filter((item) => item.code === "LAStage")
    this.leaseAgreementStatus = res?.filter((item) => item.code === "LAStatus")

    this.depositsStatus = res?.filter((item) => item.code === "LADepositStatus")

  }
 
  @action async getTaskStatus() {
    const res = await appDataService.getTaskStatus()
    this.taskStatus = res
    const statusBoardView = [
      {
        color: "#9393937d",
        name: "Overdue",
        id:taskStatusForNew.overDue
      },
      {
        color: "#861ad87d",
      
        name: "DueInThreeDay",
        id:taskStatusForNew.overDueIn3Day

      },
      {
        color: "#ff632ba8",
       
        name: "DueToDay",
        id:taskStatusForNew.DueToday

      },
      {
        color: "#12e7eebf",
       
        name: "ToDo",
        id:taskStatusForNew.todo

      },
    ]

    this.taskStatusForBoardView = [
      ...statusBoardView,
      ...res.filter((item) => item.name !== "New"),
    ]
  }


  @action
  async getDepositRefundTypes(params) {
    const res = await appDataService.getDepositRefundTypes(params)
    this.depositRefundTypes = res
  }

  @action
  async getListAmendmentType() {
    const res = await appDataService.getListAmendmentType()
    this.amendmentType = res
  }



}


export default AppDataStore
