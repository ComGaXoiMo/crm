import type { PagedResultDto } from "../../dto/pagedResultDto"
import http from "../../httpService"
import { L, LNotification } from "../../../lib/abpUtility"
import { notifyError, notifySuccess } from "../../../lib/helper"
import dayjs from "dayjs"
import { AppConfiguration, moduleIds } from "../../../lib/appconst"
import { UserOption } from "@models/user/IUserModel"

class PartnerService {
  public async create(body: any) {
    if (body.birthDate) {
      body.birthDate = dayjs(body.birthDate).toISOString()
    }
    const res = await http.post(
      "/api/services/app/Partners/CreatePartnerFull",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    if (res.data.result && res.data.result.birthDate) {
      res.data.result.birthDate = dayjs(res.data.result.birthDate)
    }
    return res.data.result
  }

  public async update(body: any) {
    if (body.birthDate) {
      body.birthDate = dayjs(body.birthDate).format("YYYY/MM/DD")
    }

    const res = await http.put("api/services/app/Partners/Update", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return res.data.result
  }

  public async delete(id: number) {
    const res = await http.delete("api/services/app/Partners/Delete", {
      params: { id },
    })
    return res.data
  }

  public async activateOrDeactivate(id: number, isActive) {
    const res = await http.post(
      "api/services/app/Partners/Active",
      { id },
      { params: { isActive } }
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("UPDATE_SUCCESSFULLY")
    )
    return res.data
  }

  public async get(id: number): Promise<any> {
    if (!id) {
      notifyError(L("ERROR"), L("ENTITY_NOT_FOUND"))
    }

    const res = await http.get("api/services/app/Partners/Get", {
      params: { id },
    })
    if (res.data.result && res.data.result.birthDate) {
      res.data.result.birthDate = dayjs(res.data.result.birthDate)
    }
    return res.data.result
  }

  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/Partners/GetAll", { params })
    const result = res.data.result
    if (result.items) {
      ;(result.items || []).forEach((item) => {
        item.profilePictureUrl = item.profilePictureId
          ? `${AppConfiguration.remoteServiceBaseUrl}api/services/app/Profile/GetProfilePictureById?profilePictureId=${item.profilePictureId}`
          : null
      })
    }

    return res.data.result
  }

  public async filterOptions(params: any): Promise<any> {
    const res = await http.get("api/services/app/Partners/GetAll", { params })
    return (res.data?.result?.items || []).forEach((item) => ({
      id: item.id,
      value: item.id,
      label: item.displayName,
      displayName: item.displayName,
      emailAddress: item.emailAddress,
    }))
  }

  public async filterWfAssigner(params: any): Promise<any> {
    params.isActive = true

    let res
    switch (params.moduleId) {
      case moduleIds.feedback: {
        res = await http.get("/api/services/app/Feedback/GetAssignUser", {
          params,
        })
        break
      }
      default: {
        res = await http.get("api/services/app/WorkOrder/GetAssignUser", {
          params,
        })
      }
    }

    return UserOption.assigns(res.data?.result?.items || [])
  }

  public async filterWfWatcher(params: any): Promise<any> {
    params.isActive = true

    let res
    switch (params.moduleId) {
      case moduleIds.feedback: {
        res = await http.get("/api/services/app/Feedback/GetAssignUser", {
          params,
        })
        break
      }
      default: {
        res = await http.get("api/services/app/WorkOrder/GetAssignUser", {
          params,
        })
      }
    }

    return UserOption.assigns(res.data?.result?.items || [])
  }

  public async getProjectRoles(params: any): Promise<any> {
    const res = await http.get("api/services/app/Partners/GetProjectRoles", {
      params,
    })
    return res.data.result
  }

  public async setProjectRole(body: any) {
    const res = await http.post(
      "api/services/app/Partners/SetProjectRoles",
      body
    )
    return res.data.result
  }
  public async getStaticInformation() {
    const res = await http.get("api/services/app/Partners/GetDashboard")
    return res.data.result
  }

  public async getWarning() {
    const res = await http.get("api/services/app/Customers/GetWarning")
    return res.data.result
  }
}

export default new PartnerService()
