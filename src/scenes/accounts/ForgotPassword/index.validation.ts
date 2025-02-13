// import { L, LError } from "@lib/abpUtility";
import { emailRegex } from "@lib/appconst"
import { checkPasswordRetype } from "@lib/validation"

const rules = {
  userNameOrEmailAddress: [
    {
      required: true,
      pattern: emailRegex,
      // message: LError("REQUIRED_FIELD_{0}", L("MY_PROFILE_FULL_NAME")),
    },
    { max: 250 },
  ],
  resetCode: [{ required: true }, { max: 50 }],
  password: [{ required: true }, { min: 6 }, { max: 255 }],

  passwordRetype: [
    { required: true },
    { min: 6 },
    { max: 255 },
    checkPasswordRetype,
  ],
}

export default rules
