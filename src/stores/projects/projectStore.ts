import { action, observable } from "mobx"

import type { PagedResultDto } from "@services/dto/pagedResultDto"
import projectService from "@services/projects/projectService"
import unitService from "@services/projects/unitService"

class ProjectStore {
  @observable isLoading!: boolean
  @observable isLoadingStackinPland!: boolean
  @observable tableData!: PagedResultDto<any>
  @observable floors!: any
  @observable units!: any
  @observable editProject!: any
  @observable editFloor!: any
  @observable editProjectUnit!: any
  @observable transportations: any = []
  @observable projectOptions: any = []

  @observable listAllProject: any = []

  @observable listProjectUserPermission!: PagedResultDto<any>

  constructor() {
    this.tableData = { items: [], totalCount: 0 }
    this.listAllProject = []
  }

  @action
  async createFloor(body: any) {
    this.isLoading = true
    await projectService
      .createFloor(body)
      .finally(() => (this.isLoading = false))
  }

  @action
  async createUnit(body: any) {
    this.isLoading = true
    await unitService.create(body).finally(() => (this.isLoading = false))
  }

  @action
  async createProject() {
    this.editProject = {
      name: "",
      isActive: true,
      projectAddress: {},
    }
  }

  @action
  async createProjectUnit() {
    this.editProjectUnit = {
      name: "",
      isActive: true,
    }
  }
  @action
  async CreateOrUpdate(updateInput: any) {
    this.isLoading = true
    const body = {
      ...updateInput,
      projectAddress: Array.isArray(updateInput.projectAddress)
        ? updateInput.projectAddress
        : [updateInput.projectAddress],
    }
    this.editProject = await projectService
      .CreateOrUpdate(body)
      .finally(() => (this.isLoading = false))
  }
  // @action
  // async update(updateInput: any) {
  //   this.isLoading = true;
  //   const body = {
  //     ...updateInput,
  //     projectAddress: Array.isArray(updateInput.projectAddress)
  //       ? updateInput.projectAddress
  //       : [updateInput.projectAddress],
  //   };
  //   await projectService.CreateOrUpdate(body).finally(() => (this.isLoading = false));
  // }

  @action
  async updateFloor(body: any) {
    this.isLoading = true
    await projectService
      .updateFloor(body)
      .finally(() => (this.isLoading = false))
  }

  @action
  async updateUnit(body: any) {
    this.isLoading = true
    await unitService.update(body).finally(() => (this.isLoading = false))
  }

  @action
  async updateProjectAddress(projectId, body: any) {
    this.isLoading = true
    await projectService
      .updateProjectAddress(projectId, body)
      .finally(() => (this.isLoading = false))
  }

  @action
  async delete(id: number) {
    await projectService.delete(id)
    this.tableData.items = this.tableData.items.filter((x) => x.id !== id)
  }

  @action
  async activateOrDeactivate(id: number, isActive) {
    await projectService.activateOrDeactivate(id, isActive)
  }
  @action
  async activateOrDeactivateFloor(id: number, isActive) {
    await projectService.activateOrDeactivateFloor(id, isActive)
  }

  @action
  async get(id: number) {
    this.isLoading = true
    this.editProject = await projectService
      .get(id)
      .finally(() => (this.isLoading = false))
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    this.tableData = await projectService
      .getAll(params)
      .finally(() => (this.isLoading = false))
  }
  @action
  async loadingStackingPland() {
    this.isLoadingStackinPland = !this.isLoadingStackinPland
  }
  @action
  async getFloors(projectId, params: any) {
    this.isLoading = true
    this.floors = await projectService
      .getFloors(projectId, params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async getUnits(projectId, params: any) {
    this.isLoading = true
    this.units = await projectService
      .getUnits(projectId, params)
      .finally(() => (this.isLoading = false))
  }
  @action
  async getSimpleProject() {
    this.isLoading = true
    const res = await projectService
      .getSimpleProject()
      .finally(() => (this.isLoading = false))
    this.listAllProject = res.map((item) => {
      return { id: item.id, name: item.projectCode }
    })
  }
  @action
  async filterOptions(params: any) {
    params.maxResultCount = 1000
    params.isActive = true
    params.sorting = "Name ASC"
    const result = await projectService.filterOptions(params)
    this.projectOptions = result
  }

  //permission
  @action
  async createOrUpdateProjectUser(updateInput: any) {
    this.isLoading = true

    await projectService
      .createOrUpdateProjectUser(updateInput)
      .finally(() => (this.isLoading = false))
  }

  @action
  async getListProjectUserPermission(params: any) {
    this.isLoading = true
    this.listProjectUserPermission = await projectService
      .getListProjectUserPermission(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async deleteUserPermission(id: number) {
    await projectService.deleteUserPermission(id)
    this.listProjectUserPermission.items =
      this.listProjectUserPermission.items.filter((x) => x.id !== id)
  }

  @action
  async updatePermission(parmas) {
    await projectService.updatePermission(parmas)
  }
}

export default ProjectStore
