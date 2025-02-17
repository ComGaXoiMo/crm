import { action, makeAutoObservable, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import requirementService from "@services/projects/requirementService"

class RequirementStore {
  @observable isLoading!: boolean
  @observable tableData!: PagedResultDto<any>
  @observable editRequirement!: any

  constructor() {
    makeAutoObservable(this)

    this.tableData = { items: [], totalCount: 0 }
  }

  @action
  async create(body: any) {
    const result = await requirementService.create(body)
    this.editRequirement = result
    this.tableData.items.push(result)
  }

  @action
  async createRequirement() {
    this.editRequirement = {
      isActive: true,
      isMultiSpace: false,
      id: 0,
    }
  }

  @action
  async update(updateStaffInput: any) {
    const result = await requirementService.update(updateStaffInput)
    this.tableData.items = this.tableData.items.map((x) => {
      if (x.id === updateStaffInput.id) x = result
      return x
    })
  }

  @action
  async delete(id: number) {
    await requirementService.delete(id)
    this.tableData.items = this.tableData.items.filter((x) => x.id !== id)
  }

  @action
  async activateOrDeactivate(id: number, isActive) {
    await requirementService.activateOrDeactivate(id, isActive)
  }

  @action
  async get(id: number) {
    const result = await requirementService.get(id)
    this.editRequirement = result
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    const result = await requirementService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.tableData = result
  }
}

export default RequirementStore
