import { checkArrayPhone, checkArrayRequired } from "@lib/validation"
import { phoneRegex } from "@lib/appconst"

const rules = {
  businessName: [{ required: true }],
  legalName: [{ required: true }],
  nationalityId: [{ required: false }],
  leadSourceId: [{ required: true }],
  industryId: [{ required: true }],
  clientTypeId: [{ required: true }],
  website: [],
  companyPhone: [
    {
      required: false,
      // validator: (rule, value) =>
      //   checkArrayRequired(rule, value, "COMPANY_PHONE"),
    },
    { type: "array" as const },
    {
      pattern: phoneRegex,
      validator: (rule, value) => checkArrayPhone(rule, value, "COMPANY_PHONE"),
    },
  ],
  companyAddress: [
    {
      required: true,
      validator: (rule, value) =>
        checkArrayRequired(rule, value, "COMPANY_LOCATION"),
    },
    { type: "array" as const },
  ],
}

export default rules
