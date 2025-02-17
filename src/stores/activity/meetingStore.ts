import { action, makeAutoObservable, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import meetingService from "@services/activity/meetingService"

class MeetingStore {
  @observable isLoading!: boolean
  @observable tableData!: PagedResultDto<any>
  @observable editFinancial!: any

  constructor() {
    makeAutoObservable(this)
    this.tableData = { items: [], totalCount: 0 }
  }

  @action
  async create(body: any) {
    const result = await meetingService.create(body)
    this.editFinancial = result
    this.tableData.items.push(result)
  }

  @action
  async createStaff() {
    this.editFinancial = {
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
    const result = await meetingService.update(updateStaffInput)
    this.tableData.items = this.tableData.items.map((x) => {
      if (x.id === updateStaffInput.id) x = result
      return x
    })
  }

  @action
  async delete(id: number) {
    await meetingService.delete(id)
    this.tableData.items = this.tableData.items.filter((x) => x.id !== id)
  }

  @action
  async activateOrDeactivate(id: number, isActive) {
    await meetingService.activateOrDeactivate(id, isActive)
  }

  @action
  async get(id: number) {
    const result = await meetingService.get(id)
    this.editFinancial = result
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    const result = await meetingService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.tableData = result
  }
}

export default MeetingStore
