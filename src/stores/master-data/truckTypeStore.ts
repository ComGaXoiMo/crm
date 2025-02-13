import { action, observable } from 'mobx'

import { PagedResultDto } from '../../services/dto/pagedResultDto'
import truckTypeService from '../../services/master-data/truckTypeService'
import { TruckTypeModel } from '@models/master-data/truckTypeModel'

class TruckTypeStore {
  @observable isLoading!: boolean
  @observable editTruckType!: any
  @observable pagedData!: PagedResultDto<any>
  @observable truckTypes!: any[]

  constructor() {
    this.pagedData = { items: [], totalCount: 0 }
  }

  @action
  async create(body) {
    this.isLoading = true
    await truckTypeService.create(body).finally(() => {
      this.isLoading = false
    })
  }

  @action
  async update(body) {
    this.isLoading = true
    await truckTypeService.update(body).finally(() => {
      this.isLoading = false
    })
  }
  @action
  async updateSortList(body) {
    this.isLoading = true
    await truckTypeService.updateSortList(body).finally(() => {
      this.isLoading = false
    })
  }

  @action
  async getById(id) {
    this.editTruckType = await truckTypeService.getById(id)
  }

  @action
  async createTruckType() {
    this.editTruckType = new TruckTypeModel()
  }

  @action
  async filter(params: any) {
    this.isLoading = true
    this.pagedData = await truckTypeService.filter(params).finally(() => (this.isLoading = false))
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    params.isActive = true
    this.truckTypes = await truckTypeService.getAll(params).finally(() => (this.isLoading = false))
  }

  @action
  async downloadTemplate() {
    return await truckTypeService.downloadTemplateImport()
  }

  @action
  async exportTruckType(params: any) {
    this.isLoading = true
    return await truckTypeService.exportTruckType(params).finally(() => (this.isLoading = false))
  }

  @action
  async activateOrDeactivate(id, isActive) {
    await truckTypeService.activateOrDeactivate(id, isActive)
  }
}

export default TruckTypeStore
