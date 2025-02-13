import { phoneRegex } from '@lib/appconst'
import { L, LError } from '../../../../../lib/abpUtility'

const rules = {
  name: [{ required: true, message: LError('REQUIRED_FIELD_{0}', L('MY_PROFILE_NAME')) }],
  phoneNumber: [
    { max: 15 },
    {
      required: true,
      pattern: phoneRegex,
      message: LError('REQUIRED_FIELD_{0}', L('MY_PROFILE_PHONE'))
    }
  ],
  surname: [{ required: true, message: LError('REQUIRED_FIELD_{0}', L('MY_PROFILE_SURNAME')) }],
  displayName: [{ required: true, message: LError('REQUIRED_FIELD_{0}', L('MY_PROFILE_FULL_NAME')) }],
  userName: [{ required: true, message: LError('REQUIRED_FIELD_{0}', L('MY_PROFILE_USER_NAME')) }],
  emailAddress: [{ required: true, message: LError('REQUIRED_FIELD_{0}', L('MY_PROFILE_EMAIL')) }],
  password: [{ required: true, message: LError('REQUIRED_FIELD_{0}', L('MY_PROFILE_PASSWORD')) }]
}

export const ruleChangePassword = {
  currentPassword: [{ required: true, message: L('ERROR.PLEASE_INPUT_CURRENT_PASSWORD') }],
  newPassword: [{ required: true, message: L('ERROR.PLEASE_INPUT_NEW_PASSWORD') }],
  newPasswordReType: [
    { required: true, message: L('ERROR.PLEASE_INPUT_NEW_PASSWORD_RETYPE') },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || getFieldValue('newPassword') === value) {
          return Promise.resolve()
        }
        return Promise.reject(L('ERROR.NEW_PASSWORD_DO_NOT_MATCH'))
      }
    })
  ]
}

export default rules
