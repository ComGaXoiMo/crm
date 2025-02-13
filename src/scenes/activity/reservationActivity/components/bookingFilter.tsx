import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { Button } from "antd"
import Col from "antd/lib/col"
import Search from "antd/lib/input/Search"
import Row from "antd/lib/row"
import { AppComponentListBase } from "@components/AppComponentBase"
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons"
import { debounce } from "lodash"

type Props = {
  handleSearch: any;
  filter: any;
  changeTab: any;
  onCreate: () => void;
  onRefesh: () => void;
  create: any;
};

class BookingFilterPanel extends AppComponentListBase<Props> {
  constructor(props: Props) {
    super(props)
  }
  state = {
    filters: {
      isActive: true,
    } as any,
  };
  componentDidMount() {
    this.searchTitleOptions("")
  }

  searchTitleOptions = async (keyword?) => {
    // your searchTitleOptions logic here
  };
  handleSearch = async (name, value) => {
    {
      // this.setState({ [name]: value });
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
  render() {
    return (
      <>
        <Row className="mb-3" gutter={[8, 8]}>
          <Col sm={{ span: 6, offset: 0 }}>
            <Search
              onChange={(value) =>
                this.updateSearch("keyword", value.target?.value)
              }
              onSearch={(value) => this.handleSearch("keyword", value)}
              size="middle"
              placeholder={L("BOOKING_FILTER_MODAL")}
            />
          </Col>
          <div style={{ position: "absolute", right: 10 }}>
            {this.props.create && (
              <Button
                icon={<PlusCircleFilled />}
                className="button-primary"
                onClick={() => this.props.onCreate()}
              ></Button>
            )}
            <Button
              icon={<ReloadOutlined />}
              className="button-primary"
              onClick={() => this.props.onRefesh()}
            ></Button>
          </div>
        </Row>
      </>
    )
  }
}

export default withRouter(BookingFilterPanel)
