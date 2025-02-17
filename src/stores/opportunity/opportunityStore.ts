import { action, makeAutoObservable, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import opportunityService from "@services/opportunity/opportunityService"
import unitService from "@services/projects/unitService"

class OpportunityStore {
  @observable isLoading!: boolean
  @observable tableData!: PagedResultDto<any>
  @observable editOpportunity!: any
  @observable widgetStatusItems!: any[]
  @observable widgetStageItems!: any[]
  @observable targetAssetOption!: any[]

  constructor() {
    makeAutoObservable(this)

    this.tableData = { items: [], totalCount: 0 }
    this.widgetStatusItems = []
  }
  @action async getTargetAssetOption(params: any) {
    this.isLoading = true
    const res = await unitService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.targetAssetOption = res.items
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
    this.editOpportunity = await opportunityService
      .create(body)
      .finally(() => (this.isLoading = false))
  }

  @action
  async createOpportunity() {
    this.editOpportunity = {
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
    this.editOpportunity = await opportunityService.get(id)
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    this.tableData = await opportunityService
      .getAll(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async getAllOpportunityAdvisory(params: any) {
    this.isLoading = true
    this.tableData = await opportunityService
      .getAllOpportunityAdvisory(params)
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
}

export default OpportunityStore
