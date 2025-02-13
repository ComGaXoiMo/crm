import type { PagedResultDto } from "@services/dto/pagedResultDto"
import { AnnouncementModel } from "@models/communication/Announcement/announcementModel"
import type { IAnnouncement } from "@models/communication/Announcement/announcementModel"
import { action, observable } from "mobx"
import announcementService from "@services/communication/announcementService"
import { OptionModel } from "@models/global"

class AnnouncementStore {
  @observable pagedData!: PagedResultDto<IAnnouncement>
  @observable isLoading!: boolean
  @observable announcements!: IAnnouncement[]
  @observable editAnnouncement!: IAnnouncement
  @observable announcementTypes!: OptionModel[]

  constructor() {
    this.pagedData = {
      items: [],
      totalCount: 0,
    }
    this.announcementTypes = []
  }

  @action
  async create(body) {
    await announcementService.create(body)
  }

  @action
  async update(body) {
    await announcementService.update(body)
  }

  @action
  async activateOrDeactivate(id, isActive) {
    await announcementService.activateOrDeactivate(id, isActive)
  }

  @action
  async delete(id) {
    await announcementService.delete(id)
    this.pagedData.items = this.pagedData.items.filter((x) => x.id !== id)
  }

  @action
  async get(id) {
    const result = await announcementService.get(id)
    this.editAnnouncement = result
  }

  @action
  async createAnnouncement() {
    this.editAnnouncement = new AnnouncementModel()
  }

  @action
  async filter(params) {
    this.isLoading = true
    const result = await announcementService
      .filter(params)
      .finally(() => (this.isLoading = false))
    this.pagedData = result
  }

  @action
  async getAll(params) {
    this.isLoading = true
    params.isActive = true
    this.announcements = await announcementService
      .getAll(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async getAnnouncementTypes() {
    this.isLoading = true
    this.announcementTypes = await announcementService
      .getAnnouncementTypes()
      .finally(() => (this.isLoading = false))
  }
}

export default AnnouncementStore
