import { action, makeAutoObservable, observable } from "mobx"
import { initializeApp } from "firebase/app"
import { getAuth, signOut } from "firebase/auth"

import { GetCurrentLoginInformations } from "../services/session/dto/getCurrentLoginInformations"
import sessionService from "../services/session/sessionService"
import userService from "../services/administrator/user/userService"
import { compressImage } from "../lib/helper"
import AppConsts, { firebaseConfig } from "@lib/appconst"
import tokenAuthService from "../services/tokenAuth/tokenAuthService"
import type { HostSettingConfiguration } from "@models/global"
import { AppSettingConfiguration } from "@models/global"
import { userLayout } from "@components/Layout/Router/router.config"
const { authorization } = AppConsts

const defaultAvatar = "/assets/images/logo.svg"
class SessionStore {
  @observable currentLogin: GetCurrentLoginInformations =
    new GetCurrentLoginInformations()
  @observable profilePicture!: string
  @observable appSettingConfiguration!: AppSettingConfiguration
  @observable ownProjects: any = []
  @observable project: any = {}
  @observable hostSetting!: HostSettingConfiguration

  constructor() {
    makeAutoObservable(this)
    this.project = {}
    this.appSettingConfiguration = new AppSettingConfiguration()
  }

  get projectId() {
    return parseInt(
      (localStorage.getItem(authorization.projectId) || 0).toString()
    )
  }

  @action async updateUsername(body) {
    await sessionService.updateUsername(body)
    await this.getCurrentLoginInformations()
  }
  @action async getHostSetting() {
    const res = await sessionService.getHostSetting()
    this.hostSetting = res
    return res
  }
  @action async changeHostSetting(body) {
    const res = await sessionService.changeHostSetting(body)
    this.hostSetting = res
    return res
  }

  @action
  async getCurrentLoginInformations() {
    const result = await sessionService.getCurrentLoginInformations()
    this.currentLogin = result
  }

  @action
  async getWebConfiguration() {
    const result = await sessionService.getWebConfiguration()
    this.appSettingConfiguration = result
  }

  @action
  async getMyProfilePicture() {
    const result = await userService.getMyProfilePicture()
    this.profilePicture = result || defaultAvatar
  }

  @action
  async uploadMyProfilePicture(file) {
    const compressedImage = await compressImage(file, 1024)
    const result = await userService.uploadProfilePicture(compressedImage)
    return result
  }

  @action
  async updateMyProfilePicture(data) {
    await userService.updateMyProfilePicture(data)
    await this.getMyProfilePicture()
  }

  @action
  async updateMyProfile(data) {
    await userService.updateMyProfile(data)
    // if ((this.currentLogin.user.phoneNumber !== data.phoneNumber) || (this.currentLogin.user.emailAddress !== data.emailAddress)) {
    //   await staffService.sendActiveEmail(this.currentLogin.user.id)
    // }
    this.currentLogin.user = { ...this.currentLogin.user, ...data }
  }

  @action
  async logout() {
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        console.log(error)
      })
    abp.utils.deleteCookie(
      AppConsts.authorization.encrptedAuthTokenName,
      abp.appPath
    )
    abp.utils.deleteCookie(AppConsts.authorization.projectId, abp.appPath)

    localStorage.clear()
    sessionStorage.clear()
    abp.auth.clearToken()

    window.location.href = userLayout.accountLogin.path
  }

  @action
  async getOwnProjects(params: any) {
    params.maxResultCount = 1000
    params.isActive = true
    params.sorting = "Name ASC"
    // this.ownProjects = await projectService.filterOptions(params)
    this.project = (this.ownProjects || []).find(
      (item) => item.id === this.projectId
    )
  }

  @action
  async changeProject(project) {
    if (!project) {
      return
    }
    const result = await tokenAuthService
      .switchProject(project.id)
      .finally(() => (this.project = project))
    const tokenExpireDate = new Date(
      new Date().getTime() + 1000 * result.expireInSeconds
    )
    abp.auth.setToken(result.accessToken, tokenExpireDate)
    abp.utils.setCookieValue(
      AppConsts.authorization.encrptedAuthTokenName,
      result.encryptedAccessToken,
      tokenExpireDate,
      abp.appPath,
      undefined,
      { Secure: true }
    )

    localStorage.setItem(authorization.projectId, project.id)
  }
}

export default SessionStore
