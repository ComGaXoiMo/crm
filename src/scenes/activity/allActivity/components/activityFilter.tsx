import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import Col from "antd/lib/col"
import Row from "antd/lib/row"
import { AppComponentListBase } from "@components/AppComponentBase"
import AppConsts from "@lib/appconst"
import FilterSelect from "@components/Filter/FilterSelect"
const { listActivityType } = AppConsts

type Props = {
  handleSearch: any
  filter: any
  changeTab: any
  onRefesh: () => void
}

class ActivityFilterPanel extends AppComponentListBase<Props> {
  constructor(props: Props) {
    super(props)
  }
  state = {
    filters: {
      isActive: true,
    } as any,
  }
  componentDidMount() {
    this.searchTitleOptions("")
  }

  searchTitleOptions = async (keyword?) => {
    // your searchTitleOptions logic here
  }
  handleSearch = async (name, value) => {
    {
      // this.setState({ [name]: value });
      await this.setState({
        filters: { ...this.state.filters, [name]: value },
      })
      await this.props.handleSearch(this.state.filters)
    }
  }

  render() {
    return (
      <>
        <Row gutter={[8, 8]}>
          {/* <Col sm={{ span: 10, offset: 0 }}>
            <Search size="middle" placeholder={L("FILTER_KEYWORD")} />
          </Col> */}
          <Col sm={{ span: 6, offset: 0 }}>
            <FilterSelect
              placeholder={L("ACTIVITY_TYPE")}
              onChange={(value) => this.handleSearch("activityType", value)}
              options={listActivityType}
            />
          </Col>
        </Row>
      </>
    )
  }
}

export default withRouter(ActivityFilterPanel)
