import { L } from "@lib/abpUtility"
import { Col, DatePicker, Input, Row, Table } from "antd"
import React from "react"
import Form from "antd/lib/form"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { CheckOutlined } from "@ant-design/icons"
import { dateFormat } from "@lib/appconst"

const dataFake = [
  {
    template: "Proposal Unit En",
    en: true,
    vn: false,
  },
  {
    template: "Proposal Unit VN",
    en: false,
    vn: true,
  },
  {
    template: "Proposal Project En",
    en: true,
    vn: false,
  },
  {
    template: "Proposal Project VN",
    en: false,
    vn: true,
  },
]
interface Props {
  id: any
}

interface State {
  file?: any
  uploading?: boolean
}

class CreateProposalModal extends AppComponentListBase<Props, State> {
  form: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = {}
  }

  render(): React.ReactNode {
    const columns = [
      {
        title: L("NOTIFICATION_TEMPLATE"),
        dataIndex: "template",
        key: "template",
        width: "80%",
        ellipsis: false,
        render: (template) => <>{template}</>,
      },
      {
        title: L("VN"),
        dataIndex: "vn",
        key: "vn",
        width: "10%",
        ellipsis: false,
        render: (vn) => <>{vn ? <CheckOutlined /> : ""}</>,
      },
      {
        title: L("EN"),
        dataIndex: "en",
        key: "en",
        width: "10%",
        ellipsis: false,
        render: (en) => <>{en ? <CheckOutlined /> : ""}</>,
      },
    ]
    return (
      <Form
        layout={"vertical"}
        ref={this.form}
        //  onFinish={this.onSave}
        // validateMessages={validateMessages}
        size="middle"
      >
        <Row gutter={[4, 4]}>
          <Col sm={{ span: 24 }}>
            <Form.Item label={L("PROPOSAL_TITLE")} name="title">
              <Input placeholder={L("")}></Input>
            </Form.Item>
          </Col>
          <Col sm={{ span: 24 }}>
            <Form.Item label={L("PROPOSAL_DATE")} name="date">
              <DatePicker className="w-100" format={dateFormat} />
            </Form.Item>
          </Col>
          <Col sm={{ span: 24 }}>
            <Table
              size="middle"
              className=""
              // rowKey={(record) => record.id}

              columns={columns}
              // loading={this.props.masterDataStore.isLoading}
              dataSource={dataFake}
              pagination={false}
            />
          </Col>
        </Row>
      </Form>
    )
  }
}
export default withRouter(CreateProposalModal)
