import { FileSearchOutlined } from "@ant-design/icons"
import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"
import {
  formatCurrency,
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
      title: L("Project code"),

      dataIndex: "projectCode",
      key: "projectCode",
      fixed: "left",
      width: 80,
      // ellipsis: false,
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
      align: align.center,
      key: "productTypeId",
      width: "150px",
      ellipsis: false,
      render: (productTypeId, row) => <>{row.productType?.name ?? "--"}</>,
    },
    {
      title: L("STATUS"),
      dataIndex: "status",
      align: align.center,
      key: "status",
      width: "150px",
      ellipsis: false,
      render: (status) => <>{status?.name ?? "--"}</>,
    },
    {
      title: L("UNIT_TYPE"),
      dataIndex: "unitType",
      align: align.center,
      key: "unitType",
      width: 100,
      ellipsis: false,
      render: (unitType) => <>{unitType?.name ?? "--"}</>,
    },

    {
      title: L("ACTUAL_SIZE"),
      dataIndex: "actualSize",
      align: align.center,
      key: "actualSize",
      width: "150px",
      ellipsis: false,
      render: (actualSize) => <>{actualSize ?? "--"}</>,
    },
    {
      title: L("BALCONY_SIZE"),
      dataIndex: "balcony",
      align: align.center,
      key: "balcony",
      width: 100,
      // ellipsis: false,
      render: (balcony) => <>{balcony ?? "--"}</>,
    },
    {
      title: L("DETAIL"),
      dataIndex: "unitViewMap",
      // align: align.center,
      key: "unitViewMap",
      width: 250,
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
      align: align.center,
      key: "askingRent",
      width: 120,
      ellipsis: false,
      render: (askingRent) => <>{formatCurrency(askingRent) ?? "--"}</>,
    },
    {
      title: L("COMMENCEMENT_DATE"),
      dataIndex: "commencementDate",
      align: align.center,
      key: "commencementDate",
      width: tableWidth.date,
      // ellipsis: false,
      // render: renderDate,
      render: (data) => <>{data ?? "01/01/2023"}</>,
    },
    {
      title: L("EXPIRED_DATE"),
      dataIndex: "expiredDate",
      align: align.center,
      key: "expiredDate",
      width: tableWidth.date,
      ellipsis: false,
      // render: renderDate,
      render: (data) => <>{data ?? "31/12/2023"}</>,
    },
    {
      title: L("MOVE_IN_DATE"),
      dataIndex: "moveIn",
      align: align.center,
      key: "moveIn",
      width: tableWidth.date,
      ellipsis: false,
      // render: renderDate,
      render: (data) => <>{data ?? "31/01/2022"}</>,
    },
    {
      title: L("MOVE_OUT_DATE"),
      dataIndex: "moveOut",
      align: align.center,
      key: "moveOut",
      width: tableWidth.date,
      ellipsis: false,
      // render: renderDate,
      render: (data) => <>{data ?? "31/12/2023"}</>,
    },
    {
      title: L("OTHER_LA_INFO"),
      dataIndex: "otherLAInfo",
      key: "otherLAInfo",
      align: align.center,
      width: 80,
      // ellipsis: false,
      render: (creationTime, row) => {
        return (
          <Popover
            placement="right"
            content={
              <div className="text-muted small">
                <div>
                  <p>Ref. No: 321</p>
                  <p>Only rent: 320000</p>
                  <p>Commencement date: 12/12/2022</p>
                  <p>Expried date: 12/12/2023</p>
                  <p>Termination: 12/12/2023</p>
                </div>
              </div>
            }
          >
            <FileSearchOutlined
              style={{ fontSize: "110%", color: "#5e5e5e" }}
            />
          </Popover>
        )
      },
    },
    SystemHistoryColumn,
  ]

  return data
}

export default columns
