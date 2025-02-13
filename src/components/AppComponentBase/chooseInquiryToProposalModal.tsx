import { L } from "@lib/abpUtility"
import { Col, Form, Modal, Row, Select } from "antd"
import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import _ from "lodash"
import { filterOptions, renderOptions } from "@lib/helper"
import InquiryStore from "@stores/communication/inquiryStore"
interface Props {
  visible: boolean;
  onCancel: () => void;
  onOk: (params) => void;
  projectIds: any;
  unitIds: any;
  inquiryStore: InquiryStore;
}

@inject(Stores.InquiryStore)
@observer
class ChooseInquiryToProposalModal extends AppComponentListBase<Props, any> {
  formRef: any = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      listInquiry: [] as any,
    }
  }
  componentDidMount(): void {
    this.getListInquiry("")
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.getListInquiry("")
      }
    }
  }
  getListInquiry = async (keyword) => {
    this.props.inquiryStore.getAll({
      keyword: keyword,
      isActive: true,
      maxResultCount: 10,
      skipCount: 0,
    })
    const listInquiry = this.props.inquiryStore.pageResult?.items.map(
      (inquiry) => {
        return {
          id: inquiry?.id,
          name: inquiry?.inquiryName,
        }
      }
    )
    this.setState({ listInquiry })
  };
  handleOk = async () => {
    let params = await this.formRef.current?.validateFields()
    params = await {
      ...params,
      unitIds: this.props.unitIds,
      projectIds: this.props.projectIds,
    }

    this.props.onOk(params)
  };
  render(): React.ReactNode {
    const { visible, onCancel } = this.props
    return (
      this.props.visible && (
        <Modal
          title={L("CREATE_PROPOSAL")}
          visible={visible}
          // visible={true}
          width={"50%"}
          onOk={() => this.handleOk()}
          onCancel={onCancel}
          closable={false}
        >
          <Form ref={this.formRef} layout={"vertical"} size="middle">
            <div className="w-100">
              <Row gutter={[8, 0]} style={{ alignItems: "center" }}>
                <Col sm={{ span: 24 }}>
                  <Form.Item
                    rules={[{ required: true }]}
                    label={L("INQUIRY")}
                    name="inquiryId"
                  >
                    <Select
                      showSearch
                      allowClear
                      filterOption={filterOptions}
                      className="full-width"
                      onSearch={_.debounce((e) => this.getListInquiry(e), 1000)}
                    >
                      {renderOptions(this.state.listInquiry)}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(ChooseInquiryToProposalModal)
