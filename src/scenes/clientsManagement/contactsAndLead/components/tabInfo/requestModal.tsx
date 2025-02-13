import { L } from "@lib/abpUtility"
import { Col, Empty, Form, Modal, Row, Spin } from "antd"
import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import Monition from "@scenes/activity/allActivity/components/Monition"
import FormTextArea from "@components/FormItem/FormTextArea"
import DataTable from "@components/DataTable"
import InquiryStore from "@stores/communication/inquiryStore"
import ContactStore from "@stores/clientManagement/contactStore"

interface Props {
  visible: boolean;
  onClose: () => void;
  onOk: (id?) => void;
  formRef: any;
  data: any;
  contactStore: ContactStore;
  inquiryStore: InquiryStore;
  isLoading: boolean;
}

interface State {
  maxResultCount: any;
  skipCount: number;
}

@inject(Stores.ContactStore, Stores.InquiryStore)
@observer
class RequestModal extends AppComponentListBase<Props, State> {
  form = this.props.formRef;

  constructor(props) {
    super(props)
    this.state = { maxResultCount: 4, skipCount: 0 }
  }
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        skipCount: (pagination.current - 1) * this.state.maxResultCount!,
        maxResultCount: pagination.pageSize,
      },
      async () => await this.getAll()
    )
  };
  getAll = async () => {
    await this.props.inquiryStore.getAllActivity({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      contactId: this.props.contactStore?.checkContact?.id,
    })
  };
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.getAll()
        this.form.current?.setFieldsValue(this.props.data)
      }
    }
  }
  render(): React.ReactNode {
    const {
      visible,
      onClose,
      onOk,
      inquiryStore: { pageResultActivity, isLoading },
    } = this.props

    return (
      this.props.visible && (
        <Modal
          style={{ top: 20 }}
          title={L("INFOMATION")}
          visible={visible}
          // visible={true}
          width={"60%"}
          okText={L("REQUEST")}
          onOk={onOk}
          onCancel={onClose}
          confirmLoading={this.props.isLoading}
          closable={false}
        >
          <Form
            ref={this.form}
            layout={"vertical"}
            //  onFinish={this.onSave}
            // validateMessages={validateMessages}
            size="middle"
          >
            <div className="w-100">
              <Row gutter={[8, 0]}>
                <Col sm={{ span: 24 }}>
                  <DataTable
                    pagination={{
                      pageSize: this.state.maxResultCount,
                      total:
                        pageResultActivity === undefined
                          ? 0
                          : pageResultActivity.totalCount,
                      onChange: this.handleTableChange,
                    }}
                  >
                    <Spin spinning={isLoading} className="h-100 w-100">
                      <Row>
                        {pageResultActivity.items.map((item, key) => (
                          <Monition key={key} data={item} />
                        ))}
                      </Row>
                      {pageResultActivity.totalCount < 1 && <Empty />}
                    </Spin>
                  </DataTable>
                </Col>
                <Col sm={{ span: 24 }}>
                  <FormTextArea label={L("REQUEST_NOTE")} name="requestNote" />
                </Col>
              </Row>
            </div>
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(RequestModal)
