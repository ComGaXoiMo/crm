import type { PagedResultDto } from "@services/dto/pagedResultDto"
import {
  NotificationTemplateDetailModel,
  RowNotificationTemplateModel,
} from "@models/notificationTemplate"
import { action, observable } from "mobx"
import notificationTemplateService from "@services/notificationTemplate/notificationTemplateService"
import { OptionModel } from "@models/global"

class NotificationTemplateStore {
  @observable pagedResult!: PagedResultDto<RowNotificationTemplateModel>
  @observable isLoading!: boolean
  @observable notificationTemplates!: RowNotificationTemplateModel[]
  @observable eProposalTemplates!: RowNotificationTemplateModel[]
  @observable notificationTypes!: OptionModel[]
  @observable editTemplate!: NotificationTemplateDetailModel

  constructor() {
    this.pagedResult = {
      items: [],
      totalCount: 0,
    }
  }

  @action
  async create(body) {
    await notificationTemplateService.create(body)
  }

  @action
  async update(body) {
    await notificationTemplateService.update(body)
  }

  @action
  async activateOrDeactivate(id, isActive) {
    await notificationTemplateService.activateOrDeactivate(id, isActive)
  }

  @action
  async delete(id) {
    await notificationTemplateService.delete(id)
    this.pagedResult.items = this.pagedResult.items.filter((x) => x.id !== id)
  }

  @action
  async get(id) {
    const result = await notificationTemplateService.get(id)
    this.editTemplate = result
  }

  @action
  async createNotificationTemplate() {
    this.editTemplate = new NotificationTemplateDetailModel()
  }

  @action
  async filter(params) {
    this.isLoading = true
    const result = await notificationTemplateService
      .filter(params)
      .finally(() => (this.isLoading = false))
    this.pagedResult = result
  }

  @action
  async getAll(params) {
    this.isLoading = true
    const result = await notificationTemplateService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.notificationTemplates = result
  }
  @action
  async getAllEproposal(params) {
    this.isLoading = true
    const result = await notificationTemplateService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.eProposalTemplates = result
  }

  @action
  async getNotificationTypes(params) {
    params.isActive = true
    this.notificationTypes =
      await notificationTemplateService.getNotificationTypes(params)
  }
}

export default NotificationTemplateStore
