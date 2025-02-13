import { PagedResultDto } from "@services/dto/pagedResultDto"
import settingVatService from "@services/settingVatService"
import { action, observable } from "mobx"

class SettingVatStore {
  @observable isLoading = false;

  @observable pageResult: PagedResultDto<any> = { totalCount: 0, items: [] };
  @observable leaseAgreementDetail!: any;

  constructor() {
    this.pageResult = { totalCount: 0, items: [] }
  }
  @action getAll = async (params) => {
    this.isLoading = true
    this.pageResult = await settingVatService
      .getAll(params)
      .finally(() => (this.isLoading = false))
  };
  @action
  async createOrUpdate(body) {
    this.isLoading = true

    const newBody = await { ...body }

    const result = await settingVatService
      .createOrUpdate({ ...newBody })
      .finally(() => (this.isLoading = false))
    this.pageResult.items.push(result)
    return result
  }

  @action
  async synVATToPaymentUnBill(id) {
    this.isLoading = true

    await settingVatService
      .synVATToPaymentUnBill(id)
      .finally(() => (this.isLoading = false))
  }
}

export default SettingVatStore
