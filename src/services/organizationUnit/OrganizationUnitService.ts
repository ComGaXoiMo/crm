import http from "@services/httpService"
import { notifySuccess } from "@lib/helper"
import { LNotification } from "@lib/abpUtility"
// import { PagedResultDto } from "@services/dto/pagedResultDto";
import { RowOUModel } from "@models/organizationUnit/OUModel"

class OrganizationUnitService {
  public async getAll(params: any): Promise<any[]> {
    const res = await http.get(
      "/api/services/app/OrganizationUnit/GetOrganizationUnits",
      { params }
    )
    const { result } = res.data
    result.items = RowOUModel.assigns(result.items)

    return result
  }
  public async createOU(body: any) {
    const result = await http.post(
      "/api/services/app/OrganizationUnit/CreateOrganizationUnit",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async deteleOU(id) {
    const result = await http.delete(
      "/api/services/app/OrganizationUnit/DeleteOrganizationUnit",
      id
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async getOUUsers(filter): Promise<any> {
    const result = await http.get(
      "/api/services/app/OrganizationUnit/GetOrganizationUnitUsers",
      {
        params: filter,
      }
    )

    return RowOUModel.assign(result.data.result)
  }

  //USER
  public async addUsersToOrganizationUnit(body: any) {
    const result = await http.post(
      "/api/services/app/OrganizationUnit/AddUsersToOrganizationUnit",
      body
    )

    return result.data.result
  }

  public async findUsers(body: any) {
    const result = await http.post(
      "/api/services/app/OrganizationUnit/FindUsers",
      body
    )
    return result.data.result
  }

  public async deleteOU(id: any) {
    const result = await http.delete(
      "/api/services/app/OrganizationUnit/DeleteOrganizationUnit",
      {
        params: { id },
      }
    )
    return result.data.result
  }

  public async RemoveUserFromOrganizationUnit(body) {
    const result = await http.delete(
      "/api/services/app/OrganizationUnit/RemoveUserFromOrganizationUnit",
      {
        params: body,
      }
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("DELETE_SUCCESSFULLY")
    )
    return result.data.result
  }
}

export default new OrganizationUnitService()
