import { action, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import mailService from "@services/activity/mailService"

class MailStore {
  @observable isLoading!: boolean;
  @observable tableData!: PagedResultDto<any>;
  @observable mailDetail!: any;

  constructor() {
    this.tableData = { items: [], totalCount: 0 }
  }

  @action
  async createOrUpdate(body: any) {
    this.isLoading = true
    const result = await mailService.createOrUpdate(body).finally(() => (this.isLoading = false))
      this.mailDetail = result
  }

  @action
  async createMail() {
    this.mailDetail = {}
  }

  @action
  async get(id: number) {
    const result = await mailService.get(id)
    this.mailDetail = result
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    const result = await mailService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.tableData = result
  }
}

export default MailStore
