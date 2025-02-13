import React from "react"
import Select from "antd/lib/select"
import companyService from "@services/clientManagement/companyService"
import debounce from "lodash/debounce"

export interface ICompanySelectProps {
  companyId?: number;
  company?: any;
  disabled?: boolean;
  onSelect: (value, label) => void;
  style?: any;
}

export default class CompanySelect extends React.Component<ICompanySelectProps> {
  state = {
    options: [],
    value: this.props.companyId,
    loading: false,
    disabled: this.props.disabled,
  };

  componentDidMount(): void {
    if (!this.props.company || !this.props.company.companyId) {
      this.findCompanies("")
    } else {
      this.setState({
        options: [
          {
            id: this.props.company.companyId,
            businessName: this.props.company.businessName,
          },
        ],
        value: this.props.company.companyId,
      })
    }
  }

  componentDidUpdate(prevProps: Readonly<ICompanySelectProps>): void {
    // Init default data
    if (
      (!prevProps.company && this.props.company) ||
      (!prevProps.company.companyId &&
        prevProps.company.companyId !== this.props.company.companyId) ||
      (this.state.value &&
        this.props.company.companyId &&
        this.state.value !== this.props.company.companyId)
    ) {
      this.setState({
        options:
          this.props.company && this.props.company.companyId
            ? [
                {
                  id: this.props.company.companyId,
                  businessName: this.props.company.businessName,
                },
              ]
            : [],
        value: this.props.company.companyId,
      })
    }
    if (prevProps.disabled !== this.props.disabled) {
      this.setState({ disabled: this.props.disabled })
    }
  }

  handleSelectItem = (value, label) => {
    this.setState({ value }, () => {
      this.props.onSelect(value, label?.children)
    })
  };

  findCompanies = debounce(async (keyword) => {
    this.setState({ loading: true })
    const result = await companyService
      .getAll({ keyword, pageSize: 20, pageNumber: 1 })
      .finally(() => this.setState({ loading: false }))
    this.setState({ options: result.items || [] })
  }, 200);

  render(): React.ReactNode {
    return (
      <Select
        getPopupContainer={(trigger) => trigger.parentNode}
        value={this.state.value}
        loading={this.state.loading}
        showSearch
        disabled={this.state.disabled}
        filterOption={false}
        onSearch={this.findCompanies}
        onChange={this.handleSelectItem}
        style={{ width: "100%" }}
      >
        {(this.state.options || []).map((option: any, index) => (
          <Select.Option key={index} value={option.id}>
            {option.businessName}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
