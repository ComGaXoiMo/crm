import { action, observable } from "mobx"

import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import contactService from "@services/clientManagement/contactService"
import { AddressModel } from "@models/common/addressModel"

class ContactStore {
  @observable isLoading!: boolean
  @observable tableData!: PagedResultDto<any>
  @observable contactInCompany!: PagedResultDto<any>
  @observable editContact!: any
  @observable checkContact!: any
  @observable listShareContact!: PagedResultDto<any>
  @observable listContactRequest!: PagedResultDto<any>

  @observable listShareContactApproved!: any[]

  @observable listContactSimple!: any

  @observable listContactByLA!: PagedResultDto<any>

  constructor() {
    this.tableData = { items: [], totalCount: 0 }
    this.listContactByLA = { items: [], totalCount: 0 }
    this.listContactSimple = []
    this.listShareContactApproved = []
  }

  @action
  async createOrUpdate(body: any) {
    this.isLoading = true
    const contactAddress = body.contactAddress?.address
      ? [body.contactAddress]
      : []
    const newBody = { ...body, contactAddress }
    await contactService
      .createOrUpdate(newBody)
      .finally(() => (this.isLoading = false))
  }

  @action
  async createContact() {
    this.editContact = {
      name: "",
      isActive: true,
      isVerified: true,
      contactAddress: [new AddressModel(null, null, null, null, true)],
      id: 0,
    }
  }

  @action
  async delete(id: number) {
    await contactService.delete(id)
    this.tableData.items = this.tableData.items.filter((x) => x.id !== id)
  }

  @action
  async activateOrDeactivate(id: number, isActive) {
    await contactService.activateOrDeactivate(id, isActive)
  }

  @action
  async deleteLAContact(contactId, laId) {
    await contactService.deleteLAContact(contactId, laId)
  }
  @action
  async get(id: number, isShowFull: boolean) {
    this.isLoading = true
    const result = await contactService
      .get(id, isShowFull)
      .finally(() => (this.isLoading = false))
    this.editContact = result
  }

  @action
  async getAll(params: any) {
    this.isLoading = true
    const result = await contactService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.tableData = result
  }
  @action
  async getAllContactByLA(params: any) {
    this.isLoading = true
    const result = await contactService
      .getAllContactByLA(params)
      .finally(() => (this.isLoading = false))
    this.listContactByLA = result
  }

  @action
  async getAllinCompany(params: any) {
    this.isLoading = true
    const result = await contactService
      .getAll(params)
      .finally(() => (this.isLoading = false))
    this.contactInCompany = result
  }

  @action
  async checkExistContact(params: any) {
    this.isLoading = true
    const result = await contactService
      .checkExistContact(params)
      .finally(() => (this.isLoading = false))
    this.checkContact = result
  }

  @action
  async resetExistContact() {
    this.checkContact = {}
  }

  @action
  async getSimpleContact(params) {
    this.isLoading = true
    const res = await contactService
      .getSimpleContact(params)
      .finally(() => (this.isLoading = false))
    this.listContactSimple = res?.items?.map((item) => {
      return {
        id: item.id,
        name: `${item.contactName} `,
        company: [{ id: item?.companyId, name: item?.company?.businessName }],
      }
    })
  }

  @action
  async addToListSimpleContact(value) {
    this.listContactSimple = [...this.listContactSimple, { ...value }]
  }
  //share contact
  @action
  async getListContactShare(params: any) {
    this.isLoading = true
    // const {isActive ,...filter } =params
    const filter = { ...params, isActive: true }

    const result = await contactService
      .getListContactShare(filter)
      .finally(() => (this.isLoading = false))
    this.listShareContact = result
  }

  @action
  async getListContactRequest(params: any) {
    this.isLoading = true
    const filter = { ...params, isActive: false }

    const result = await contactService
      .getListContactShare(filter)
      .finally(() => (this.isLoading = false))
    this.listContactRequest = result
  }
  @action
  async getListContactShareApproved(params: any) {
    this.isLoading = true
    const result = await contactService
      .getListContactShareApproved(params)
      .finally(() => (this.isLoading = false))
    this.listShareContactApproved = result
  }
  @action
  async createRequestShareByUser(parmas) {
    this.isLoading = true
    await contactService
      .createRequestShareByUser(parmas)
      .finally(() => (this.isLoading = false))
  }
  @action
  async createRequestShareByHead(parmas) {
    this.isLoading = true
    await contactService
      .createRequestShareByHead(parmas)
      .finally(() => (this.isLoading = false))
  }
  @action
  async approveShare(parmas) {
    this.isLoading = true
    await contactService
      .approveShare(parmas)
      .finally(() => (this.isLoading = false))
  }
  @action
  async rejectShare(parmas) {
    this.isLoading = true
    await contactService
      .rejectShare(parmas)
      .finally(() => (this.isLoading = false))
  }

  @action
  async exportExcel(params: any) {
    this.isLoading = true
    return await contactService
      .exportExcel(params)
      .finally(() => (this.isLoading = false))
  }
}

export default ContactStore
