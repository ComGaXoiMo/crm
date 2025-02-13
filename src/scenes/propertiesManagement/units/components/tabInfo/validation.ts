// import { checkArrayRequired } from "@lib/validation";

const rules = {
  required: [{ required: true }],
  unitName: [{ required: true }, { max: 50 }],
  floorId: [{ required: true }],
  statusId: [{ required: true }],
  unitTypeId: [{ required: true }],
  size: [{ required: true }],
  roomNumber: [{ require: true }],
  description: [{ require: false }, { max: 2000 }],
}

export const ruleUnitTenant = {
  orgTenantId: [{ required: true }],
  reasonMove: [{ required: false }],
  description: [{ required: false }],
}

export default rules
