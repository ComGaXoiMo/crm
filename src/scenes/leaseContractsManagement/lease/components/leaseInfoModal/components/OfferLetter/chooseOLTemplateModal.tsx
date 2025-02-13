import { L } from "@lib/abpUtility"
import { Col, Modal, Row, Table } from "antd"
import React from "react"
import Form from "antd/lib/form"
// import { portalLayouts } from "@components/Layout/Router/router.config";
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import NotificationTemplateStore from "@stores/notificationTemplate/notificationTemplateStore"

import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import _ from "lodash"
import { validateMessages } from "@lib/validation"

interface Props {
  visible: boolean;
  onClose: () => void;
  notificationTemplateStore: NotificationTemplateStore;
}

interface State {
  maxResultCount: number;
  skipCount: number;
  filters: any;

  dataItemplate: any[];
}
@inject(Stores.NotificationTemplateStore)
@observer
class ChooseOLTemplateModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      filters: { KeyWord: "", isActive: true },
      dataItemplate: [] as any,
    }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        await this.getTemplate()
      }
    }
  }
  getTemplate = async () => {
    this.setState({
      dataItemplate: [
        {
          notificationTemplate: {
            id: 1,
            subject: "OfferLetter 1",
          },
        },
        {
          notificationTemplate: {
            id: 2,
            subject: "OfferLetter 2",
          },
        },
      ],
    })
  };

  gotoCreate = async (templateId?) => {
    const params = await this.formRef.current?.validateFields()
    console.log(params)
  };

  render(): React.ReactNode {
    const { visible, onClose } = this.props
    const columns = [
      {
        title: L("TITLE"),
        dataIndex: "notificationTemplate",
        key: "notificationTemplate",
        // ellipsis: false,
        render: (notificationTemplate, item: any) => (
          <Row>
            <Col sm={{ span: 21, offset: 0 }}>
              <a
                onClick={() => {
                  Modal.confirm({
                    title: L("CREATE_OFFER_LETTER_WITH_ThIS_TEMPLATE"),
                    onOk: () => this.gotoCreate(item.notificationTemplate.id),
                  })
                }}
                className="link-text-table"
              >
                {notificationTemplate?.subject}
              </a>
            </Col>
          </Row>
        ),
      },
    ]
    const {
      notificationTemplateStore: { isLoading },
    } = this.props
    const { dataItemplate } = this.state
    return (
      <Modal
        open={visible}
        destroyOnClose
        width={"45%"}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        title={L("SELECT_OFFER_LETTER_TEMPLATE")}
        onCancel={() => {
          onClose()
        }}
        confirmLoading={isLoading}
      >
        <Form
          validateMessages={validateMessages}
          layout={"vertical"}
          ref={this.formRef}
          size="middle"
        >
          <Row gutter={[4, 0]}>
            <Col sm={{ span: 24 }}></Col>

            <Col sm={{ span: 24 }}>
              {L("CHOOSE_ONE_TEMPLATE_TO_CREATE_OFFER_LETTER")}
              <Table
                size="middle"
                className="custom-ant-table"
                // rowKey={(record) => record.id}
                columns={columns}
                loading={isLoading}
                dataSource={dataItemplate ?? []}
                pagination={false}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
export default withRouter(ChooseOLTemplateModal)
