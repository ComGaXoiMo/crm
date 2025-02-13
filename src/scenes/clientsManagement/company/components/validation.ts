import { L } from "@lib/abpUtility"
import { checkArrayPhone } from "@lib/validation"

const rules = {
  businessName: [{ required: true }, { max: 500 }],
  required: [{ required: true }],
  legalName: [{ required: true }, { max: 500 }],
  legalNameVi: [{ required: false }, { max: 500 }],
  nationalityId: [{ required: false }],
  leadSourceId: [{ required: true }],
  industryId: [{ required: true }],
  clientTypeId: [{ required: true }],
  website: [{ required: false }, { max: 500 }],
  vatCode: [{ required: true }, { max: 50 }],
  description: [{ required: false }, { max: 2000 }],
  bank: [{ required: false }, { max: 500 }],
  companyPhone: [
    {
      required: false,
    },

    { type: "array" as const },
    {
      validator: (rule, value) =>
        checkArrayPhone(rule, value, "COMPANY_PHONE", true),
      message: L("FORMAT_PHONE_NUMBER_VALIDATE"),
    },
  ],
  companyAddress: [
    {
      required: true,
    },
  ],
}

export default rules
