import * as React from "react"

import { inject, observer } from "mobx-react"

import { Card } from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
// import { Table } from "antd";

export interface ICallItemProps {
  id: any
}

@inject()
@observer
class CallBoardItem extends AppComponentListBase<ICallItemProps, any> {
  formRef: any = React.createRef()
  state = {}

  public render() {
    return (
      <>
        <Card className="card-item-detail-modal">
          <div className="h-100 board-item">
            <strong>Offer name</strong>
            <label>Create By: You</label>
            <label>Client name: Zaire Dorwart</label>
            <label>Time Log: 01/01/2023</label>
            <label>Note: </label>
          </div>
        </Card>
      </>
    )
  }
}

export default withRouter(CallBoardItem)
