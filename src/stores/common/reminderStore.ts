import { action, observable } from 'mobx'

import { ReminderModel } from '@models/common/reminderModel'
import reminderService from '@services/common/reminderService'
import AppConsts from '@lib/appconst'
const { timeUnits } = AppConsts

class ReminderStore {
  @observable isLoading!: boolean
  @observable module: number
  @observable parentId?: number
  @observable editReminder: ReminderModel

  constructor() {
    this.editReminder = new ReminderModel()
    this.module = 0
    this.parentId = 0
  }

  @action
  public setReminderInfo(module, parentId) {
    this.module = module
    if (parentId) {
      this.parentId = parentId
    }
  }

  @action
  public setReminder(key, value) {
    this.editReminder = {
      ...this.editReminder,
      [key]: value
    }
  }

  @action
  public resetReminder() {
    this.editReminder = new ReminderModel()
    this.parentId = 0
    this.module = 0
  }

  @action
  async getReminder(module, parentId, timeUnit: string) {
    this.isLoading = true
    this.editReminder = await reminderService
      .getReminder(
        {
          module: this.module || module,
          parentId: this.parentId || parentId
        },
        timeUnit
      )
      .finally(() => (this.isLoading = false))
  }

  @action
  async updateReminder(module, parentId, timeUnit: string, isSilent?: boolean) {
    if (!isSilent) {
      this.isLoading = true
    }
    const params = {
      ...this.editReminder,
      moduleId: this.module || module,
      parentId: this.parentId || parentId
    }
    switch (timeUnit) {
      case timeUnits.days:
        params.reminderInMinute = params.reminderInMinute * 24 * 60
        break
      case timeUnits.hours:
        params.reminderInMinute = params.reminderInMinute * 60
        break
    }
    this.editReminder = await reminderService.updateReminder(params).finally(() => {
      if (!isSilent) {
        this.isLoading = false
      }
    })
  }
}

export default ReminderStore
