import type { PagedResultDto } from "@services/dto/pagedResultDto"
import { TermConditionDetailModel } from "@models/termCondition"
import { action, makeAutoObservable, observable } from "mobx"
import termConditionService from "@services/administrator/termConditionService"

class TermConditionStore {
  @observable pagedResult!: PagedResultDto<TermConditionDetailModel>
  @observable isLoading!: boolean
  @observable feeTypes!: TermConditionDetailModel[]
  @observable editTermCondition!: TermConditionDetailModel
  constructor() {
    makeAutoObservable(this)

    this.pagedResult = {
      items: [],
      totalCount: 0,
    }
  }

  @action
  async createOrUpdate(body) {
    await termConditionService.createOrUpdate(body)
  }

  @action
  async get() {
    const result = await termConditionService.get()
    this.editTermCondition = result || new TermConditionDetailModel()
  }

  @action
  async createTermCondition() {
    this.editTermCondition = new TermConditionDetailModel()
  }
}

export default TermConditionStore
