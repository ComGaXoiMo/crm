import { action, makeAutoObservable, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import proposalService from "@services/activity/proposalService"

class ProposalStore {
  @observable isLoading!: boolean
  @observable tableData!: PagedResultDto<any>
  @observable listUnitImage!: any[]
  @observable proposalDetail!: any
  @observable proposalPublic!: any
  @observable template!: any
  @observable getTemplateLoading!: boolean

  constructor() {
    makeAutoObservable(this)
    this.tableData = { items: [], totalCount: 0 }
    this.proposalPublic = {}
  }

  @action
  async createOrUpdate(body: any) {
    const result = await proposalService.createOrUpdate(body)
    this.proposalDetail = result
  }
  @action
  async updateTemplate(body: any) {
    await proposalService.updateTemplate(body)
  }
  @action
  async createProposal() {
    this.proposalDetail = {}
  }

  @action
  async get(id: number) {
    const result = await proposalService.get(id)
    this.proposalDetail = result
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    const result = await proposalService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.tableData = result
  }
  @action
  async getUnitTemplate(id: number) {
    this.getTemplateLoading = true
    const result = await proposalService
      .getUnitTemplate(id)
      .finally(() => (this.getTemplateLoading = false))
    this.template = result
  }
  @action
  async getProjectTemplate(id: number) {
    this.getTemplateLoading = true
    const result = await proposalService
      .getProjectTemplate(id)
      .finally(() => (this.getTemplateLoading = false))
    this.template = result
  }

  @action
  async getPublicProposal(uniqueId) {
    const result = await proposalService.getPublicProposal(uniqueId)
    this.proposalPublic = result
  }
  @action
  async updateLinkView(params) {
    await proposalService.updateLinkView(params)
  }
  @action
  async getUnitImage(uiqueId) {
    const result = await proposalService.getUnitImage(uiqueId)
    this.listUnitImage = result
  }
}

export default ProposalStore
