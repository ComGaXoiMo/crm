export interface GetAllUserOutput {
  userName: string
  name: string
  surname: string
  emailAddress: string
  isActive: boolean
  fullName: string
  lastLoginTime: Date
  creationTime: Date
  roleNames: string[]
  id: number
  displayName: string
}
