import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import http from "../httpService"
import { L, LNotification } from "../../lib/abpUtility"
import { notifyError, notifySuccess } from "../../lib/helper"
import {
  OpportunityDetailModel,
  RowOpportunityModel,
} from "@models/opportunity"
import dayjs from "dayjs"

class OpportunityService {
  public async create(body: any) {
    const result = await http.post(
      "api/Opportunity/CreateOrUpdateOpportunity",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async update(body: any) {
    const result = await http.post(
      "api/Opportunity/CreateOrUpdateOpportunity",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async convertToDeal(opportunityId) {
    const result = await http.post(
      "api/Opportunity/ConvertOpportunityToDeal",
      {},
      { params: { opportunityId } }
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async delete(id: number) {
    const result = await http.delete("api/services/app/Residents/Delete", {
      params: { id },
    })
    return result.data
  }

  public async activateOrDeactivate(id: number, isActive) {
    const result = await http.post(
      "api/services/app/Residents/Active",
      { id },
      { params: { isActive } }
    )
    return result.data
  }

  public async get(id: number): Promise<any> {
    if (!id) {
      notifyError(L("Error"), L("EntityNotFound"))
    }

    const result = await http.get(`api/Opportunity/${id}`)

    return OpportunityDetailModel.assign(result.data.result)
  }

  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.post("api/Opportunity/Filters", params)
    const { result } = res.data
    result.items = RowOpportunityModel.assigns(result.items)

    return result
  }

  public async getAllOpportunityAdvisory(
    params: any
  ): Promise<PagedResultDto<any>> {
    const res = await http.post("api/Opportunity/OpportunityAdvisory", params)
    const { result } = res.data
    result.items = RowOpportunityModel.assigns(result.items)

    return result
  }

  public async filterOptions(params: any): Promise<PagedResultDto<any>> {
    params.pageNumber = 1
    params.pageSize = 20
    const res = await http.post("api/Opportunity/Filters", params)
    const { result } = res.data
    result.items = RowOpportunityModel.assigns(result.items)

    return result.items
  }

  public async getWidgetStatusItems(params: any): Promise<any> {
    if (params.dateFrom) {
      params.dateFrom = dayjs(params.dateFrom).startOf("date").toDate()
    }
    if (params.dateTo) {
      params.dateTo = dayjs(params.dateTo).toDate()
    }

    const res = await http.get("api/Statistic/CountOpportunityStatusV1", {
      params,
    })
    const { result } = res.data
    const total = (result || []).reduce(
      (total, item) => (total += item.primaryCount || 0),
      0
    )
    return (result || []).map((item) => {
      item.statusId = item.StatusId
      item.percent = Math.round((item.primaryCount / total) * 100)
      return item
    })
  }

  public async getWidgetStageItems(params: any): Promise<any> {
    if (params.dateFrom) {
      params.dateFrom = dayjs(params.dateFrom).startOf("date").toDate()
    }
    if (params.dateTo) {
      params.dateTo = dayjs(params.dateTo).toDate()
    }

    const res = await http.get("api/Statistic/CountOpportunityStageV1", {
      params,
    })
    const { result } = res.data
    const total = (result || []).reduce(
      (total, item) => (total += item.primaryCount || 0),
      0
    )
    return (result || []).map((item) => {
      item.statusId = item.StatusId
      item.stageId = item.StageId
      item.percent = Math.round((item.primaryCount / total) * 100)
      return item
    })
  }
}

export default new OpportunityService()
