import type { PagedResultDto } from "../dto/pagedResultDto"
import http from "../httpService"
import { L, LNotification } from "../../lib/abpUtility"
import { notifyError, notifySuccess } from "../../lib/helper"

class MailService {
  public async createOrUpdate(body: any) {
    const result = await http.post(
      "api/services/app/InquiryMail/CreateOrUpdate",
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

    const result = await http.get("api/services/app/InquiryMail/Get", {
      params: { id },
    })

    return result.data.result
  }

  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/InquiryMail/GetAll", {
      params,
    })
    const { result } = res.data

    return result
  }
}

export default new MailService()
