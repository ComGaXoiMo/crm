import type { PagedResultDto } from "@services/dto/pagedResultDto"
import inquiryService from "@services/projects/inquiryService"
import { action, observable } from "mobx"

class InquiryStore {
  @observable isLoading = false
  @observable source: Array<any> = []
  @observable status: Array<any> = []
  @observable pageResult: PagedResultDto<any> = { totalCount: 0, items: [] }
  @observable inquiryDetail!: any
  @observable matchingListing!: any
  @observable listStatus: any
  @observable auditLogResult: any
  @observable listInquiryBoardView: any
  @observable matchingInquiry: PagedResultDto<any> = {
    totalCount: 0,
    items: [],
  }
  @observable pageResultActivity: PagedResultDto<any> = {
    totalCount: 0,
    items: [],
  }

  @observable listInquirySimple: Array<any> = []

  constructor() {
    this.listStatus = []
    this.listInquiryBoardView = {}
  }
  @action getCategories = async () => {
    const res = await inquiryService.getCategories()
    this.status = res.filter((item) => item.typeCode === "InquiryStatus")
    this.source = res.filter((item) => item.typeCode === "InquirySource")
  }

  @action getAll = async (params) => {
    this.isLoading = true
    this.pageResult = await inquiryService
      .getAll(params)
      .finally(() => (this.isLoading = false))
  }

  @action
  async getAllByStatus(params: any) {
    const res = await inquiryService.getInquiryStatus()
    this.listStatus = await res.filter((item) => item.code === "InquiryStatus")
    await this.listStatus.forEach(async (item) => {
      this.listInquiryBoardView[item.id] = await inquiryService.getAll({
        ...params,
        statusId: item.id,
      })
    })
  }

  @action
  async getMore(statusId: number, params: any) {
    const result = await inquiryService.getAll({
      ...params,
      statusId: statusId,
    })
    // .finally(() => (this.isLoading = false));
    const oldResult = this.listInquiryBoardView[statusId].items
    this.listInquiryBoardView[statusId] = {
      items: [...oldResult, ...result.items],
      totalCount: result.totalCount,
    }
  }
  @action getAuditLogs = async (params) => {
    this.isLoading = true
    this.auditLogResult = await inquiryService
      .getAuditLogs(params)
      .finally(() => (this.isLoading = false))
  }
  @action
  async createOrUpdate(body) {
    this.isLoading = true
    const inquiryAddress = (await body.inquiryAddress)
      ? [body.inquiryAddress]
      : []
    const contactAddress =
      (await body.contact?.contactAddress?.address) ||
      body.contact?.contactAddress?.provinceId
        ? [body.contact?.contactAddress]
        : []
    const newBody = await {
      ...body,
      inquiryAddress,
      contact: { ...body.contact, contactAddress },
    }

    const result = await inquiryService
      .createOrUpdate({ ...newBody })
      .finally(() => (this.isLoading = false))

    this.inquiryDetail = result
    return result
  }

  @action
  async UpdateComplete(id) {
    await inquiryService.UpdateComplete(id)
  }
  @action
  async UpdateDrop(params) {
    await inquiryService.UpdateDrop(params)
  }

  @action
  async isCreate() {
    this.inquiryDetail = {}
  }

  // @action
  // async update(params) {
  //   let result = await inquiryService.update({ ...params });
  //   this.pageResult!.items = this.pageResult?.items.map((news) => {
  //     if (news.id === params.id) return result;
  //     return news;
  //   });
  // }

  @action async get(id) {
    this.isLoading = true
    const result = await inquiryService
      .get(id)
      .finally(() => (this.isLoading = false))
    this.inquiryDetail = result
  }
  @action async getMatchingListing(inquiryId) {
    this.isLoading = true
    this.matchingListing = await inquiryService
      .getMatchingListing(inquiryId)
      .finally(() => (this.isLoading = false))
  }
  @action async getMatchingInquiry(params) {
    this.isLoading = true
    this.matchingInquiry = await inquiryService
      .getMatchingInquiry(params)
      .finally(() => (this.isLoading = false))
  }
  @action
  async activateOrDeactivate(id: number, isActive) {
    await inquiryService.activateOrDeactivate(id, isActive)
  }
  @action
  async addToListSimpleInquiry(value) {
    this.listInquirySimple = [...this.listInquirySimple, { ...value }]
  }
  @action
  async getSimpleInquiry(params) {
    this.isLoading = true

    const res = await inquiryService
      .getSimpleInquiry(params)
      .finally(() => (this.isLoading = false))
    this.listInquirySimple = res
  }
  @action async getDueDate(params) {
    const res = await inquiryService.getDueDate(params)
    return res
  }

  @action getAllActivity = async (params) => {
    this.isLoading = true
    this.pageResultActivity = await inquiryService
      .getAllActivity(params)
      .finally(() => (this.isLoading = false))
  }
}

export default InquiryStore
