import type { PagedResultDto } from "../dto/pagedResultDto"
import http from "../httpService"
import { ProductTypeModel } from "../../models/master-data/productTypeModel"
import { notifyError, notifySuccess } from "@lib/helper"
import { L, LNotification } from "@lib/abpUtility"
import { downloadFile } from "@lib/helperFile"

class ProductTypeService {
  public async create(body: any) {
    const res = await http.post("/api/services/app/Products/Create", body)
    return ProductTypeModel.assign(res.data.result)
  }

  public async filter(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("/api/services/app/Products/GetAll", { params })
    const result = res.data.result
    result.items = ProductTypeModel.assigns(result.items || [])
    return result
  }

  public async getAll(params: any): Promise<ProductTypeModel[]> {
    const res = await http.get("/api/services/app/Products/GetLists", {
      params,
    })
    const result = res.data.result
    return ProductTypeModel.assigns(result || [])
  }

  public async update(body: any) {
    const res = await http.put("/api/services/app/Products/Update", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification(L("SAVE_SUCCESSFULLY"))
    )
    return ProductTypeModel.assign(res.data.result)
  }

  public async updateSortList(body: any) {
    const res = await http.post("/api/services/app/Products/SortList", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return ProductTypeModel.assign(res.data.result)
  }

  public async getById(id): Promise<any> {
    if (!id) {
      notifyError(L("ERROR"), L("ENTITY_NOT_FOUND"))
    }
    const result = await http.get("/api/services/app/Products/Get", {
      params: { id },
    })
    return ProductTypeModel.assign(result.data.result)
  }

  public async activateOrDeactivate(ids: number, isActive) {
    const response = await http.post(
      "/api/services/app/Products/MultiActives",
      ids,
      { params: { isActive } }
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return response.data
  }

  public async delete(id: number) {
    const response = await http.delete("/api/services/app/Products/Delete", {
      params: { id },
    })
    return response.data
  }

  public async downloadTemplateImport() {
    const response = await http.get("/api/Imports/Products/GetTemplateImport", {
      responseType: "blob",
    })
    downloadFile(response.data, "import-project-type-template.xlsx")
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
      "api/Imports/Products/ImportFromExcel",
      formData,
      config
    )
    return response.data
  }

  public async exportProductType(params: any): Promise<any> {
    const res = await http.get("api/Export/ExportProductType", {
      params,
      responseType: "blob",
    })
    downloadFile(res.data, "product-type.xlsx")
  }
}

export default new ProductTypeService()
