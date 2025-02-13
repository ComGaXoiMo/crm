import { action, observable } from 'mobx'

import AppConsts from './../lib/appconst'
import LoginModel from '../models/account/Login/loginModel'
import tokenAuthService from '../services/tokenAuth/tokenAuthService'

declare let abp: any

class AuthenticationStore {
  @observable isLoading!: boolean
  @observable phoneLoginModel!: any 
  @observable loginModel: LoginModel = new LoginModel()
  @observable firebaseBody: any = {}
  get isAuthenticated(): boolean {
    if (!abp.session.userId) return false

    return true
  }

  @action public async checkPhoneNumber(phoneNumber) {
    const result = await tokenAuthService.checkPhoneNumber(phoneNumber)
    return result
  }
  @action public async checkSocial(body) {
    this.firebaseBody = body
    const result = await tokenAuthService.checkSocial(body)
    return result
  }
  @action
  public async login(model: LoginModel) {
    this.isLoading = true
    const result = await tokenAuthService.authenticate({
      userNameOrEmailAddress: model.userNameOrEmailAddress,
      password: model.password,
      rememberClient: model.rememberMe
    }).finally(() => this.isLoading = false)

    const tokenExpireDate = model.rememberMe ? new Date(new Date().getTime() + 1000 * result.expireInSeconds) : undefined
    abp.auth.setToken(result.accessToken, tokenExpireDate)
    abp.utils.setCookieValue(
      AppConsts.authorization.encrptedAuthTokenName,
      result.encryptedAccessToken,
      tokenExpireDate,
      abp.appPath,
      undefined,
      {Secure: true}
    )
  }
  @action
  public async loginSocial(body) {
    this.isLoading = true
    const result = await tokenAuthService.socialAuth({
      ...this.firebaseBody,
      ...body}).finally(() => this.isLoading = false)

    const tokenExpireDate = new Date(new Date().getTime() + 1000 * result.expireInSeconds)
    abp.auth.setToken(result.accessToken, tokenExpireDate)
    abp.utils.setCookieValue(
      AppConsts.authorization.encrptedAuthTokenName,
      result.encryptedAccessToken,
      tokenExpireDate,
      abp.appPath,
      undefined,
      {Secure: true}
    )
  }
  @action public async loginSMS(body) {
    this.isLoading = true
    const result = await tokenAuthService.SMSAuth(body).finally(() => this.isLoading = false)

    const tokenExpireDate = new Date(new Date().getTime() + 1000 * result.expireInSeconds)
    abp.auth.setToken(result.accessToken, tokenExpireDate)
    abp.utils.setCookieValue(
      AppConsts.authorization.encrptedAuthTokenName,
      result.encryptedAccessToken,
      tokenExpireDate,
      abp.appPath,
      undefined,
      {Secure: true}
    )
  }
  @action public async getMethod() {
    this.isLoading = true
    const res = await tokenAuthService.getLoginMethod().finally(() => this.isLoading = false)
    return res
  }
  @action public async registerBySMS(body) {
    this.isLoading = true
    const result = await tokenAuthService.registerBySMS(body).finally(() => this.isLoading = false)
    const tokenExpireDate = new Date(new Date().getTime() + 1000 * result.expireInSeconds)
    abp.auth.setToken(result.accessToken, tokenExpireDate)
    abp.utils.setCookieValue(
      AppConsts.authorization.encrptedAuthTokenName,
      result.encryptedAccessToken,
      tokenExpireDate,
      abp.appPath,
      undefined,
      {Secure: true}
    )
  }
  @action public async registerAccount(body) {
    this.isLoading = true
    return await tokenAuthService.registerAccount(body).finally(() => this.isLoading = false)
    
  }
  @action
  logout() {
    abp.utils.deleteCookie(AppConsts.authorization.encrptedAuthTokenName, abp.appPath)
    abp.utils.deleteCookie(AppConsts.authorization.projectId, abp.appPath)

    localStorage.clear()
    sessionStorage.clear()
    abp.auth.clearToken()
  }
}
export default AuthenticationStore
