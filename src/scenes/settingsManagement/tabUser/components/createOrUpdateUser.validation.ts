import { L } from "@lib/abpUtility"
import { emailRegex, phoneRegex } from "@lib/appconst"

const rules = {
  name: [{ required: true }],
  surname: [{ required: true }],
  displayName: [{ required: true }, { min: 6 }, { max: 250 }],
  userName: [{ required: true }, { min: 1 }, { max: 250 }],
  emailAddress: [{ required: true, pattern: emailRegex }, { max: 250 }],
  phoneNumber: [
    { max: 20 },
    {
      required: true,
      pattern: phoneRegex,
      message: L("FORMAT_PHONE_NUMBER_VALIDATE"),
    },
  ],
}

export default rules
