import React, { useEffect, useState, useCallback } from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { Button, Tooltip, Row, Col } from "antd"
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import AppConsts, { appPermissions } from "@lib/appconst"
import { ExcelIcon } from "@components/Icon"
import FilterSelect from "@components/Filter/FilterSelect"
import FilterSearch from "@components/Filter/FilterSearch"
import { debounce } from "lodash"

const { activeStatus, contactType } = AppConsts

const ContactsAndLeadFilterPanel = ({
  userStore,
  handleSearch,
  filter,
  onRefresh,
  onCreate,
  exportExcel,
}) => {
  const [filters, setFilters] = useState({ isActive: true })
  const [listUser, setListUser] = useState([])

  useEffect(() => {
    getStaff("")
  }, [])

  const getStaff = async (keyword) => {
    await userStore.getAll({ maxResultCount: 10, skipCount: 0, keyword })
    setListUser(userStore.users.items.map((i) => ({ id: i.id, name: i.name })))
  }

  const handleSearchStaff = debounce((keyword) => {
    getStaff(keyword)
  }, 400)

  const handleSearchFilter = useCallback(
    async (name, value) => {
      const updatedFilters = { ...filters, [name]: value }
      setFilters(updatedFilters)
      await handleSearch(updatedFilters)
    },
    [filters, handleSearch]
  )

  const updateSearch = debounce((name, value) => {
    handleSearchFilter("keyword", value)
  }, 200)

  return (
    <Row gutter={[4, 8]}>
      <Col sm={{ span: 5 }}>
        <FilterSearch
          onChange={(e) => updateSearch("keyword", e.target?.value)}
          onSearch={(value?) => handleSearchFilter("keyword", value)}
          placeholder={L("FILTER_KEYWORD_CONTACT")}
        />
      </Col>
      <Col sm={{ span: 5 }}>
        <FilterSelect
          placeholder={L("DEALER")}
          onSearch={handleSearchStaff}
          selectProps={{ mode: "multiple" }}
          onChange={(value) => handleSearchFilter("userIds", value)}
          options={listUser}
        />
      </Col>
      <Col sm={{ span: 3 }}>
        <FilterSelect
          placeholder={L("FILTER_CONTACT_TYPE")}
          onChange={(value) => handleSearchFilter("typeId", value)}
          options={contactType}
        />
      </Col>
      <Col sm={{ span: 3 }}>
        <FilterSelect
          placeholder={L("STATUS")}
          defaultValue="true"
          onChange={(value) => handleSearchFilter("isActive", value)}
          options={activeStatus}
        />
      </Col>
      <div style={{ position: "absolute", display: "flex", right: 10 }}>
        {appPermissions.contact.export && (
          <Tooltip title={L("EXPORT_EXCEL")} placement="topLeft">
            <Button
              icon={<ExcelIcon />}
              className="button-primary"
              onClick={exportExcel}
            />
          </Tooltip>
        )}
        {appPermissions.contact.create && (
          <Tooltip title={L("CREATE_CONTACT")} placement="topLeft">
            <Button
              icon={<PlusCircleFilled />}
              className="button-primary"
              onClick={onCreate}
            />
          </Tooltip>
        )}
        <Tooltip title={L("RELOAD")} placement="topLeft">
          <Button
            icon={<ReloadOutlined />}
            className="button-primary"
            onClick={onRefresh}
          />
        </Tooltip>
      </div>
    </Row>
  )
}

export default withRouter(
  inject(Stores.UserStore)(observer(ContactsAndLeadFilterPanel))
)
