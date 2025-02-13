import { EditFilled } from "@ant-design/icons"
import DataTable from "@components/DataTable"
import FormDatePicker from "@components/FormItem/FormDatePicker"
import { L } from "@lib/abpUtility"
import { Button, Col, Form, Input, Modal, Row, Table } from "antd"
import React from "react"
import AppConsts from "@lib/appconst"
import { formatCurrency } from "@lib/helper"
const { align } = AppConsts
interface Props {
  visible: boolean;
  onClose: () => void;
  onOk: () => void;
  status?: any;
  data?: any;
}
interface State {
  loading: any;
}

export default class GenerateModal extends React.PureComponent<Props, State> {
  formref: any = React.createRef();

  async componentDidUpdate(prevProp) {
    if (prevProp.visible !== this.props.visible) {
      this.formref.current?.setFieldsValue(this.props.data)
    }
  }

  render(): React.ReactNode {
    const { visible, onClose, onOk } = this.props
    const columns = [
      {
        title: L("YEAR"),
        dataIndex: "year",
        key: "year",
        align: align.center,
        ellipsis: false,
        width: 50,
        render: (year) => <>{year}</>,
      },
      {
        title: L("TOTAL_AMOUNT"),
        dataIndex: "totalAmount",
        key: "totalAmount",
        align: align.right,
        width: 100,
        render: (totalAmount) => <>{formatCurrency(totalAmount)}</>,
      },
      {
        title: L("GENERATE_START_DATE"),
        dataIndex: "startDate",
        ellipsis: false,
        align: align.center,
        key: "startDate",
        width: 100,
        render: (startDate) => <>{startDate}</>,
      },
      {
        title: L("DUE_DATE"),
        dataIndex: "dueDate",
        key: "dueDate",
        align: align.center,
        width: 100,
        render: (dueDate) => <>{dueDate}</>,
      },
      {
        title: L("STATUS"),
        dataIndex: "status",
        key: "status",
        align: align.center,
        width: 100,
        render: (status) => <>{status}</>,
      },
      {
        title: L("ACTION"),
        width: 100,
        align: align.center,
        dataIndex: "action",
        key: "action",
        render: (_: any, record, index) => {
          return (
            <>
              <Button type="link" icon={<EditFilled />} />
            </>
          )
        },
      },
    ]
    return (
      this.props.visible && (
        <Modal
          open={visible}
          width={"60%"}
          destroyOnClose
          style={{ top: 20 }}
          title={L("GENERATE")}
          cancelText={L("BTN_CANCEL")}
          onCancel={onClose}
          onOk={onOk}
        >
          <Form layout={"vertical"} ref={this.formref} size="middle">
            <Row gutter={[16, 8]}>
              {/* <Col sm={{ span: 12 }}>
                <Form.Item label={L("REFERENCE_NUMBER")} name="referenceNumber">
                  <Input disabled placeholder={L("")}></Input>
                </Form.Item>
              </Col> */}
              <Col sm={{ span: 6 }}>
                <Form.Item label={L("LEASE_TERM")} name="leaseTerm">
                  <Input disabled placeholder={L("")}></Input>
                </Form.Item>
              </Col>
              <Col sm={{ span: 6 }}>
                <Form.Item label={L("PAYMENT_TERM")} name="paymentTerm">
                  <Input disabled placeholder={L("")}></Input>
                </Form.Item>
              </Col>
              <Col sm={{ span: 6 }}>
                <Form.Item label={L("RENT_ONLY")} name="rentOnly">
                  <Input disabled placeholder={L("")}></Input>
                </Form.Item>
              </Col>
              <Col sm={{ span: 6 }}>
                <FormDatePicker
                  label="GENERATE_START_DATE"
                  name={"startDate"}
                />
              </Col>
              <Col sm={{ span: 24 }}>
                <DataTable
                  title={L("LEASE_DEPOSIT")}
                  pagination={{
                    pageSize: 10,
                    current: 0,
                  }}
                >
                  <Table
                    size="middle"
                    className="custom-ant-table custom-ant-row"
                    rowKey="id"
                    pagination={false}
                    bordered
                    columns={columns}
                    dataSource={[]}
                  />
                </DataTable>
              </Col>
            </Row>
          </Form>
        </Modal>
      )
    )
  }
}
