import { action, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import siteVisitService from "@services/activity/siteVisitService"

class SiteVisitStore {
  @observable isLoading!: boolean;
  @observable tableData!: PagedResultDto<any>;
  @observable siteVisitDetail!: any;

  constructor() {
    this.tableData = { items: [], totalCount: 0 }
  }

  @action
  async createOrUpdate(body: any) {
    this.isLoading = true
    const result = await siteVisitService.createOrUpdate(body).finally(() => (this.isLoading = false))
    this.siteVisitDetail = result
  }

  @action
  async createSiteVisit() {
    this.siteVisitDetail = {}
  }

  @action
  async get(id: number) {
    const result = await siteVisitService.get(id)
    this.siteVisitDetail = result
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    const result = await siteVisitService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.tableData = result
  }
}

export default SiteVisitStore
