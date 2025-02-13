import React from "react"
import { Button, Col, Pagination, Row } from "antd"
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons"
import { isGranted, L } from "../../lib/abpUtility"
import "./DataTable.less"

export interface IDataTableProps {
  title?: string;
  keywordPlaceholder?: string;
  textAddNew?: string;
  onCreate?: () => void;
  onRefresh?: () => void;
  disable?: boolean;
  pagination?: any;
  createPermission?: string;
  handleRefresh?: (key, value) => void;
  actionComponent?: () => void;
  filterComponent?: any;
}

const DataTable: React.FunctionComponent<IDataTableProps> = ({
  title,
  textAddNew,
  onCreate,
  onRefresh,
  pagination,
  disable,
  createPermission,
  actionComponent,
  filterComponent,
  ...props
}) => {
  const handleCreate = () => {
    onCreate && onCreate()
  }
  const handleRefresh = () => {
    onRefresh && onRefresh()
  }
  const handleOnChange = (page, pageSize) => {
    if (pagination.onChange) {
      pagination.onChange({ current: page, pageSize: pageSize })
    }
  }

  return (
    <>
      {filterComponent && (
        <Row gutter={[8, 8]} className="mb-2">
          <Col flex="auto">{filterComponent}</Col>
        </Row>
      )}
      <div className="d-flex justify-content-between my-1 content-right ">
        {/* <h3 style={{ fontWeight: 600, margin: "0.75rem" }}>{title}</h3> */}
        <div className="d-flex align-items-center">
          {actionComponent && actionComponent()}
          {onCreate && (!createPermission || isGranted(createPermission)) && (
            <Button
              className="button-primary"
              shape={textAddNew ? "round" : "circle"}
              icon={<PlusCircleFilled />}
              disabled={disable}
              onClick={handleCreate}
              style={{ boxShadow: "0px 4px 8px rgba(110, 186, 196, 0.2)" }}
            >
              {textAddNew}
            </Button>
          )}
          {onRefresh && (
            <Button
              className="button-primary"
              shape={textAddNew ? "round" : "circle"}
              icon={<ReloadOutlined />}
              disabled={disable}
              onClick={handleRefresh}
              style={{ boxShadow: "0px 4px 8px rgba(110, 186, 196, 0.2)" }}
            >
              {textAddNew}
            </Button>
          )}
        </div>
      </div>
      {props.children}
      {pagination && pagination.total > 0 && (
        <Row className="mt-3 pb-3">
          <Col sm={{ span: 24, offset: 0 }} style={{ textAlign: "end" }}>
            <Pagination
              size="small"
              showTotal={(total) => L("TOTAL_{0}_ITEMS", total)}
              {...pagination}
              onChange={handleOnChange}
              showSizeChanger={true}
              pageSizeOptions={[10, 20, 25, 50]}
            />
          </Col>
        </Row>
      )}
    </>
  )
}

export default DataTable
