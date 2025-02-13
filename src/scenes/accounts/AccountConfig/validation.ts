import { L, LError } from "@lib/abpUtility"
import { phoneRegex } from "@lib/appconst"

const rules = {
  name: [
    {
      required: true,
      message: LError("REQUIRED_FIELD_{0}", L("MY_PROFILE_NAME")),
    },
  ],
  phoneNumber: [
    { max: 15 },
    {
      required: true,
      pattern: phoneRegex,
      message: LError("REQUIRED_FIELD_{0}", L("MY_PROFILE_PHONE")),
    },
  ],
  surname: [
    {
      required: true,
      message: LError("REQUIRED_FIELD_{0}", L("MY_PROFILE_SURNAME")),
    },
  ],
  displayName: [
    {
      required: true,
      message: LError("REQUIRED_FIELD_{0}", L("MY_PROFILE_FULL_NAME")),
    },
    { max: 200 },
  ],
  userName: [
    {
      required: true,
      message: LError("REQUIRED_FIELD_{0}", L("MY_PROFILE_USER_NAME")),
    },
  ],
  emailAddress: [
    {
      required: true,
      message: LError("REQUIRED_FIELD_{0}", L("MY_PROFILE_EMAIL")),
    },
    { max: 250 },
  ],
  password: [
    {
      required: true,
      message: LError("REQUIRED_FIELD_{0}", L("MY_PROFILE_PASSWORD")),
    },
    { min: 6 },
  ],
}

export const ruleChangePassword = {
  currentPassword: [
    { required: true, message: L("ERROR.PLEASE_INPUT_CURRENT_PASSWORD") },
  ],
  newPassword: [
    { required: true, message: L("ERROR.PLEASE_INPUT_NEW_PASSWORD") },    { min: 6 },
  ],
  newPasswordReType: [
    { required: true, message: L("ERROR.PLEASE_INPUT_NEW_PASSWORD_RETYPE") },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || getFieldValue("newPassword") === value) {
          return Promise.resolve()
        }
        return Promise.reject(L("ERROR.NEW_PASSWORD_DO_NOT_MATCH"))
      },
    }),
  ],
}

export default rules
