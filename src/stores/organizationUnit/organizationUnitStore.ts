import { action, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import OrganizationUnitService from "@services/organizationUnit/OrganizationUnitService"

class OrganizationUnitStore {
  @observable isLoading!: boolean;
  @observable tableData!: any[];
  @observable userTableData!: PagedResultDto<any>;
  @observable listUsers!: PagedResultDto<any>;

  @observable editOU!: any;

  constructor() {
    this.tableData = []
    this.editOU = {
      parentId: null,
      displayName: "",
      id: 0,
    }
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    const result = await OrganizationUnitService.getAll(params).finally(
      () => (this.isLoading = false)
    )
    this.tableData = result
  }
  @action
  async createOU(body: any) {
    this.isLoading = true
    this.editOU = await OrganizationUnitService.createOU(body).finally(
      () => (this.isLoading = false)
    )
    return this.editOU
  }
  @action
  async deleteOU(id: any) {
    this.isLoading = true
    await OrganizationUnitService.deleteOU(id).finally(
      () => (this.isLoading = false)
    )
  }
  //User
  @action
  async getOUUsers(filter: any) {
    const result = await OrganizationUnitService.getOUUsers(filter)
    this.userTableData = result
  }
  @action
  async findUsers(body: any) {
    this.isLoading = true
    this.listUsers = await OrganizationUnitService.findUsers(body).finally(
      () => (this.isLoading = false)
    )
    return this.listUsers
  }
  @action
  async addUsersToOrganizationUnit(body: any) {
    this.isLoading = true
    this.listUsers = await OrganizationUnitService.addUsersToOrganizationUnit(
      body
    ).finally(() => (this.isLoading = false))
    return this.listUsers
  }
  @action
  async removeUserFromOrganizationUnit(body: any) {
    this.isLoading = true
    this.listUsers =
      await OrganizationUnitService.RemoveUserFromOrganizationUnit(
        body
      ).finally(() => (this.isLoading = false))
    return this.listUsers
  }
}

export default OrganizationUnitStore
