import { L } from "@lib/abpUtility"
import { Col, Form, Modal, Row, Select } from "antd"
import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import UserStore from "@stores/administrator/userStore"
import { debounce } from "lodash"
import { filterOptions, renderOptions } from "@lib/helper"
import { validateMessages } from "@lib/validation"

interface Props {
  visible: boolean;
  onClose: () => void;
  onOk: (id?) => void;
  formRef: any;
  data: any;
  userStore: UserStore;
}

interface State {
  listUser: any[];
}

@inject(Stores.UserStore)
@observer
class AddUserModal extends AppComponentListBase<Props, State> {
  form = this.props.formRef;

  constructor(props) {
    super(props)
    this.state = { listUser: [] as any }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      this.form.current?.setFieldsValue(this.props.data)
      this.getStaff("")
    }
  }

  getStaff = async (keyword) => {
    await this.props.userStore.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword: keyword,
    })
    const lsitUser = [...this.props.userStore.users.items]

    lsitUser.map((i) => {
      return { id: i.id, name: i.name }
    })
    this.setState({ listUser: lsitUser })
  };
  handleSearchStaff = debounce((keyword) => {
    this.getStaff(keyword)
  }, 400);
  render(): React.ReactNode {
    const { visible, onClose, onOk } = this.props

    return (
      this.props.visible && (
        <Modal
          // style={{ top: 50 }}
          title={L("INFOMATION")}
          visible={visible}
          // visible={true}
          width={"40%"}
          onOk={onOk}
          onCancel={onClose}
          closable={false}
        >
          <Form
            ref={this.form}
            layout={"vertical"}
            size="middle"
            validateMessages={validateMessages}
          >
            <div className="w-100">
              <Row gutter={[8, 0]}>
                <Col sm={{ span: 24 }}>
                  {/* <FormSelect
                    label={L("USER")}
                    name="userId"
                    options={this.state.listUser ?? []}
                  /> */}
                  <Form.Item
                    label={L("STAFF")}
                    name="userId"
                    rules={[{ required: true }]}
                  >
                    <Select
                      showSearch
                      allowClear
                      onSearch={this.handleSearchStaff}
                      filterOption={filterOptions}
                      className="full-width"
                    >
                      {renderOptions(this.state.listUser ?? [])}
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
export default withRouter(AddUserModal)
