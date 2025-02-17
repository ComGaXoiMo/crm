import { action, makeAutoObservable, observable } from "mobx"

import taskService from "@services/activity/taskService"
import type { PagedResultDto } from "@services/dto/pagedResultDto"
import dayjs from "dayjs"
import AppConsts from "@lib/appconst"
const { taskStatusForNew } = AppConsts

class TaskStore {
  @observable isLoading!: boolean
  @observable tableData!: PagedResultDto<any>
  @observable taskDetail!: any
  @observable taskStatus!: any
  @observable listTaskBoardView!: any

  constructor() {
    makeAutoObservable(this)

    this.tableData = { items: [], totalCount: 0 }
    this.listTaskBoardView = {} as any
    this.taskStatus = []
    this.isLoading = false
  }

  @action
  async createOrUpdate(body: any) {
    this.isLoading = true

    const result = await taskService
      .createOrUpdate(body)
      .finally(() => (this.isLoading = false))
    this.taskDetail = result
  }

  @action
  async createTask() {
    this.taskDetail = {}
  }

  @action
  async get(id: number) {
    const result = await taskService.get(id)
    this.taskDetail = result
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    const result = await taskService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.tableData = result
  }

  @action
  async getAllByStatus(params: any) {
    const res = await taskService.getTaskStatus()
    this.taskStatus = res.filter((item) => item.name !== "New")

    await this.taskStatus.forEach(async (item, index) => {
      if (item.id > 100) {
        if (item.id === taskStatusForNew.overDue) {
          this.listTaskBoardView[item.id] = await taskService.getAll({
            ...params,
            statusId: 1,
            toDate: dayjs().startOf("day").toJSON(),
          })
        } else if (item.id === taskStatusForNew.DueToday) {
          this.listTaskBoardView[item.id] = await taskService.getAll({
            ...params,
            statusId: 1,
            fromDate: dayjs().startOf("day").toJSON(),
            toDate: dayjs().startOf("day").add(1, "d").toJSON(),
          })
        } else if (item.id === taskStatusForNew.overDueIn3Day) {
          this.listTaskBoardView[item.id] = await taskService.getAll({
            ...params,
            statusId: 1,
            fromDate: dayjs().startOf("day").add(1, "d").toJSON(),
            toDate: dayjs().startOf("day").add(3, "d").toJSON(),
          })
        } else if (item.id === taskStatusForNew.todo) {
          this.listTaskBoardView[item.id] = await taskService.getAll({
            ...params,
            statusId: 1,
            fromDate: dayjs().startOf("day").toJSON(),
          })
        }
      } else {
        this.listTaskBoardView[item.id] = await taskService.getAll({
          ...params,
          statusId: item.id,
        })
      }
    })
  }

  @action
  async getMore(statusId: number, params: any) {
    let fromDate: any = undefined
    let toDate: any = undefined
    switch (statusId) {
      case taskStatusForNew.overDue:
        fromDate = undefined
        toDate = dayjs().startOf("day").toJSON()
        break
      case taskStatusForNew.DueToday:
        ;(fromDate = dayjs().startOf("day").toJSON()),
          (toDate = dayjs().startOf("day").add(1, "d").toJSON())
        break
      case taskStatusForNew.overDueIn3Day:
        ;(fromDate = dayjs().startOf("day").add(1, "d").toJSON()),
          (toDate = dayjs().startOf("day").add(3, "d").toJSON())
        break
      case taskStatusForNew.todo:
        ;(fromDate = dayjs().startOf("day").toJSON()), (toDate = undefined)
        break
      default:
        fromDate = undefined
        toDate = undefined
    }

    const result = await taskService.getAll({
      ...params,
      statusId: statusId < 100 ? statusId : 1,
      fromDate: fromDate,
      toDate: toDate,
    })

    // .finally(() => (this.isLoading = false));
    const oldResult = this.listTaskBoardView[statusId].items
    this.listTaskBoardView[statusId] = {
      items: [...oldResult, ...result.items],
      totalCount: result.totalCount,
    }
  }
}

export default TaskStore
