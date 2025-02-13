import React, { Component } from "react"
import { Button, Card, Col, Row } from "antd"
import Title from "antd/lib/typography/Title"
import TreeDataOrganization from "./components/treeDataOrganization"
import { L } from "../../../lib/abpUtility"
import http from "@services/httpService"
import OrganizationUnitControl from "./components/organizationUnitControl"
import withRouter from "@components/Layout/Router/withRouter"

interface OrganizationUnitState {
  staffList: any[];
  loading: boolean;
  activeOrganization: number;
}

class OrganizationUnit extends Component<any, OrganizationUnitState> {
  constructor(props: any) {
    super(props)
    this.state = {
      staffList: [] as any,
      loading: false,
      activeOrganization: 0,
    }
    this.getStaffByDepartment = this.getStaffByDepartment.bind(this)
  }

  async getStaffByDepartment(item: any) {
    this.setState({ loading: true, activeOrganization: item })
    try {
      const result = await http.get(
        "api/services/app/OrganizationUnit/GetOrganizationUnitUsers",
        { params: { id: item.id } }
      )
      this.setState({ staffList: result.data.result.items })
    } catch (error) {
      fakedata
      console.log(error)
      this.setState({ staffList: fakedata })
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    const { staffList, loading, activeOrganization } = this.state
    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card className="m-2" style={{ minHeight: "100px" }}>
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <Title level={4}>{L("DEPARTMENT")}</Title>
                </span>
                <span>
                  <Button type="primary">+ </Button>
                </span>
              </div>
              <div>
                <TreeDataOrganization
                  getStaffByDepartment={(item) =>
                    this.getStaffByDepartment(item)
                  }
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
                getStaffByDepartment={(item) => this.getStaffByDepartment(item)}
              />
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default withRouter(OrganizationUnit)
const fakedata = [
  {
    code: "0001",
    displayName: "Leasing 1",
    id: 1,
    memberCount: 0,
    roleCount: 0,
  },
]
