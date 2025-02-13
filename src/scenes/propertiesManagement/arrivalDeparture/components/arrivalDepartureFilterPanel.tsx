import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { Button, DatePicker, Select, Tooltip } from "antd"
import Col from "antd/lib/col"
import Search from "antd/lib/input/Search"
import Row from "antd/lib/row"
import { renderOptions } from "@lib/helper"
import projectService from "@services/projects/projectService"
import { ReloadOutlined } from "@ant-design/icons"
const { RangePicker } = DatePicker

type Props = {
  handleSearch: any;
  filter: any;
  onRefresh: () => void;
  changeTab: any;
};

// const tabKeys = {
//   shortTerm: L("SHORT_TIME"),
//   longTerm: L("LONG_TIME"),
// };
class ArrivalDeparturesFilterPanel extends React.Component<Props> {
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

  render() {
    return (
      <>
        <Row gutter={[0, 0]}>
          <Col sm={{ span: 4, offset: 0 }}>
            <Search size="middle" placeholder={L("UNIT_NUMBER")} />
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
          <Col sm={{ span: 4, offset: 0 }}>
            <RangePicker placeholder={["Move-in from", "Move-in to"]} />
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
            <RangePicker placeholder={["Move-out from", "Move-out to"]} />
          </Col>
          {/* <Radio.Group
            onChange={async (value) => {
              await this.setState({ selectedType: value.target.value });
              await this.props.changeTab(value);
            }}
            value={this.state.selectedType}
            buttonStyle="solid"
          >
            <Radio.Button key={tabKeys.shortTerm} value={tabKeys.shortTerm}>
              {tabKeys.shortTerm}
            </Radio.Button>
            <Radio.Button key={tabKeys.longTerm} value={tabKeys.longTerm}>
              {tabKeys.longTerm}
            </Radio.Button>
          </Radio.Group>
          <Col sm={{ span: 2, offset: 0 }}>
              <Select
                      getPopupContainer={(trigger) => trigger.parentNode}             placeholder={L("TYPE")}
              style={{ width: "100%" }}
              allowClear
              // showSearch
            ></Select>
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

export default withRouter(ArrivalDeparturesFilterPanel)
