import { L } from "@lib/abpUtility"
// import { CalendarOutlined, UserOutlined } from "@ant-design/icons/lib";
// import { renderDateTime } from "@lib/helper";

const columns = (actionColumn?) => {
  const data = [
    {
      title: L("DOC_NAME"),
      dataIndex: "name",
      key: "name",
      ellipsis: false,
      width: "30%",
      render: (name) => <>{name}</>,
    },
    {
      title: L("UPLOOAD_TYPE"),
      dataIndex: "type",
      key: "type",
      width: "33%",
      ellipsis: false,
      render: (type) => <>{type}</>,
    },

    {
      title: L("Remark"),
      dataIndex: "ather",
      key: "ather",
      width: "33%",
      render: (ather) => <>{ather ?? "Note ..."}</>,
    },

    actionColumn,
  ]

  return data
}

export default columns
