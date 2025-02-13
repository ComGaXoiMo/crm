import { L, LNotification } from "@lib/abpUtility"
import { notifyError, notifySuccess } from "@lib/helper"
import type { PagedResultDto } from "@services/dto/pagedResultDto"
import http from "../httpService"
import { LeaseAgreementDetailModel } from "@models/leaseAgreementModel/leaseAgreementModel"

class LeaseAgreementService {
  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/LeaseAgreement/GetAll", {
      params,
    })
    const { result } = res.data

    return result
  }

  public async createOrUpdate(body: any) {
    const res = await http.post(
      "api/services/app/LeaseAgreement/CreateOrUpdate",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return res.data.result
  }

  public async get(id: number): Promise<any> {
    if (!id) {
      notifyError(L("ERROR"), L("ENTITY_NOT_FOUND"))
    }
    const res = await http.get("api/services/app/LeaseAgreement/Get", {
      params: { id },
    })
    return LeaseAgreementDetailModel.assign(res.data.result)
  }
  public async activateOrDeactivate(id: number, isActive) {
    const result = await http.post(
      "api/services/app/LeaseAgreement/Active",
      { id },
      { params: { isActive } }
    )
    return result.data
  }

  public async UpdateStatusLA(params) {
    const result = await http.put(
      "/api/services/app/LeaseAgreement/UpdateStatusLA",
      params
    )
    await notifySuccess(
      LNotification("SUCCESS"),
      LNotification("UPDATE_STATUS_SUCCESSFULLY")
    )
    return result.data
  }

  public async getListFeeType(params: any): Promise<any> {
    const res = await http.get(
      "/api/services/app/LeaseAgreement/GetListFeeType",
      {
        params,
      }
    )
    const { result } = res.data
    return result
  }
  public async genVATAmountByFeeType(params: any) {
    const res = await http.post(
      "/api/services/app/LeaseAgreement/GenVATAmountByFeeType",
      params
    )

    return res.data.result
  }
  public async getPaymentSchedule(params: any): Promise<any> {
    const res = await http.get(
      "/api/services/app/LeaseAgreement/GetPaymentSchedule",
      {
        params,
      }
    )
    const { result } = res.data
    return result
  }
  public async createPaymentSchedule(params: any) {
    const res = await http.post(
      "/api/services/app/LeaseAgreement/CreatePaymentSchedule",
      params
    )

    return res.data.result
  }
  public async createOrUpdatePaymentSchedule(params: any) {
    const res = await http.post(
      "/api/services/app/LeaseAgreement/CreateOrUpdatePaymentSchedule",
      params
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("EDIT_PAYMENT_SUCCESSFULLY")
    )
    return res.data.result
  }

  // SETTING VAT
  public async getListLeaseAgreementPaymentScheduleStatus(): Promise<any> {
    const res = await http.get(
      "/api/services/app/Category/GetListLeaseAgreementPaymentScheduleStatus"
    )
    const { result } = res.data
    return result
  }

  public async updateStatusPaymentSchedule(params) {
    const result = await http.put(
      "/api/services/app/LeaseAgreement/UpdateStatusPaymentSchedule",
      params
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("UPDATE_STATUS_SUCCESSFULLY")
    )
    return result.data
  }

  public async getAuditLogs(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/LeaseAgreement/GetAuditLogs", {
      params,
    })
    const { result } = res.data
    return result
  }

  public async getLAAmountAfterDiscount(params): Promise<any> {
    const res = await http.get(
      "/api/services/app/LeaseAgreement/GetLAAmountAfterDiscount",
      {
        params,
      }
    )
    const { result } = res.data
    return result
  }

  public async getLASettingAsync(): Promise<any> {
    const result = await http.get(
      "api/services/app/LeaseAgreement/GetLASetting"
    )

    return result.data.result
  }
  public async updateLASettingAsync(body: any) {
    const result = await http.put(
      "api/services/app/LeaseAgreement/UpdateLASetting",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }
  public async getLAStatusSetting(): Promise<any> {
    const result = await http.get(
      "api/services/app/LeaseAgreement/GetListLeaseAgreementStatusSetting"
    )

    return result.data.result
  }
  public async updateLAStatusSetting(body: any) {
    const result = await http.put(
      "api/services/app/LeaseAgreement/UpdateLeaseAgreementStatusSetting",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }
  public async updateLABlock(body: any) {
    const result = await http.put(
      "api/services/app/LeaseAgreement/UpdateLABlock",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }
  //COMMISSION
  public async getCommision(leaseAgreementId: number): Promise<any> {
    if (!leaseAgreementId) {
      notifyError(L("ERROR"), L("ENTITY_NOT_FOUND"))
    }
    const res = await http.get(
      "api/services/app/LeaseAgreementCommission/GetCommissionByLeaseAgreement",
      {
        params: { leaseAgreementId },
      }
    )
    // return LeaseAgreementDetailModel.assign(res.data.result)
    return res.data.result
  }
  public async getCommisionDealer(leaseAgreementId: number): Promise<any> {
    if (!leaseAgreementId) {
      notifyError(L("ERROR"), L("ENTITY_NOT_FOUND"))
    }
    const res = await http.get(
      "api/services/app/LeaseAgreementCommission/GetDealerCommissionForLA",
      {
        params: { leaseAgreementId },
      }
    )
    // return LeaseAgreementDetailModel.assign(res.data.result)
    return res.data.result
  }
  public async createOrUpdateCommision(body: any): Promise<any> {
    const res = await http.post(
      "api/services/app/LeaseAgreementCommission/createOrUpdate",
      body
    )

    return res.data.result
  }
  public async createOrUpdateCommisionDetail(body: any): Promise<any> {
    const res = await http.post(
      "api/services/app/LeaseAgreementCommission/createOrUpdateCommissionPhaseDetail",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("UPDATE_COMMISSION_SUCCESSFULLY")
    )
    return res.data.result
  }
  //booking form
  // SETTING VAT
  public async getBookingForm(body: any): Promise<any> {
    const res = await http.get(
      "/api/services/app/LeaseAgreement/GetBookingForm",
      {
        params: { ...body },
      }
    )
    const { result } = res.data
    return result
  }
  public async getDepositForm(body: any): Promise<any> {
    const res = await http.get(
      "/api/services/app/LeaseAgreement/GetDepositForm",
      {
        params: { ...body },
      }
    )
    const { result } = res.data
    return result
  }
  public async getTerminationNote(body: any): Promise<any> {
    const res = await http.get(
      "/api/services/app/LeaseAgreement/GetTerminationNote",
      {
        params: { ...body },
      }
    )
    const { result } = res.data
    return result
  }
  public async getLAExport(body: any): Promise<any> {
    const res = await http.get(
      "/api/services/app/LeaseAgreement/GetLeaseAgreement",
      {
        params: { ...body },
      }
    )
    const { result } = res.data
    return result
  }

  // Amendment
  public async createOrUpdateAmendment(body: any) {
    const res = await http.post(
      "api/services/app/LeaseAgreement/CreateOrUpdateAmendment",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return res.data.result
  }

  public async getAllAmendmentForLA(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get(
      "api/services/app/LeaseAgreement/GetListAmendment",
      {
        params,
      }
    )
    const { result } = res.data

    return result
  }

  public async UpdateStatusAmendment(params) {
    const result = await http.put(
      "/api/services/app/LeaseAgreement/UpdateStatusAmendment",
      params
    )
    await notifySuccess(
      LNotification("SUCCESS"),
      LNotification("UPDATE_STATUS_SUCCESSFULLY")
    )
    return result.data
  }
  public async getTotalCommission(params): Promise<any> {
    const res = await http.get(
      "api/services/app/LeaseAgreementCommission/GetTotalCommission",
      {
        params,
      }
    )
    // return LeaseAgreementDetailModel.assign(res.data.result)
    return res.data.result
  }
}

export default new LeaseAgreementService()
