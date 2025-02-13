import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { Button, Select, Tooltip } from "antd"
import Col from "antd/lib/col"
import Search from "antd/lib/input/Search"
import Row from "antd/lib/row"
import projectService from "@services/projects/projectService"
import { renderOptions } from "@lib/helper"
import _, { debounce } from "lodash"
import { ReloadOutlined } from "@ant-design/icons"
import AppDataStore from "@stores/appDataStore"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import moment from "moment"
type Props = {
  handleSearch: (filters) => void;

  filter: any;
  changeTab: any;
  inquiryId: any;

  appDataStore: AppDataStore;
  onRefresh: () => void;
};

// type States = {
//   selectedType: any;
//   filters: any;
//   listProject: any[];
// };
@inject(Stores.AppDataStore)
@observer
class UnitModalFilterPanel extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
  }
  state = {
    listProject: [],
    listFloor: [],
    filters: {
      inquiryId: this.props.inquiryId,
    },
  };
  componentDidMount = async () => {
    await this.getProject("")
  };

  getProject = async (keyword) => {
    const res = await projectService.getAll({
      pageSize: 10,
      keyword,
      isActive: true,
    })
    const newProjects = res.items.map((i) => {
      return { id: i.id, name: i.projectCode }
    })
    this.setState({ listProject: newProjects })
  };

  handleSearch = async (name, value) => {
    {
      await this.setState({
        filters: { ...this.state.filters, [name]: value },
      })
      await this.props.handleSearch(this.state.filters)
    }
  };
  updateSearch = debounce((name, value) => {
    const { filters } = this.state
    this.setState({ filters: { ...filters, [name]: value } })
    if (value?.length === 0) {
      this.handleSearch("keyword", value)
    }
  }, 100);

  handleDateChange = async (value) => {
    const startDate =
      value && value.length ? moment(value[0]).startOf("day").toJSON() : null
    // await this.handleSearch("fromDate", startDate);
    const { filters } = this.state
    await this.setState({ filters: { ...filters, fromDate: startDate } })
    const endDate =
      value && value.length ? moment(value[1]).endOf("day").toJSON() : null

    await this.handleSearch("toDate", endDate)
  };
  render() {
    const {
      appDataStore: { propertyTypes },
    } = this.props
    return (
      <>
        <Row gutter={[4, 8]}>
          <Col sm={{ span: 6, offset: 0 }}>
            <Search
              onChange={(value) =>
                this.updateSearch("keyword", value.target?.value)
              }
              onSearch={(value) => this.handleSearch("keyword", value)}
              size="middle"
              placeholder={L("UNIT_NAME")}
            />
          </Col>
          <Col sm={{ span: 6, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("PROJECT")}
              filterOption={false}
              className="w-100"
              onChange={(value) => this.handleSearch("projectId", value)}
              onSearch={_.debounce((e) => this.getProject(e), 1000)}
              allowClear
              showSearch
            >
              {renderOptions(this.state.listProject)}
            </Select>
          </Col>
          <Col sm={{ span: 6, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("TYPE")}
              style={{ width: "100%" }}
              allowClear
              onChange={(value) => this.handleSearch("productTypeId", value)}
              // showSearch
            >
              {renderOptions(propertyTypes)}
            </Select>
          </Col>
          {/* <Col sm={{ span: 4, offset: 0 }}>
              <Select
                      getPopupContainer={(trigger) => trigger.parentNode}             placeholder={L("UNIT_STATUS")}
              style={{ width: "100%" }}
              onChange={(value) => this.handleSearch("unitStatusId", value)}
              allowClear
              // showSearch
            >
              {renderOptions(unitStatus)}
            </Select>
          </Col>
          <Col sm={{ span: 6, offset: 0 }}>
            <RangePicker
              className="w-100"
              format={dateFormat}
              onChange={this.handleDateChange}
              // onChange={(value) => this.handleSearch('dateFromTo', value)}
              placeholder={rangePickerPlaceholder()}
            />
          </Col> */}

          <div style={{ position: "absolute", right: 10 }}>
            {/* <Button
              icon={<PlusCircleFilled />}
              className="button-secondary"
              onClick={() => this.props.onCreateProject()}
            >
              {L("PROJECT")}
            </Button> */}

            <Tooltip title={L("RELOAD")} placement="topLeft">
              <Button
                icon={<ReloadOutlined />}
                className="button-primary"
                onClick={() => this.props.onRefresh()}
              ></Button>
            </Tooltip>
          </div>
        </Row>
      </>
    )
  }
}

export default withRouter(UnitModalFilterPanel)
