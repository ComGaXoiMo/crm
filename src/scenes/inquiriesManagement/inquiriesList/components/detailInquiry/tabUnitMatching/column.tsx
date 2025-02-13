import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"
import {
  formatCurrency,
  renderDate,
  // renderDate
} from "@lib/helper"
import { Tag } from "antd"

const { align } = AppConsts
const columns = (
  // projectColumn?,
  actionColumn?
) => {
  const data = [
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
      width: "150px",
      ellipsis: false,
      render: (productTypeId, row) => <>{row.productType?.name ?? "--"}</>,
    },
    {
      title: L("STATUS"),
      dataIndex: "status",
      align: align.left,
      key: "status",
      width: "150px",
      ellipsis: false,
      render: (status) => <>{status?.name ?? "--"}</>,
    },
    {
      title: L("UNIT_TYPE"),
      dataIndex: "unitType",
      align: align.left,
      key: "unitType",
      width: 100,
      ellipsis: false,
      render: (unitType) => <>{unitType?.name ?? "--"}</>,
    },

    {
      title: L("ACTUAL_SIZE"),
      dataIndex: "actualSize",
      align: align.right,
      key: "actualSize",
      width: "150px",
      ellipsis: false,
      render: (actualSize) => <>{actualSize ?? "--"}</>,
    },
    {
      title: L("BALCONY_SIZE"),
      dataIndex: "balcony",
      align: align.right,
      key: "balcony",
      width: 100,
      // ellipsis: false,
      render: (balcony) => <>{balcony}</>,
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
      align: align.right,
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
      width: 130,
      // ellipsis: false,
      // render: renderDate,
      render: renderDate,
    },
    {
      title: L("EXPIRED_DATE"),
      dataIndex: "expiredDate",
      align: align.center,
      key: "expiredDate",
      width: 140,
      ellipsis: false,
      // render: renderDate,
      render: renderDate,
    },

    SystemHistoryColumn,
  ]

  return data
}

export default columns
