import * as React from "react"

import { Col, Dropdown, Menu, Modal, Row, Table } from "antd"
import { MoreOutlined } from "@ant-design/icons"
import { inject, observer } from "mobx-react"

import AppComponentBase from "../../../components/AppComponentBase"
import { EntityDto } from "../../../services/dto/entityDto"
import { L, LNotification } from "../../../lib/abpUtility"
import Stores from "../../../stores/storeIdentifier"
import LanguageStore from "../../../stores/administrator/languageStore"
import { appPermissions } from "../../../lib/appconst"
import debounce from "lodash/debounce"
import getColumns from "./columns"
import Search from "antd/es/input/Search"
import withRouter from "@components/Layout/Router/withRouter"
import LanguageDetailModal from "./components/languageDetailModal"
import DataTable from "@components/DataTable"
export interface ILanguageProps {
  history: any
  languageStore: LanguageStore
}

export interface ILanguageState {
  modalVisible: boolean
  maxResultCount: number
  skipCount: number
  languageId: number
  filter: string
}

const confirm = Modal.confirm

@inject(Stores.LanguageStore)
@observer
class Language extends AppComponentBase<ILanguageProps, ILanguageState> {
  formRef: any = React.createRef()

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    languageId: 0,
    filter: "",
  }

  get currentPage() {
    return Math.floor(this.state.skipCount / this.state.maxResultCount) + 1
  }

  async componentDidMount() {
    await this.getAll()
  }

  async getAll() {
    await this.props.languageStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      keyword: this.state.filter,
    })
  }

  handleTableChange = (pagination: any) => {
    this.setState(
      {
        skipCount: (pagination.current - 1) * this.state.maxResultCount!,
        maxResultCount: pagination.pageSize,
      },
      async () => await this.getAll()
    )
  }

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  }

  createOrUpdateModalOpen = async (entityDto: EntityDto) => {
    if (entityDto.id === 0) {
      await this.props.languageStore.createLanguage()
    } else {
      await this.props.languageStore.get(entityDto)
    }

    this.setState({ languageId: entityDto.id })
    this.Modal()

    this.formRef.current.setFieldsValue({
      ...this.props.languageStore.editLanguage,
    })
  }

  delete(input: EntityDto) {
    const self = this
    confirm({
      title: LNotification("DO_YOU_WANT_TO_DEACTIVATE_THIS_ITEM"),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk() {
        self.props.languageStore.delete(input)
      },
      onCancel() {
        console.log("BTN_CANCEL")
      },
    })
  }

  handleCreate = () => {
    const form = this.formRef.current

    form.validateFields().then(async (values: any) => {
      if (this.state.languageId === 0) {
        await this.props.languageStore.create(values)
      } else {
        await this.props.languageStore.update({
          id: this.state.languageId,
          ...values,
        })
      }

      await this.getAll()
      this.setState({ modalVisible: false })
      form.resetFields()
    })
  }

  updateSearch = debounce((event) => {
    this.setState({ filter: event.target?.value })
  }, 100)

  handleSearch = (value: string) => {
    this.setState(
      { filter: value, skipCount: 0 },
      async () => await this.getAll()
    )
  }

  gotoLanguageText = (id) => {
    // const { history } = this.props;
    // history.push(portalLayouts.adminLanguageTexts.path.replace(":id", id));
    this.setState({
      modalVisible: true,
    })
  }

  renderFilterComponent = () => {
    const keywordPlaceHolder = `${this.L("LANGUAGE_NAME")}`
    return (
      <Row gutter={[8, 8]}>
        <Col sm={{ span: 8, offset: 0 }}>
          <Search
            placeholder={keywordPlaceHolder}
            onChange={this.updateSearch}
            onSearch={this.handleSearch}
          />
        </Col>
      </Row>
    )
  }

  public render() {
    const { languages } = this.props.languageStore
    const columns = getColumns({
      title: L("LANGUAGE_FLAG"),
      dataIndex: "icon",
      key: "icon",
      width: "15%",
      render: (text: string, item: any) => (
        <Row>
          <Col sm={{ span: 21, offset: 0 }}>
            <a
              onClick={
                this.isGranted(appPermissions.adminLanguage.detail)
                  ? () => this.gotoLanguageText(item.name)
                  : () => console.log("No permission")
              }
            >
              <div>
                <i className={text} />
              </div>
            </a>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu>
                  {this.isGranted(appPermissions.adminLanguage.delete) && (
                    <Menu.Item
                      key={1}
                      onClick={() => this.delete({ id: item.id })}
                    >
                      {L(item.isActive ? "BTN_DEACTIVATE" : "BTN_ACTIVATE")}
                    </Menu.Item>
                  )}
                </Menu>
              }
              placement="bottomLeft"
            >
              <button className="button-action-hiden-table-cell">
                <MoreOutlined />
              </button>
            </Dropdown>
          </Col>
        </Row>
      ),
    })

    return (
      <>
        <DataTable
          title={this.L("LANGUAGE_LIST")}
          // onCreate={() => this.createOrUpdateModalOpen({ id: 0 })}
          pagination={{
            pageSize: this.state.maxResultCount,
            current: this.currentPage,
            total: languages === undefined ? 0 : languages.totalCount,
            onChange: this.handleTableChange,
          }}
          createPermission={appPermissions.adminLanguage.create}
          // filterComponent={this.renderFilterComponent()}
        >
          <Table
            size="middle"
            className=" custom-ant-row"
            rowKey={(record) => record.id.toString()}
            columns={columns}
            pagination={false}
            loading={this.props.languageStore.isLoading}
            dataSource={languages === undefined ? [] : languages.items}
            onChange={this.handleTableChange}
          />
        </DataTable>
        <LanguageDetailModal
          visible={this.state.modalVisible}
          onCancel={() =>
            this.setState({
              modalVisible: false,
            })
          }
        />
      </>
    )
  }
}

export default withRouter(Language)
