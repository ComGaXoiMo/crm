import listingService from "@services/projects/listingService"
import { action, observable } from "mobx"
import dayjs from "dayjs"

// import type { PagedResultDto } from "../../services/dto/pagedResultDto";

class ListingStore {
  @observable isLoading = false
  @observable tableData: Array<any> = []
  @observable totalItems = 0
  @observable listingStatus: Array<any> = []
  @observable listingType: Array<any> = []
  @observable listingDetailData: any
  @observable listingCompare: Array<any> = []

  @action async getAllListing(params) {
    this.isLoading = true
    const res = await listingService.getAllListing(params)
    this.tableData = res.items
    this.totalItems = res.totalCount
    this.isLoading = false
  }
  @action async getListingCategory(params) {
    this.isLoading = true
    const res = await listingService.getListingCategory(params)

    this.listingType = res.filter((item) => item.code === "ListingType")
    this.listingStatus = res.filter((item) => item.code === "ListingStatus")
    this.isLoading = false
  }
  @action
  async createListing(body: any) {
    this.isLoading = true
    const res = await listingService.createListing(body)
    this.listingDetailData = res
    this.isLoading = false
  }

  @action
  async updateListing(body: any) {
    this.isLoading = true
    const value = {
      ...this.listingDetailData,
      ...body,
    }
    const res = await listingService.createListing(value)
    this.listingDetailData = res
    this.isLoading = false
  }

  @action async getListingDetail(id) {
    this.isLoading = true
    const res = await listingService.getListingDetail(id)
    res.dateAvailable = dayjs(res.dateAvailable)
    res.endDate = dayjs(res.endDate)
    res.publishDate = dayjs(res.publishDate)
    this.listingDetailData = res
    this.isLoading = false
  }

  @action async clearListingDetail() {
    this.listingDetailData = null
  }

  @action
  async activateOrDeactivate(id: number, isActive) {
    // await listingService.activateOrDeactivate(id, isActive);
  }

  @action async getListingCompare(ids) {
    this.isLoading = true
    const result = await listingService.getListingCompare(ids)
    this.listingCompare = result
    this.isLoading = false
  }
}

export default ListingStore
