import { action, observable } from 'mobx'

import { PagedResultDto } from '../../services/dto/pagedResultDto'
import { ProductTypeModel } from '@models/master-data/productTypeModel'
import productTypeService from '@services/master-data/productTypeService'

class ProductTypeStore {
  @observable isLoading!: boolean
  @observable editProductType!: any
  @observable pagedData!: PagedResultDto<any>
  @observable productTypes!: any[]

  constructor() {
    this.pagedData = { items: [], totalCount: 0 }
  }

  @action
  async create(body) {
    this.isLoading = true
    await productTypeService.create(body).finally(() => {
      this.isLoading = false
    })
  }

  @action
  async update(body) {
    this.isLoading = true
    await productTypeService.update(body).finally(() => {
      this.isLoading = false
    })
  }

  @action
  async updateSortList(body) {
    this.isLoading = true
    await productTypeService.updateSortList(body).finally(() => {
      this.isLoading = false
    })
  }

  @action
  async filter(params: any) {
    this.isLoading = true
    const result = await productTypeService.filter(params).finally(() => (this.isLoading = false))
    this.pagedData = result
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    params.isActive = true
    this.productTypes = await productTypeService.getAll(params).finally(() => (this.isLoading = false))
  }

  @action
  async getById(id) {
    this.editProductType = await productTypeService.getById(id)
  }

  @action
  async createProductType() {
    this.editProductType = new ProductTypeModel()
  }

  @action
  async downloadTemplate() {
    return await productTypeService.downloadTemplateImport()
  }

  @action
  async exportProductType(params: any) {
    this.isLoading = true
    return await productTypeService.exportProductType(params).finally(() => (this.isLoading = false))
  }

  @action
  async activateOrDeactivate(id, isActive) {
    await productTypeService.activateOrDeactivate(id, isActive)
  }
}

export default ProductTypeStore
