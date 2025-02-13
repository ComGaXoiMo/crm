import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import { L } from "@lib/abpUtility"

const columns = (actionColumn?) => {
  const data = [
    actionColumn,

    {
      title: L("PASSPORT"),
      dataIndex: "passport",
      key: "passport",
      width: "12%",
      ellipsis: false,
      render: (passport) => <>{passport}</>,
    },
    {
      title: L("PHONE"),
      dataIndex: "phone",
      key: "phone",
      width: "12%",
      ellipsis: false,
      render: (phone) => <>{phone}</>,
    },
    {
      title: L("EMAIL"),
      dataIndex: "emailAddress",
      key: "emailAddress",
      ellipsis: false,
      render: (emailAddress) => <>{emailAddress}</>,
    },

    // {
    //   title: L("MOVE_IN"),
    //   dataIndex: "moveIn",
    //   key: "unitType",

    //   width: "10%",
    //   ellipsis: false,
    //   render: (moveIn) => <>{moveIn}</>,
    // },
    // {
    //   title: L("MOVE_OUT"),
    //   dataIndex: "moveOut",
    //   key: "arrivmmoveOutoveOutlDate",
    //   width: "10%",
    //   ellipsis: false,
    //   render: (moveOut) => <>{moveOut}</>,
    // },
    // {
    //   title: L("DERPARTURE_DATE"),
    //   dataIndex: "derpartureDate",
    //   key: "derpartureDate",
    //   width: "10%",
    //   ellipsis: false,
    //   render: (derpartureDate) => <>{derpartureDate}</>,
    // },
    // {
    //   title: L("CONTRACT_STATUS"),
    //   dataIndex: "contractStatus",
    //   key: "contractStatus",
    //   width: "10%",
    //   ellipsis: false,
    //   render: (contractStatus) => <>{contractStatus}</>,
    // },
    // {
    //   title: L("REMARK"),
    //   dataIndex: "remark",
    //   key: "remark",
    //   width: "15%",
    //   ellipsis: false,
    //   render: (remark) => <>{remark}</>,
    // },
    SystemHistoryColumn,
  ]

  return data
}

export default columns
