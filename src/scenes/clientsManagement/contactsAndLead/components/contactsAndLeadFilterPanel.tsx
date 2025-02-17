import React, { useEffect, useState, useCallback } from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { Row, Col } from "antd"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import AppConsts from "@lib/appconst"
import FilterSelect from "@components/Filter/FilterSelect"
import { debounce } from "lodash"

const { activeStatus, contactType } = AppConsts

const ContactsAndLeadFilterPanel = ({ userStore, handleSearch }) => {
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

  return (
    <Row gutter={[4, 8]}>
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
    </Row>
  )
}

export default withRouter(
  inject(Stores.UserStore)(observer(ContactsAndLeadFilterPanel))
)
