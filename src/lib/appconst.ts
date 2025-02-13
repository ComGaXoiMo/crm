import { L, LCategory } from "./abpUtility"
import {
  ExcelIcon,
  ImageIcon,
  OtherFileIcon,
  PdfIcon,
  WordIcon,
  PowerPointIcon,
} from "@components/Icon"
import { useEffect, useRef } from "react"

export const AppConfiguration = {
  appBaseUrl: "",
  remoteServiceBaseUrl: "",
  googleMapKey: "AIzaSyC43U2-wqXxYEk1RBrTLdkYt3aDoOxO4Fw",
  appLayoutConfig: {} as any,
}

export const validateStatus = {
  validating: "validating",
  success: "success",
  error: "error",
  warning: "warning",
}
export const firebaseConfig = {
  apiKey: "AIzaSyBWB9UZA57pjeVhQ6IrZ7XfXc-3uuZag0Q",
  authDomain: "sbhub-admin.firebaseapp.com",
  databaseURL: "https://sbhub-admin.firebaseio.com",
  projectId: "sbhub-admin",
  storageBucket: "sbhub-admin.appspot.com",
  messagingSenderId: "1065389236552",
  appId: "1:1065389236552:android:1311d58ede888d25b1537d",
}
export const defaultLocation = {
  lat: 10.8230989,
  lng: 106.6296638,
}
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export const StepOTPVariable = {
  otpOldPhone: "old-phone-otp",
  otpNewPhone: "new-phone-otp",
  newPhoneNumber: "new-phone",
}

const AppConsts = {
  vnCountryId: 232,
  noImage: "/assets/images/logo.png",
  tableMaxHeight: window.innerHeight - 440,
  tableWidth: {
    date: 150,
    shortCode: 100,
  },

  inquiryStatusOverview: [
    { id: "1", name: "New inquiry" },
    {
      id: "2",
      name: "Offer",
    },
    {
      id: "3",
      name: "Lease agreement",
    },
    {
      id: "4",
      name: "Confirmed",
    },
    {
      id: "5",
      name: "Dropped",
    },
  ],
  inquiryStatus: {
    newInquiry: {
      id: 1,
      name: "newInquiry",
    },
    offer: {
      id: 2,
      name: "offer",
    },
    leaseAgreement: {
      id: 3,
      name: "leaseAgreement",
    },
    confirmed: {
      id: 4,
      name: "confirmed",
    },
    dropped: {
      id: 5,
      name: "dropped",
    },
  },
  unitStatus: {
    vacant: 1 as const,
    leased: 2 as const,
    showRoom: 3 as const,
    renovation: 4 as const,
    pmhUse: 5 as const,
    inhouseUse: 6 as const,
    outOfOrder: 7 as const,
    outOfService: 8 as const,
  },
  documentType: {
    other: 9 as const,
    image: 8 as const,
    logo: 10 as const,
  },
  itemDashboard: {
    overView: 1,
    property: 2,
    client: 3,
    inquiry: 4,
    LA: 5,
    task: 6,
    staff: 7,
    commission: 8,
    deposit: 9,
    unitOcc: 10,
    appUsage: 11,
    performances: 12,
  },
  leaseStatus: {
    laDraft: 7,
    LaSigned: 10,
    laConfirm: 17,
  },
  leaseStage: {
    new: 1 as const,
    confirm: 2 as const,

    terminate: 3 as const,
    earlyTerminate: 4 as const,
    drop: 5 as const,
  },

  dashboardOccType: {
    date: 0 as const,
    week: 1 as const,

    month: 2 as const,
  },
  proposalTemplateType: {
    unit: 2 as const,
    project: 1 as const,
  },

  pdfType: {
    portrait: "portrait",
    landscape: "landscape",
  },
  activityTypes: {
    proposal: 1,
    siteVisit: 2,
    reservation: 3,
  },
  leaseFeeType: {
    rent: 0 as const,
    scCharge: 1 as const,
    otherFee: 2 as const,
    discount: 3 as const,
  },
  roles: {
    admin: 3,
    dealer: 4,
  },
  sorterKey: {
    ascend: "asc",
    descend: "desc",
  },
  align: {
    right: "right" as const,
    left: "left" as const,
    center: "center" as const,
  },
  dataType: {
    string: "string" as const,
    number: "number" as const,
    boolean: "boolean" as const,
    method: "method" as const,
    regexp: "regexp" as const,
    integer: "integer" as const,
    float: "float" as const,
    object: "object" as const,
    enum: "enum" as const,
    date: "date" as const,
    url: "url" as const,
    hex: "hex" as const,
    email: "email" as const,
  },
  positionUser: {
    admin: 1 as const,
    dealer: 0 as const,
  },
  notifiType: {
    proposal: 9 as const,
    bookingForm: 17 as const,
    deposit: 18 as const,
    terminateNote: 19 as const,
    leaseAgreement: 20 as const,
  },
  unitReservationStatus: {
    new: 1 as const,
    close: 2 as const,
    cancel: 3 as const,
    expried: 4 as const,
    userCancel: 5 as const,
  },
  activityType: {
    call: 1 as const,
    mail: 2 as const,
    proposal: 3 as const,
    sitevisit: 4 as const,
    reservation: 5 as const,
  },

  paymentStatus: {
    unBill: 1 as const,
    paid: 2 as const,
    cancel: 3 as const,
  },
  billingStatus: [
    {
      id: 0,
      name: "unBilled",
      get label() {
        return L("UN_BILLED")
      },
    },
    {
      id: 1,
      name: "billed",
      get label() {
        return L("BILLED")
      },
    },
    {
      id: 2,
      name: "canceled",
      get label() {
        return L("CANCELED")
      },
    },
  ],
  listActivityType: [
    {
      id: 1,
      name: "call",
      get label() {
        return L("CALL")
      },
    },
    {
      id: 2,
      name: "mail",
      get label() {
        return L("MAIL")
      },
    },
    {
      id: 3,
      name: "proposal",
      get label() {
        return L("PROPOSAL")
      },
    },
    {
      id: 4,
      name: "sitevisit",
      get label() {
        return L("SITEVISIT")
      },
    },
    {
      id: 5,
      name: "reservation",
      get label() {
        return L("RESERVATION")
      },
    },
  ],
  inquiryStatusConst: {
    confirmed: 4 as const,
    dropped: 5 as const,
  },
  taskStatusForNew: {
    overDue: 101 as const,
    overDueIn3Day: 102 as const,
    DueToday: 103 as const,
    todo: 104 as const,
  },
  proposalType: {
    project: 1 as const,
    unit: 2 as const,
  },
  listProposalType: [
    {
      id: 1,
      name: "Project",
      get label() {
        return L("PROJECT")
      },
    },
    {
      id: 2,
      name: "Unit",
      get label() {
        return L("UNIT")
      },
    },
  ],
  contactType: [
    {
      id: 1,
      name: "individual",
      get label() {
        return L("INDIVIDUAL")
      },
    },
    {
      id: 2,
      name: "company",
      get label() {
        return L("COMPANY")
      },
    },
  ],
  listLaConfirmUnitStatus: [
    {
      id: 2,
      name: "Leased",
      get label() {
        return L("LEASED")
      },
    },
    {
      id: 5,
      name: "PmhUse",
      get label() {
        return L("PMH_USE")
      },
    },
    {
      id: 6,
      name: "InHouseUse",
      get label() {
        return L("IN_HOUSE_USE")
      },
    },
  ],
  inquirySource: [
    {
      id: 1,
      name: "newLead",
      get label() {
        return L("NEW_LEAD")
      },
    },
    {
      id: 2,
      name: "existTenant",
      get label() {
        return L("EXIST_TENANT")
      },
    },
    {
      id: 3,
      name: "oldProspect",
      get label() {
        return L("OLD_PROSPECT")
      },
    },
  ],
  expiredIn: [
    {
      id: 1,
      get label() {
        return L("0-30")
      },
    },
    {
      id: 2,
      get label() {
        return L("30-60")
      },
    },
    {
      id: 3,
      get label() {
        return L("60-90")
      },
    },
    {
      id: 4,
      get label() {
        return L(">90")
      },
    },
  ],
  leaseTerm: [
    {
      id: 1,
      name: "1year",
      get label() {
        return L("ONE_YEAR")
      },
    },
    {
      id: 2,
      name: "2year",
      get label() {
        return L("TWO_YEAR")
      },
    },
    {
      id: 3,
      name: "3year",
      get label() {
        return L("THREE_YEAR")
      },
    },
  ],
  paymentTerm: [
    {
      id: 1,
      name: "monthly",
      res: 12,
      countMonth: 1,
      get label() {
        return L("MONTHLY")
      },
    },
    {
      id: 2,
      res: 6,
      countMonth: 2,
      name: "biMonthly",
      get label() {
        return L("BI_MONTHLY")
      },
    },
    {
      id: 3,
      res: 4,
      countMonth: 3,
      name: "quaterly",
      get label() {
        return L("QUATERLY")
      },
    },
    {
      id: 4,
      res: 1,
      countMonth: 12,
      name: "yearly",
      get label() {
        return L("YEARLY")
      },
    },
    {
      id: 5,
      name: "oneTimePayment",
      res: 1,
      countMonth: 1,
      get label() {
        return L("ONE_TIME_PAYMENT")
      },
    },
  ],
  term: {
    monthly: 1 as const,
    biMonthly: 2 as const,
    quaterly: 3 as const,
    yearly: 4 as const,
    oneTimePayment: 5 as const,
  },
  depositLAStatus: {
    draf: 11 as const,
    send: 12 as const,
    paid: 13 as const,
    cancelled: 21 as const,
  },
  projectPermissionType: [
    {
      id: 1,
      name: "read",
      get label() {
        return L("READ_PERMISSION")
      },
    },
    {
      id: 2,
      name: "write",
      get label() {
        return L("READ_AND_WRITE_PERMISSION")
      },
    },
  ],

  amendmentLAItems: [
    {
      id: 1,
      name: "Commencement & expiry date",
      get label() {
        return L("Commencement & expiry date")
      },
    },
    {
      id: 2,
      name: "Rent",
      get label() {
        return L("Rent")
      },
    },
    {
      id: 3,
      name: "Other fees (Allowances)",
      get label() {
        return L("Other fees (Allowances)")
      },
    },
    {
      id: 4,
      name: "Discount",
      get label() {
        return L("Discount")
      },
    },
    {
      id: 5,
      name: "Unit",
      get label() {
        return L("Unit")
      },
    },
    {
      id: 6,
      name: "Payment term",
      get label() {
        return L("Payment term")
      },
    },

    {
      id: 8,
      name: "Payment date",
      get label() {
        return L("Payment date")
      },
    },
    {
      id: 9,
      name: "Exchange rate",
      get label() {
        return L("Exchange rate")
      },
    },
  ],
  amendmentItem: {
    commAndExpryDate: 1 as const,
    rent: 2 as const,
    otherFee: 3 as const,
    discount: 4 as const,
    unit: 5 as const,
    paymentTerm: 6 as const,
    checkInAndOutDate: 7 as const,
    paymentDate: 8 as const,
    exchangeRate: 9 as const,
  },

  formVerticalLayout: {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
      lg: { span: 24 },
      xl: { span: 24 },
      xxl: { span: 24 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
      lg: { span: 24 },
      xl: { span: 24 },
      xxl: { span: 24 },
    },
  },
  formVerticalLayout2: {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 10 },
      lg: { span: 10 },
      xl: { span: 12 },
      xxl: { span: 12 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 14 },
      lg: { span: 14 },
      xl: { span: 12 },
      xxl: { span: 12 },
    },
  },
  formHorizontalLayout: {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 12 },
      md: { span: 12 },
      lg: { span: 6 },
      xl: { span: 6 },
      xxl: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 12 },
      md: { span: 12 },
      lg: { span: 18 },
      xl: { span: 18 },
      xxl: { span: 20 },
    },
  },
  projectCategoryTarget: {
    unitType: "UNITTYPE",
    unitStatus: "UNITSTATUS",
    memberRole: "MEMBERROLE",
    memberType: "MEMBERTYPE",
  },
  ratingOptions: [
    {
      value: 1,
    },
    {
      value: 2,
    },
    {
      value: 3,
    },
    {
      value: 4,
    },
    {
      value: 5,
    },
  ],
  escrowOptions: [100000, 200000, 500000, 800000],
  filterCommissionStatus: [
    {
      name: "All",
      value: " ",
      get label() {
        return L("ALL")
      },
    },
    {
      name: "yes",
      value: "true",
      get label() {
        return L("HAS_COMMISSION")
      },
    },
    {
      name: "no",
      value: "false",
      get label() {
        return L("NOT_HAS_COMMISSION")
      },
    },
  ],
  confirmedStatus: [
    {
      name: "All",
      value: " ",
      get label() {
        return L("ALL")
      },
    },
    {
      name: "Active",
      value: "true",
      get label() {
        return L("CONFIRMED")
      },
    },
    {
      name: "Inactive",
      value: "false",
      get label() {
        return L("UNCONFIRMED")
      },
    },
  ],
  activeStatus: [
    {
      name: "All",
      value: " ",
      get label() {
        return L("ALL")
      },
    },
    {
      name: "Active",
      value: "true",
      get label() {
        return L("ACTIVE")
      },
    },
    {
      name: "Inactive",
      value: "false",
      get label() {
        return L("DEACTIVATE")
      },
    },
  ],

  reportType: [
    {
      name: "Year To Date",
      value: "year",
      get label() {
        return L("YEAR_TO_DATE")
      },
    },
    {
      name: "Month To Date",
      value: "month",
      get label() {
        return L("MONTH_TO_DATE")
      },
    },
  ],

  requestStatus: [
    {
      name: "All",
      value: " ",
      get label() {
        return L("REQUEST_ALL")
      },
    },
    {
      name: "Active",
      value: "true",
      get label() {
        return L("REQUEST_ACTIVE")
      },
    },
    {
      name: "Inactive",
      value: "false",
      get label() {
        return L("REQUEST_WAITING")
      },
    },
  ],
  authenticationOptions: [
    {
      name: "All",
      value: " ",
      get label() {
        return L("ALL")
      },
    },
    {
      name: "Active",
      value: "1",
      get label() {
        return L("AUTHENTICATED")
      },
    },
    {
      name: "Inactive",
      value: "0",
      get label() {
        return L("UNAUTHENTICATED")
      },
    },
  ],
  emailAuthenticationStatus: [
    {
      name: "All",
      value: " ",
      get label() {
        return L("ALL")
      },
    },
    {
      name: "Authentication",
      value: "true",
      get label() {
        return L("EMAIL_AUTHENTICATION")
      },
    },
    {
      name: "Unauthentication",
      value: "false",
      get label() {
        return L("EMAIL_UNAUTHENTICATION")
      },
    },
  ],
  phoneAuthenticationStatus: [
    {
      name: "All",
      value: " ",
      get label() {
        return L("ALL")
      },
    },
    {
      name: "Authentication",
      value: "true",
      get label() {
        return L("PHONE_AUTHENTICATION")
      },
    },
    {
      name: "Unauthentication",
      value: "false",
      get label() {
        return L("PHONE_UNAUTHENTICATION")
      },
    },
  ],
  genders: [
    { name: "GENDER_MALE", value: true },
    { name: "GENDER_FEMALE", value: false },
    { name: "GENDER_OTHER", value: undefined },
  ],
  bookingTimes: [
    {
      get name() {
        return L("DAY")
      },
      value: "DAY",
    },
    {
      get name() {
        return L("WEEK")
      },
      value: "WEEK",
    },
    {
      get name() {
        return L("MONTH")
      },
      value: "MONTH",
    },
  ],
  bookingFutureTypes: [
    {
      value: "CURRENT",
      get label() {
        return L("CURRENT")
      },
    },
    {
      value: "CURRENT_AND_NEXT",
      get label() {
        return L("CURRENT_AND_NEXT")
      },
    },
    {
      value: "NEXT",
      get label() {
        return L("NEXT")
      },
    },
  ],
  bookingDates: [
    {
      numNextValidDate: "ALL_DAY",
      value: "ALL_DAY",
      label: "ALL_DAY",
      isAnyTime: true,
      daySelected: true,
      order: 0,
    },
    {
      numNextValidDate: "MONDAY",
      value: "MONDAY",
      label: "MONDAY",
      isAnyTime: true,
      daySelected: true,
      order: 1,
    },
    {
      numNextValidDate: "TUESDAY",
      value: "TUESDAY",
      label: "TUESDAY",
      isAnyTime: true,
      daySelected: true,
      order: 2,
    },
    {
      numNextValidDate: "WEDNESDAY",
      value: "WEDNESDAY",
      label: "WEDNESDAY",
      isAnyTime: true,
      daySelected: true,
      order: 3,
    },
    {
      numNextValidDate: "THURSDAY",
      value: "THURSDAY",
      label: "THURSDAY",
      isAnyTime: true,
      daySelected: true,
      order: 4,
    },
    {
      numNextValidDate: "FRIDAY",
      value: "FRIDAY",
      label: "FRIDAY",
      isAnyTime: true,
      daySelected: true,
      order: 5,
    },
    {
      numNextValidDate: "SATURDAY",
      value: "SATURDAY",
      label: "SATURDAY",
      isAnyTime: true,
      daySelected: true,
      order: 6,
    },
    {
      numNextValidDate: "SUNDAY",
      value: "SUNDAY",
      label: "SUNDAY",
      isAnyTime: true,
      daySelected: true,
      order: 7,
    },
  ],
  reservationStatus: {
    requested: "REQUESTED",
    approved: "APPROVED",
  },
  userManagement: {
    defaultAdminUserName: "admin",
  },
  localization: {
    defaultLocalizationSourceName: "WebLabel",
    sourceWebNotification: "WebNotification",
    sourceWebError: "WebError",
    sourceWebMainMenu: "WebMainMenu",
    sourceWebCategory: "WebCategory",
  },
  authorization: {
    encrptedAuthTokenName: "enc_auth_token",
    projectId: "projectId",
    targetApplication: 1,
  },
  validate: {
    maxNumber: 999999999999,
  },
  masterDataTargets: {
    WORK_ORDER_TYPE: "WorkOrderType",
    UNIT_TYPE: "UnitType",
    UNIT_STATUS: "UnitStatus",
    RESIDENT_TYPE: "ResidentType",
    RESIDENT_ROLE: "ResidentRole",
  },
  notificationTypes: {
    all: 0,
    sms: 1,
    email: 2,
    inApp: 3,
  },
  announcementTypes: {
    picture: "Picture",
    video: "Video",
    updateApp: "UpdateApp",
  },
  announcementMethodTypes: {
    all: 0,
    email: 1,
    inApp: 2,
  },
  announcementMethodTypeKeys: {
    0: "ALL",
    1: "EMAIL", //(allow HTML)
    2: "INAPP",
  },
  announcementStatus: {
    readyForPublish: 1,
    sending: 2,
    completed: 3,
    failed: 4,
  },
  announcementStatusKeys: {
    0: "ANNOUNCEMENT_STATUS_PROCESSING",
    1: "ANNOUNCEMENT_STATUS_READY_FOR_PUBLISH",
    2: "ANNOUNCEMENT_STATUS_SENDING",
    3: "ANNOUNCEMENT_STATUS_COMPLETED",
    4: "ANNOUNCEMENT_STATUS_FAILED",
  },
  monthNamesShort: [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ],
  timeUnits: {
    hours: "HOURS",
    days: "DAYS",
    minutes: "MINUTES",
  },

  cashAdvanceTransactionTypes: {
    receipt: 1,
    expenseMandate: 2,
  },
  pickerType: {
    month: "month",
    quarter: "quarter",
    year: "year",
  },
  datePickerType: [
    {
      get name() {
        return L("MONTH")
      },
      value: "month",
    },
    {
      get name() {
        return L("QUATER")
      },
      value: "quarter",
    },

    {
      get name() {
        return L("YEAR")
      },
      value: "year",
    },
  ],
  dayOfWeek: [
    {
      value: 0,
      name: "Sunday",
    },
    {
      value: 1,
      name: "Monday",
    },
    {
      value: 2,
      name: "Tuesday",
    },
    {
      value: 3,
      name: "Wednesday",
    },
    {
      value: 4,
      name: "Thursday",
    },
    {
      value: 5,
      name: "Friday",
    },
    {
      value: 6,
      name: "Saturday",
    },
  ],
}

export const AppStatus = {
  withdrawStatus: {
    cancelled: "CANCELLED",
    processed: "PROCESSED",
    isDone: (statusCode) =>
      statusCode === "CANCELLED" || statusCode === "PROCESSED",
  },
  activeStatus: {},
  announcementStatus: {
    cancelled: "CANCELLED",
    processed: "PROCESSED",
    isDone: (statusCode) =>
      statusCode === "CANCELLED" || statusCode === "PROCESSED",
  },
}
export const userType = {
  staff: "1",
  tenant: "2",
}

export const loginSteps = {
  login: 1,
  projectSelect: 2,
}
export const loginMethods = {
  systemAccount: 1,
  socialAccount: 2,
  phoneNumber: 3,
}

export const workflowEvent = {
  init: "InitWorkflow",
}
export const documentTypes = {
  image: "IMAGE",
  document: "DOCUMENT",
}
export const cookieKeys = {
  encToken: "enc_auth_token",
}

export function dateDifference(startDate, endDate) {
  const years = endDate.diff(startDate, "years")
  startDate.add(years, "years")

  const months = endDate.diff(startDate, "months")
  startDate.add(months, "months")

  const days = endDate.diff(startDate, "days")

  return {
    years: years,
    months: months,
    days: days,
  }
}
export const keySyncfusion =
  "Mgo+DSMBaFt+QHJqVk1hXk5Hd0BLVGpAblJ3T2ZQdVt5ZDU7a15RRnVfRFxgSXtRdEBrUHdXcw==;Mgo+DSMBPh8sVXJ1S0R+X1pFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF5jT39QdkBhW3pXcHRQRQ==;ORg4AjUWIQA/Gnt2VFhiQlJPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXhSdUVmW31beXRXRWM=;MjQwMTE3MUAzMjMxMmUzMDJlMzBWcml5T3JFdkRac1o1cnRPYnRHQ3ozaEZvZlEzOFlxSFpyVGhBLzBQQ3pJPQ==;MjQwMTE3MkAzMjMxMmUzMDJlMzBUckg5NjlJaXpaeG1LQm52MFN5SzFra3hvOFVueVlFWUsraDNKTE5pd1hJPQ==;NRAiBiAaIQQuGjN/V0d+Xk9HfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5Vd0ZjXH1cdX1UR2Nf;MjQwMTE3NEAzMjMxMmUzMDJlMzBjR3NEUGdBbnpEaUt3NXJTQVpBMHZqWnJ4U0lDUVBCdlVhUS9Vb1J3UTMwPQ==;MjQwMTE3NUAzMjMxMmUzMDJlMzBqNTRTVDdWQVhOeCt0eEdNendTYUFSSXE2M3EyQktwZkRGZ21oL2RLY0tzPQ==;Mgo+DSMBMAY9C3t2VFhiQlJPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXhSdUVmW31beXZVQWM=;MjQwMTE3N0AzMjMxMmUzMDJlMzBhVGlYV1ZGcGs2Z09kTkNNV3ZlUEYzODYvOEdkWFFpc21FcnVTQ2NiVG5ZPQ==;MjQwMTE3OEAzMjMxMmUzMDJlMzBpNnpqYVpiTUFiQ2F2MWZyUit5dGcwSVdLZC9DcXhLbHlIbUNYSmFPV0k4PQ==;MjQwMTE3OUAzMjMxMmUzMDJlMzBjR3NEUGdBbnpEaUt3NXJTQVpBMHZqWnJ4U0lDUVBCdlVhUS9Vb1J3UTMwPQ=="

export const defaultAvatar = "/assets/images/logoCore.png"
export const dateFormat = "DD/MM/YYYY"
export const dateSortFormat = "YYYYMMDD"
export const dateTimeFormat = "DD/MM/YYYY HH:mm"
export const yearFormat = "YYYY"
export const monthFormat = "MM/YYYY"
export const monthCharFormat = "YYYY MMM"
export const weekFormat = "YYYY-[W]WW-MMM"
export const timeFormat = "HH:mm"
export const phoneRegex =
  /^[1-9][+]?\(?([0-9]{0,3})?\)?[-.]?([0-9]{1,3})?[-.]?([0-9]{1,3})[-.]?([0-9]{1,5})$/
export const emailRegex =
  /^(?:[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})?$/
export const modules = [
  {
    get name() {
      return LCategory("MODULE_WORKORDER")
    },
    id: 13,
  },
  {
    get name() {
      return LCategory("MODULE_FEEDBACK")
    },
    id: 20,
  },
]
export const moduleIds = {
  dismantlingRequest: 14,
  jobRequest: 13,
  feedback: 20,
  unit: 1,
  unitEdit: 1001,
  comment: 1002,
  reservation: 17,
  visitor: 1003,
  planMaintenance: 18,
  inventory: 34,
  order: 47,
  inspection: 41,
  cogs: 47,
  ratingBadge: 301,
  feedbackType: 201,
  feedbackCategory: 201,
  opMargin: 47,
  transportationCost: 47,
  quotationProject: 47,
  shareContact: 103,
  company: 7,
  requirement: 26,
  contact: 8,
  opportunity: 9,
  project: 25,
  dealContract: 33,
  activity: 26,
  accountant: 43,
}
export const moduleNames = {
  unit: "UNIT",
  news: "NEWS",
  requirement: "REQUEST",
  company: "COMPANY",
  inquiry: "INQUIRY",
  contact: "CONTACT",
  contract: "CONTRACT",
  opportunity: "OPPORTUNITY",
  project: "PROJECT",
  logoProject: "LOGO_PROJECT",
  dealContract: "DEAL",
  listing: "LISTING",
  mail: "MAIL",
  tenant: "TENANT",
}
export const modulePrefix = {
  13: "WORK_ORDER_WF_",
  20: "FEEDBACK_WF_",
  14: "DISMANTLING_REQUEST_",
}

export const sidebarStatus = {
  menu: 1,
  setting: 2,
  account: 3,
}

export const budgetAppType = {
  unit: 1,
  revenue: 2,
}
export const moduleFile = {
  library: "Library",
  project: "Project",
  workOrder: "WorkOrder",
  feedback: "Feedback",
  news: "News",
  event: "Event",
  reservation: "Reservation",
  chatMessage: "ChatMessages",
  amenity: "Amenities",
  visitor: "Visitor",
  company: "Company",
  contract: "Contract",
  contractCategory: "ContractCategory",
  buildingDirectory: "BuildingDirectory",
  planMaintenance: "PlanMaintenance",
  asset: "AssetManagement",
  shopOwner: "ShopOwner",
  product: "Product",
  inventory: "Inventory",
  inventoryStockIn: "InventoryStock",
  inventoryStockOut: "InventoryAllocate",
}
export const notificationMethod = {
  1: "SMS",
  2: "EMAIL", //(allow HTML)
  3: "INAPP",
}
export const notificationMethods = [
  {
    get name() {
      return LCategory("SMS")
    },
    id: 1,
  },
  {
    get name() {
      return LCategory("EMAIL")
    },
    id: 2,
  },
  {
    get name() {
      return LCategory("INAPP")
    },
    id: 3,
  },
]
export const userGroups = [
  {
    get name() {
      return LCategory("STAFF")
    },
    id: 1,
  },
  {
    get name() {
      return LCategory("CUSTOMER")
    },
    id: 2,
  },
  {
    get name() {
      return LCategory("PARTNER")
    },
    id: 3,
  },
]

export const phoneStatus = {
  undefined: 0,
  available: 1,
  inActive: 2,
  notFound: 3,
}

export const getEscalationModuleByModuleId = (moduleId) => {
  switch (moduleId) {
    case moduleIds.inspection: {
      return 4
    }
    case moduleIds.planMaintenance: {
      return 3
    }
    case moduleIds.feedback: {
      return 2
    }
    case moduleIds.jobRequest:
    default: {
      return 1
    }
  }
}
export const appStatusColors = {
  success: "#689F38",
  error: "#EB7077",
  valid: "#689F38",
  expired: "#CCCCCC",
}
export const backgroundColors = [
  "#FAC51D",
  "#66BD6D",
  "#FAA026",
  "#29BB9C",
  "#E96B56",
  "#55ACD2",
  "#B7332F",
  "#2C83C9",
  "#9166B8",
  "#92E7E8",
]
export const getBackgroundColorByIndex = (arrayIndex) => {
  const index = arrayIndex % backgroundColors.length
  return backgroundColors[index]
}

export const moduleAvatar = {
  myProfile: "myProfile",
  staff: "Staff",
  resident: "Resident",
  shopOwner: "ShopOwner",
  project: "Project",
  colorByLetter: (letter) => {
    if (!backgroundColors || !letter) return "#fff"

    const charCode = letter.charCodeAt(0)
    return getBackgroundColorByIndex(charCode)
  },
}
export const wfFieldTypes = {
  text: 0,
  number: 1,
  money: 2,
  dateTime: 3,
  list: 4,
}

export const ckeditorToolbar = {
  toolbarGroups: [
    { name: "document", groups: ["mode", "doctools", "document", "source"] },
    { name: "clipboard", groups: ["clipboard", "undo"] },
    {
      name: "editing",
      groups: ["find", "selection", "spellchecker", "editing"],
    },
    { name: "styles", groups: ["styles", "font-family"] },
    { name: "forms", groups: ["forms"] },
    { name: "colors", groups: ["colors"] },
    { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
    {
      name: "paragraph",
      groups: ["align", "list", "indent", "blocks", "bidi", "paragraph"],
    },
    { name: "links", groups: ["links"] },
    { name: "insert", groups: ["insert"] },
    { name: "tools", groups: ["tools"] },
    { name: "others", groups: ["others"] },
    { name: "about", groups: ["about"] },
  ],
  removeButtons:
    "Save,Templates,Cut,NewPage,Preview,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,ShowBlocks,About,Flash,PageBreak,HorizontalRule,Language,BidiRtl,BidiLtr,Blockquote,CreateDiv,Smiley,Iframe",
}
export const mimeType = {
  "application/pdf": PdfIcon,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    ExcelIcon,
  "application/vnd.ms-excel": ExcelIcon,
  "application/msword": WordIcon,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    WordIcon,
  "application/vnd.ms-powerpoint": PowerPointIcon,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    PowerPointIcon,
  "image/jpeg": ImageIcon,
  "image/png": ImageIcon,
  other: OtherFileIcon,
}
export const mimeTypeToImagePath = {
  "application/pdf": "/assets/icons/pdf.svg",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "/assets/icons/excel.svg",
  "application/vnd.ms-excel": "/assets/icons/excel.svg",
  "application/msword": "/assets/icons/word.svg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "/assets/icons/word.svg",
  "application/vnd.ms-powerpoint": "/assets/icons/power-point.svg",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "/assets/icons/power-point.svg",
  "image/jpeg": "/assets/icons/image-file.svg",
  "image/png": "/assets/icons/image-file.svg",
  other: "/assets/icons/other-file.svg",
}
export const appPermissions = {
  adminUser: {
    page: "PagesAdministration.Users",
    create: "PagesAdministration.Users.Create",
    read: "PagesAdministration.Users.Read",
    update: "PagesAdministration.Users.Update",
    delete: "PagesAdministration.Users.Delete",
  },
  adminTenant: {
    page: "PagesAdministration.Roles",
    create: "PagesAdministration.Roles.Create",
    read: "PagesAdministration.Roles.Read",
    update: "PagesAdministration.Roles.Update",
    delete: "PagesAdministration.Roles.Delete",
  },

  workflow: {
    page: "PagesAdministration.Workflow",
    create: "PagesAdministration.Workflow.Create",
    read: "PagesAdministration.Workflow.Read",
    update: "PagesAdministration.Workflow.Update",
    delete: "PagesAdministration.Workflow.Delete",
    detail: "PagesAdministration.Workflow.Detail",
  },

  ratingBadge: {
    page: "PagesAdministration.MasterData",
    create: "PagesAdministration.MasterData.Create",
    read: "PagesAdministration.MasterData.Read",
    update: "PagesAdministration.MasterData.Update",
    delete: "PagesAdministration.MasterData.Delete",
    detail: "PagesAdministration.MasterData.Export",
    export: "PagesAdministration.MasterData.Export",
    import: "PagesAdministration.MasterData.Import",
  },

  // Account

  customer: {
    page: "PagesAdministration.Customer",
    create: "PagesAdministration.Customer.Create",
    read: "PagesAdministration.Customer.Read",
    update: "PagesAdministration.Customer.Update",
    delete: "PagesAdministration.Customer.Delete",
    detail: "PagesAdministration.Customer.Detail",
  },
  partner: {
    page: "PagesAdministration.Partner",
    create: "PagesAdministration.Partner.Create",
    read: "PagesAdministration.Partner.Read",
    update: "PagesAdministration.Partner.Update",
    delete: "PagesAdministration.Partner.Delete",
    detail: "PagesAdministration.Partner.Detail",
  },
  // Services
  userTenant: {
    page: "PagesAdministration.UserTenant",
    create: "PagesAdministration.UserTenant.Create",
    read: "PagesAdministration.UserTenant.Read",
    detail: "PagesAdministration.UserTenant.Detail",
    update: "PagesAdministration.UserTenant.Update",
    delete: "PagesAdministration.UserTenant.Delete",
  },
  feedback: {
    page: "PagesAdministration.Feedback",
    create: "PagesAdministration.Feedback.Create",
    read: "PagesAdministration.Feedback.Read",
    update: "PagesAdministration.Feedback.Update",
    delete: "PagesAdministration.Feedback.Delete",
    detail: "PagesAdministration.Feedback.Detail",
    myWorkOrder: "PagesAdministration.Feedback.MyWorkorder",
    export: "PagesAdministration.Feedback.Export",
  },
  news: {
    page: "PagesAdministration.News",
    create: "PagesAdministration.News.Create",
    read: "PagesAdministration.News.Read",
    update: "PagesAdministration.News.Update",
    delete: "PagesAdministration.News.Delete",
    detail: "PagesAdministration.News.Detail",
  },

  announcement: {
    page: "PagesAdministration.Workorder",
    create: "PagesAdministration.Workorder.Create",
    read: "PagesAdministration.Workorder.Read",
    update: "PagesAdministration.Workorder.Update",
    delete: "PagesAdministration.Workorder.Delete",
    detail: "PagesAdministration.Workorder.Detail",
  },
  system: {
    paymentSetting: "PagesAdministration.System.Settings",
  },
  expenseMandate: {
    page: "PagesAdministration.ExpenseMandateRequest",
    create: "PagesAdministration.ExpenseMandateRequest.Update",
    read: "PagesAdministration.ExpenseMandateRequest.Read",
    update: "PagesAdministration.ExpenseMandateRequest.Update",
    delete: "PagesAdministration.ExpenseMandateRequest.Delete",
  },

  //PMH
  company: {
    page: "PagesAdministration.Company",
    create: "PagesAdministration.Company.Create",
    read: "PagesAdministration.Company.Read",
    update: "PagesAdministration.Company.Update",
    delete: "PagesAdministration.Company.Delete",
    detail: "PagesAdministration.Company.Detail",
    export: "PagesAdministration.Company.Export",
  },
  contact: {
    page: "PagesAdministration.Contact",
    associate: "PagesAdministration.Contact.Associate",
    create: "PagesAdministration.Contact.Create",
    read: "PagesAdministration.Contact.Read",
    update: "PagesAdministration.Contact.Update",
    delete: "PagesAdministration.Contact.Delete",
    detail: "PagesAdministration.Contact.Detail",
    export: "PagesAdministration.Contact.Export",
  },
  inquiry: {
    page: "PagesAdministration.Inquiry",
    create: "PagesAdministration.Inquiry.Create",
    read: "PagesAdministration.Inquiry.Read",
    update: "PagesAdministration.Inquiry.Update",
    delete: "PagesAdministration.Inquiry.Delete",
    detail: "PagesAdministration.Inquiry.Detail",
    unlimit: "PagesAdministration.Inquiry.UnlimitReservation",
    fullEdit: "PagesAdministration.Inquiry.FullEdit",
  },
  deposit: {
    page: "PagesAdministration.Deposit",
    create: "PagesAdministration.Deposit.Create",
    read: "PagesAdministration.Deposit.Read",
    update: "PagesAdministration.Deposit.Update",
    delete: "PagesAdministration.Deposit.Delete",
  },
  task: {
    page: "PagesAdministration.Task",
    create: "PagesAdministration.Task.Create",
    read: "PagesAdministration.Task.Read",
    update: "PagesAdministration.Task.Update",
    delete: "PagesAdministration.Task.Delete",
    detail: "PagesAdministration.Task.Detail",
    allTask: "PagesAdministration.Task.AllTask",
  },
  leaseAgreement: {
    page: "PagesAdministration.LeaseAgreement",
    create: "PagesAdministration.LeaseAgreement.Create",
    read: "PagesAdministration.LeaseAgreement.Read",
    update: "PagesAdministration.LeaseAgreement.Update",
    delete: "PagesAdministration.LeaseAgreement.Delete",
    detail: "PagesAdministration.LeaseAgreement.Detail",
    requestLa: "PagesAdministration.LeaseAgreement.Request",
    lock: "PagesAdministration.LeaseAgreement.Block",
    commission: "PagesAdministration.LeaseAgreement.ViewCommission",
    editCommission: "PagesAdministration.LeaseAgreement.EditCommission",
    dealerCommission: "PagesAdministration.LeaseAgreement.DealerCommission",
    fullEdit: "PagesAdministration.LeaseAgreement.FullEdit",
  },
  amendment: {
    page: "PagesAdministration.Amendment",
    create: "PagesAdministration.Amendment.Create",
    read: "PagesAdministration.Amendment.Read",
    update: "PagesAdministration.Amendment.Update",
    delete: "PagesAdministration.Amendment.Delete",
  },
  project: {
    page: "PagesAdministration.Project",
    create: "PagesAdministration.Project.Create",
    read: "PagesAdministration.Project.Read",
    update: "PagesAdministration.Project.Update",
    delete: "PagesAdministration.Project.Delete",
    detail: "PagesAdministration.Project.Detail",
    export: "PagesAdministration.Project.Export",
    userPermission: "PagesAdministration.Project.UserPermission",
  },
  setting: {
    page: "PagesAdministration.Setting",
    create: "PagesAdministration.Setting.Create",
    read: "PagesAdministration.Setting.Read",
    update: "PagesAdministration.Setting.Update",
    delete: "PagesAdministration.Setting.Delete",
    detail: "PagesAdministration.Setting.Detail",
  },
  budget: {
    page: "PagesAdministration.Budget",
    create: "PagesAdministration.Budget.Create",
    read: "PagesAdministration.Budget.Read",
    update: "PagesAdministration.Budget.Update",
    delete: "PagesAdministration.Budget.Delete",
  },
  report: {
    page: "PagesAdministration.Report",
    overview: "PagesAdministration.Report.Overview",
    property: "PagesAdministration.Report.Property",
    client: "PagesAdministration.Report.Client",
    inquiry: "PagesAdministration.Report.Inquiry",
    leaseAgreement: "PagesAdministration.Report.LA",
    task: "PagesAdministration.Report.Task",
    commission: "PagesAdministration.Report.Commission",
    staff: "PagesAdministration.Report.Staff",
    deposit: "PagesAdministration.Report.Deposit",
    unitOcc: "PagesAdministration.Report.UnitOcc",
    appUsage: "PagesAdministration.Report.AppUsage",
    budget: "PagesAdministration.Report.Budget",
  },
  staff: {
    page: "PagesAdministration.Staff",
    create: "PagesAdministration.Staff.Create",
    read: "PagesAdministration.Staff.Read",
    update: "PagesAdministration.Staff.Update",
    delete: "PagesAdministration.Staff.Delete",
    detail: "PagesAdministration.Staff.Detail",
    tranfers: "PagesAdministration.Staff.Tranfers",
  },
  unit: {
    page: "PagesAdministration.Unit",
    create: "PagesAdministration.Unit.Create",
    read: "PagesAdministration.Unit.Read",
    update: "PagesAdministration.Unit.Update",
    delete: "PagesAdministration.Unit.Delete",
    detail: "PagesAdministration.Unit.Detail",
    export: "PagesAdministration.Unit.Export",
  },
  adminLanguage: {
    page: "PagesAdministration.Languages",
    create: "PagesAdministration.Languages.Create",
    read: "PagesAdministration.Languages.Read",
    detail: "PagesAdministration.Languages.Detail",
    update: "PagesAdministration.Languages.Update",
    delete: "PagesAdministration.Languages.Delete",
    changeText: "PagesAdministration.Languages.ChangeTexts",
  },
  adminTeam: {
    page: "PagesAdministration.Teams",
    create: "PagesAdministration.Teams.Create",
    read: "PagesAdministration.Teams.Read",
    update: "PagesAdministration.Teams.Update",
    delete: "PagesAdministration.Teams.Delete",
    detail: "PagesAdministration.Teams.Detail",
  },
  adminRole: {
    page: "PagesAdministration.Roles",
    create: "PagesAdministration.Roles.Create",
    read: "PagesAdministration.Roles.Read",
    update: "PagesAdministration.Roles.Update",
    delete: "PagesAdministration.Roles.Delete",
    detail: "PagesAdministration.Roles.Detail",
  },
}

// Administrative Level
export enum AdministrativeLevel {
  administrative_area_level_1 = "administrative_area_level_1",
  administrative_area_level_2 = "administrative_area_level_2",
  administrative_area_level_3 = "administrative_area_level_3",
  undefined = "undefined",
}

// Notification
export const notificationTypes = {
  text: 1,
  download: 2,
  gotoDetail: 3,
}

// fileType
export const fileTypeGroup = {
  images: [".png", ".jpg", ".jpeg"],
  documents: [".csv", ".xlsx", ".pdf", ".doc", ".docx"],
  documentAndImage: [
    ".csv",
    ".xlsx",
    ".pdf",
    ".doc",
    ".docx",
    ".png",
    ".jpg",
    ".jpeg",
  ],
}

// Layout constant
export const themeByEvent = {
  events: {
    default: "default",
    xmasSanta: "xmas-santa",
    xmasHouse: "xmas-house",
    xmasNight: "xmas-night",
    flowers: "flowers",
  },
}

export const retrieveTypes = {
  administrative_area_level_1: ["(cities)"],
  administrative_area_level_2: ["(regions)"],
  undefined: [],
}

export const routeByModules = {
  [moduleIds.company]: "/company-detail/:id",
  [moduleIds.contact]: "/contact-detail/:id",
  [moduleIds.project]: "/project-detail/:id",
  [moduleIds.opportunity]: "/opportunity-detail/:id",
  [moduleIds.requirement]: "/requirement-detail/:id",
  [moduleIds.dealContract]: "/deal-contract-detail/:id",
  [moduleIds.accountant]: "/accountant-detail/:id",
}
export const MODULES = [
  { label: "COMPANY", value: moduleIds.company },
  { label: "CONTACT", value: moduleIds.contact },
  { label: "OPPORTUNITY", value: moduleIds.opportunity },
  { label: "PROJECT", value: moduleIds.project },
  { label: "DEAL", value: moduleIds.dealContract },
]
export const GENDERS = [
  { value: "Mr.", label: "Mr." },
  { value: "Ms.", label: "Ms." },
  { value: "Mrs.", label: "Mrs." },
  { value: "Dr.", label: "Dr." },
]
export const listDays = [
  {
    get label() {
      return L("{0}_DAYS", 7)
    },
    value: 7,
  },
  {
    get label() {
      return L("{0}_DAYS", 30)
    },
    value: 30,
  },
  {
    get label() {
      return L("{0}_DAYS", 60)
    },
    value: 60,
  },
  {
    get label() {
      return L("{0}_DAYS", 180)
    },
    value: 180,
  },
]
export const percentOptions = [
  { value: 0, label: "0%" },
  { value: 30, label: "30%" },
  { value: 50, label: "50%" },
  { value: 70, label: "70%" },
  { value: 100, label: "100%" },
]
export const rangePickerPlaceholder: any = () => {
  const label = [
    {
      get label() {
        return L("FROM_DATE")
      },
    },
    {
      get label() {
        return L("TO_DATE")
      },
    },
  ]
  return label.map((i: any) => i.label)
}
export default AppConsts
