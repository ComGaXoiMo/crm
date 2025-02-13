import { PagedResultDto } from '../../dto/pagedResultDto'
import http from '../../httpService'
import { L, LNotification } from '../../../lib/abpUtility'
import { notifyError, notifySuccess } from '../../../lib/helper'
import moment from 'moment-timezone'
import { AppConfiguration } from '../../../lib/appconst'

class CustomerService {
  public async create(body: any) {
    if (body.birthDate) {
      body.birthDate = moment(body.birthDate).toISOString()
    }
    const res = await http.post('api/services/app/Customers/Create', body)
    notifySuccess(LNotification('SUCCESS'), LNotification('SAVING_SUCCESSFULLY'))
    if (res.data.result && res.data.result.birthDate) {
      res.data.result.birthDate = moment(res.data.result.birthDate)
    }
    return res.data.result
  }

  public async update(body: any) {
    if (body.birthDate) {
      body.birthDate = moment(body.birthDate).format('YYYY/MM/DD')
    }

    const res = await http.put('api/services/app/Customers/Update', body)
    notifySuccess(LNotification('SUCCESS'), LNotification('SAVING_SUCCESSFULLY'))
    return res.data.result
  }

  public async delete(id: number) {
    const res = await http.delete('api/services/app/Customers/Delete', { params: { id } })
    return res.data
  }

  public async activateOrDeactivate(id: number, isActive) {
    const res = await http.post('api/services/app/Customers/Active', { id }, { params: { isActive } })
    notifySuccess(LNotification('SUCCESS'), LNotification('UPDATE_SUCCESSFULLY'))
    return res.data
  }

  public async get(id: number): Promise<any> {
    if (!id) {
      notifyError(L('ERROR'), L('ENTITY_NOT_FOUND'))
    }

    const res = await http.get('api/services/app/Customers/Get', { params: { id } })
    if (res.data.result && res.data.result.birthDate) {
      res.data.result.birthDate = moment(res.data.result.birthDate)
    }
    return res.data.result
  }

  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get('api/services/app/Customers/GetAll', { params })
    const result = res.data.result
    if (result.items) {
      (result.items || []).forEach((item) => {
        item.profilePictureUrl = item.profilePictureId
          ? `${AppConfiguration.remoteServiceBaseUrl}api/services/app/Profile/GetProfilePictureById?profilePictureId=${item.profilePictureId}`
          : null
      })
    }

    return res.data.result
  }

  public async filterOptions(params: any): Promise<any> {
    const res = await http.get('api/services/app/Customers/GetAll', { params })
    return (res.data?.result?.items || []).map((item) => ({
      id: item.id,
      value: item.id,
      label: item.displayName,
      displayName: item.displayName,
      emailAddress: item.emailAddress
    }))
  }
  public async getStaticInformation() {
    const res = await http.get('api/services/app/Customers/GetDashboard')
    return res.data.result
  }
  public async getWarning() {
    const res = await http.get('api/services/app/Customers/GetWarning')
    return res.data.result
  }
}

export default new CustomerService()
