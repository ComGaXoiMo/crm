import http from '../httpService'
import { OptionModel } from '@models/global'
import { notifySuccess } from '@lib/helper'
import { LNotification } from '@lib/abpUtility'

class MasterDataService {
  public async filterFeedbackTypes(params: any): Promise<OptionModel[]> {
    const res = await http.get('api/services/app/Employees/GetListEntity', {
      params
    })
    const result = res.data.result
    return OptionModel.assigns(result || [])
  }

  public async filterProductOptions(params: any): Promise<OptionModel[]> {
    const res = await http.get('api/services/app/Product/GetAll', { params })
    const result = res.data.result
    return OptionModel.assigns(result.items || [])
  }

  public async filterProjectSizeOptions(params: any): Promise<OptionModel[]> {
    const res = await http.get('api/services/app/ProjectSize/GetAll', { params })
    const result = res.data.result
    return OptionModel.assigns((result.items || []).map((item) => ({ ...item, name: item.size })))
  }

  public async filterProjectTypeOptions(params: any): Promise<OptionModel[]> {
    const res = await http.get('api/services/app/ProjectType/GetAll', { params })
    const result = res.data.result
    return OptionModel.assigns(result.items || [])
  }

  public async filterProvinceOptions(params: any): Promise<OptionModel[]> {
    const res = await http.get('/api/services/app/Transportation/GetListProvince', {
      params
    })
    const result = res.data.result
    return OptionModel.assigns(result || [])
  }

  public async filterDistrictOptions(params: any): Promise<OptionModel[]> {
    const res = await http.get('/api/services/app/Transportation/GetListDistrict', {
      params
    })
    const result = res.data.result
    return OptionModel.assigns(result || [])
  }

  public async filterTruckTypeOptions(params: any): Promise<OptionModel[]> {
    const res = await http.get('/api/services/app/TruckTypes/GetLists', {
      params
    })
    const result = res.data.result
    return OptionModel.assigns(result || [])
  }

  public async filterProjectMasterOptions(params: any): Promise<OptionModel[]> {
    const res = await http.get('api/services/app/Transportation/GetTrucks', {
      params
    })
    const result = res.data.result
    return OptionModel.assigns(result || [])
  }

  public async filterWarehouseOptions(params: any): Promise<OptionModel[]> {
    const res = await http.get('api/services/app/Transportation/GetTrucks', {
      params
    })
    const result = res.data.result
    return OptionModel.assigns(result || [])
  }

  public async filterPersonInChargeOptions(params: any): Promise<OptionModel[]> {
    const res = await http.get('api/services/app/Transportation/GetTrucks', {
      params
    })
    const result = res.data.result
    return OptionModel.assigns(result || [])
  }

  public async filterCustomerOptions(params: any): Promise<OptionModel[]> {
    const res = await http.get('api/services/app/Transportation/GetTrucks', {
      params
    })
    const result = res.data.result
    return OptionModel.assigns(result || [])
  }

  public async filterFeeTypeOptions(params: any): Promise<OptionModel[]> {
    const res = await http.get('api/services/app/ServiceFees/GetLists', {
      params
    })
    return OptionModel.assigns(res.data.result || [])
  }

  public async getPaymentOption() {
    const res = await http.get('api/services/app/CashAdvance/GetChannels')
    const result = res.data.result
    return OptionModel.assigns(result || [])
  }

  public async getTruckBrandOptions(params: any): Promise<OptionModel[]> {
    const res = await http.get('api/services/app/TruckBrands/GetLists', {
      params
    })
    const result = res.data.result
    return OptionModel.assigns(result || [])
  }

  public async getUserStatus(userId) {
    const res = await http.get('api/services/app/User/GetStatusUser', {
      params: { userId }
    })
    return res.data.result
  }
  public async sendActiveEmail(userId) {
    const res = await http.post('api/services/app/Account/SendActivateEmail', null ,{
      params: { userId }
    })
    notifySuccess(LNotification('SUCCESS'), LNotification('SEND_EMAIL_SUCCESSFULLY'))
    return res.data.result
  }
  
}

export default new MasterDataService()
