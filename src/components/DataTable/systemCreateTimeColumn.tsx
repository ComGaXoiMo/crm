import { L } from "@lib/abpUtility"
import { renderDateTime } from "@lib/helper"
import AppConsts from "@lib/appconst"
const { align } = AppConsts
const SystemCreateTimeColumn = {
  title: L("CREATE_AT"),
  dataIndex: "creationTime",
  key: "creationTime",
  width: 150,
  align: align.center,
  readonly: true,
  //   fixed: "right",
  render: (creationTime, row) => {
    return (
      <div className="text-muted small">
        <div>{renderDateTime(creationTime) ?? "--"}</div>
      </div>
    )
  },
}

export default SystemCreateTimeColumn
