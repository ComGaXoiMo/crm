import {
  checkArrayEmail,
  checkArrayPhone,
  checkArrayRequired,
} from "@lib/validation"
import { phoneRegex } from "@lib/appconst"
import { L } from "@lib/abpUtility"

const rules = {
  required: [{ required: true }],
  gender: [{ required: true }],
  contactName: [{ required: true }, { max: 200 }],
  nationalityId: [{ required: false }],

  existPhone: [
    {
      required: true,
    },
    {
      pattern: phoneRegex,
      message: L("FORMAT_PHONE_NUMBER_VALIDATE"),
    },
  ],
  contactPhone: [
    { type: "array" as const },
    {
      required: true,
      pattern: phoneRegex,
      validator: (rule, value) => checkArrayPhone(rule, value, "CONTACT_PHONE"),
    },
  ],
  contactEmail: [
    { type: "array" as const },
    {
      required: false,
      // pattern: emailRegex,
      validator: (rule, value) => checkArrayEmail(rule, value, "CONTACT_EMAIL"),
    },
  ],
  contactAddress: [
    {
      required: true,
      validator: (rule, value) =>
        checkArrayRequired(rule, value, "CONTACT_LOCATION"),
    },
    { type: "array" as const },
  ],
  contactDescription: [
    {
      required: false,
    },
    {
      max: 2000,
    },
  ],
}

export default rules
