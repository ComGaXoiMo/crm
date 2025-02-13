import { L } from "@lib/abpUtility"

const columns = (actionColumn?, settingColumn?) => {
  const data = [
    actionColumn,

    {
      title: L("PROJECT"),
      dataIndex: "projectId",
      key: "projectId",

      ellipsis: false,
      render: (projectId) => <>{projectId ?? ""}</>,
    },
    settingColumn,
  ]

  return data
}

export default columns
