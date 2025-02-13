import type { PagedResultDto } from "../dto/pagedResultDto"
import http from "../httpService"
import { notifyError, notifySuccess } from "@lib/helper"
import { L, LNotification } from "@lib/abpUtility"
import dayjs from "dayjs"

class MeetingService {
  public async create(body: any) {
    const result = await http.post("api/services/app/Residents/Create", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async update(body: any) {
    const result = await http.post("api/services/app/Residents/Update", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async delete(id: number) {
    const result = await http.delete("api/services/app/Residents/Delete", {
      params: { id },
    })
    return result.data
  }

  public async activateOrDeactivate(id: number, isActive) {
    const result = await http.post(
      "api/services/app/Residents/Active",
      { id },
      { params: { isActive } }
    )
    return result.data
  }

  public async get(id: number): Promise<any> {
    if (!id) {
      notifyError(L("Error"), L("EntityNotFound"))
    }

    const result = await http.get("api/services/app/Residents/Get", {
      params: { id },
    })
    if (result.data.result && result.data.result.birthDate) {
      result.data.result.birthDate = dayjs(result.data.result.birthDate)
    }
    return result.data.result
  }

  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/Residents/GetAll", { params })
    const { result } = res.data
    ;(result.items || []).forEach((item) => {
      ;(item.units || []).forEach((unit) => {
        unit.fullUnitCode = unit.unit?.fullUnitCode
        unit.projectName = unit.unit?.project?.name
      })
    })
    return result
  }
}

export default new MeetingService()
