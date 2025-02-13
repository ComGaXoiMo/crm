import { PagedResultDto } from "@services/dto/pagedResultDto"
import http from "../httpService"
import { notifyError, notifySuccess } from "@lib/helper"
import { L, LNotification } from "@lib/abpUtility"
import {
  RowCompanyModel,
  CompanyDetailModel,
} from "@models/clientManagement/companyModel"
import { downloadFile } from "@lib/helperFile"

class CompanyService {
  public async createOrUpdate(body: any) {
    const result = await http.post(
      "api/services/app/Company/CreateOrUpdate",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async update(body: any) {
    const result = await http.post(
      "api/services/app/Company/CreateOrUpdate",
      body
    )
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
      "api/services/app/Company/Active",
      { id },
      { params: { isActive } }
    )
    return result.data
  }

  public async get(id: number): Promise<any> {
    if (!id) {
      notifyError(L("Error"), L("EntityNotFound"))
    }

    const res = await http.get(`api/services/app/Company/Get?id=${id}`)
    const { result } = res.data

    return CompanyDetailModel.assign(result)
  }
  public async getCompany(id: number): Promise<any> {
    if (!id) {
      notifyError(L("Error"), L("EntityNotFound"))
    }

    const res = await http.get(`api/services/app/Company/Get?id=${id}`)
    const { result } = res.data

    return result
  }
  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/Company/GetAll", { params })
    const { result } = res.data
    result.items = RowCompanyModel.assigns(result.items)

    return result
  }

  public async filterOptions(params: any): Promise<any> {
    params.pageNumber = 1
    params.pageSize = 20
    const res = await http.get("api/services/app/Company/GetAll", { params })
    const { result } = res.data
    result.items = RowCompanyModel.assigns(result.items)

    return result.items
  }
  public async exportExcel(params: any): Promise<any> {
    const res = await http.get("api/Export/ExportCompany", {
      params,
      responseType: "blob",
    })
    downloadFile(res.data, "company.xlsx")
  }
  public async getAuditLogs(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/Company/GetAuditLogs", {
      params,
    })
    const { result } = res.data
    return result
  }
}

export default new CompanyService()
