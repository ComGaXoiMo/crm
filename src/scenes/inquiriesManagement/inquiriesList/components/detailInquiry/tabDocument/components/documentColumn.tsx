import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import { L } from "@lib/abpUtility"
import { renderDate } from "@lib/helper"
// import { CalendarOutlined, UserOutlined } from "@ant-design/icons/lib";
// import { renderDateTime } from "@lib/helper";

const columns = (actionColumn?) => {
  const data = [
    {
      title: L("DOC_NAME"),
      dataIndex: "documentName",
      key: "documentName",
      ellipsis: false,
      width: "30%",
      render: (documentName) => <>{documentName}</>,
    },
    {
      title: L("UPLOOAD_TYPE"),
      dataIndex: "documentType",
      key: "documentType",
      width: "20%",
      ellipsis: false,
      render: (documentType) => <>{documentType?.name}</>,
    },
    {
      title: L("UPLOAD_DATE"),
      dataIndex: "uploadDate",
      key: "uploadDate",
      width: "20%",
      ellipsis: false,
      render: renderDate,
    },
    {
      title: L("ATTACHEMENT"),
      dataIndex: "originalFileName",
      key: "originalFileName",
      width: "33%",
      render: (originalFileName) => <>{originalFileName}</>,
    },
    SystemHistoryColumn,
    actionColumn,
  ]

  return data
}

export default columns
