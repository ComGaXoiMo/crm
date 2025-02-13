import type { PagedResultDto } from "../dto/pagedResultDto"
import http from "../httpService"
import { TransportationCostModel } from "../../models/master-data/transportationCostModel"
import { notifyError, notifySuccess } from "@lib/helper"
import { L, LNotification } from "@lib/abpUtility"
import { downloadFile } from "@lib/helperFile"

class TransportationCostService {
  public async create(body: any) {
    const res = await http.post("api/services/app/Transportation/Create", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification(L("SAVE_SUCCESSFULLY"))
    )
    return TransportationCostModel.assign(res.data.result)
  }

  public async filter(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/Transportation/GetAll", {
      params,
    })
    const result = res.data.result
    result.items = TransportationCostModel.assigns(result.items || [])
    return result
  }

  public async update(body: any) {
    const res = await http.put("api/services/app/Transportation/Update", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification(L("SAVE_SUCCESSFULLY"))
    )
    return TransportationCostModel.assign(res.data.result)
  }

  public async getById(id): Promise<any> {
    if (!id) {
      notifyError(L("ERROR"), L("ENTITY_NOT_FOUND"))
    }
    const result = await http.get("/api/services/app/Transportation/Get", {
      params: { id },
    })
    return TransportationCostModel.assign(result.data.result)
  }

  public async activateOrDeactivate(ids: number, isActive) {
    const response = await http.post(
      "api/services/app/Transportation/MultiActives",
      ids,
      { params: { isActive } }
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return response.data
  }

  public async delete(id: number, isActive) {
    const response = await http.delete(
      "api/services/app/Transportation/Delete",
      {
        params: { isActive },
      }
    )
    return response.data
  }

  public async downloadTemplateImport() {
    const response = await http.get("api/Imports/Transportation/GetTemplate", {
      responseType: "blob",
    })
    downloadFile(response.data, "import-transportation-template.xlsx")
  }

  public async importByTemplateImport(file) {
    const formData = new FormData()
    formData.append("file", file)
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    }
    const response = await http.post(
      "api/Imports/Transportation/ImportFromExcel",
      formData,
      config
    )
    return response.data
  }

  public async exportTransportationCost(params: any): Promise<any> {
    const res = await http.get("api/Export/ExportTransportation", {
      params,
      responseType: "blob",
    })
    downloadFile(res.data, "transportation.xlsx")
  }
}

export default new TransportationCostService()
