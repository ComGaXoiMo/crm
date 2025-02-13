import http from "@services/httpService"
import { notifyError, notifySuccess } from "@lib/helper"
import { L, LNotification } from "@lib/abpUtility"
import { PagedResultDto } from "@services/dto/pagedResultDto"
import { RowContactModel } from "@models/clientManagement/contactModel"
import { ContactDetailModel } from "@models/clientManagement/contactModel"
import { downloadFile } from "@lib/helperFile"

class ContactService {
  public async createOrUpdate(body: any) {
    const result = await http.post(
      "api/services/app/Contact/CreateOrUpdate",
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
      "api/services/app/Contact/Active",
      { id },
      { params: { isActive } }
    )
    return result.data
  }

  public async deleteLAContact(contactId, laId) {
    const result = await http.delete(
      "api/services/app/Contact/DeleteLAContact",
      {
        params: { contactId, laId },
      }
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("DELETE_SUCCESSFULLY")
    )
    return result.data
  }
  public async get(id: number, isShowFull: boolean): Promise<any> {
    if (!id) {
      notifyError(L("Error"), L("EntityNotFound"))
    }

    // let res = await http.get(
    //   `api/services/app/Contact/Get/${id}?isShowFull=${isShowFull === true ? "true" : "false"}`
    // );
    const res = await http.get(`api/services/app/Contact/Get`, {
      params: { id, isShowFull },
    })
    const { result } = res.data

    return ContactDetailModel.assign(result)
  }

  public async getAll(params: any): Promise<PagedResultDto<any>> {
    // if (params.levelIds) {
    //   params.levelIds = params.levelIds.join(",");
    // }
    const res = await http.get("api/services/app/Contact/GetAll", { params })
    const { result } = res.data
    result.items = RowContactModel.assigns(result.items)

    return result
  }
  public async getAllContactByLA(params: any): Promise<PagedResultDto<any>> {
    // if (params.levelIds) {
    //   params.levelIds = params.levelIds.join(",");
    // }
    const res = await http.get("api/services/app/Contact/GetAll", { params })
    const { result } = res.data
    result.items = RowContactModel.assigns(result.items)

    return result
  }
  public async filterOptions(params: any): Promise<any> {
    params.pageNumber = 1
    params.pageSize = 20
    const res = await http.get("api/services/app/Contact/GetAll", { params })
    const { result } = res.data
    result.items = RowContactModel.assigns(result.items)

    return result.items
  }

  public async checkExistContact(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/Contact/GetExistContact", {
      params,
    })
    const { result } = res.data

    return result
  }
  public async getSimpleContact(params: any) {
    const result = await http.get(
      "api/services/app/Contact/GetListContactByLA",
      {
        params,
      }
    )
    return result.data?.result
  }
  public async getListContactShare(params: any): Promise<PagedResultDto<any>> {
    // if (params.levelIds) {
    //   params.levelIds = params.levelIds.join(",");
    // }
    const res = await http.get("api/services/app/Contact/GetListContactShare", {
      params,
    })
    const { result } = res.data

    return result
  }

  public async getListContactShareApproved(params: any) {
    const res = await http.get(
      "api/services/app/Contact/GetListContactShareApproved",
      {
        params,
      }
    )
    const { result } = res.data

    return result
  }
  public async createRequestShareByUser(params) {
    const result = await http.post(
      "api/services/app/Contact/CreateRequestShareByUser",
      params
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SEND_REQUEST_SUCCESSFULLY")
    )
    return result.data
  }
  public async createRequestShareByHead(params) {
    const result = await http.post(
      "api/services/app/Contact/CreateRequestShareByHead",
      params
    )
    return result.data
  }
  public async approveShare(params) {
    const result = await http.post(
      "api/services/app/Contact/ApproveShare",
      {},
      { params }
    )
    return result.data
  }
  public async rejectShare(params) {
    const result = await http.post(
      "api/services/app/Contact/RejectShare",
      {},
      { params }
    )
    return result.data
  }

  public async exportExcel(params: any): Promise<any> {
    const res = await http.get("api/Export/ExportContact", {
      params,
      responseType: "blob",
    })
    downloadFile(res.data, "contact.xlsx")
  }
}

export default new ContactService()
