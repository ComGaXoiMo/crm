import { action, makeAutoObservable, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import calendarService from "@services/activity/calendarService"
import activityService from "@services/activity/activityService"

class MeetingStore {
  @observable isLoading!: boolean
  @observable activities!: PagedResultDto<any>
  @observable activities4Calendar!: any[]
  @observable editFinancial!: any

  constructor() {
    makeAutoObservable(this)
    this.activities = { items: [], totalCount: 0 }
  }

  @action
  async create(body: any) {
    const result = await calendarService.create(body)
    this.editFinancial = result
    this.activities.items.push(result)
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
    const result = await calendarService.update(updateStaffInput)
    this.activities.items = this.activities.items.map((x) => {
      if (x.id === updateStaffInput.id) x = result
      return x
    })
  }

  @action
  async delete(id: number) {
    await calendarService.delete(id)
    this.activities.items = this.activities.items.filter((x) => x.id !== id)
  }

  @action
  async activateOrDeactivate(id: number, isActive) {
    await calendarService.activateOrDeactivate(id, isActive)
  }

  @action
  async get(id: number) {
    const result = await calendarService.get(id)
    this.editFinancial = result
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    const result = await activityService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.activities = result
  }

  @action
  async getAll4Calendar(params: any) {
    this.isLoading = true
    const result = await activityService
      .getAll4Calendar(params)
      .finally(() => (this.isLoading = false))
    this.activities4Calendar = result.items || []
  }
}

export default MeetingStore
