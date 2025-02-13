import SystemCreateTimeColumn from "@components/DataTable/systemCreateTimeColumn"
import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"
import { renderDate } from "@lib/helper"
import { Tag } from "antd"
// import { CalendarOutlined, UserOutlined } from "@ant-design/icons/lib";
// import { renderDateTime } from "@lib/helper";
const { align } = AppConsts

const columns = (actionColumn?) => {
  const data = [
    actionColumn,
    {
      title: L("INQUYRY_NAME"),
      dataIndex: "inquiry",
      key: "inquiry",
      ellipsis: true,
      width: 200,
      render: (inquiry) => <>{inquiry?.inquiryName}</>,
    },

    // {
    //   title: L("MODULE"),
    //   dataIndex: "module",
    //   key: "module",
    //   width: "15%",
    //   ellipsis: false,
    //   render: (module, row) => (
    //     <>{row.id % 2 === 0 ? "Lease agreement" : "Inquiry"}</>
    //   ),
    // },
    {
      title: L("TASK_STATUS"),
      dataIndex: "inquiryTaskStatus",
      key: "inquiryTaskStatus",
      ellipsis: false,
      width: 150,
      align: align.left,
      render: (inquiryTaskStatus) => <>{inquiryTaskStatus?.name}</>,
    },
    {
      title: L("DUE_DATE"),
      dataIndex: "dueDate",
      key: "dueDate",
      ellipsis: false,
      width: 150,
      align: align.center,
      render: renderDate,
    },
    {
      title: L("PIC"),
      dataIndex: "inquiryTaskUser",
      key: "inquiryTaskUser",
      width: 400,
      render: (inquiryTaskUser) => (
        <>
          {inquiryTaskUser?.map((item, index) => {
            return <Tag key={index}>{item?.user.displayName}</Tag>
          })}
        </>
      ),
    },
    {
      title: L("REMARK"),
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: "",
      render: (description) => <>{description}</>,
    },
    SystemCreateTimeColumn,
    SystemHistoryColumn,
  ]

  return data
}

export default columns
