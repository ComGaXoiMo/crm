import type { PagedResultDto } from "../dto/pagedResultDto"
import http from "../httpService"
import { TruckBrandModel } from "../../models/master-data/truckBrandModel"
import { downloadFile } from "@lib/helperFile"
import { notifyError, notifySuccess } from "@lib/helper"
import { L, LNotification } from "@lib/abpUtility"

class TruckBrandService {
  public async create(body: any) {
    const res = await http.post("api/services/app/TruckBrands/Create", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification(L("SAVE_SUCCESSFULLY"))
    )
    return TruckBrandModel.assign(res.data.result)
  }

  public async filter(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/TruckBrands/GetAll", {
      params,
    })
    const result = res.data.result
    result.items = TruckBrandModel.assigns(result.items || [])
    return result
  }

  public async getAll(params: any): Promise<TruckBrandModel[]> {
    const res = await http.get("api/services/app/TruckBrands/GetLists", {
      params,
    })
    const result = res.data.result
    result.items = TruckBrandModel.assigns(result.items || [])
    return result
  }

  public async update(body: any) {
    const res = await http.put("api/services/app/TruckBrands/Update", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification(L("SAVE_SUCCESSFULLY"))
    )
    return TruckBrandModel.assign(res.data.result)
  }

  public async updateSortList(body: any) {
    const res = await http.post("api/services/app/TruckBrands/SortList", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return TruckBrandModel.assign(res.data.result)
  }

  public async getById(id): Promise<any> {
    if (!id) {
      notifyError(L("ERROR"), L("ENTITY_NOT_FOUND"))
    }
    const result = await http.get("api/services/app/TruckBrands/Get", {
      params: { id },
    })
    return TruckBrandModel.assign(result.data.result)
  }

  public async activateOrDeactivate(ids: number[], isActive) {
    const response = await http.post(
      "api/services/app/TruckBrands/MultiActives",
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
    const response = await http.delete("api/services/app/TruckBrands/Delete", {
      params: { id, isActive },
    })
    return response.data
  }

  public async downloadTemplateImport() {
    const response = await http.get(
      "api/Imports/TruckBrands​/GetTemplateImport",
      { responseType: "blob" }
    )
    downloadFile(response.data, "import-truckBrand-template.xlsx")
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
      "api/Imports/TruckBrands​/ImportFromExcel",
      formData,
      config
    )
    return response.data
  }

  public async exportTruckBrand(params: any): Promise<any> {
    const res = await http.get("/api/Export/ExportTruckBrand", {
      params,
      responseType: "blob",
    })
    downloadFile(res.data, "truckBrand.xlsx")
  }
}

export default new TruckBrandService()
