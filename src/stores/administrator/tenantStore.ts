import { action, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
// import TenantModel from "../../models/tenants/TenantModel";
import tenantService from "../../services/administrator/tenant/tenantService"

class TenantStore {
  @observable isLoading!: boolean
  @observable tableData!: PagedResultDto<any>
  @observable tableMoveOutInData!: PagedResultDto<any>

  @observable tenantModel: any

  constructor() {
    this.tableData = { items: [], totalCount: 0 }
    this.tableMoveOutInData = { items: [], totalCount: 0 }
  }

  @action
  async CreateOrUpdate(updateInput: any) {
    this.isLoading = true

    this.tenantModel = await tenantService
      .CreateOrUpdate(updateInput)
      .finally(() => (this.isLoading = false))
  }

  @action
  async createTenant() {
    this.tenantModel = {
      id: 0,
      isActive: true,
      name: "",
    }
  }

  @action
  async get(id: number) {
    this.isLoading = true
    this.tenantModel = await tenantService
      .get(id)
      .finally(() => (this.isLoading = false))
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    this.tableData = await tenantService
      .getAll(params)
      .finally(() => (this.isLoading = false))
  }
  @action
  async getAllunitTenant(params: any) {
    this.isLoading = true
    this.tableMoveOutInData = await tenantService
      .getAllunitTenant(params)
      .finally(() => (this.isLoading = false))
  }
  @action
  async moveTenantInUnit(updateInput: any) {
    await tenantService.moveTenantInUnit(updateInput)
  }
  @action
  async moveTenantOutUnit(updateInput: any) {
    await tenantService.moveTenantOutUnit(updateInput)
  }
  @action
  async activateOrDeactivate(id: number, isActive) {
    await tenantService.activateOrDeactivate(id, isActive)
  }
}

export default TenantStore
