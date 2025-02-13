import { action, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import { RatingBadgeModel } from "@models/master-data/ratingBadgeModel"
import ratingBadgeService from "@services/master-data/ratingBadgeService"
import { moduleIds } from "@lib/appconst"

class RatingBadgeStore {
  @observable isLoading!: boolean
  @observable editRatingBadge!: any
  @observable pagedData!: PagedResultDto<any>
  @observable ratingBadges!: any[]

  constructor() {
    this.pagedData = { items: [], totalCount: 0 }
  }

  @action
  async create(body) {
    this.isLoading = true
    await ratingBadgeService.create(body).finally(() => {
      this.isLoading = false
    })
  }

  @action
  async update(body) {
    this.isLoading = true
    await ratingBadgeService.update(body).finally(() => {
      this.isLoading = false
    })
  }

  @action
  async updateSortList(body) {
    this.isLoading = true
    await ratingBadgeService.updateSortList(body).finally(() => {
      this.isLoading = false
    })
  }

  @action
  async filter(params: any) {
    this.isLoading = true
    params.moduleId = moduleIds.ratingBadge
    this.pagedData = await ratingBadgeService
      .filter(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    params.isActive = true
    params.moduleId = moduleIds.ratingBadge
    this.ratingBadges = await ratingBadgeService
      .getAll(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async getById(id) {
    this.editRatingBadge = await ratingBadgeService.getById(id)
  }

  @action
  async createRatingBadge() {
    this.editRatingBadge = new RatingBadgeModel()
  }

  @action
  async downloadTemplate() {
    return await ratingBadgeService.downloadTemplateImport()
  }

  @action
  async exportRatingBadge(params: any) {
    this.isLoading = true
    return await ratingBadgeService
      .exportRatingBadge(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async activateOrDeactivate(id, isActive) {
    await ratingBadgeService.activateOrDeactivate(id, isActive)
  }
}

export default RatingBadgeStore
