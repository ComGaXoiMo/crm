import { action, makeAutoObservable, observable } from "mobx"

import type { CreateOrUpdateUserInput } from "../../services/administrator/user/dto/createOrUpdateUserInput"
import { EntityDto } from "../../services/dto/entityDto"
import { GetRoles } from "../../services/administrator/user/dto/getRolesOuput"
import { GetUserOutput } from "../../services/administrator/user/dto/getUserOutput"
import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import type { PagedUserResultRequestDto } from "../../services/administrator/user/dto/PagedUserResultRequestDto"
import type { UpdateUserInput } from "../../services/administrator/user/dto/updateUserInput"
import userService from "../../services/administrator/user/userService"
import { compressImage } from "../../lib/helper"
import { defaultAvatar } from "../../lib/appconst"
import { GetTeams } from "@services/administrator/user/dto/getTeamsOutput"

class UserStore {
  @observable isLoading!: boolean
  @observable users!: PagedResultDto<GetUserOutput>
  @observable editUser!: CreateOrUpdateUserInput
  @observable roles: GetRoles[] = []
  @observable teams: GetTeams[] = []
  @observable editUserProfilePicture!: string

  constructor() {
    makeAutoObservable(this)

    this.editUserProfilePicture = defaultAvatar
  }

  @action
  async create(createUserInput: CreateOrUpdateUserInput) {
    this.isLoading = true
    const result = await userService
      .create(createUserInput)
      .finally(() => (this.isLoading = false))
    this.users.items.push(result)
  }

  @action
  async update(updateUserInput: UpdateUserInput) {
    this.isLoading = true
    const result = await userService
      .update(updateUserInput)
      .finally(() => (this.isLoading = false))
    this.users.items = this.users.items.map((x: GetUserOutput) => {
      if (x.id === updateUserInput.id) x = result
      return x
    })
  }

  @action
  async delete(entityDto: EntityDto) {
    await userService.delete(entityDto)
    this.users.items = this.users.items.filter(
      (x: GetUserOutput) => x.id !== entityDto.id
    )
  }
  @action
  async activateOrDeactivate(id: number, isActive) {
    await userService.activateOrDeactivate(id, isActive)
  }
  @action
  async getRoles() {
    this.isLoading = true
    const result = await userService
      .getRoles()
      .finally(() => (this.isLoading = false))
    this.roles = result
  }
  @action
  async getTeam(params) {
    const result = await userService.getTeam(params)
    this.teams = result
  }
  @action
  async get(entityDto: EntityDto) {
    this.isLoading = true
    const result = await userService
      .get(entityDto)
      .finally(() => (this.isLoading = false))
    this.editUser = result
  }
  @action
  async sendRequestPassword(id) {
    this.isLoading = true
    await userService
      .sendRequestPassword(id)
      .finally(() => (this.isLoading = false))
  }
  @action
  async createUser() {
    this.editUser = {
      userName: "",
      name: "",
      surname: "",
      emailAddress: "",
      isActive: true,
      roleNames: [],
      password: "",
      userOrganizationUnit: [],
      id: 0,
      projectUser: [],
    }

    // this.roles = [];
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    this.isLoading = true
    const result = await userService
      .getAll(pagedFilterAndSortedRequest)
      .finally(() => (this.isLoading = false))
    this.users = result
  }

  async changeLanguage(languageName: string) {
    await userService.changeLanguage({ languageName: languageName })
  }

  @action
  async getProfilePicture(profilePictureId) {
    const result = await userService.getProfilePictureById(profilePictureId)
    this.editUserProfilePicture = result || defaultAvatar
  }

  @action
  async uploadProfilePicture(file) {
    const compressedImage = await compressImage(file, 1024)
    const result = await userService.uploadProfilePicture(compressedImage)
    return result
  }

  @action
  async updateProfilePicture(data) {
    const profilePictureId = await userService.updateProfilePicture(data)
    await this.getProfilePicture(profilePictureId)
  }
}

export default UserStore
