import { action, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import transportationCostService from "../../services/master-data/transportationCostService"
import { TransportationCostModel } from "@models/master-data/transportationCostModel"

class TransportationCostStore {
  @observable isLoading!: boolean
  @observable editTransportationCost!: any
  @observable pagedData!: PagedResultDto<any>

  constructor() {
    this.pagedData = { items: [], totalCount: 0 }
  }

  @action
  async create(body) {
    this.isLoading = true
    await transportationCostService.create(body).finally(() => {
      this.isLoading = false
    })
  }

  @action
  async update(body) {
    this.isLoading = true
    await transportationCostService.update(body).finally(() => {
      this.isLoading = false
    })
  }

  @action
  async filter(params: any) {
    this.isLoading = true
    this.pagedData = await transportationCostService
      .filter(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async getById(id) {
    this.editTransportationCost = await transportationCostService.getById(id)
  }

  @action
  async createTransportationCost() {
    this.editTransportationCost = new TransportationCostModel()
  }

  @action
  async downloadTemplate() {
    return await transportationCostService.downloadTemplateImport()
  }

  @action
  async exportTransportationCost(params: any) {
    this.isLoading = true
    return await transportationCostService
      .exportTransportationCost(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async activateOrDeactivate(id, isActive) {
    await transportationCostService.activateOrDeactivate(id, isActive)
  }
}

export default TransportationCostStore
