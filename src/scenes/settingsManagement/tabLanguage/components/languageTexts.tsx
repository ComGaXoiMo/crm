import * as React from "react"

import { Button, Col, Modal, Row, Table, Select } from "antd"
import { EditOutlined, CloseOutlined } from "@ant-design/icons"
import { inject, observer } from "mobx-react"

import { AppComponentListBase } from "../../../../components/AppComponentBase"
import LanguageTextFormModal from "./languageTextFormModal"
import { EntityDto } from "../../../../services/dto/entityDto"
import {
  LanguageTextInputDto,
  LanguageTextDto,
} from "../../../../services/administrator/language/dto/languageTextDto"
import { L, LNotification } from "../../../../lib/abpUtility"
import Stores from "../../../../stores/storeIdentifier"
import LanguageStore from "../../../../stores/administrator/languageStore"
import DataTable from "../../../../components/DataTable"
import AppConsts from "../../../../lib/appconst"
import debounce from "lodash/debounce"
import Search from "antd/es/input/Search"
import withRouter from "@components/Layout/Router/withRouter"

const { align, localization } = AppConsts

export interface ILanguageProps {
  match: any
  languageStore: LanguageStore
}

export interface ILanguageState {
  modalVisible: boolean
  maxResultCount: number
  skipCount: number
  modalType: string
  filters: any
}

const confirm = Modal.confirm

@inject(Stores.LanguageStore)
@observer
class Language extends AppComponentListBase<ILanguageProps, ILanguageState> {
  formRef: any = React.createRef()
  languageSources: any = abp.localization.sources || []
  languages: any = abp.localization.languages || []
  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    modalType: "add",
    filters: {
      targetLanguageName: this.props.match?.params?.id,
      sourceName: localization.defaultLocalizationSourceName,
      filterText: "",
    },
  }

  get currentPage() {
    return Math.floor(this.state.skipCount / this.state.maxResultCount) + 1
  }

  async componentDidMount() {
    await this.getAll()
  }

  getAll = async () => {
    await this.props.languageStore.getAllLanguageText({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
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

  createOrUpdateModalOpen = async (entityDto: LanguageTextDto | null) => {
    const body: LanguageTextInputDto = {
      languageName: this.state.filters.targetLanguageName,
      sourceName: this.state.filters.sourceName,
      key: entityDto?.key || this.state.filters.filterText || "",
      value: entityDto?.targetValue || "",
    }
    await this.props.languageStore.createLanguageText(body)
    this.setState({ modalType: entityDto ? "edit" : "add" })
    this.Modal()
    this.formRef.current.setFieldsValue({
      ...this.props.languageStore.editLanguageText,
    })
  }

  delete(input: EntityDto) {
    const self = this
    confirm({
      title: LNotification("DO_YOU_WANT_TO_DEACTIVATE_THIS_ITEM"),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk() {
        self.props.languageStore.deleteLanguageText(input)
      },
      onCancel() {
        console.log("BTN_CANCEL")
      },
    })
  }

  handleCreate = () => {
    const form = this.formRef.current

    form.validateFields().then(async (values: any) => {
      values.key = (values.key || "").trim()
      values.value = (values.value || "").trim()
      await this.props.languageStore.createOrUpdateLanguageText(values)
      await this.getAll()
      this.setState({ modalVisible: false })
      form.resetFields()
    })
  }

  updateSearch = debounce((name, value) => {
    const { filters } = this.state
    this.setState({ filters: { ...filters, [name]: value } })
    if (value?.length === 0) {
      this.handleSearch("keyword", value)
    }
  }, 100)

  handleSearch = (name, value) => {
    const { filters } = this.state
    this.setState(
      { filters: { ...filters, [name]: value }, skipCount: 0 },
      async () => await this.getAll()
    )
  }

  renderFilterComponent = () => {
    const { filters } = this.state
    const keywordPlaceHolder = `${this.L("LANGUAGE_TEXT_KEY")}, ${this.L(
      "LANGUAGE_TEXT_BASE_VALUE"
    )},  ${this.L("LANGUAGE_TEXT_TARGET_VALUE")}`
    return (
      <Row gutter={[8, 8]}>
        <Col sm={{ span: 8, offset: 0 }}>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            className="full-width"
            value={filters.targetLanguageName}
            onChange={(value) => this.handleSearch("targetLanguageName", value)}
          >
            {this.languages &&
              this.languages.map((language, index) => (
                <Select.Option key={index} value={language.name}>
                  <i className={language.icon} /> {language.displayName}
                </Select.Option>
              ))}
          </Select>
        </Col>
        <Col sm={{ span: 8, offset: 0 }}>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            className="full-width"
            value={filters.sourceName}
            onChange={(value) => this.handleSearch("sourceName", value)}
          >
            {this.languageSources &&
              this.languageSources.map((source, index) => (
                <Select.Option key={index} value={source.name}>
                  {source.name}
                </Select.Option>
              ))}
          </Select>
        </Col>
        <Col sm={{ span: 8, offset: 0 }}>
          <Search
            placeholder={keywordPlaceHolder}
            onChange={(value) =>
              this.updateSearch("keyword", value.target?.value)
            }
            onSearch={(value) => this.handleSearch("filterText", value)}
          />
        </Col>
      </Row>
    )
  }

  public render() {
    const { languageTexts } = this.props.languageStore

    const columns = [
      {
        title: L("LANGUAGE_TEXT_KEY"),
        dataIndex: "key",
        key: "key",
        width: 150,
        ellipsis: false,
        render: (text: string) => <>{text}</>,
      },
      {
        title: L("LANGUAGE_TEXT_BASE_VALUE"),
        dataIndex: "baseValue",
        key: "baseValue",
        width: 150,
        ellipsis: false,
        render: (text: string) => <>{text}</>,
      },
      {
        title: L("LANGUAGE_TEXT_TARGET_VALUE"),
        dataIndex: "targetValue",
        key: "targetValue",
        width: 150,
        ellipsis: false,
        render: (text: string) => <>{text}</>,
      },
      {
        title: L("ACTIONS"),
        width: 150,
        align: align.right,
        render: (text: string, item: any) => (
          <div>
            <Button
              size="small"
              className="ml-1"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => this.createOrUpdateModalOpen(item)}
            />
            <Button
              size="small"
              className="ml-1"
              shape="circle"
              icon={<CloseOutlined />}
              onClick={() => this.delete({ id: item.id })}
            />
          </div>
        ),
      },
    ]

    return (
      <>
        <DataTable
          title={this.L("LANGUAGE_TEXT_LIST")}
          onCreate={() => this.createOrUpdateModalOpen(null)}
          onRefresh={() => this.getAll()}
          pagination={{
            pageSize: this.state.maxResultCount,
            current: this.currentPage,
            total: languageTexts === undefined ? 0 : languageTexts.totalCount,
            onChange: this.handleTableChange,
          }}
          filterComponent={this.renderFilterComponent()}
        >
          <Table
            size="middle"
            className=""
            columns={columns}
            pagination={false}
            loading={this.props.languageStore.isLoading}
            dataSource={languageTexts === undefined ? [] : languageTexts.items}
          />
        </DataTable>
        <LanguageTextFormModal
          formRef={this.formRef}
          visible={this.state.modalVisible}
          onCancel={() =>
            this.setState({
              modalVisible: false,
            })
          }
          modalType={this.state.modalType}
          onCreate={this.handleCreate}
          loading={this.props.languageStore?.isLoading}
        />
      </>
    )
  }
}

export default withRouter(Language)
