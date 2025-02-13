import type { PagedResultDto } from "../dto/pagedResultDto"
import http from "../httpService"
import { L, LNotification } from "@lib/abpUtility"
import { notifyError, notifySuccess } from "@lib/helper"
import { NewsModel } from "@models/communication/News"

class NewsService {
  public async create(body: NewsModel) {
    const result = await http.post("/api/News/CreateAsync", body)
    return result.data.result
  }

  public async update(body: any) {
    const result = await http.post("api/News/UpdateAsync", body)
    return result.data.result
  }

  public async delete(id: number, isActive) {
    const result = await http.post("api/News/Active", null, {
      params: { id, isActive },
    })
    return result.data
  }

  public async get(id: number): Promise<any> {
    if (!id) {
      notifyError(L("ERROR"), L("ENTITY_NOT_FOUND"))
    }

    const result = await http.get("/api/services/app/News/Get", {
      params: { id },
    })
    return result.data.result
  }

  public async getForDetail(id: number): Promise<any> {
    if (!id) {
      notifyError(L("ERROR"), L("ENTITY_NOT_FOUND"))
    }

    const result = await http.get(`/api/News/Get`, { params: { id } })
    return result.data.result
  }

  public async getForEdit(id: number): Promise<any> {
    if (!id) {
      notifyError(L("ERROR"), L("ENTITY_NOT_FOUND"))
    }

    const result = await http.get(`api/News/GetNewsForEdit/${id}`)
    return result.data.result
  }

  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const paramsCategory: any = {}
    if (params.CategoryIds && params.CategoryIds.length > 0) {
      const newCategoryIds = params.CategoryIds.split(",")
      newCategoryIds.map((cat, index) => {
        paramsCategory[`CategoryIds[${index}]`] = cat
      })
    }
    const newParams = {
      ...params,
      ...paramsCategory,
    }
    delete newParams.CategoryIds
    const res = await http.get("app/News/GetAll", { params: newParams })
    const { result } = res.data
    // result.items = NewsModel.assigns(result.items || [])
    return result
  }

  public notify(newsId: number) {
    return http
      .post("api/services/app/News/SendEventNotification", null, {
        params: { eventId: newsId },
      })
      .then(() => {
        notifySuccess(
          LNotification("SUCCESS"),
          LNotification(L("NEWS_NOTIFICATION_SENT"))
        )
      })
  }
  public getCategories = async () => {
    return (await http.get("api/Category/GetListNewsCategory")).data.result
  }
}

export default new NewsService()
