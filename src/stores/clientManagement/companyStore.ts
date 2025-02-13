import { action, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import companyService from "@services/clientManagement/companyService"
import { AddressModel } from "@models/common/addressModel"

class CompanyStore {
  @observable isLoading!: boolean;
  @observable tableData!: PagedResultDto<any>;
  @observable editCompany!: any;
  @observable auditLogResult: any

  constructor() {
    this.auditLogResult = []
    this.tableData = { items: [], totalCount: 0 }
  }

  @action
  async createOrUpdate(body: any) {
    // if (body.companyUserIds) {
    //   body.companyUser = body.companyUserIds.map((userId) => ({ userId }));
    // }
    // if (body.companyOrganizationUnitIds) {
    //   body.companyOrganizationUnit = body.companyOrganizationUnitIds.map(
    //     (organizationUnitId) => ({ organizationUnitId })
    //   );
    // }
    this.isLoading = true
    await companyService
      .createOrUpdate(body)
      .finally(() => (this.isLoading = false))
  }

  @action
  async createCompany() {
    this.editCompany = {
      name: "",
      isActive: true,
      isVerified: true,
      id: undefined,
      companyAddress: [new AddressModel(null, null, null, null, true)],
    }
  }

  @action
  async update(body: any) {
    if (body.companyUserIds) {
      body.companyUser = body.companyUserIds.map((userId) => ({ userId }))
    }
    if (body.companyOrganizationUnitIds) {
      body.companyOrganizationUnit = body.companyOrganizationUnitIds.map(
        (organizationUnitId) => ({ organizationUnitId })
      )
    }

    this.isLoading = true
    await companyService.update(body).finally(() => (this.isLoading = false))
  }

  @action
  async delete(id: number) {
    await companyService.delete(id)
    this.tableData.items = this.tableData.items.filter((x) => x.id !== id)
  }

  @action
  async activateOrDeactivate(id: number, isActive) {
    await companyService.activateOrDeactivate(id, isActive)
  }

  @action
  async get(id: number) {
    this.isLoading = true
    const result = await companyService
      .get(id)
      .finally(() => (this.isLoading = false))
    this.editCompany = result
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    const result = await companyService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.tableData = result
  }

  @action
  async exportExcel(params: any) {
    this.isLoading = true
    return await companyService
      .exportExcel(params)
      .finally(() => (this.isLoading = false))
  }

  
  @action getAuditLogs = async (params) => {
    this.isLoading = true
    this.auditLogResult = await companyService
      .getAuditLogs(params)
      .finally(() => (this.isLoading = false))
  }

}

export default CompanyStore
