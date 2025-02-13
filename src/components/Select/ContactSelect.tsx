import React from "react"
import Select from "antd/lib/select"
import contactService from "@services/clientManagement/contactService"
import debounce from "lodash/debounce"
import { MailOutlined, PhoneOutlined } from "@ant-design/icons/lib"
const { Option } = Select

export interface IContactSelectProps {
  contactId?: number;
  companyId?: number;
  contact?: any;
  onSelect: (value, label) => void;
  style?: any;
}

export default class ContactSelect extends React.Component<IContactSelectProps> {
  state = {
    options: [],
    value: this.props.contactId,
    loading: false,
  };

  componentDidMount(): void {
    if (this.props.contact.contactId && this.props.contact) {
      this.setState({
        options:
          this.props.contact && this.props.contact.contactId
            ? [
                {
                  id: this.props.contact.contactId,
                  contactName: this.props.contact.contactName,
                },
              ]
            : [],
        value: this.props.contact.contactId,
      })
    } else {
      this.findContact("")
    }
  }

  componentDidUpdate(prevProps: Readonly<IContactSelectProps>): void {
    // Init default data
    if (
      (!prevProps.contact && this.props.contact) ||
      (!prevProps.contact?.contactId &&
        prevProps.contact?.contactId !== this.props.contact?.contactId) ||
      (this.state.value &&
        this.props.contact.contactId &&
        this.state.value !== this.props.contact.contactId)
    ) {
      this.setState({
        options:
          this.props.contact && this.props.contact.contactId
            ? [
                {
                  id: this.props.contact.contactId,
                  contactName: this.props.contact.contactName,
                },
              ]
            : [],
        value: this.props.contact.contactId,
      })
    }
    if (prevProps.companyId !== this.props.companyId) {
      this.findContact("")
    }
  }

  handleSelectItem = (value) => {
    const option = this.state.options.find(
      (item: any) => item.id === value
    ) as any
    this.setState({ value }, () => {
      this.props.onSelect(value, option?.contactName)
    })
  };

  findContact = debounce(async (keyword) => {
    this.setState({ loading: true })
    const result = await contactService
      .getAll({
        keyword,
        pageSize: 20,
        pageNumber: 1,
        companyId: this.props.companyId,
      })
      .finally(() => this.setState({ loading: false }))
    this.setState({ options: result.items || [] })
  }, 300);

  render(): React.ReactNode {
    return (
      <Select
        getPopupContainer={(trigger) => trigger.parentNode}
        value={this.state.value}
        showSearch
        allowClear
        filterOption={false}
        onSearch={this.findContact}
        onChange={this.handleSelectItem}
        style={{ width: "100%" }}
        loading={this.state.loading}
      >
        {(this.state.options || []).map((option: any, index) => (
          <Option key={index} value={option.id}>
            {option.gender} {option.contactName}
            {option.primaryEmail?.email && (
              <div className="text-muted small">
                <MailOutlined className="ml-1" /> {option.primaryEmail?.email}
              </div>
            )}
            {option.primaryPhone?.phone && (
              <div className="text-muted small">
                <PhoneOutlined className="ml-1" /> {option.primaryPhone?.phone}
              </div>
            )}
          </Option>
        ))}
      </Select>
    )
  }
}
