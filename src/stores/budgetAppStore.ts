import { budgetAppType } from "@lib/appconst"
import budgetAppService from "@services/budgetAppService"
import { action, makeAutoObservable, observable } from "mobx"

class BudgetAppStore {
  @observable isLoading = false

  @observable pageResultUnit: any = []
  @observable pageResultRevenue: any = []
  @observable detail!: any

  constructor() {
    makeAutoObservable(this)
    this.pageResultUnit = []
    this.pageResultRevenue = []
  }
  @action getAllByUnit = async (params) => {
    this.isLoading = true
    this.pageResultUnit = await budgetAppService
      .getAll({ ...params, type: budgetAppType.unit })
      .finally(() => (this.isLoading = false))
  }
  @action getAllByRevenue = async (params) => {
    this.isLoading = true
    this.pageResultRevenue = await budgetAppService
      .getAll({ ...params, type: budgetAppType.revenue })
      .finally(() => (this.isLoading = false))
  }
  @action
  async createOrUpdate(body) {
    this.isLoading = true

    const result = await budgetAppService
      .createOrUpdate(body)
      .finally(() => (this.isLoading = false))

    return result
  }

  @action
  async get(id) {
    this.isLoading = true

    this.detail = await budgetAppService
      .get({ id })
      .finally(() => (this.isLoading = false))
  }
}

export default BudgetAppStore
