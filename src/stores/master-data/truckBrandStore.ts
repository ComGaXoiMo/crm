import { action, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import truckBrandService from "../../services/master-data/truckBrandService"
import { TruckBrandModel } from "@models/master-data/truckBrandModel"

class TruckBrandStore {
  @observable isLoading!: boolean
  @observable editTruckBrand!: any
  @observable pagedData!: PagedResultDto<any>
  @observable truckBrands!: any[]

  constructor() {
    this.pagedData = { items: [], totalCount: 0 }
  }

  @action
  async create(body) {
    this.isLoading = true
    await truckBrandService.create(body).finally(() => {
      this.isLoading = false
    })
  }

  @action
  async update(body) {
    this.isLoading = true
    await truckBrandService.update(body).finally(() => {
      this.isLoading = false
    })
  }

  @action
  async updateSortList(body) {
    this.isLoading = true
    await truckBrandService.updateSortList(body).finally(() => {
      this.isLoading = false
    })
  }

  @action
  async getById(id) {
    this.editTruckBrand = await truckBrandService.getById(id)
  }

  @action
  async createTruckBrand() {
    this.editTruckBrand = new TruckBrandModel()
  }

  @action
  async filter(params: any) {
    this.isLoading = true
    this.pagedData = await truckBrandService
      .filter(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    params.isActive = true
    this.truckBrands = await truckBrandService
      .getAll(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async downloadTemplate() {
    return await truckBrandService.downloadTemplateImport()
  }

  @action
  async exportTruckBrand(params: any) {
    this.isLoading = true
    return await truckBrandService
      .exportTruckBrand(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async activateOrDeactivate(ids, isActive) {
    await truckBrandService.activateOrDeactivate(ids, isActive)
  }
}

export default TruckBrandStore
