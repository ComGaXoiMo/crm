import http from '@services/httpService'
import { notifySuccess } from '@lib/helper'
import { LNotification } from '@lib/abpUtility'
import { SystemSetting, ISystemSetting } from '@models/administration/systemSettingModel'

class SystemSettingService {
  public async getAllSetting(): Promise<ISystemSetting> {
    const res = await http.get('/api/services/app/HostSettings/GetAllSettings', {})
    return SystemSetting.assign(res.data.result || {})
  }

  public async updateAllSetting(payload: ISystemSetting) {
    const res = await http.put('/api/services/app/HostSettings/UpdateAllSettings', payload)
    notifySuccess(LNotification('SUCCESS'), LNotification('SAVING_SUCCESSFULLY'))
    return res.data
  }
}

export default new SystemSettingService()
