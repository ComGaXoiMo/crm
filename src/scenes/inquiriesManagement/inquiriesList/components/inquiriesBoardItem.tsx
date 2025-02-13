import * as React from "react"

import { inject, observer } from "mobx-react"
import "./pipeline-view.less"

import { Card, Tag } from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import { formatCurrency } from "@lib/helper"
import { AppComponentListBase } from "@components/AppComponentBase"
import { appPermissions } from "@lib/appconst"
import InquiryStore from "@stores/communication/inquiryStore"
import Stores from "@stores/storeIdentifier"
// import { Table } from "antd";

export interface IInquiriesListProps {
  data: any;
  goDetail: () => void;
  loading: any;
  key: any;
  inquiryStore: InquiryStore;
}

@inject(Stores.InquiryStore)
@observer
class InquiriesBoardItem extends AppComponentListBase<
  IInquiriesListProps,
  any
> {
  formRef: any = React.createRef();
  state = {};

  public render() {
    const {
      inquiryStore: { inquiryDetail },
    } = this.props

    return (
      <>
        <style>
          {`
     .card-detail:hover{
      background-color: #fffdf9 !important;
      border: 1px solid #696969 !important;
       }
       p {
        margin-top: 0;
        margin-bottom: 3px;
      }
      `}
        </style>
        <Card
          onClick={
            this.isGranted(appPermissions.inquiry.detail)
              ? () => this.props.goDetail()
              : () => console.log("no permission")
          }
          className="card-detail"
          key={this.props.data?.id}
          style={{
            borderColor: this.props.data?.isActive ? "#e4e4e4" : "#ff8989",
            // backgroundColor:
            //   inquiryDetail?.id === this.props.data?.id ? "#fbfff6" : "#fff",
            border:
              inquiryDetail?.id === this.props.data?.id
                ? "1px solid #838383"
                : "1px solid #f0f0f0",
          }}
        >
          <div className="h-100 board-item">
            <strong style={{ whiteSpace: "break-spaces" }}>
              {this.props.data?.inquiryName ?? ""}
            </strong>

            <p>Contact: {this.props.data?.contact?.contactName ?? ""}</p>
            <p>Dealer: {this.props.data?.creatorUser?.displayName ?? ""}</p>
            <p>
              Price: {formatCurrency(this.props.data?.fromPrice)}~
              {formatCurrency(this.props.data?.toPrice)}
            </p>
            <p>
              Size: {this.props.data?.fromSize}m2~
              {this.props.data?.toSize}m2
            </p>
            <p>
              Detail status:
              <Tag color={this.props.data?.statusDetail?.color}>
                {this.props.data?.statusDetail?.name}
              </Tag>
            </p>
          </div>
        </Card>
      </>
    )
  }
}

export default withRouter(InquiriesBoardItem)
