import { PagedResultDto } from "@services/dto/pagedResultDto"
import http from "../httpService"
import { notifyError, notifySuccess } from "@lib/helper"
import { L, LNotification } from "@lib/abpUtility"
import { RowRequirementModel } from "@models/project/requirementModel"

class RequirementService {
  public async create(body: any) {
    const result = await http.post("api/Request/Create", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async update(body: any) {
    const result = await http.post(`/api/Request/Update/${body.id}`, body)
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

    const result = await http.get(`api/Request/GetDetails/${id}`)

    return result.data.result
  }

  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.post("api/Request/GetListRequest", params)
    const { result } = res.data
    result.items = RowRequirementModel.assigns(result.items)

    return result
  }
}

export default new RequirementService()
