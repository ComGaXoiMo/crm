import type { PagedResultDto } from "../dto/pagedResultDto"
import http from "../httpService"
import { L, LNotification } from "../../lib/abpUtility"
import { notifyError, notifySuccess } from "../../lib/helper"

class ReservationService {
  public async createOrUpdate(body: any) {
    const result = await http.post(
      "api/services/app/InquiryReservation/CreateOrUpdate",
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

    const result = await http.get("api/services/app/InquiryReservation/Get", {
      params: { id },
    })

    return result.data.result
  }
  public async getPriorityReservationUnit(params: any): Promise<any> {
    const result = await http.get(
      "api/services/app/InquiryReservation/GetPriorityReservationUnit",
      {
        params,
      }
    )

    return result.data.result
  }
  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/InquiryReservation/GetAll", {
      params,
    })
    const { result } = res.data

    return result
  }

  public async getSettingReservation(): Promise<any> {
    const result = await http.get(
      "api/services/app/InquiryReservation/GetSettingReservation"
    )

    return result.data.result
  }
  public async updateSettingReservation(body: any) {
    const result = await http.put(
      "api/services/app/InquiryReservation/UpdateSettingReservation",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }
}

export default new ReservationService()
