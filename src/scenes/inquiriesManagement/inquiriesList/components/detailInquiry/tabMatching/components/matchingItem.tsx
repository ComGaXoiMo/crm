import * as React from "react"

import { inject, observer } from "mobx-react"

import { Card } from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
// import { Table } from "antd";

export interface IMailItemProps {
  data: any
}

@inject()
@observer
class MatchingItem extends AppComponentListBase<IMailItemProps, any> {
  formRef: any = React.createRef()
  state = {}

  public render() {
    const { data } = this.props

    return (
      <>
        <Card className="card-item-detail-modal">
          <div className="h-100 board-item">
            <strong>{data?.name}</strong>
            <label>Area: {data?.area ?? "-"}</label>
            <label>price: {data?.price ?? "-"} </label>
            <label>Note: {data?.note ?? "-"}</label>
            <label>Attack link: {data?.area ?? "-"}</label>
          </div>
        </Card>
      </>
    )
  }
}

export default withRouter(MatchingItem)
