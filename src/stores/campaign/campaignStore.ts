import { action, makeAutoObservable, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import campaignService from "../../services/campaign/campaignService"

class CampaignStore {
  @observable isLoading!: boolean
  @observable tableData!: PagedResultDto<any>
  @observable editCampaign!: any

  constructor() {
    makeAutoObservable(this)

    this.tableData = { items: [], totalCount: 0 }
  }

  @action
  async create(body: any) {
    const result = await campaignService.create(body)
    this.editCampaign = result
    this.tableData.items.push(result)
  }

  @action
  async createCampaign() {
    this.editCampaign = {
      userName: "",
      name: "",
      surname: "",
      displayName: "",
      emailAddress: "",
      isActive: true,
      roleNames: [],
      password: "",
      id: 0,
    }
  }

  @action
  async update(updateStaffInput: any) {
    const result = await campaignService.update(updateStaffInput)
    this.tableData.items = this.tableData.items.map((x) => {
      if (x.id === updateStaffInput.id) x = result
      return x
    })
  }

  @action
  async delete(id: number) {
    await campaignService.delete(id)
    this.tableData.items = this.tableData.items.filter((x) => x.id !== id)
  }

  @action
  async activateOrDeactivate(id: number, isActive) {
    await campaignService.activateOrDeactivate(id, isActive)
  }

  @action
  async get(id: number) {
    const result = await campaignService.get(id)
    this.editCampaign = result
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    const result = await campaignService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.tableData = result
  }
}

export default CampaignStore
