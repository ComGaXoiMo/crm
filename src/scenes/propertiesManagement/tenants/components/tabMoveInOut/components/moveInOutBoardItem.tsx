import * as React from "react"

import { inject, observer } from "mobx-react"

import { Card } from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import { LogoutOutlined } from "@ant-design/icons"
import moment from "moment"
import { dateFormat } from "@lib/appconst"
// import { Table } from "antd";

export interface IProposalItemProps {
  moveOut: any;
  data: any;
}

@inject()
@observer
class ProposalBoardItem extends AppComponentListBase<IProposalItemProps> {
  formRef: any = React.createRef();
  state = {};

  public render() {
    const { data } = this.props

    return (
      <>
        <Card className="card-item-detail-modal w-100 ">
          <div className="h-100 w-100 flex center-items">
            <div style={{ width: "100%" }}>
              <label>
                Tenant name : <strong>{data?.userTenant?.name}</strong>
              </label>
              <label>Email: {data?.userTenant?.emailAddress}</label>
              {/* <label>Phone: +84 390283921</label>
            <label>Emai: LanLan@mail.com</label> */}
              <label>
                Unit:
                <strong>
                  {data?.unit?.projectCode}-{data?.unit?.unitName}
                </strong>
              </label>
              {/* <label>Description: move in at 23/03/2023</label> */}
              <label>
                Move-in date:
                <strong>{moment(data?.moveInDate).format(dateFormat)}</strong>
              </label>
              {data?.moveOutDate && (
                <>
                  <label>
                    Move-out date:
                    <strong>
                      {moment(data?.moveOutDate).format(dateFormat)}
                    </strong>
                  </label>
                  <label>
                    Move-out reason: <strong>{data?.moveOutReason}</strong>
                  </label>
                </>
              )}
            </div>
            {!data.moveOutDate && (
              <div
                className="icon-modal"
                onClick={() =>
                  this.props.moveOut({
                    id: data?.id,
                    tenantId: data?.userTenantId,
                  })
                }
              >
                <LogoutOutlined style={{ fontSize: 25 }} />
              </div>
            )}
          </div>
        </Card>
      </>
    )
  }
}

export default withRouter(ProposalBoardItem)
