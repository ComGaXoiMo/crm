import { action, makeAutoObservable, observable } from "mobx"

import depositService from "@services/activity/depositService"

class DepositStore {
  @observable isLoading!: boolean
  @observable dashboardDeposit!: any

  @observable tableDepositData!: any[]
  @observable depositDetail!: any

  @observable tableCollectData!: any[]
  @observable collectDetail!: any

  @observable tableRefundData!: any[]
  @observable refundDetail!: any
  constructor() {
    makeAutoObservable(this)
    this.tableDepositData = []
    this.depositDetail = {}

    this.tableCollectData = []
    this.collectDetail = {}

    this.tableRefundData = []
    this.refundDetail = {}
  }
  @action
  async getDashboardDeposit(id: any) {
    this.isLoading = true
    const result = await depositService
      .getDashboardDeposit(id)
      .finally(() => (this.isLoading = false))
    this.dashboardDeposit = result
  }
  @action
  async getAllDeposit(id: any) {
    this.isLoading = true
    const result = await depositService
      .getAllDeposit(id)
      .finally(() => (this.isLoading = false))
    this.tableDepositData = result
  }
  @action
  async getDeposit(id: number) {
    const result = await depositService.getDetailDeposit(id)
    this.depositDetail = result
  }
  @action
  async initDeposit() {
    this.depositDetail = {}
  }
  @action
  async createOrUpdateDeposit(body: any) {
    this.isLoading = true

    const result = await depositService
      .createOrUpdateDeposit(body)
      .finally(() => (this.isLoading = false))
    this.depositDetail = result
  }
  @action
  async activateOrDeactivateDeposit(id: number, isActive) {
    await depositService.activateOrDeactivateDeposit(id, isActive)
  }
  @action
  async deleteDeposit(id: number) {
    await depositService.deleteDeposit(id)
    this.tableDepositData = this.tableDepositData.filter((x) => x.id !== id)
  }

  @action
  async getAllDepositCollect(id: any) {
    this.isLoading = true
    const result = await depositService
      .getAllDepositCollect(id)
      .finally(() => (this.isLoading = false))
    this.tableCollectData = result
  }
  @action
  async getCollect(id: number) {
    const result = await depositService.getDetailDepositCollect(id)
    this.collectDetail = result
  }
  @action
  async initCollect() {
    this.collectDetail = {}
  }
  @action
  async createOrUpdateCollect(body: any) {
    this.isLoading = true

    const result = await depositService
      .createOrUpdateCollect(body)
      .finally(() => (this.isLoading = false))
    this.collectDetail = result
  }
  @action
  async activateOrDeactivateCollect(id: number, isActive) {
    await depositService.activateOrDeactivateCollect(id, isActive)
  }
  @action
  async deleteCollect(id: number) {
    await depositService.deleteCollect(id)
    this.tableCollectData = this.tableCollectData.filter((x) => x.id !== id)
  }

  @action
  async getAllDepositRefund(id: any) {
    this.isLoading = true
    const result = await depositService
      .getAllDepositRefund(id)
      .finally(() => (this.isLoading = false))
    this.tableRefundData = result
  }
  @action
  async getRefund(id: number) {
    const result = await depositService.getDetailDepositRefund(id)
    this.refundDetail = result
  }
  @action
  async initRefund() {
    this.refundDetail = {}
  }
  @action
  async createOrUpdateRefund(body: any) {
    this.isLoading = true

    const result = await depositService
      .createOrUpdateRefund(body)
      .finally(() => (this.isLoading = false))
    this.refundDetail = result
  }
  @action
  async activateOrDeactivateRefund(id: number, isActive) {
    await depositService.activateOrDeactivateRefund(id, isActive)
  }
  @action
  async deleteRefund(id: number) {
    await depositService.deleteRefund(id)
    this.tableRefundData = this.tableRefundData.filter((x) => x.id !== id)
  }
}

export default DepositStore
