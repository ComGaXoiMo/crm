import { LNotification } from "@lib/abpUtility"
import { notifySuccess } from "@lib/helper"
import { PagedResultDto } from "@services/dto/pagedResultDto"
import http from "./httpService"
import { SettingVatModel } from "@models/settingVat/settingVatModel"

class SettingVatService {
  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/SettingVATAppServices/GetAll", {
      params,
    })
    const { result } = res.data

    result.items = SettingVatModel.assigns(result.items)
    return result
  }

  public async createOrUpdate(body: any) {
    const res = await http.post(
      "api/services/app/SettingVATAppServices/CreateOrUpdate",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return res.data.result
  }
  public async synVATToPaymentUnBill(id) {
    await http.post(
      "api/services/app/SettingVATAppServices/SynVATToPaymentUnBill",
      {},
      { params: { id } }
    )
    notifySuccess(LNotification("SUCCESS"), LNotification("SYNC_SUCCESSFULLY"))
  }
}

export default new SettingVatService()
// body,
//       {params: {moduleId, referenceId: parentId}}
