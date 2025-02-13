import { EntityDto } from './../../dto/entityDto'

export default class UserLoginInfoDto extends EntityDto {
  name!: string
  displayName!: string
  surname!: string
  userName!: string
  emailAddress!: string
  phoneNumber!: string 
  userInfo!: {isEmailConfirmed: boolean
    isPhoneConfirmed: boolean
    status: number
    userLogins: string[]}
}
