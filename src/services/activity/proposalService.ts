import type { PagedResultDto } from "../dto/pagedResultDto"
import http from "../httpService"
import { L, LNotification } from "../../lib/abpUtility"
import { notifyError, notifySuccess } from "../../lib/helper"

class ProposalService {
  public async createOrUpdate(body: any) {
    const result = await http.post(
      "api/services/app/InquiryProposal/CreateOrUpdate",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async get(id: number): Promise<any> {
    if (!id) {
      notifyError(L("Error"), L("EntityNotFound"))
    }

    const result = await http.get("api/services/app/InquiryProposal/Get", {
      params: { id },
    })

    return result.data.result
  }

  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/InquiryProposal/GetAll", {
      params,
    })
    const { result } = res.data

    return result
  }
  public async getUnitTemplate(id: number): Promise<any> {
    if (!id) {
      notifyError(L("Error"), L("EntityNotFound"))
    }

    const result = await http.get(
      "api/services/app/InquiryProposal/GetUnitTemplate",
      {
        params: { id },
      }
    )

    return result.data.result
  }
  public async getProjectTemplate(id: number): Promise<any> {
    if (!id) {
      notifyError(L("Error"), L("EntityNotFound"))
    }

    const result = await http.get(
      "api/services/app/InquiryProposal/GetProjectTemplate",
      {
        params: { id },
      }
    )

    return result.data.result
  }

  public async updateTemplate(body: any) {
    const result = await http.put(
      "api/services/app/InquiryProposal/UpdateTemplate",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async getPublicProposal(uniqueId): Promise<any> {
    if (!uniqueId) {
      notifyError(L("Error"), L("EntityNotFound"))
    }

    const result = await http.get(
      "api/services/app/PublicProposal/GetProposal",
      {
        params: { uniqueId },
      }
    )

    return result.data.result
  }

  public async updateLinkView(params) {
    const result = await http.put(
      "api/services/app/PublicProposal/UpdateLinkView",
      {},
      { params: params }
    )
    return result
  }

  public async getUnitImage(uniqueId): Promise<any> {
    if (!uniqueId) {
      notifyError(L("Error"), L("EntityNotFound"))
    }

    const result = await http.get(
      "api/services/app/Documents/GetUnitPictures",
      {
        params: { uniqueId },
      }
    )

    return result.data.result
  }
}

export default new ProposalService()
