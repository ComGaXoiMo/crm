import { L } from "@lib/abpUtility"
// import { CalendarOutlined, UserOutlined } from "@ant-design/icons/lib";
// import { renderDateTime } from "@lib/helper";

const columns = (actionColumn?) => {
  const data = [
    {
      title: L("CHANGE_TIME"),
      dataIndex: "changeTime",
      key: "changeTime",
      width: "34%",
      render: (changeTime) => <>{changeTime}</>,
    },
    {
      title: L("UPDATE_BY"),
      dataIndex: "updateBy",
      key: "updateBy",
      width: "33%",
      ellipsis: false,
      render: (updateBy) => <>{updateBy}</>,
    },
    {
      title: L("PROPERTIES"),
      dataIndex: "properties",
      key: "properties",
      width: "33%",
      render: (properties) => <>{properties}</>,
    },
    {
      title: L("OLD_VALUES"),
      dataIndex: "oldValues",
      key: "oldValues",
      width: "33%",
      render: (oldValues) => <>{oldValues}</>,
    },
    {
      title: L("NEW_VALUES"),
      dataIndex: "newValues",
      key: "newValues",
      width: "33%",
      render: (newValues) => <>{newValues}</>,
    },
    actionColumn,
  ]

  return data
}

export default columns
