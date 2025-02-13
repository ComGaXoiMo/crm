import { L } from "@lib/abpUtility"
import { emailRegex, phoneRegex } from "@lib/appconst"

const rules = {
  name: [
    {
      required: true,
      max: 50,
    },
  ],
  passport: [
    {
      required: true,
      max: 50,
    },
  ],
  phone: [
    {
      required: false,
      max: 20,
    },
    {
      pattern: phoneRegex,
      message: L("FORMAT_PHONE_NUMBER_VALIDATE"),
    },
  ],
  email: [
    {
      required: false,
      max: 50,
    },
    {
      pattern: emailRegex,
      message: "Not format email address",
    },
  ],
}

export default rules
