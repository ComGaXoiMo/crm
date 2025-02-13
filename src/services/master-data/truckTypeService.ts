import { downloadFile } from "@lib/helperFile"
import http from "../httpService"
import { TruckTypeModel } from "@models/master-data/truckTypeModel"
import type { PagedResultDto } from "@services/dto/pagedResultDto"
import { notifyError, notifySuccess } from "@lib/helper"
import { L, LNotification } from "@lib/abpUtility"

class TruckTypeService {
  public async create(body: any) {
    const res = await http.post("api/services/app/TruckTypes/Create", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification(L("SAVE_SUCCESSFULLY"))
    )
    return TruckTypeModel.assign(res.data.result)
  }

  public async filter(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/TruckTypes/GetAll", { params })
    const result = res.data.result
    result.items = TruckTypeModel.assigns(result.items || [])
    return result
  }

  public async getAll(params: any): Promise<TruckTypeModel[]> {
    const res = await http.get("api/services/app/TruckTypes/GetLists", {
      params,
    })
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification(L("SAVE_SUCCESSFULLY"))
    )
    const result = res.data.result
    result.items = TruckTypeModel.assigns(result.items || [])
    return result
  }

  public async update(body: any) {
    const res = await http.put("api/services/app/TruckTypes/Update", body)
    return TruckTypeModel.assign(res.data.result)
  }

  public async updateSortList(body: any) {
    const res = await http.post("api/services/app/TruckTypes/SortList", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return TruckTypeModel.assign(res.data.result)
  }

  public async getById(id): Promise<any> {
    if (!id) {
      notifyError(L("ERROR"), L("ENTITY_NOT_FOUND"))
    }
    const result = await http.get("api/services/app/TruckTypes/Get", {
      params: { id },
    })
    return TruckTypeModel.assign(result.data.result)
  }

  public async activateOrDeactivate(ids: number, isActive) {
    const response = await http.post(
      "api/services/app/TruckTypes/MultiActives",
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
    const response = await http.delete("api/services/app/TruckTypes/Delete", {
      params: { id, isActive },
    })
    return response.data
  }

  public async downloadTemplateImport() {
    const response = await http.get(
      "api/Imports/TruckTypes/GetTemplateImport",
      { responseType: "blob" }
    )
    downloadFile(response.data, "import-truck-type-template.xlsx")
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
      "api/Imports/TruckTypes/ImportFromExcel",
      formData,
      config
    )
    return response.data
  }

  public async exportTruckType(params: any): Promise<any> {
    const res = await http.get("/api/Export/ExportTruckType", {
      params,
      responseType: "blob",
    })
    downloadFile(res.data, "truckBrand.xlsx")
  }
}

export default new TruckTypeService()
