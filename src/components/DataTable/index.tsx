import React, { useCallback } from "react"
import { Button, Card, Col, Pagination, Row } from "antd"
import { isGranted, L } from "../../lib/abpUtility"
import "./DataTable.less"
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons"
import { ExcelIcon } from "@components/Icon"
import FilterSearch from "@components/Filter/FilterSearch"
import { debounce } from "lodash"
import TableFilterSelect from "./components/tableFilterSelect"

export interface IDataTableProps {
  title?: string
  keywordPlaceholder?: string
  textAddNew?: string
  onCreate?: any
  onRefresh?: any
  exportExcel?: any
  disable?: boolean
  pagination?: any
  createPermission?: string
  exportPermission?: string
  handleRefresh?: (key, value) => void
  handleSearch?: any
  actionComponent?: any
  multiActionComponent?: any
  filterComponent?: any
  children?: any
  searchPlaceholder?: any
}

const DataTable: React.FunctionComponent<IDataTableProps> = ({
  title,
  textAddNew,
  onCreate,
  onRefresh,
  exportExcel,
  pagination,
  disable,
  createPermission,
  exportPermission,
  actionComponent,
  multiActionComponent,
  filterComponent,
  handleSearch,
  searchPlaceholder,
  ...props
}) => {
  const handleCreate = () => {
    onCreate && onCreate()
  }

  const handleRefresh = () => {
    onRefresh && onRefresh()
  }
  const handleExport = () => {
    exportExcel && exportExcel()
  }
  const handleOnChange = (page, pageSize) => {
    if (pagination.onChange) {
      pagination.onChange({ current: page, pageSize: pageSize })
    }
  }
  const handleSearchFilter = useCallback(
    async (name, value) => {
      const updatedFilters = { [name]: value }
      await handleSearch(updatedFilters)
    },
    [handleSearch]
  )
  const updateSearch = debounce((name, value) => {
    handleSearchFilter(name, value)
  }, 200)
  const recentLists = [
    { title: "All Contacts", id: 1 },
    { title: "My Contacts", id: 2 },
    { title: "Contacts Address", id: 3 },
  ]

  const lists = [
    { title: "All Contacts", id: 1 },
    { title: "My Contacts", id: 2 },
    { title: "Contacts Address", id: 3 },
    { title: "My idle Contacts", id: 4 },
    { title: "Contacts idle for 30 days", id: 5 },
    { title: "All Leads", id: 6 },
  ]
  return (
    <>
      <Card className="card-table">
        <div className="flex space-between center-items ">
          <div>
            {multiActionComponent ? (
              <div> {multiActionComponent} </div>
            ) : (
              filterComponent && (
                <TableFilterSelect lists={lists} recentLists={recentLists} />
              )
            )}
          </div>

          <div className="d-flex justify-content-between  content-right ">
            <div className="d-flex align-items-center">
              {handleSearch && (
                <FilterSearch
                  onChange={(e) => updateSearch("keyword", e.target?.value)}
                  placeholder={L(searchPlaceholder ?? "SEARCH")}
                />
              )}
              {exportExcel &&
                (!exportPermission || isGranted(exportPermission)) && (
                  <Button
                    icon={<ExcelIcon />}
                    className="button-secondary"
                    onClick={handleExport}
                  />
                )}

              {actionComponent && actionComponent}
              {onCreate &&
                (!createPermission || isGranted(createPermission)) && (
                  <Button
                    className="button-primary"
                    icon={<PlusCircleFilled />}
                    disabled={disable}
                    onClick={handleCreate}
                    style={{
                      boxShadow: "0px 4px 8px rgba(110, 186, 196, 0.2)",
                    }}
                  >
                    {textAddNew}
                  </Button>
                )}
              {onRefresh && (
                <Button
                  className="button-primary"
                  icon={<ReloadOutlined />}
                  disabled={disable}
                  onClick={handleRefresh}
                  style={{ boxShadow: "0px 4px 8px rgba(110, 186, 196, 0.2)" }}
                ></Button>
              )}
            </div>
          </div>
        </div>
        <div className="custom-table">{props.children}</div>
        {pagination && pagination.total > 0 && (
          <Row className="mt-3 pb-3">
            <Col sm={{ span: 24, offset: 0 }} style={{ textAlign: "end" }}>
              <Pagination
                size="small"
                showTotal={(total) => L("TOTAL_{0}_ITEMS", total)}
                {...pagination}
                onChange={handleOnChange}
                showSizeChanger
              />
            </Col>
          </Row>
        )}{" "}
      </Card>
    </>
  )
}

export default DataTable
