import { action, makeAutoObservable, observable } from "mobx"

import masterDataService from "../../services/master-data/masterDataService"

class MasterDataStore {
  @observable isLoading!: boolean
  @observable feedbackTypeOptions!: any[]
  @observable productOptions!: any[]
  @observable projectSizeOptions!: any[]
  @observable projectTypeOptions!: any[]
  @observable provinceOptions!: any[]
  @observable districtOptions!: any[]
  @observable truckTypeOptions!: any[]
  @observable truckBrandOptions: any[] = []
  @observable projectMasterOptions!: any[]
  @observable warehouseOptions!: any[]
  @observable personInChargeOptions!: any[]
  @observable customerOptions!: any[]
  @observable feeTypeOptions!: any[]
  @observable paymentOptions: Array<any> = []
  @observable userStatus: any = {}
  @observable haveUserWarning = false
  constructor() {
    makeAutoObservable(this)

    this.feedbackTypeOptions = []
    this.productOptions = []
    this.projectSizeOptions = []
    this.projectTypeOptions = []
    this.provinceOptions = []
    this.districtOptions = []
    this.truckTypeOptions = []
  }

  @action async getUserStatus(userId) {
    this.haveUserWarning = false
    const result = await masterDataService.getUserStatus(userId)
    if (Object.keys(result).some((key) => result[key] === true)) {
      this.haveUserWarning = true
    }
    this.userStatus = result
  }
  @action async getPaymentOption() {
    this.paymentOptions = await masterDataService.getPaymentOption()
  }
  @action async getTruckBrandOptions(params) {
    params.skipCount = params.skipCount || 0
    params.maxResultCount = params.maxResultCount || 20
    params.isActive = true
    this.isLoading = true

    this.truckBrandOptions = await masterDataService
      .getTruckBrandOptions(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async filterProductOptions(params: any) {
    params.skipCount = params.skipCount || 0
    params.maxResultCount = params.maxResultCount || 20
    this.isLoading = true

    this.productOptions = await masterDataService
      .filterProductOptions(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async filterProjectSizeOptions(params: any) {
    params.skipCount = params.skipCount || 0
    params.maxResultCount = params.maxResultCount || 20
    this.isLoading = true

    this.projectSizeOptions = await masterDataService
      .filterProjectSizeOptions(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async filterProjectTypeOptions(params: any) {
    params.skipCount = params.skipCount || 0
    params.maxResultCount = params.maxResultCount || 20
    this.isLoading = true

    this.projectTypeOptions = await masterDataService
      .filterProjectTypeOptions(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async filterProvinceOptions(params: any) {
    params.skipCount = params.skipCount || 0
    params.maxResultCount = params.maxResultCount || 20
    this.isLoading = true

    this.provinceOptions = await masterDataService
      .filterProvinceOptions(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async filterDistrictOptions(params: any) {
    params.skipCount = params.skipCount || 0
    params.maxResultCount = params.maxResultCount || 20
    this.isLoading = true

    this.districtOptions = await masterDataService
      .filterDistrictOptions(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async filterTruckTypeOptions(params: any) {
    params.skipCount = params.skipCount || 0
    params.maxResultCount = params.maxResultCount || 20
    params.isActive = true
    this.isLoading = true

    this.truckTypeOptions = await masterDataService
      .filterTruckTypeOptions(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async filterProjectMasterOptions(params: any) {
    params.skipCount = params.skipCount || 0
    params.maxResultCount = params.maxResultCount || 20
    this.isLoading = true

    this.projectMasterOptions = await masterDataService
      .filterProjectMasterOptions(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async filterWarehouseOptions(params: any) {
    params.skipCount = params.skipCount || 0
    params.maxResultCount = params.maxResultCount || 20
    this.isLoading = true

    this.warehouseOptions = await masterDataService
      .filterProjectMasterOptions(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async filterPersonInChargeOptions(params: any) {
    params.skipCount = params.skipCount || 0
    params.maxResultCount = params.maxResultCount || 20
    this.isLoading = true

    this.personInChargeOptions = await masterDataService
      .filterProjectMasterOptions(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async filterCustomerOptions(params: any) {
    params.skipCount = params.skipCount || 0
    params.maxResultCount = params.maxResultCount || 20
    this.isLoading = true

    this.customerOptions = await masterDataService
      .filterCustomerOptions(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async filterFeeTypeOptions(params: any) {
    params.skipCount = params.skipCount || 0
    params.maxResultCount = params.maxResultCount || 20
    params.isActive = true
    this.isLoading = true

    this.feeTypeOptions = await masterDataService
      .filterFeeTypeOptions(params)
      .finally(() => (this.isLoading = false))
  }
}

export default MasterDataStore
