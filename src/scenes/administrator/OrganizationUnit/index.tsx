import { Button, Card, Col, Row } from "antd"
import Title from "antd/lib/typography/Title"
import React, { useState } from "react"
import TreeDataOrganization from "./components/treeDataOrganization"
import { L } from "../../../lib/abpUtility"
import http from "@services/httpService"
import OrganizationUnitControl from "./components/organizationUnitControl"

interface StaffListProps {
  addedTime: string
  emailAddress: string
  id: number
  isHead: boolean
  name: string
  surname: string
  userName: string
}

function OrganizationUnit() {
  const [staffList, setStaffList] = useState<Array<StaffListProps>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [activeOrganization, setActiveOrganization] = useState(0)

  const getStaffByDepartment = async (item) => {
    setLoading(true)
    setActiveOrganization(item)
    try {
      const result = await http.get(
        "api/services/app/OrganizationUnit/GetOrganizationUnitUsers",
        { params: { id: item.id } }
      )
      setStaffList(result.data.result.items)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <Card className="my-3">
        <Title level={2}>{L("ORGANIZATION_UNIT")}</Title>
      </Card>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card className="m-2" style={{ minHeight: "100px" }}>
            <div className="d-flex justify-content-between align-items-center">
              <span>
                <Title level={4}>{L("ORGANIZATION")}</Title>
              </span>
              <span>
                <Button type="primary">+ {L("BTN_ADD")}</Button>
              </span>
            </div>
            <div>
              <TreeDataOrganization
                getStaffByDepartment={(item) => getStaffByDepartment(item)}
              />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card className="m-2" style={{ minHeight: "100px" }}>
            <OrganizationUnitControl
              loading={loading}
              staffList={staffList}
              activeOrganization={activeOrganization}
              getStaffByDepartment={(item) => getStaffByDepartment(item)}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default OrganizationUnit
