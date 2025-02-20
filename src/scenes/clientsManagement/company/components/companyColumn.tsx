import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import { L } from "@lib/abpUtility"
// import { CalendarOutlined, UserOutlined } from "@ant-design/icons/lib";
// import { renderDateTime } from "@lib/helper";
import AppConsts from "@lib/appconst"
import { formatCurrency, formatNumber } from "@lib/helper"
const { align } = AppConsts
const columns = (actionColumn?) => {
  const data = [
    // {
    //   title: L("ID"),
    //   dataIndex: "id",
    //   key: "id",
    //   width: "5%",
    //   ellipsis: false,
    //   render: (id) => <>{id}</>,
    // },
    actionColumn,
    {
      title: L("NUM_OF_INQUIRY"),
      dataIndex: "numOfInquiry",
      align: align.right,
      key: "numOfInquiry",
      width: 100,

      render: (numOfInquiry) => <>{formatNumber(numOfInquiry)}</>,
    },
    {
      title: L("NUM_OF_LEASEAGREEMENT"),
      dataIndex: "numOfLA",
      key: "numOfLA",
      align: align.right,
      ellipsis: false,
      width: 100,
      render: (numOfLA) => <>{formatNumber(numOfLA)}</>,
    },

    {
      title: L("TOTAL_LA_VALUE"),
      dataIndex: "laValue",
      key: "laValue",
      align: align.right,
      // ellipsis: false,
      width: 120,
      render: (laValue) => <>{formatCurrency(laValue)}</>,
    },
    {
      title: L("WEBSITE"),
      dataIndex: "website",
      key: "website",
      align: align.left,
      ellipsis: true,
      width: 180,
      render: (website) => <> {website ?? ""}</>,
    },

    {
      title: L("INDUSTRY"),
      dataIndex: "industry",
      key: "industry",
      ellipsis: false,

      render: (industry) => <>{industry?.industryName ?? ""}</>,
    },
    // {
    //   title: L("TAX_CODE"),
    //   dataIndex: "taxCode",
    //   ellipsis: false,
    //   key: "taxCode",
    //   width: "10%",
    //   render: (taxCode, record, index) => <>{taxCode ?? "TC000" + index}</>,
    // },
    // {
    //   title: L("CONTRACT_NUMBER"),
    //   align: align.right,
    //   dataIndex: "contractNumber",
    //   ellipsis: false,
    //   key: "contractNumber",
    //   width: "10%",
    //   render: (contractNumber) => <>{contractNumber ?? 100}</>,
    // },

    // {
    //   title: L("TASK"),
    //   dataIndex: "task",
    //   key: "task",
    //   align: align.right,
    //   ellipsis: false,
    //   width: "10%",
    //   render: (task) => <>{task ?? 20}</>,
    // },
    SystemHistoryColumn,
  ]

  return data
}

export default columns
