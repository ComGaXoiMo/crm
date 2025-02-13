import { L } from "@lib/abpUtility"
import { renderDateTime } from "@lib/helper"
import moment from "moment-timezone/moment-timezone"
import AppConsts from "@lib/appconst"
import { HistoryOutlined } from "@ant-design/icons"
import { Popover } from "antd"
const { align } = AppConsts
const SystemHistoryColumn = {
  title: (
    <Popover content={L("SYSTEM")}>
      <HistoryOutlined style={{ fontSize: "110%" }} />
    </Popover>
  ),
  dataIndex: "creationTime",
  key: "creationTime",
  width: 50,
  align: align.center,
  readonly: true,
  //   fixed: "right",
  render: (creationTime, row) => {
    const createdAtAgo = moment(creationTime).fromNow()
    const updatedAtAgo = moment(row.lastModificationTime).fromNow()
    return (
      <Popover
        placement="right"
        content={
          <div className="text-muted small">
            {row.lastModifierUser ? (
              <div>
                {L("UPDATED_BY")} {row.lastModifierUser?.displayName}
                &ensp;
                {updatedAtAgo}
                &ensp;{L("AT")} {renderDateTime(row.lastModificationTime)}
              </div>
            ) : (
              <div>
                {L("CREATED_BY")} {row.creatorUser?.displayName ?? "??"}
                &ensp;
                {createdAtAgo}
                &ensp;
                {L("AT")} {renderDateTime(creationTime)}
              </div>
            )}
          </div>
        }
      >
        <HistoryOutlined style={{ fontSize: "110%", color: "#5e5e5e" }} />
      </Popover>
    )
  },
}

export default SystemHistoryColumn
