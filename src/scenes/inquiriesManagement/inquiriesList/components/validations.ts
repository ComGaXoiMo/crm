import { L } from "@lib/abpUtility"
import { phoneRegex } from "@lib/appconst"
import { checkArrayEmail, checkArrayPhone } from "@lib/validation"

const rules = {
  required: [{ required: true }],
  contactName: [{ required: true }, { max: 500 }],
  inquiryName: [{ required: true }, { max: 500 }],
  contactPhone: [
    { type: "array" as const },
    {
      required: true,
      pattern: phoneRegex,
      validator: (rule, value) => checkArrayPhone(rule, value, "CONTACT_PHONE"),
      message: L("FORMAT_PHONE_NUMBER_VALIDATE"),
    },
  ],
  contactEmail: [
    { type: "array" as const },
    {
      required: false,
      validator: (rule, value) => checkArrayEmail(rule, value, "CONTACT_EMAIL"),
    },
  ],
}

export default rules
