import { L } from "@lib/abpUtility"
import { formatCurrency, renderDate, renderDotComm } from "@lib/helper"
// import { CalendarOutlined, UserOutlined } from "@ant-design/icons/lib";
// import { renderDateTime } from "@lib/helper";
import AppConsts from "@lib/appconst"
import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import SystemCreateTimeColumn from "@components/DataTable/systemCreateTimeColumn"
import { Tag, Tooltip } from "antd"
import { FileDoneOutlined } from "@ant-design/icons"

const { align, leaseStage, positionUser } = AppConsts
const columns = (actionColumn?) => {
  const data = [
    actionColumn,
    {
      title: (
        <Tooltip title={L("COMMISSION_HAS_BEEN_CREATED")}>
          <FileDoneOutlined />
        </Tooltip>
      ),
      dataIndex: "isShareCommission",
      key: "isShareCommission",
      ellipsis: false,
      align: align.center,
      width: 40,
      render: (isShareCommission) => renderDotComm(isShareCommission),
    },
    {
      title: L("LA_STATUS"),
      dataIndex: "status",
      key: "status",
      ellipsis: false,
      align: align.left,
      width: 230,
      render: (status, item) =>
        item?.stageId === leaseStage.drop ? (
          <Tooltip title={`${item?.reasonDrop}`}>
            <Tag color={status?.color}>{status?.name}</Tag>
          </Tooltip>
        ) : (
          <Tag color={status?.color}>{status?.name}</Tag>
        ),
    },
    {
      title: L("LA_CONTACT"),
      dataIndex: "contact",
      ellipsis: false,
      key: "contact",
      width: 170,
      render: (contact) => contact?.contactName,
    },

    {
      title: L("COMPANY"),
      dataIndex: "company",
      key: "company",
      width: 190,
      ellipsis: true,
      render: (company) => <>{company?.businessName}</>,
    },

    {
      title: L("PROJECT"),
      dataIndex: "project",
      key: "project",
      width: 120,
      ellipsis: true,
      render: (project, row) => (
        <>
          {row?.leaseAgreementUnit.map((item, index) => (
            <div key={index}>{item.project?.projectCode}</div>
          ))}
        </>
      ),
    },
    {
      title: L("UNIT_NO"),
      dataIndex: "leaseAgreementUnit",
      key: "leaseAgreementUnit",
      width: 170,
      ellipsis: true,
      render: (leaseAgreementUnit) => (
        <>
          {leaseAgreementUnit.map((item, index) => (
            <Tooltip key={index} title={`${item.unit?.unitName}`}>
              <Tag color="purple">
                <>{item.unit?.unitName}</>
              </Tag>
            </Tooltip>
          ))}
        </>
      ),
    },
    {
      title: L("COMMENCEMENT_DATE"),
      dataIndex: "commencementDate",
      // ellipsis: false,
      key: "commencementDate",
      align: align.center,
      width: 150,
      render: renderDate,
    },
    {
      title: L("EXPIRY_DATE"),
      dataIndex: "expiryDate",
      ellipsis: false,
      align: align.center,
      key: "expiryDate",
      width: 120,
      render: renderDate,
    },
    {
      title: L("EXTENSION_DATE"),
      dataIndex: "extensionDate",
      key: "extensionDate",
      align: align.center,
      ellipsis: false,
      width: 120,
      render: renderDate,
    },
    {
      title: L("TERMINATION_DATE"),
      dataIndex: "terminationDate",
      key: "terminationDate",
      align: align.center,
      ellipsis: false,
      width: 120,
      render: renderDate,
    },
    {
      title: L("MOVE_IN_DATE"),
      dataIndex: "moveInDate",
      key: "moveInDate",
      align: align.center,
      ellipsis: false,
      width: 120,
      render: renderDate,
    },
    {
      title: L("MOVE_OUT_DATE"),
      dataIndex: "moveOutDate",
      key: "moveOutDate",
      ellipsis: false,
      align: align.center,
      width: 120,
      render: renderDate,
    },
    {
      title: L("RENT_INC_VAT_SC"),
      dataIndex: "rentSCIncVAT",
      key: "rentSCIncVAT",
      align: align.right,
      // ellipsis: false,

      width: 150,

      render: (rentSCIncVAT) => <>{formatCurrency(rentSCIncVAT)}</>,
    },
    {
      title: L("ALLOWANCE"),
      dataIndex: "allowance",
      align: align.right,
      ellipsis: false,
      key: "allowance",
      width: 150,
      render: (allowance) => <>{formatCurrency(allowance)}</>,
    },

    {
      title: L("SAP_ALLOWANCE"),
      dataIndex: "sapAllowance",
      key: "sapAllowance",
      align: align.right,
      ellipsis: false,
      width: 150,
      render: (sapAllowance) => <>{formatCurrency(sapAllowance)}</>,
    },
    {
      title: L("RENT_ONLY"),
      dataIndex: "rentOnly",
      align: align.right,
      key: "rentOnly",
      ellipsis: false,
      width: 150,
      render: (rentOnly) => <>{formatCurrency(rentOnly)}</>,
    },
    {
      title: L("RENT_INCL_SC_EXCL_VAT"),
      dataIndex: "rentSCExcVal",
      key: "rentSCExcVal",
      align: align.right,
      ellipsis: false,
      width: "170px",
      render: (rentSCExcVal) => <>{formatCurrency(rentSCExcVal)}</>,
    },
    {
      title: L("VAT_AMOUNT"),
      dataIndex: "vatAmount",
      ellipsis: false,
      align: align.right,
      key: "vatAmount",
      width: 150,
      render: (vatAmount) => <>{formatCurrency(vatAmount)}</>,
    },
    {
      title: L("DEPOSIT_AMOUNT"),
      dataIndex: "depositAmount",
      ellipsis: false,
      align: align.right,
      key: "depositAmount",
      width: 150,
      render: (depositAmount) => <>{formatCurrency(depositAmount)}</>,
    },

    {
      title: L("EXPIRED_DAY_NOTIFICATION"),
      dataIndex: "expiredDayNotification",
      ellipsis: false,
      key: "expiredDayNotification",
      align: align.right,
      width: 100,
      render: (expiredDayNotification) => <>{expiredDayNotification}</>,
    },

    {
      title: L("DEALER_IN_CHARGE"),
      dataIndex: "dealer",
      ellipsis: false,
      key: "dealer",
      align: align.left,
      width: 200,
      render: (dealer, row) => (
        <>
          {
            row?.leaseAgreementUserIncharge?.find(
              (item) => item.positionId === positionUser.dealer
            )?.user?.displayName
          }
        </>
      ),
    },
    {
      title: L("ADMIN_IN_CHARGE"),
      dataIndex: "adminInCharge",
      ellipsis: false,
      key: "adminInCharge",
      align: align.left,
      width: 200,
      render: (adminInCharge, row) => (
        <>
          {
            row?.leaseAgreementUserIncharge?.find(
              (item) => item.positionId === 1
            )?.user?.displayName
          }
        </>
      ),
    },
    SystemCreateTimeColumn,
    SystemHistoryColumn,
  ]

  return data
}

export default columns
