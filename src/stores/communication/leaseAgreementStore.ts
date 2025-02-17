import type { PagedResultDto } from "@services/dto/pagedResultDto"
import leaseAgreementService from "@services/projects/leaseAgreementService"
import { action, makeAutoObservable, observable } from "mobx"

class LeaseAgreementStore {
  @observable isLoading = false

  @observable pageResult: PagedResultDto<any> = { totalCount: 0, items: [] }
  @observable listAmendment: PagedResultDto<any> = { totalCount: 0, items: [] }
  @observable listLaByUnit: PagedResultDto<any> = { totalCount: 0, items: [] }
  @observable leaseAgreementDetail!: any
  @observable listMainFeeType!: any
  @observable listSCFeeType!: any
  @observable listOtherFeeType!: any
  @observable listFeeType!: any
  @observable paymentGenerate!: any
  @observable listPaymentScheduleAmount!: any
  @observable auditLogResult: any
  @observable paymentScheduleStatus!: any
  @observable bookingDataDetail!: any
  @observable terminationNoteDetail!: any
  @observable leaseAgreementExportDetail!: any
  @observable depositDataDetail!: any
  @observable paymentAfterDiscount!: any
  @observable laReminderSetting!: any
  @observable laStatusSetting!: any[]
  @observable lACommission!: any
  @observable totalCommission!: any
  @observable lACommissionDealer!: any
  @observable listLASelect!: any[]

  constructor() {
    makeAutoObservable(this)

    this.paymentGenerate = []
    this.paymentScheduleStatus = []
    this.listPaymentScheduleAmount = []
    this.listMainFeeType = []
    this.listFeeType = []
    this.listSCFeeType = []
    this.listOtherFeeType = []
    this.paymentAfterDiscount = 0
    this.auditLogResult = []
    this.laStatusSetting = []
    this.lACommissionDealer = []
    this.listLASelect = []
  }
  @action getAll = async (params) => {
    this.isLoading = true
    this.pageResult = await leaseAgreementService
      .getAll(params)
      .finally(() => (this.isLoading = false))
  }
  @action getAllForSelect = async (params) => {
    const res = await leaseAgreementService.getAll(params)
    this.listLASelect = await res.items?.map((item) => {
      return {
        id: item?.id,
        name: item?.referenceNumber,
      }
    })
  }
  @action getLaByUnit = async (params) => {
    this.isLoading = true
    this.listLaByUnit = await leaseAgreementService
      .getAll(params)
      .finally(() => (this.isLoading = false))
  }
  @action
  async createOrUpdate(body) {
    this.isLoading = true

    const newBody = await { ...body }

    const result = await leaseAgreementService
      .createOrUpdate({ ...newBody })
      .finally(() => (this.isLoading = false))
    this.pageResult.items.push(result)
    return result
  }
  @action
  async isCreate() {
    this.leaseAgreementDetail = {
      leaseAgreementUnit: [],
    }
  }
  @action async isRenewLA() {
    this.leaseAgreementDetail = {
      ...this.leaseAgreementDetail,
      statusId: undefined,
    }
  }
  @action async get(id) {
    this.isLoading = true
    const result = await leaseAgreementService
      .get(id)
      .finally(() => (this.isLoading = false))
    this.leaseAgreementDetail = result
  }
  @action
  async activateOrDeactivate(id: number, isActive) {
    await leaseAgreementService.activateOrDeactivate(id, isActive)
  }
  @action async UpdateStatusLA(params) {
    await leaseAgreementService.UpdateStatusLA(params)
  }
  @action async getListFeeType(keyword) {
    const listFeeType = await leaseAgreementService.getListFeeType(keyword)
    this.listFeeType = listFeeType
    this.listMainFeeType = listFeeType.filter((item) => item.typeId === 0)
    this.listSCFeeType = listFeeType.filter((item) => item.typeId === 1)
    this.listOtherFeeType = listFeeType.filter((item) => item.typeId === 2)
  }
  @action
  async genVATAmountByFeeType(params) {
    const result = await leaseAgreementService.genVATAmountByFeeType(params)

    this.paymentGenerate = result
    return result[0]
  }
  @action async getPaymentSchedule(id) {
    this.isLoading = true
    const res = await leaseAgreementService
      .getPaymentSchedule(id)
      .finally(() => (this.isLoading = false))
    this.listPaymentScheduleAmount = res
  }
  @action
  async createPaymentSchedule(params) {
    this.isLoading = true
    await leaseAgreementService
      .createPaymentSchedule(params)
      .finally(() => (this.isLoading = false))

    // this.listPaymentAmount = result;
  }
  @action
  async createOrUpdatePaymentSchedule(params) {
    this.isLoading = true
    await leaseAgreementService
      .createOrUpdatePaymentSchedule(params)
      .finally(() => (this.isLoading = false))

    // this.listPaymentAmount = result;
  }
  @action async getListLeaseAgreementPaymentScheduleStatus() {
    const res =
      await leaseAgreementService.getListLeaseAgreementPaymentScheduleStatus()
    this.paymentScheduleStatus = res
  }
  @action async updateStatusPaymentSchedule(params) {
    await leaseAgreementService.updateStatusPaymentSchedule(params)
  }
  @action async getLAAmountAfterDiscount(params) {
    const res = await leaseAgreementService.getLAAmountAfterDiscount(params)
    this.paymentAfterDiscount = res
    return res
  }

  @action getAuditLogs = async (params) => {
    this.isLoading = true
    this.auditLogResult = await leaseAgreementService
      .getAuditLogs(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async getLASettingAsync() {
    this.isLoading = true
    const result = await leaseAgreementService
      .getLASettingAsync()
      .finally(() => (this.isLoading = false))
    this.laReminderSetting = result
  }
  @action
  async updateLASettingAsync(body: any) {
    this.isLoading = true
    await leaseAgreementService
      .updateLASettingAsync(body)
      .finally(() => (this.isLoading = false))
  }

  @action
  async getLAStatusSetting() {
    this.isLoading = true
    const result = await leaseAgreementService
      .getLAStatusSetting()
      .finally(() => (this.isLoading = false))
    this.laStatusSetting = result
  }
  @action
  async updateLAStatusSetting(body: any) {
    this.isLoading = true
    await leaseAgreementService
      .updateLAStatusSetting(body)
      .finally(() => (this.isLoading = false))
  }

  @action
  async updateLABlock(body: any) {
    this.isLoading = true
    await leaseAgreementService
      .updateLABlock(body)
      .finally(() => (this.isLoading = false))
  }

  //Commission
  @action async getLACommission(id) {
    this.isLoading = true
    const result = await leaseAgreementService
      .getCommision(id)
      .finally(() => (this.isLoading = false))
    this.lACommission = result
  }
  @action async getLACommissionDealer(id) {
    this.isLoading = true
    const result = await leaseAgreementService
      .getCommisionDealer(id)
      .finally(() => (this.isLoading = false))
    this.lACommissionDealer = result
  }
  @action
  async createOrUpdateCommission(params) {
    this.isLoading = true

    const newParams = await { ...params }

    const result = await leaseAgreementService
      .createOrUpdateCommision({ ...newParams })
      .finally(() => (this.isLoading = false))
    return result
  }
  @action
  async createOrUpdateCommissionPhaseDetail(params) {
    this.isLoading = true

    const result = await leaseAgreementService
      .createOrUpdateCommisionDetail(params)
      .finally(() => (this.isLoading = false))
    return result
  }
  //Booking form

  @action async getBookingForm(params: any) {
    const res = await leaseAgreementService.getBookingForm(params)
    this.bookingDataDetail = res
  }
  @action async getDepositForm(params: any) {
    const res = await leaseAgreementService.getDepositForm(params)
    this.depositDataDetail = res
  }
  @action async getTerminationNote(params: any) {
    const res = await leaseAgreementService.getTerminationNote(params)
    this.terminationNoteDetail = res
  }
  @action async getLAExport(params: any) {
    const res = await leaseAgreementService.getLAExport(params)
    this.leaseAgreementExportDetail = res
  }

  // Amendment
  @action
  async createOrUpdateAmendment(body) {
    this.isLoading = true

    const newBody = await { ...body }

    const result = await leaseAgreementService
      .createOrUpdateAmendment({ ...newBody })
      .finally(() => (this.isLoading = false))
    return result
  }

  @action getAllAmendmentForLA = async (params) => {
    this.isLoading = true
    this.listAmendment = await leaseAgreementService
      .getAllAmendmentForLA(params)
      .finally(() => (this.isLoading = false))
  }
  @action async UpdateStatusAmendment(params) {
    await leaseAgreementService.UpdateStatusAmendment(params)
  }
  @action async getTotalCommission(params) {
    this.isLoading = true
    const result = await leaseAgreementService
      .getTotalCommission(params)
      .finally(() => (this.isLoading = false))
    this.totalCommission = result
  }
}

export default LeaseAgreementStore
