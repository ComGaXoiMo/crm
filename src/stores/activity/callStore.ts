import { action, makeAutoObservable, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import callService from "@services/activity/callService"

class CallStore {
  @observable isLoading!: boolean
  @observable tableData!: PagedResultDto<any>
  @observable callDetail!: any

  constructor() {
    makeAutoObservable(this)
    this.tableData = { items: [], totalCount: 0 }
  }

  @action
  async createOrUpdate(body: any) {
    this.isLoading = true
    const result = await callService
      .createOrUpdate(body)
      .finally(() => (this.isLoading = false))
    this.callDetail = result
  }

  @action
  async createCall() {
    this.callDetail = {}
  }

  @action
  async get(id: number) {
    const result = await callService.get(id)
    this.callDetail = result
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    const result = await callService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.tableData = result
  }
}

export default CallStore
