import { action, makeAutoObservable, observable } from "mobx"

import type { PagedResultDto } from "@services/dto/pagedResultDto"
import activityService from "@services/activity/activityService"
import { moduleIds } from "@lib/appconst"

class ActivityStore {
  @observable isLoading!: boolean
  @observable tableData!: PagedResultDto<any>
  @observable editActivity!: any
  @observable activityStatus!: any[]
  @observable taskStatus!: any[]
  @observable taskPriorities!: any[]
  @observable reminderFormats!: any[]
  @observable reminderTypes!: any[]

  constructor() {
    makeAutoObservable(this)
    this.tableData = { items: [], totalCount: 0 }
  }

  @action
  async create(body: any, moduleId, parentId) {
    this.isLoading = true
    this.editActivity = await activityService
      .create(body, moduleId, parentId)
      .finally(() => (this.isLoading = false))
  }

  @action
  async createActivity() {
    this.editActivity = {
      moduleId: undefined,
      parentId: undefined,
      activityName: "",
      isActive: true,
      direction: true,
      statusId: undefined,
      taskStatusId: undefined,
      taskPriorityId: undefined,
      dateStart: undefined,
      dateEnd: undefined,
      description: "",
    }
  }

  @action
  async update(body: any) {
    this.isLoading = true
    await activityService
      .update(body, body.moduleId, body.referenceId)
      .finally(() => (this.isLoading = false))
  }

  @action
  async delete(id: number) {
    await activityService.delete(id)
    this.tableData.items = this.tableData.items.filter((x) => x.id !== id)
  }

  @action
  async deactivate(id: number) {
    await activityService.deactivate(id)
  }

  @action
  async get(id: number) {
    const result = await activityService.get(id)
    this.editActivity = result
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    const result = await activityService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.tableData = result
  }

  @action
  async getActivityCategories(params: any) {
    const result = await activityService.getActivityCategories(params)
    this.activityStatus = (result || []).filter(
      (item) => item.typeCode === "ActivityStatus"
    )
    this.taskStatus = (result || []).filter(
      (item) => item.typeCode === "TaskStatus"
    )
    this.taskPriorities = (result || []).filter(
      (item) => item.typeCode === "TaskPriority"
    )
    this.reminderFormats = (result || []).filter(
      (item) => item.typeCode === "ReminderFormat"
    )
    this.reminderTypes = (result || []).filter(
      (item) => item.typeCode === "ReminderType"
    )
  }

  @action
  async getAllByModule(params: any, moduleId, parentId) {
    this.isLoading = true

    switch (moduleId) {
      case moduleIds.company: {
        params = { companyId: parentId }
        this.tableData = await activityService
          .getAllCompanyActivity(params)
          .finally(() => (this.isLoading = false))
        break
      }
      default: {
        this.tableData = await activityService
          .getAllByModule(params, moduleId, parentId)
          .finally(() => (this.isLoading = false))
      }
    }
  }
}

export default ActivityStore
