import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { DatePicker, Select } from "antd"
import Col from "antd/lib/col"
import Search from "antd/lib/input/Search"
import Row from "antd/lib/row"
import { renderOptions } from "@lib/helper"
import projectService from "@services/projects/projectService"
const { RangePicker } = DatePicker

type Props = {
  handleSearch: any;
  filter: any;
  changeTab: any;
};

class SiteVisitsFilterPanel extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }
  state = {
    selectedType: "",
    listProject: [],
  };
  async componentDidMount() {
    await this.getProject("")
    this.searchTitleOptions("")
  }
  getProject = async (keyword) => {
    const res = await projectService.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword,
      isActive: true,
    })
    const newProjects = res.items.map((i) => {
      return { id: i.id, name: i.projectName }
    })
    this.setState({ listProject: newProjects })
  };
  searchTitleOptions = async (keyword?) => {
    // your searchTitleOptions logic here
  };

  changeTab = async (event) => {
    const value = event.target.value
    console.log("checked", value)
    await this.setState({ selectedType: value })
  };
  render() {
    return (
      <>
        <Row gutter={[4, 8]}>
          <Col sm={{ span: 4, offset: 0 }}>
            <Search size="middle" placeholder={L("FILTER_KEYWORD")} />
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("PROJECT")}
              filterOption={false}
              className="w-100"
              onSearch={(value) => this.getProject(value)}
              allowClear
              showSearch
            >
              {renderOptions(this.state.listProject)}
            </Select>
          </Col>
          <Col sm={{ span: 2, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("UNIT_LIST")}
              filterOption={false}
              className="w-100"
              allowClear
            >
              {renderOptions([
                { value: 303 },
                { value: 304 },
                { value: 305 },
                { value: 306 },
              ])}
            </Select>
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
            <RangePicker placeholder={["From", "To"]} />
          </Col>
        </Row>
      </>
    )
  }
}

export default withRouter(SiteVisitsFilterPanel)
