import * as React from "react"

import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Table, Button, Card } from "antd"

import { L } from "@lib/abpUtility"
import { formatNumber, tableToExcel } from "@lib/helper"
import withRouter from "@components/Layout/Router/withRouter"
import { ExcelIcon } from "@components/Icon"
import _ from "lodash"
import AppConsts from "@lib/appconst"
const { align } = AppConsts

export interface IProps {
  data: any
}

class MostActivities extends AppComponentListBase<IProps> {
  printRef: any = React.createRef()
  state = {
    filters: {},
  }

  public render() {
    const columns = [
      {
        title: L("USER_NAME"),
        dataIndex: "DisplayName",
        key: "DisplayName",
        width: 130,
        ellipsis: true,
        render: (DisplayName, row, index) => {
          const obj = {
            children: DisplayName,
            props: {} as any,
          }
          // Check if this row's project matches the project of the previous row
          if (
            index > 0 &&
            DisplayName === this.props.data[index - 1]?.DisplayName
          ) {
            obj.props.rowSpan = 0
          } else {
            // Count the number of consecutive rows with the same project
            let count = 1
            for (let i = index + 1; i < this.props.data.length; i++) {
              if (this.props.data[i].DisplayName === DisplayName) {
                count++
              } else {
                break
              }
            }
            obj.props.rowSpan = count
          }
          return obj
        },
      },
      {
        title: L("DATA_TYPE"),
        dataIndex: "DateType",
        key: "DateType",
        width: 80,
        ellipsis: true,
        render: (DateType) => <>{L(DateType)}</>,
      },

      {
        title: L("LeaseAgreement"),
        dataIndex: "LeaseAgreement",
        key: "LeaseAgreement",
        width: 80,
        align: align.right,
        ellipsis: true,
        render: (LeaseAgreement) => <>{formatNumber(LeaseAgreement)}</>,
      },
      {
        title: L("Inquiry"),
        dataIndex: "Inquiry",
        key: "Inquiry",
        width: 80,
        align: align.right,
        ellipsis: true,
        render: (Inquiry) => <>{formatNumber(Inquiry)}</>,
      },
      {
        title: L("Reservation"),
        dataIndex: "Reservation",
        key: "Reservation",
        width: 80,
        align: align.right,
        ellipsis: true,
        render: (Reservation) => <>{formatNumber(Reservation)}</>,
      },
      {
        title: L("Company"),
        dataIndex: "Company",
        key: "Company",
        width: 80,
        align: align.right,
        ellipsis: true,
        render: (Company) => <>{formatNumber(Company)}</>,
      },
      {
        title: L("Contact"),
        dataIndex: "Contact",
        key: "Contact",
        width: 80,
        align: align.right,
        ellipsis: true,
        render: (Contact) => <>{formatNumber(Contact)}</>,
      },
      {
        title: L("Task"),
        dataIndex: "Task",
        key: "Task",
        width: 80,
        align: align.right,
        ellipsis: true,
        render: (Task) => <>{formatNumber(Task)}</>,
      },
    ]

    return (
      <>
        <div ref={this.printRef} className="dashboard-style">
          <Row gutter={[8, 8]}>
            <Col sm={{ span: 24, offset: 0 }}>
              <Card className="card-report-fit-height w-100">
                <div className="header-report">
                  <strong>{L("USER_ACTIVITIES")}</strong>
                  <div className="content-right">
                    <Button
                      onClick={() => tableToExcel("tblUserActivities")}
                      className="button-primary"
                      icon={<ExcelIcon />}
                    ></Button>
                  </div>
                </div>

                <Table
                  id={"tblUserActivities"}
                  size="middle"
                  className="custom-ant-row"
                  pagination={false}
                  columns={columns}
                  dataSource={this.props.data}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </>
    )
  }
}

export default withRouter(MostActivities)
