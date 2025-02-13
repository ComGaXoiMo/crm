import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import http from "../httpService"
import { L, LNotification } from "../../lib/abpUtility"
import { notifyError, notifySuccess } from "../../lib/helper"
import moment from "moment-timezone"
import { RowTargetModel } from "@models/campaign/targetModel"

class TargetService {
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
      result.data.result.birthDate = moment(result.data.result.birthDate)
    }
    return result.data.result
  }

  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.post("api/TargetList/Filters", params)
    const { result } = res.data
    result.items = RowTargetModel.assigns(result.items)
    return result
  }
}

export default new TargetService()
