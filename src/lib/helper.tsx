import * as React from "react"
import { Avatar, Modal, notification, Tooltip, Select, Tag, Badge } from "antd"
import moment from "moment-timezone"
import * as XLSX from "xlsx-js-style"
import AppConsts, {
  cookieKeys,
  notificationTypes,
  emailRegex,
  moduleAvatar,
  themeByEvent,
  appStatusColors,
  AppConfiguration,
  dateFormat,
} from "./appconst"
import {
  CaretDownOutlined,
  CaretUpOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  MailFilled,
  MailOutlined,
  ManOutlined,
  PhoneFilled,
  PhoneOutlined,
  WomanOutlined,
} from "@ant-design/icons"
// import Badge from "antd/lib/badge";
import { L } from "@lib/abpUtility"
import { Status } from "@models/global"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

const { pdfType } = AppConsts
const { colorByLetter } = moduleAvatar,
  { Option } = Select

export function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener("load", () => callback(reader.result))
  reader.readAsDataURL(img)
}
export function isNumber(value) {
  return typeof value === "number"
}
export function getPreviewFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export const notifyWarning = (message: string, description: string) => {
  notification.warning({ message, description, placement: "bottomLeft" })
}
export const notifyError = (title: string, content: string) => {
  Modal.error({ title, content })
}

export const notifySuccess = (message: string, description: string) => {
  notification.success({ message, description, placement: "bottomLeft" })
}

export const mapActiveStatus = (isActive) => {
  return isActive
    ? new Status(L("ACTIVE"), appStatusColors.success)
    : new Status(L("INACTIVE"), appStatusColors.error)
}

export const addItemToList = (listItem: any[], itemToList: any) => {
  if (!listItem.find((item) => item?.id === itemToList?.id)) {
    listItem.push(itemToList)
  }
}
export const convertFilterDate = (
  currentFilter,
  newDatePicker,
  fromName?,
  toName?
) => {
  const fName = fromName ? fromName : "fromDate"
  const tName = toName ? toName : "toDate"
  const fromDate = newDatePicker
    ? moment(newDatePicker[0]).endOf("days").toJSON()
    : undefined
  const toDate = newDatePicker
    ? moment(newDatePicker[1]).endOf("days").toJSON()
    : undefined
  return { ...currentFilter, [fName]: fromDate, [tName]: toDate }
}

export const handleDownloadPdf = async (element, style, fileName) => {
  const canvas = await html2canvas(element, {
    useCORS: true,
    allowTaint: true,
    logging: true,
    scale: 0.8,
    // imageTimeout:0
  })
  const data = canvas.toDataURL("image/png")
  const pageHeight = style === pdfType.portrait ? 297 : 210
  const pdfWidth = style === pdfType.portrait ? 210 : 297
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width

  const pdf = new jsPDF(style ?? "landscape", "mm", "a4") // Set A4 size

  let position = 0
  let remainingHeight = pdfHeight
  pdf.addImage(data, "WEBP", 0, position, pdfWidth, pdfHeight)
  remainingHeight -= pageHeight
  while (remainingHeight >= 0) {
    pdf.addPage() // Add new page for overflow content
    position = remainingHeight - pdfHeight
    pdf.addImage(data, "WEBP", 0, position, pdfWidth, pdfHeight)
    remainingHeight -= pageHeight
  }

  pdf.save(fileName)
}

export const tableToExcel = (docId, prefix?) => {
  const data = document.getElementById(docId)
  if (data) {
    // Remove elements with class name "scroll-bar" from the content of the data element
    const elementsToRemove = data.getElementsByClassName(
      "ant-table-cell-scrollbar"
    )
    const elementsArray = Array.from(elementsToRemove)
    elementsArray.forEach((element) => {
      element.remove()
    })
  } else {
    console.error(`Element with ID '${docId}' not found.`)
  }
  const excelFile = XLSX.utils.table_to_book(data, {
    sheet: "sheet1",
    cellStyles: true,
    dateNF: "dd/MM/yyyy",
    raw: true,
  })

  // Get the first sheet in the workbook
  const sheetName = excelFile.SheetNames[0]
  const sheet = excelFile.Sheets[sheetName]

  // Define cell style with borders
  const borderStyle = {
    border: {
      top: { color: { rgb: "000000" }, style: "thin" },
      bottom: { color: { rgb: "000000" }, style: "thin" },
      left: { color: { rgb: "000000" }, style: "thin" },
      right: { color: { rgb: "000000" }, style: "thin" },
    },
  }

  const boldStyle = { bold: true }
  // Loop through all cells and apply the border style
  for (const cell in sheet) {
    if (sheet.hasOwnProperty(cell)) {
      // Check if the cell has a valid column index
      if (cell[0] === "!") continue // Skip non-cell properties
      const colIndex = XLSX.utils.decode_col(cell.replace(/[0-9]/g, ""))
      if (colIndex >= 0) {
        if (!sheet[cell].s) sheet[cell].s = {}
        sheet[cell].s.border = borderStyle.border
      }
      const rowIndex = XLSX.utils.decode_row(cell)
      if (rowIndex === 0) {
        sheet[cell].s = { ...sheet[cell].s, ...boldStyle }
      }
      sheet[cell].t = "s"
    }
  }
  const range = XLSX.utils.decode_range(sheet["!ref"] ?? "")

  for (let C = range.s.c; C <= range.e.c; ++C) {
    const colWidth = getColWidth(sheet, C)
    sheet["!cols"] = sheet["!cols"] || []
    sheet["!cols"][C] = { wch: colWidth }
  }

  XLSX.writeFile(excelFile, docId + prefix + ".xlsx")
}
function getColWidth(sheet, colIndex) {
  const maxWidth = 50 // Set a maximum width to avoid overly wide columns
  const cellWidths = [] as any
  const range = XLSX.utils.decode_range(sheet["!ref"])

  for (let R = range.s.r; R <= range.e.r; ++R) {
    const cellValue =
      sheet[XLSX.utils.encode_cell({ r: R, c: colIndex })]?.v || ""
    const cellTextLength = cellValue.toString().length
    cellWidths.push(cellTextLength)
  }

  // Add extra padding (you can adjust this as needed)
  const padding = 2
  const colWidth = Math.min(maxWidth, Math.max(...cellWidths) + padding)

  return colWidth
}

export function isNullOrEmpty(text) {
  if (!text) {
    return true
  }

  text = text.trim()
  return text.length < 1
}

export function isObjectUndefinedOrNull(obj) {
  return obj === undefined || obj === null
}
export function isNumeric(num) {
  return !isNaN(num)
}
export function isValidEmail(text) {
  if (!text || isNullOrEmpty(text)) {
    return false
  }
  return emailRegex.test(text)
}

export function filterOptions(input, option) {
  return option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
}
export function filterOptionsWithNotSpace(input, option) {
  const sanitizedInput = input.replace(/\s/g, "").toLowerCase()
  const sanitizedOption = option?.children?.replace(/\s/g, "").toLowerCase()
  return sanitizedOption?.indexOf(sanitizedInput) >= 0
}
export function arrayToObject(arr, key, value) {
  return arr.reduce((obj, current) => {
    return { ...obj, [current[key]]: current[value] }
  }, {})
}

export function getFirstLetterAndUpperCase(text) {
  return text && text.length ? text.charAt(0).toUpperCase() : "G"
}

export function hexToRGB(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : null
}

export function getCountDownXmasMessage(loaderMessage) {
  // Find the distance between now and the count down date
  // Get today's date and time
  const countDownDate = new Date(new Date().getFullYear(), 11, 25).getTime()
  const now = new Date().getTime()
  const distance = countDownDate - now

  // Time calculations for days, hours, minutes and seconds
  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  return days === 0
    ? "Merry Christmas!"
    : (loaderMessage || "").replace("{0}", `${days}`)
}

export function initMultiLanguageField() {
  return (abp.localization.languages || []).map((lang) => {
    return { languageName: lang.name, icon: lang.icon, value: "" }
  })
}

export function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function mapMultiLanguageField(existLangs) {
  return (abp.localization.languages || []).map((lang) => {
    const currentLang =
      (existLangs || []).find((item) => item.languageName === lang.name) || {}
    return { ...currentLang, languageName: lang.name, icon: lang.icon }
  })
}

export function isBetween(start, end, current) {
  // Format date to remove second
  const startStr = moment(start).format("MM/DD/YYYY HH:mm")
  const endStr = moment(end).format("MM/DD/YYYY HH:mm")
  const currentStr = moment(current).format("MM/DD/YYYY HH:mm")
  const mStart = moment(startStr)
  const mEnd = moment(endStr)
  const mCurrent = moment(currentStr)
  return mStart.isBefore(mCurrent) && mEnd.isAfter(mCurrent)
}

export function isSame(timeA, timeB) {
  const timeAStr = moment(timeA).format("MM/DD/YYYY HH:mm")
  const timeBStr = moment(timeB).format("MM/DD/YYYY HH:mm")
  const mTimeA = moment(timeAStr)
  const mTimeB = moment(timeBStr)

  return mTimeA.isSame(mTimeB)
}
export function renderCompanyAvatar(
  value,
  secondInfo?,
  row?,
  onClick?,
  thirdInfo?
) {
  if (!row) {
    row = {}
  }

  const firstLetter = getFirstLetterAndUpperCase(value || "G")
  const color = colorByLetter(firstLetter)
  return (
    <>
      <div
        className="table-cell-profile"
        onClick={() => (onClick ? onClick() : "")}
      >
        <div>
          <Avatar src={row.profilePictureUrl} style={{ background: color }}>
            {firstLetter}
          </Avatar>
        </div>
        <div className="info ml-2">
          <div className="full-name text-truncate">{value}</div>
          {secondInfo && (
            <div className="phone text-truncate">{secondInfo}</div>
          )}
          {thirdInfo && <div className="phone text-truncate">{thirdInfo}</div>}
        </div>
      </div>
    </>
  )
}

export function renderContactInfo(row) {
  return (
    <div className="small">
      {row.phone && (
        <div className="phone">
          <PhoneOutlined className="mr-1" />
          {row.phone}
        </div>
      )}
      {row.emailAddress && (
        <div className="email">
          <MailOutlined className="mr-1" />
          {row.emailAddress}
        </div>
      )}
      {row.website && (
        <div className="email">
          <GlobalOutlined className="mr-1" />
          {row.website}
        </div>
      )}
      {row.address && (
        <div className="email">
          <EnvironmentOutlined className="mr-1" />
          {row.address}
        </div>
      )}
    </div>
  )
}

export function renderAvatar(value, row?, showUserName?, secondInfo?) {
  if (!row) {
    row = {}
  }

  const firstLetter = getFirstLetterAndUpperCase(value || "G")
  const color = colorByLetter(firstLetter)
  return (
    <>
      <div className="table-cell-profile">
        <div>
          <Avatar src={row.profilePictureUrl} style={{ background: color }}>
            {firstLetter}
          </Avatar>
        </div>
        <div className="info ml-2">
          <div className="full-name text-truncate">
            {L(row.gender ? "GENDER_MR" : "GENDER_MS")} {value}
          </div>
          {secondInfo && (
            <div className="phone text-truncate text-muted">{secondInfo}</div>
          )}
          {row.phoneNumber && (
            <div className="phone text-truncate text-muted">
              {row.phoneNumber}
            </div>
          )}
          {row.emailAddress && !showUserName && (
            <div className="email text-truncate text-muted">
              {row.emailAddress}
            </div>
          )}
          {row.userName && !!showUserName && (
            <div className="phone text-truncate text-muted">{row.userName}</div>
          )}
        </div>
      </div>
    </>
  )
}

export function renderContact(phoneNumber?, email?) {
  return (
    <>
      <div className="table-cell-profile">
        <div className="info ml-2">
          {phoneNumber && (
            <div className="phone text-truncate text-muted">
              <PhoneFilled className="mr-1" />
              {phoneNumber}
            </div>
          )}
          {email && (
            <div className="email text-truncate text-muted">
              <MailFilled className="mr-1" /> {email}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export function renderGender(value) {
  return <>{value ? <ManOutlined /> : <WomanOutlined />}</>
}

export function renderOptions(options, log?, showTooltip?) {
  if (log) {
    console.log(options)
  }
  if (showTooltip === true) {
    return (options || []).map((option, index) => (
      <Option key={index} value={option.value || option.id}>
        <Tooltip title={option.label || option.name}>
          {option.label || option.name}
        </Tooltip>
      </Option>
    ))
  } else {
    return (options || []).map((option, index) => (
      <Option
        disabled={option?.disabled}
        key={index}
        value={option.value || option.id}
      >
        {option.displayName ||
          option.label ||
          option.name ||
          option.code ||
          option.contactName ||
          option.businessName}
      </Option>
    ))
  }
}
export function renderCustomerOptions(options, log?, showTooltip?) {
  if (log) {
    console.log(options)
  }
  return (options || []).map((option, index) => (
    <Option key={index} value={option.id}>
      {showTooltip ? (
        <Tooltip title={`${option.phoneNumber} - ${option.emailAddress}`}>
          {option.displayName}
        </Tooltip>
      ) : (
        option.displayName
      )}
    </Option>
  ))
}
export function renderDotActive(value) {
  return <Badge color={value ? "#689F38" : "#EB7077"} size="default" />
}
export function renderDotComm(value: boolean) {
  return value ? <Badge color={"#FEC20C"} size="default" /> : undefined
}
export function renderPercent(value) {
  if (value) {
    value = (value * 100).toFixed(2)
  }

  return value
}
export function renderMonth(value) {
  if (value) {
    // TODO using global format
    value = moment(value).format("MM/YYYY")
  }

  return value
}
export function renderDate(value) {
  if (value) {
    // TODO using global format
    value = moment(value).format(dateFormat)
  }

  return value
}
export function renderQuarter(value) {
  if (value) {
    // TODO using global format
    value = `Q${moment(value).format("Q-YYYY")}`
  }

  return value
}
export function renderDateTime(value) {
  if (value) {
    // TODO using global format
    value = moment(value).format("DD/MM/YYYY HH:mm")
  }

  return value
}

export function renderTime(value) {
  if (value) {
    // TODO using global format
    value = moment(value).format("HH:mm")
  }

  return value
}

export function renderIsActive(value) {
  return value === true ? (
    // <Tooltip title={L("ACTIVE")}>
    <Tag color="success">Active</Tag>
  ) : (
    // </Tooltip>
    // <Tooltip title={L("INACTIVE")}>
    <Tag color="error">Deactive</Tag>
    // </Tooltip>
  )
}
export function renderIsTrue(value) {
  return value === true ? (
    <Tooltip title={L("TRUE")}>
      <Tag color="green">Yes</Tag>
    </Tooltip>
  ) : (
    <Tooltip title={L("FALSE")}></Tooltip>
  )
}
export function renderLogo(logoUrl, projectName, size = 64) {
  const firstLetter = getFirstLetterAndUpperCase(projectName || "G")
  const color = colorByLetter(firstLetter)
  return (
    <>
      <div className="table-cell-profile">
        <div>
          <Avatar
            shape="square"
            size={size}
            src={logoUrl}
            style={{ background: color }}
          >
            {firstLetter}
          </Avatar>
        </div>
      </div>
    </>
  )
}

export function renderTag(value, color) {
  return (
    <Tag className="cell-round mr-0" color={color}>
      {value}
    </Tag>
  )
}

export function compressImage(file, maxSize) {
  const image = new Image()
  const canvas = document.createElement("canvas")
  const dataURItoBlob = function (dataURI) {
    const bytes =
      dataURI.split(",")[0].indexOf("base64") >= 0
        ? atob(dataURI.split(",")[1])
        : unescape(dataURI.split(",")[1])
    const mime = dataURI.split(",")[0].split(":")[1].split(";")[0]
    const max = bytes.length
    const ia = new Uint8Array(max)
    for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i)
    return new Blob([ia], { type: mime })
  }
  const reader = new FileReader()
  const resize = function () {
    let width = image.width
    let height = image.height
    if (width > height) {
      if (width > maxSize) {
        height *= maxSize / width
        width = maxSize
      }
    } else {
      if (height > maxSize) {
        width *= maxSize / height
        height = maxSize
      }
    }
    canvas.width = width
    canvas.height = height
    canvas.getContext("2d")?.drawImage(image, 0, 0, width, height)
    const dataUrl = canvas.toDataURL("image/jpeg")
    return dataURItoBlob(dataUrl)
  }
  return new Promise(function (ok, no) {
    if (!file.type.match(/image.*/)) {
      no(new Error("Not an image"))
      return
    }
    reader.onload = function (readerEvent) {
      image.onload = function () {
        return ok(resize())
      }
      image.src = readerEvent.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

// Link prepare
export function buildFileUrlWithEncToken(fileUrl) {
  return fileUrl && fileUrl.length
    ? `${fileUrl}&encToken=${encodeURIComponent(
        abp.utils.getCookieValue(cookieKeys.encToken)
      )}`
    : ""
}

export function prepareLinkQueryString(params, url) {
  if (!isObjectUndefinedOrNull(params)) {
    let index = 0
    let query = ""
    Object.keys(params).forEach((key) => {
      const bullet = index === 0 ? "?" : "&"
      let value = params[key]
      if (Array.isArray(params[key])) {
        value = ""
        params[key].forEach((item) => {
          value += (value.length ? "&" : "") + `${key}=${item}`
        })
        query = query + bullet + value
      } else {
        query = query + bullet + key + "=" + value
      }
      index++
    })

    return url + query
  }
  return url
}

export function image2Base64(img: File | Blob | undefined) {
  if (!img) {
    return Promise.resolve("")
  }
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener("load", () => resolve(reader.result))
    reader.readAsDataURL(img)
  })
}

export function getLocalLocale() {
  // ts trick to avoid type checking
  const _navigator: any = navigator
  return (
    _navigator.userLanguage ||
    (navigator.languages &&
      navigator.languages.length &&
      navigator.languages[0]) ||
    navigator.language ||
    _navigator.browserLanguage ||
    _navigator.systemLanguage ||
    "en"
  )
}

export function formatCurrency(val: number, locale?: string, currency = "đ") {
  return ` ${(Math.round(val) + "").replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  )} ${currency}`
}

// export function formatNumber(
//   val: string | number,
//   locale = "vi",
//   currency = "vnd"
// ) {
//   const convertedNum = Number(val);
//   if (isNaN(convertedNum)) return "";

//   let _locale = locale || getLocalLocale();

//   return new Intl.NumberFormat(_locale).format(convertedNum);
// }
export function formatNumber(val?: number, locale = "vi", currency = "vnd") {
  return ` ${(Math.round(val ?? 0) + "").replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  )} `
}
export function formatDynamicPercent(val?: number) {
  if (!val) {
    return 0
  }
  let className = val >= 0 ? "card-text-green" : "card-text-red"
  const icon = val >= 0 ? <CaretUpOutlined /> : <CaretDownOutlined />

  return (
    <strong className={`${className}`}>
      {icon}
      {`${(Math.round(val * 100) / 100 + "").replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      )} %`}
    </strong>
  )
}

export function formatNumberWithSignal(val: number) {
  if (val === undefined) {
    return 0
  } else if (val >= 0) {
    return `+${(Math.round(val) + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  } else {
    return `${(Math.round(val) + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  }
}

export function formatNumberFloat(
  val: number,
  locale = "vi",
  currency = "vnd"
) {
  if (!val) {
    return 0
  }
  return `${(Math.round(val * 100) / 100 + "").replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  )}`
}
export function inputCurrencyFormatter(value, locale = "vi", symbol = "đ") {
  if (value) {
    return `${symbol} ${(Math.round(value) + "").replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    )}`
  } else {
    return `0${symbol}`
  }
}
export function inputCurrencyUSAFormatter(
  value: number,
  locale = "en",
  symbol = "$"
) {
  return `${symbol} ${(Math.round(value * 1000) / 1000 + "").replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  )}`
}
export function inputCurrencyParse(value, locale = "vi", symbol = "đ") {
  return value
    .replace(symbol, "")
    .replace(" ", "")
    .replace(/\$\s?|(,*)/g, "")
}

export function inputNumberFormatter(value, locale = "vi") {
  return `${(value + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

export function inputNumberParse(value, locale = "vi") {
  return value.replace(/\$\s?|(,*)/g, "")
}

export function compactObject(obj) {
  const keys = Object.keys(obj)
  return keys.reduce((result, key) => {
    if (obj[key]) result[key] = obj[key]
    return result
  }, {})
}

// Notification
export function getNotificationAction(userNotification: any) {
  if (
    userNotification.notification.notificationName ===
    "App.DownloadInvalidImported"
  ) {
    return notificationTypes.download
  }
  if (
    // userNotification.notification?.data?.properties.Id &&
    // userNotification.notification?.data?.properties.Type
    userNotification.notification?.data?.properties.Type === 103 // hard code
  ) {
    return notificationTypes.gotoDetail
  }

  return notificationTypes.text
}

export function changeBackgroundByEvent(event?, type?) {
  //Start the snow default options you can also make it snow in certain elements, etc.
  const { events } = themeByEvent
  switch (event) {
    case events.xmasNight:
    case events.xmasHouse:
    case events.xmasSanta: {
      const fjs = document.getElementsByTagName("script")[0]
      if (document.getElementById("blog-xtraffic-snow-effect")) return
      const js = document.createElement("script")
      js.id = "blog-xtraffic-snow-effect"
      js.src = "assets/snow-storm.js"
      fjs.parentNode && fjs.parentNode.insertBefore(js, fjs)
      break
    }
  }
}

export function buildFileUrl(fileUrl) {
  const baseUrl = (AppConfiguration.remoteServiceBaseUrl || "").substring(
    0,
    (AppConfiguration.remoteServiceBaseUrl || "").length - 1
  )
  return fileUrl && fileUrl.length
    ? `${baseUrl}${fileUrl}?enc_auth_token=${encodeURIComponent(
        abp.utils.getCookieValue(cookieKeys.encToken)
      )}`
    : ""
}

export function inputPercentFormatter(value, locale = "vi") {
  return `${(Math.round(value * 100) / 100 + "").replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  )} %`
}

export function inputPercentParse(value, locale = "vi") {
  return value
    .replace("%", "")
    .replace(" ", "")
    .replace(/\$\s?|(,*)/g, "")
}

//check and add item to list

export const getTotalCountOtherOneItem = (
  listItem: any[],
  rowKey: any,
  keyToSum: any
) => {
  let totalCount = 0
  const listOhterItem = listItem.filter((item) => item.uniqueId !== rowKey)
  listOhterItem.map((item) => {
    totalCount = totalCount + item[keyToSum]
  })
  return totalCount
}
