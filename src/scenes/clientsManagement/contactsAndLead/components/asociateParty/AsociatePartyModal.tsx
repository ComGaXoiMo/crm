import { L } from "@lib/abpUtility"
import { Button, Modal, Table } from "antd"
import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import { inject, observer } from "mobx-react"
import _ from "lodash"

interface Props {
  visible: boolean
  onCancel: () => void
  onOk: () => void
  data: any
  tagetName: string
}

@inject()
@observer
class AsociatePartyModal extends AppComponentListBase<Props> {
  formRef: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = { listInquiry: [] as any, listProject: [] as any }
  }
  componentDidMount(): void {
    // this.initValue()
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        // this.initValue()
      }
    }
  }

  // initValue = async () => {};
  render(): React.ReactNode {
    const { visible, onCancel } = this.props
    const columns = [
      {
        title: L("USER_NAME"),
        dataIndex: "user",
        key: "user",
        width: 250,
        render: (user) => <div>{user.displayName}</div>,
      },
      {
        title: L("EMAIL_ADDRESS"),
        dataIndex: "email",
        key: "email",
        width: 250,
        render: (user, item) => <div>{item?.user?.emailAddress}</div>,
      },
      {
        title: L("REQUEST_NOTE"),
        dataIndex: "requestNote",
        key: "requestNote",

        ellipsis: false,
        render: (requestNote) => <>{requestNote ?? ""}</>,
      },
    ]

    return (
      this.props.visible && (
        <Modal
          title={<strong>{this.props.tagetName}</strong>}
          open={visible}
          width={"70%"}
          closable={false}
          footer={
            <>
              <Button onClick={onCancel}>{L("BTN_CANCEL")}</Button>
            </>
          }
        >
          <Table
            size="middle"
            className=""
            rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            dataSource={this.props.data}
          />
        </Modal>
      )
    )
  }
}
export default withRouter(AsociatePartyModal)
