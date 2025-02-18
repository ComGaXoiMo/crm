import { action, makeAutoObservable, observable } from "mobx"

import type { CreateRoleInput } from "../../services/administrator/role/dto/createRoleInput"
import { EntityDto } from "../../services/dto/entityDto"
import { GetAllPermissionsOutput } from "../../services/administrator/role/dto/getAllPermissionsOutput"
import { GetAllRoleOutput } from "../../services/administrator/role/dto/getAllRoleOutput"
import type { GetRoleAsyncInput } from "../../services/administrator/role/dto/getRolesAsyncInput"
import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import type { PagedRoleResultRequestDto } from "../../services/administrator/role/dto/PagedRoleResultRequestDto"
import RoleEditModel from "../../models/roles/roleEditModel"
import type { UpdateRoleInput } from "../../services/administrator/role/dto/updateRoleInput"
import roleService from "../../services/administrator/role/roleService"

class RoleStore {
  @observable isLoading!: boolean
  @observable roles!: PagedResultDto<GetAllRoleOutput>
  @observable roleEdit: RoleEditModel = new RoleEditModel()
  @observable allPermissions: GetAllPermissionsOutput[] = []
  @observable allRoles: any[] = []
  constructor() {
    makeAutoObservable(this)
  }
  @action
  async create(createRoleInput: CreateRoleInput) {
    await roleService.create(createRoleInput)
  }

  @action
  async createRole() {
    this.roleEdit = {
      grantedPermissionNames: [],
      role: {
        name: "",
        displayName: "",
        description: "",
        id: 0,
      },
      permissions: [{ name: "", displayName: "", description: "" }],
    }
  }

  @action
  async getRolesAsync(getRoleAsyncInput: GetRoleAsyncInput) {
    await roleService.getRolesAsync(getRoleAsyncInput)
  }

  @action
  async update(updateRoleInput: UpdateRoleInput) {
    await roleService.update(updateRoleInput)
    this.roles.items
      .filter((x: GetAllRoleOutput) => x.id === updateRoleInput.id)
      .map((x: GetAllRoleOutput) => {
        return (x = updateRoleInput)
      })
  }

  @action
  async delete(entityDto: EntityDto) {
    await roleService.delete(entityDto)
    this.roles.items = this.roles.items.filter(
      (x: GetAllRoleOutput) => x.id !== entityDto.id
    )
  }

  @action
  async getAllPermissions() {
    const result = await roleService.getAllPermissions()
    this.allPermissions = result
  }

  @action
  async getRoleForEdit(id) {
    const result = await roleService.getRoleForEdit(id)
    this.roleEdit.grantedPermissionNames = result.grantedPermissionNames
    this.roleEdit.permissions = result.permissions
    this.roleEdit.role = result.role
  }

  @action
  async get(entityDto: EntityDto) {
    const result = await roleService.get(entityDto)
    this.roles = result.data.result
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedRoleResultRequestDto) {
    this.isLoading = true
    const result = await roleService
      .getAll(pagedFilterAndSortedRequest)
      .finally(() => (this.isLoading = false))
    this.roles = result
  }

  @action
  async getAllRoles() {
    const result = await roleService.getAll({
      keyword: "",
      skipCount: 0,
      maxResultCount: 1000,
    })
    this.allRoles = (result.items || []).map((item) => ({
      ...item,
      value: item.id,
      label: item.displayName,
      group: item.displayName.charAt(0),
    }))
    return this.allRoles
  }
}

export default RoleStore
