import { FileSearchOutlined, LineOutlined } from "@ant-design/icons"
import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"
import {
  formatCurrency,
  formatNumberFloat,
  renderDate,
  // renderDate
} from "@lib/helper"
import { Popover, Tag } from "antd"

const { align, tableWidth } = AppConsts
const columns = (
  // projectColumn?,
  actionColumn?
) => {
  const data = [
    {
      title: L("PROJECT_CODE"),

      dataIndex: "projectCode",
      key: "projectCode",
      fixed: "left",
      width: 100,
      ellipsis: false,
      render: (projectCode) => <>{projectCode ?? "--"}</>,
    },
    actionColumn,

    // {
    //   title: L("PROJECT"),

    //   dataIndex: "projectName",
    //   key: "projectName",
    //   fixed: "left",
    //   width: "210px",
    //   ellipsis: false,
    //   render: (projectName) => <>{projectName ?? "--"}</>,
    // },
    {
      title: L("PROPERTY_TYPE"),
      dataIndex: "productTypeId",
      align: align.left,
      key: "productTypeId",
      width: 110,
      ellipsis: false,
      render: (productTypeId, row) => <>{row.productType?.name ?? ""}</>,
    },
    {
      title: L("STATUS"),
      dataIndex: "status",
      align: align.left,
      key: "status",
      width: 110,
      ellipsis: false,
      render: (status) => <>{status?.name ?? ""}</>,
    },
    {
      title: L("UNIT_TYPE"),
      dataIndex: "unitType",
      align: align.center,
      key: "unitType",
      width: 100,
      ellipsis: false,
      render: (unitType) => <>{unitType?.name ?? ""}</>,
    },

    {
      title: L("ACTUAL_SIZE"),
      dataIndex: "actualSize",
      align: align.right,
      key: "actualSize",
      width: 140,
      // ellipsis: false,
      render: (actualSize) => <>{formatNumberFloat(actualSize)}</>,
      sorter: true,
    },
    {
      title: L("BALCONY_SIZE"),
      dataIndex: "balcony",
      align: align.right,
      key: "balcony",
      width: 110,
      // ellipsis: false,
      render: (balcony) => <>{formatNumberFloat(balcony) ?? ""}</>,
    },
    {
      title: L("UNIT_VIEW"),
      dataIndex: "unitViewMap",
      // align: align.center,
      key: "unitViewMap",
      width: 220,
      // ellipsis: false,
      // render: (unitViewId, row) => <>{row.unitView?.name ?? "--"}</>,
      render: (unitViewMap) => (
        <div>
          {(unitViewMap || []).map((item, index) => (
            <Tag className="cell-round mr-1" color="#23a887" key={index}>
              {item.view?.name}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: L("ASKING_RENT"),
      dataIndex: "askingRent",
      align: align.right,
      key: "askingRent",
      width: 130,
      // ellipsis: false,
      render: (askingRent) => <>{formatCurrency(askingRent) ?? ""}</>,
      sorter: true,
    },
    // {
    //   title: L("COMMENCEMENT_DATE"),
    //   dataIndex: "commencementDate",
    //   align: align.center,
    //   key: "commencementDate",
    //   width: tableWidth.date,

    //   render: renderDate,
    // },
    // {
    //   title: L("EXPIRED_DATE"),
    //   dataIndex: "expiredDate",
    //   align: align.center,
    //   key: "expiredDate",
    //   width: tableWidth.date,
    //   ellipsis: false,
    //   render: renderDate,
    // },
    {
      title: L("MOVE_IN_DATE"),
      dataIndex: "moveInDate",
      align: align.center,
      key: "moveIn",
      width: tableWidth.date,
      ellipsis: false,
      render: renderDate,
    },
    {
      title: L("MOVE_OUT_DATE"),
      dataIndex: "moveOutDate",
      align: align.center,
      key: "moveOut",
      width: tableWidth.date,
      ellipsis: false,
      render: renderDate,
    },
    {
      title: L("OTHER_LA_INFO"),
      dataIndex: "otherLA",
      key: "otherLA",
      align: align.center,
      width: 80,
      // ellipsis: false,
      render: (otherLA, row) => {
        return otherLA?.referenceNumber ? (
          <Popover
            placement="right"
            content={
              <div className="text-muted small">
                <div>
                  <p>
                    {L("REFERENCE_NUMBER")}: {otherLA?.referenceNumber}
                  </p>
                  <p>
                    {L("COMMENCEMENT_DATE")}:
                    {renderDate(otherLA?.commencementDate)}
                  </p>
                  <p>
                    {L("EXPIRED_DATE")}: {renderDate(otherLA?.expiryDate)}
                  </p>
                  <p>
                    {L("MOVE_IN")}:
                    {otherLA?.moveInDate
                      ? renderDate(otherLA?.moveInDate)
                      : "--"}
                  </p>
                  <p>
                    {L("MOVE_OUT")}:
                    {otherLA?.moveOutDate
                      ? renderDate(otherLA?.moveOutDate)
                      : "--"}
                  </p>
                </div>
              </div>
            }
          >
            <FileSearchOutlined
              style={{ fontSize: "110%", color: "#5e5e5e" }}
            />
          </Popover>
        ) : (
          <Popover placement="right" content={<span>{L("NO_OTHER_LA")}</span>}>
            <LineOutlined style={{ fontSize: "110%", color: "#5e5e5e" }} />
          </Popover>
        )
      },
    },
    SystemHistoryColumn,
  ]

  return data
}

export default columns
