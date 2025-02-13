import type { PagedResultDto } from "../../dto/pagedResultDto"
import http from "../../httpService"
import { notifyError, notifySuccess } from "@lib/helper"
import { L, LNotification } from "@lib/abpUtility"

class TenantService {
  public async CreateOrUpdate(body: any) {
    const result = await http.post(
      "api/services/app/UserTenant/CreateOrUpdate",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async get(id: number): Promise<any> {
    if (!id) {
      notifyError(L("Error"), L("EntityNotFound"))
    }

    const result = await http.get("api/services/app/UserTenant/Get", {
      params: { id },
    })

    return result.data.result
  }

  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/UserTenant/GetAll", { params })
    const { result } = res.data
    return result
  }

  //unit tenant
  public async getAllunitTenant(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/UserTenant/GetAllUnitTenant", {
      params,
    })
    const { result } = res.data
    return result
  }
  public async moveTenantInUnit(body: any) {
    const result = await http.post(
      "api/services/app/UserTenant/MoveTenantInUnit",
      body
    )
    notifySuccess(
      LNotification("MOVE_IN"),
      LNotification("MOVE_IN_SUCCESSFULLY")
    )
    return result.data.result
  }
  public async moveTenantOutUnit(body: any) {
    const result = await http.post(
      "/api/services/app/UserTenant/MoveOutTenantInUnit",
      body
    )
    notifySuccess(
      LNotification("MOVE_OUT"),
      LNotification("MOVE_OUT_SUCCESSFULLY")
    )
    return result.data.result
  }
  public async activateOrDeactivate(id: number, isActive) {
    const result = await http.post(
      "api/services/app/UserTenant/Active",
      { id },
      { params: { isActive } }
    )
    return result.data
  }
}

export default new TenantService()
