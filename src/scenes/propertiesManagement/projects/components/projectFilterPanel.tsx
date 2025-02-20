import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import Col from "antd/lib/col"
import Row from "antd/lib/row"
import _, { debounce } from "lodash"
import AppDataStore from "@stores/appDataStore"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import AppConsts from "@lib/appconst"
import FilterSelect from "@components/Filter/FilterSelect"
const { activeStatus } = AppConsts
type Props = {
  handleSearch: (filters) => void
  appDataStore: AppDataStore
}
type States = { filters: any }
@inject(Stores.AppDataStore)
@observer
class projectsFilterPanel extends AppComponentListBase<Props, States> {
  constructor(props: Props) {
    super(props)
  }
  state = {
    filters: {
      isActive: true,
    } as any,
  }
  handleSearch = async (name, value) => {
    {
      await this.setState({
        filters: { ...this.state.filters, [name]: value },
      })
      await this.props.handleSearch(this.state.filters)
    }
  }
  updateSearch = debounce((name, value) => {
    const { filters } = this.state
    this.setState({ filters: { ...filters, [name]: value } })
    if (value?.length === 0) {
      this.handleSearch("keyword", value)
    }
  }, 100)

  render() {
    const {
      appDataStore: { propertyTypes },
    } = this.props
    return (
      <>
        <Row gutter={[4, 8]}>
          <Col sm={{ span: 4, offset: 0 }}>
            <FilterSelect
              placeholder={L("PRODUCT_TYPE")}
              onChange={(value) => this.handleSearch("PropertyTypeId", value)}
              options={propertyTypes}
            />
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
            <FilterSelect
              placeholder={L("STATUS")}
              defaultValue="true"
              onChange={(value) => this.handleSearch("isActive", value)}
              options={activeStatus}
            />
          </Col>
        </Row>
      </>
    )
  }
}

export default withRouter(projectsFilterPanel)
