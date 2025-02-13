import { L, LNotification } from "@lib/abpUtility"
import { notifyError, notifySuccess } from "@lib/helper"
import { PagedResultDto } from "@services/dto/pagedResultDto"
import http from "../httpService"
import {
  ActivityModel,
  InquiryDetailModel,
  InquirySimpleModel,
} from "@models/inquiry/inquiryModel"

class InquiryService {
  public async getCategories() {
    const res = await http.get(`api/Category/GetInquiryCategory`)
    return res.data.result
  }
  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/Inquiry/GetAll", { params })
    const { result } = res.data
    return result
  }
  public async getInquiryStatus(): Promise<any> {
    const res = await http.get(
      "api/services/app/Category/GetListInquiryCategory"
    )
    const result = res.data.result || []
    return result
  }
  public async createOrUpdate(body: any) {
    const res = await http.post("api/services/app/Inquiry/CreateOrUpdate", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return res.data.result
  }
  public async UpdateComplete(id: any) {
    const result = await http.put(
      "api/services/app/Inquiry/UpdateComplete",
      {},
      {
        params: { id },
      }
    )
    return result
  }
  public async UpdateDrop(params) {
    const result = await http.put(
      "api/services/app/Inquiry/UpdateDrop",
      {},
      { params: params }
    )
    return result
  }

  // public async delete(id: number) {
  //   let res = await http.delete('api/services/app/Employees/Delete', { params: { id } })
  //   return res.data
  // }

  // public async activateOrDeactivate(id: number, isActive) {
  //   let res = await http.post('api/services/app/Employees/Active', { id }, { params: { isActive } })
  //   notifySuccess(LNotification('SUCCESS'), LNotification('UPDATE_SUCCESSFULLY'))
  //   return res.data
  // }

  public async get(id: number): Promise<any> {
    if (!id) {
      notifyError(L("ERROR"), L("ENTITY_NOT_FOUND"))
    }
    const res = await http.get("api/services/app/Inquiry/Get", {
      params: { id },
    })
    return InquiryDetailModel.assign(res.data.result)
  }
  public async activateOrDeactivate(id: number, isActive) {
    const result = await http.post(
      "api/services/app/Inquiry/Active",
      { id },
      { params: { isActive } }
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification(L("CHANGE_STATUS_SUCCESSFULLY"))
    )
    return result.data
  }

  public async getAuditLogs(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/Inquiry/GetAuditLogs", {
      params,
    })
    const { result } = res.data
    return result
  }

  public async getMatchingListing(inquiryId: any): Promise<any> {
    const res = await http.get("api/services/app/Listing/GetMatchingListing", {
      params: { inquiryId },
    })
    return res.data.result
  }
  // public async getMatchingInquiry(listingId: number): Promise<any> {
  //   let res = await http.get("api/services/app/Inquiry/GetMatchingInquiry", {
  //     params: { listingId },
  //   });
  //   return res.data.result;
  // }
  public async getMatchingInquiry(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/Inquiry/GetMatchingInquiry", {
      params,
    })
    const { result } = res.data
    return result
  }

  public async getSimpleInquiry(params: any) {
    const result = await http.get(
      "api/services/app/Inquiry/GetListInquiryForLA",
      { params }
    )
    return InquirySimpleModel.assigns(result.data?.result.items || [])
  }

  public async getDueDate(params: any): Promise<any> {
    const res = await http.get("/api/services/app/Inquiry/GetDueDate", {
      params,
    })
    const { result } = res.data

    return result
  }

  public async getAllActivity(params: any): Promise<any> {
    const res = await http.get("api/services/app/Inquiry/GetActivity", {
      params,
    })
    const { result } = res.data
    result.items = ActivityModel.assigns(result?.items)
    return result
  }
}

export default new InquiryService()
