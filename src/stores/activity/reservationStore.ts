import { action, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import reservationService from "@services/activity/reservationService"

class ReservationStore {
  @observable isLoading!: boolean
  @observable tableData!: PagedResultDto<any>
  @observable moreReservations!: any[]
  @observable reservationDetail!: any
  @observable lisPriorityReservationUnit!: any[]
  @observable reservationSetting!: any

  constructor() {
    this.tableData = { items: [], totalCount: 0 }
  }

  @action
  async createOrUpdate(body: any) {
    this.isLoading = true
    const result = await reservationService.createOrUpdate(body).finally(() => (this.isLoading = false))
    this.reservationDetail = result
   
  }

  @action
  async createReservation() {
    this.reservationDetail = {}
  }
  @action
  async removeDataTable() {
    this.tableData = { items: [], totalCount: 0 }
  }
  @action
  async get(id: number) {
    const result = await reservationService.get(id)
    this.reservationDetail = result
  }
  @action
  async getPriorityReservationUnit(params: any) {
    const result = await reservationService.getPriorityReservationUnit(params)
    this.lisPriorityReservationUnit = result

    return result
  }
  @action
  async getAll(params: any) {
    this.isLoading = true
    const result = await reservationService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.tableData = result
    return result
  }

  @action
  async getMoreAll(params: any, inquiryId?) {
    this.isLoading = true
    const result = await reservationService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.moreReservations = result?.items.filter(
      (item) => item.inquiryId !== inquiryId
    )
    return result
  }

  @action
  async getSettingReservation() {
    this.isLoading = true
    const result = await reservationService
      .getSettingReservation()
      .finally(() => (this.isLoading = false))
    this.reservationSetting = result
  }
  @action
  async updateSettingReservation(body: any) {
    this.isLoading = true
    await reservationService
      .updateSettingReservation(body)
      .finally(() => (this.isLoading = false))
  }
}

export default ReservationStore
