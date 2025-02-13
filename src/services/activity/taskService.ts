import type { PagedResultDto } from "../dto/pagedResultDto"
import http from "../httpService"
import { L, LNotification } from "../../lib/abpUtility"
import { notifyError, notifySuccess } from "../../lib/helper"
import AppConsts from "@lib/appconst"
const { taskStatusForNew } = AppConsts
class TaskService {
  public async createOrUpdate(body: any) {
    const result = await http.post(
      "api/services/app/InquiryTask/CreateOrUpdate",
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

    const result = await http.get("api/services/app/InquiryTask/Get", {
      params: { id },
    })

    return result.data.result
  }

  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/InquiryTask/GetAll", {
      params,
    })
    const { result } = res.data

    return result
  }
  public async getTaskStatus(): Promise<any> {
    const res = await http.get(
      "api/services/app/Category/GetListInquiryTaskStatus"
    )
    const result =
      [
        {
          color: "#9393937d",
          name: "Overdue",
          id: taskStatusForNew.overDue,
        },
        {
          color: "#861ad87d",

          name: "DueInThreeDay",
          id: taskStatusForNew.overDueIn3Day,
        },
        {
          color: "#ff632ba8",

          name: "DueToDay",
          id: taskStatusForNew.DueToday,
        },
        {
          color: "#12e7eebf",

          name: "ToDo",
          id: taskStatusForNew.todo,
        },
        ...res.data.result,
      ] || []
    return result
  }
}

export default new TaskService()
