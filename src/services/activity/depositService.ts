import http from "../httpService"
import { L, LNotification } from "@lib/abpUtility"
import { notifyError, notifySuccess } from "@lib/helper"
// import {  LNotification } from "../../lib/abpUtility"
// import {notifySuccess } from "../../lib/helper"

class DepositService {
  

  public async getDashboardDeposit(id: any) {
    const res = await http.get("api/services/app/LeaseAgreementDeposit/GetDashboardLeaseAgreementDeposit", {
      params: { leaseAgreementId:id },
    })
    const { result } = res.data

    return result
  }


  public async getAllDeposit(id: any) {
    const res = await http.get("api/services/app/LeaseAgreementDeposit/GetListDepositByLeaseAgreement", {
      params: { leaseAgreementId:id },
    })
    const { result } = res.data

    return result
  }

  
  public async getDetailDeposit(id: number): Promise<any> {
    if (!id) {
      notifyError(L("ERROR"), L("ENTITY_NOT_FOUND"))
    }
    const res = await http.get("api/services/app/LeaseAgreementDeposit/GetDetailDeposit", {
      params: { id },
    })
    return (res.data.result)
  }

  public async createOrUpdateDeposit(body: any) {
    const res = await http.post(
      "api/services/app/LeaseAgreementDeposit/CreateOrUpdateDeposit",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return res.data.result
  }
  public async activateOrDeactivateDeposit(id: number, isActive) {
    const result = await http.post(
      "api/services/app/LeaseAgreementDeposit/ActiveDeposit",
      { id },
      { params: { isActive } }
    )
    return result.data
  }
  public async deleteDeposit(id: number) {
    const result = await http.delete('api/services/app/LeaseAgreementDeposit/DeleteDeposit', { params: { id } })
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("DELETE_SUCCESSFULLY")
    )
    return result.data
  }



  public async getAllDepositCollect(id: any) {
    const res = await http.get("api/services/app/LeaseAgreementDeposit/GetListDepositCollectByLeaseAgreement", {
      params: { leaseAgreementId:id },
    })
    const { result } = res.data

    return result
  } 

  public async getDetailDepositCollect(id: number): Promise<any> {
    if (!id) {
      notifyError(L("ERROR"), L("ENTITY_NOT_FOUND"))
    }
    const res = await http.get("api/services/app/LeaseAgreementDeposit/GetDetailDepositCollect", {
      params: { id },
    })
    return (res.data.result)
  }

  public async createOrUpdateCollect(body: any) {
    const res = await http.post(
      "api/services/app/LeaseAgreementDeposit/CreateOrUpdateCollect",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return res.data.result
  }
  public async activateOrDeactivateCollect(id: number, isActive) {
    const result = await http.post(
      "api/services/app/LeaseAgreementDeposit/ActiveCollect",
      { id },
      { params: { isActive } }
    )
    return result.data
  }
  public async deleteCollect(id: number) {
    const result = await http.delete('api/services/app/LeaseAgreementDeposit/DeleteCollect', { params: { id } })
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("DELETE_SUCCESSFULLY")
    )
    return result.data
  }




  public async getAllDepositRefund(id: any) {
    const res = await http.get("api/services/app/LeaseAgreementDeposit/GetListDepositRefundByLeaseAgreement", {
      params: { leaseAgreementId:id },
    })
    const { result } = res.data

    return result
  }


  public async getDetailDepositRefund(id: number): Promise<any> {
    if (!id) {
      notifyError(L("ERROR"), L("ENTITY_NOT_FOUND"))
    }
    const res = await http.get("api/services/app/LeaseAgreementDeposit/GetDetailDepositRefund", {
      params: { id },
    })
    return (res.data.result)
  }

  public async createOrUpdateRefund(body: any) {
    const res = await http.post(
      "api/services/app/LeaseAgreementDeposit/CreateOrUpdateRefund",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return res.data.result
  }
  public async activateOrDeactivateRefund(id: number, isActive) {
    const result = await http.post(
      "api/services/app/LeaseAgreementDeposit/ActiveRefund",
      { id },
      { params: { isActive } }
    )
    return result.data
  }
  public async deleteRefund(id: number) {
    const result = await http.delete('api/services/app/LeaseAgreementDeposit/DeleteRefund', { params: { id } })
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("DELETE_SUCCESSFULLY")
    )
    return result.data
  }




 
}

export default new DepositService()
