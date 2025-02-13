import { action, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import masterDataService from "../../services/administrator/masterDataService"
import { initMultiLanguageField } from "@lib/helper"

class MasterDataStore {
  @observable isLoading!: boolean
  @observable masterDatas!: PagedResultDto<any>
  @observable editMasterData!: any
  @observable targetOptions: any = []

  @action
  async create(body: any) {
    await masterDataService.create(body)
  }

  @action
  async update(body: any) {
    this.isLoading = true
    await masterDataService.update(body).finally(() => (this.isLoading = false))
  }

  @action
  async delete(id: number) {
    await masterDataService.delete(id)
    this.masterDatas.items = this.masterDatas.items.filter((x) => x.id !== id)
  }

  @action
  async activateOrDeactivate(id: number, isActive) {
    await masterDataService.activateOrDeactivate(id, isActive)
  }

  @action
  async get(id: number) {
    const result = await masterDataService.get(id)
    this.editMasterData = result
  }

  @action
  async createMasterData() {
    this.editMasterData = {
      id: 0,
      isActive: true,
      code: "",
      description: "",
      names: initMultiLanguageField(),
      target: "",
      parentCode: "",
      tenantType: "",
    }
  }
}

export default MasterDataStore
