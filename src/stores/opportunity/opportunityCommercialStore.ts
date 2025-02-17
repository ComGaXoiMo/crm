import { action, makeAutoObservable, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import opportunityService from "@services/opportunity/opportunityCommercialService"

class OpportunityCommercialStore {
  @observable isLoading!: boolean
  @observable tableData!: PagedResultDto<any>
  @observable editOpportunityCommercial!: any
  @observable widgetStatusItems!: any[]
  @observable widgetStageItems!: any[]
  @observable listStatus!: any[]
  @observable listOpportunity: any = {}
  @observable viewType = "L"

  constructor() {
    makeAutoObservable(this)

    this.tableData = { items: [], totalCount: 0 }
    this.widgetStatusItems = []
  }
  @action
  async getStatus() {
    this.listStatus = await opportunityService.getStatus()
  }
  @action
  async getMore(statusId: number, params: any) {
    this.isLoading = true
    const result = await opportunityService.getAll({
      ...params,
      statusIds: statusId,
    })
    const oldResult = this.listOpportunity[statusId].items
    this.listOpportunity[statusId] = {
      items: [...oldResult, ...result.items],
      totalCount: result.totalCount,
    }
    this.isLoading = false
  }

  @action
  async create(body: any) {
    if (body.opportunityOrganizationUnit) {
      body.organizationUnitId = (
        body.opportunityOrganizationUnit.find((item) => item.isPrimary) || {}
      )?.organizationUnitId
      body.amount = body.opportunityOrganizationUnit.reduce((total, item) => {
        return (total += parseInt(item.feeAmount) || 0)
      }, 0)
    }
    this.isLoading = true
    this.editOpportunityCommercial = await opportunityService
      .create(body)
      .finally(() => (this.isLoading = false))
  }

  @action
  async createOpportunityCommercial() {
    this.editOpportunityCommercial = {
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
  async update(body: any) {
    if (body.opportunityOrganizationUnit) {
      body.organizationUnitId = (
        body.opportunityOrganizationUnit.find((item) => item.isPrimary) || {}
      )?.organizationUnitId
      body.amount = body.opportunityOrganizationUnit.reduce((total, item) => {
        return (total += parseInt(item.feeAmount) || 0)
      }, 0)
    }
    this.isLoading = true
    await opportunityService
      .update(body)
      .finally(() => (this.isLoading = false))
  }

  @action
  async convertToDeal(id) {
    await opportunityService.convertToDeal(id)
  }

  @action
  async delete(id: number) {
    await opportunityService.delete(id)
    this.tableData.items = this.tableData.items.filter((x) => x.id !== id)
  }

  @action
  async activateOrDeactivate(id: number, isActive) {
    await opportunityService.activateOrDeactivate(id, isActive)
  }

  @action
  async get(id: number) {
    this.editOpportunityCommercial = await opportunityService.get(id)
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    this.tableData = await opportunityService
      .getAll(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async getWidgetStatusItems(params: any) {
    this.isLoading = true
    this.widgetStatusItems = await opportunityService
      .getWidgetStatusItems(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async getWidgetStageItems(params: any) {
    this.isLoading = true
    this.widgetStageItems = await opportunityService
      .getWidgetStageItems(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async updateOpportunityStatus(opportunityId: number, statusId: number) {
    await opportunityService.updateOpportunityStatus({
      opportunityId,
      statusId,
    })
    return await this.getAllByStatus({})
  }
  @action
  async getAllByStatus(params: any) {
    this.isLoading = true
    this.listStatus = await opportunityService
      .getStatus()
      .finally(() => (this.isLoading = false))
    Promise.all(
      this.listStatus.map(async (item) => {
        this.listOpportunity[item.id] = await opportunityService.getAll({
          ...params,
          statusIds: item.id,
          maxResultCount: 20,
          skipCount: 0,
        })
      })
    ).finally(() => (this.isLoading = false))
  }
}

export default OpportunityCommercialStore
