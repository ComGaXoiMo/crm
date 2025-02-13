import { ChangeLanguagaInput } from "./dto/changeLanguageInput"
import { CreateOrUpdateUserInput } from "./dto/createOrUpdateUserInput"
import { EntityDto } from "../../dto/entityDto"
import { GetAllUserOutput } from "./dto/getAllUserOutput"
import type { PagedResultDto } from "../../dto/pagedResultDto"
import { PagedUserResultRequestDto } from "./dto/PagedUserResultRequestDto"
import { UpdateUserInput } from "./dto/updateUserInput"
import orderBy from "lodash/orderBy"
import http from "../../httpService"
import { notifySuccess } from "@lib/helper"
import { L, LNotification } from "@lib/abpUtility"
import { UserBalanceModel } from "@models/user/IUserModel"
import { OptionModel } from "@models/global"

class UserService {
  public async create(createUserInput: CreateOrUpdateUserInput) {
    const result = await http.post(
      "api/services/app/Employees/Create",
      createUserInput
    )

    notifySuccess(
      LNotification("SUCCESS"),
      LNotification(L("SAVE_SUCCESSFULLY"))
    )
    return result.data.result
  }

  public async update(updateUserInput: UpdateUserInput) {
    const result = await http.put(
      "api/services/app/Employees/Update",
      updateUserInput
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification(L("SAVE_SUCCESSFULLY"))
    )
    return result.data.result
  }

  public async delete(entityDto: EntityDto) {
    const result = await http.delete("api/services/app/Employees/Delete", {
      params: entityDto,
    })
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification(L("DELETE_SUCCESSFULLY"))
    )
    return result.data
  }
  public async activateOrDeactivate(id: number, isActive) {
    const result = await http.post(
      "api/services/app/Employees/Active",
      { id },
      { params: { isActive } }
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification(L("DE_ACTIVE_SUCCESSFULLY"))
    )
    return result.data
  }
  public async getRoles() {
    const result = await http.get("api/services/app/User/GetRoles")
    return orderBy(result.data.result.items || [], "displayName")
  }
  public async getTeam(params: any) {
    const result = await http.get(
      "/api/services/app/OrganizationUnit/GetOrganizationUnits",
      { params }
    )
    return orderBy(result.data.result || [], "displayName")
  }

  public async changeLanguage(changeLanguageInput: ChangeLanguagaInput) {
    const result = await http.post(
      "api/services/app/User/ChangeLanguage",
      changeLanguageInput
    )
    return result.data
  }

  public async sendRequestPassword(id) {
    const result = await http.post(
      "api/services/app/Account/SendResetPassword",
      {
        id: id,
      }
    )
    return result.data.result
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateUserInput> {
    const result = await http.get("api/services/app/Employees/Get", {
      params: entityDto,
    })
    return result.data.result
  }

  public async getUserBalance(params): Promise<UserBalanceModel> {
    const result = await http.get(
      "api/services/app/User/GetUserBalanceAmount",
      {
        params,
      }
    )
    return UserBalanceModel.assign(result.data.result)
  }

  public async getAll(
    pagedFilterAndSortedRequest: PagedUserResultRequestDto
  ): Promise<PagedResultDto<GetAllUserOutput>> {
    const result = await http.get("api/services/app/Employees/GetAll", {
      params: pagedFilterAndSortedRequest,
    })
    return result.data.result
  }

  public async getMyProfilePicture() {
    const result = await http.get("api/services/app/Profile/GetProfilePicture")
    const profilePictureUrl = result.data.result?.profilePicture
      ? `data:image/jpeg;base64,${result.data.result.profilePicture}`
      : undefined
    return profilePictureUrl
  }

  public async getProfilePictureById(profilePictureId) {
    const result = await http.get(
      "api/services/app/Profile/GetProfilePictureById",
      { params: { profilePictureId } }
    )
    const profilePictureUrl = result.data.result?.profilePicture
      ? `data:image/jpeg;base64,${result.data.result.profilePicture}`
      : undefined
    return profilePictureUrl
  }

  public async uploadProfilePicture(file) {
    const data = new FormData()
    data.append("file", file)
    const result = await http.post("api/Profile/UploadProfilePicture", data, {
      headers: {
        "content-type": "multipart/form-data",
      },
    })
    return result.data.result
  }

  public async updateMyProfilePicture(body: any) {
    const result = await http.put(
      "api/services/app/Profile/UpdateMyProfilePicture",
      body
    )
    return result.data.result
  }

  public async updateProfilePicture(body: any) {
    const result = await http.put(
      "api/services/app/Profile/UpdateProfilePicture",
      body
    )
    return result.data.result
  }

  public async updateMyProfile(body: any) {
    const result = await http.put(
      "api/services/app/Profile/UpdateCurrentUserProfile",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification(L("SAVE_SUCCESSFULLY"))
    )
    return result.data.result
  }
  public async changeMyPassword(body: any) {
    const result = await http.post("api/services/app/User/ChangePassword", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification(L("SAVE_SUCCESSFULLY"))
    )
    return result.data.result
  }

  public async filterOptions(params: any): Promise<any> {
    const res = await http.get("api/services/app/User/GetUsers", { params })
    return OptionModel.assigns(res.data?.result?.items || [])
  }
  public async findUsers(params): Promise<any[]> {
    const result = await http.get("api/services/app/Employees/GetAll", {
      params,
    })

    return result.data.result?.items || []
  }
}

export default new UserService()
