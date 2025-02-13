import { LNotification } from "@lib/abpUtility"
import { notifySuccess } from "@lib/helper"
import http from "./httpService"
import { RowBudgetAppModel } from "@models/budgetApp/budgetAppModel"

class BudgetAppService {
  public async getAll(params: any): Promise<any> {
    const res = await http.get(
      "api/services/app/BudgetAppServices/GetBudgetByYear",
      {
        params,
      }
    )
    let { result } = res.data

    result = RowBudgetAppModel.assigns(result)
    return result
  }

  public async createOrUpdate(body: any) {
    const res = await http.post(
      "api/services/app/BudgetAppServices/CreateOrUpdate",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return res.data.result
  }
  public async get(params) {
    const res = await http.get("api/services/app/BudgetAppServices/Get", {
      params,
    })
    const { result } = res.data

    return result
  }
}

export default new BudgetAppService()
