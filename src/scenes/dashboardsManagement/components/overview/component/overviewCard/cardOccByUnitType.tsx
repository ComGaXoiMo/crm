import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Card } from "antd"

import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"
import { formatNumber, formatNumberFloat } from "@lib/helper"
import { L } from "@lib/abpUtility"
export interface IOverviewProps {
  dataThis: any
  dataLast: any
}

@inject(Stores.DashboardStore)
@observer
class CardOccByUnitType extends AppComponentListBase<IOverviewProps> {
  printRef: any = React.createRef()
  state = {
    dataThisBeforeMerge: [] as any,
  }
  componentDidMount(): void {
    this.mergeDataThisAndLast()
  }
  componentDidUpdate(prevProps): void {
    if (
      this.props.dataLast !== prevProps.dataLast ||
      this.props.dataThis !== prevProps.dataThis
    ) {
      this.mergeDataThisAndLast()
    }
  }

  mergeDataThisAndLast = () => {
    const { dataThis, dataLast } = this.props
    console.log(dataThis, dataLast)
    const thisDataBeforeMerge = dataThis.map((thisData) => {
      const lastData = dataLast.find(
        (item) => item?.ProjectId === thisData?.ProjectId
      )
      const arrType = [] as any
      thisData?.unitTypes?.forEach((item) => {
        const existingType = arrType.find(
          (type) => type.unitType === item.unitType
        )

        if (!existingType) {
          arrType.push(item)
        }
      })
      lastData?.unitTypes?.forEach((item) => {
        const existingType = arrType.find(
          (type) => type.unitType === item.unitType
        )

        if (!existingType) {
          arrType.push({ ...item, percent: 0 })
        }
      })
      return { ...thisData, unitTypes: arrType }
    })

    this.setState({ dataThisBeforeMerge: thisDataBeforeMerge })
  }

  public render() {
    const { dataLast } = this.props
    return (
      <>
        <Card className="card-report-fit-height">
          <Row gutter={[4, 4]}>
            <Col sm={{ span: 24 }}>
              <span className="card-overview-title">
                {this.L("OCCUPANCY_RATE_BY_UNIT_TYPE")}
              </span>
            </Col>

            <Col sm={{ span: 24 }}>
              <Row gutter={[24, 4]}>
                <Col sm={{ span: 8 }}></Col>
                <Col
                  sm={{ span: 8 }}
                  className="card-text-strong card-text-right"
                >
                  {this.L("LAST_PERIOD")}
                </Col>
                <Col
                  sm={{ span: 8 }}
                  className="card-text-strong card-text-right"
                >
                  {this.L("THIS_PERIOD")}
                </Col>
                {this.state.dataThisBeforeMerge?.map((item, index) => (
                  <>
                    <Col
                      sm={{ span: 24 }}
                      className="card-overview-second-title"
                    >
                      {item?.ProjectName}
                    </Col>
                    {/* Leased */}
                    <Col sm={{ span: 8 }} className="card-text-strong">
                      {this.L("LEASED")}
                    </Col>
                    <Col sm={{ span: 8 }} className="card-text-right">
                      {formatNumber(
                        dataLast.find(
                          (last) => last.ProjectId === item?.ProjectId
                        )?.Leased
                      )}
                    </Col>
                    <Col sm={{ span: 8 }} className="card-text-right">
                      {formatNumber(item?.Leased)}
                    </Col>
                    {/* Occ % */}
                    <Col
                      sm={{ span: 8 }}
                      className="card-text-strong card-text-red"
                    >
                      {this.L("OCC_%")}
                    </Col>
                    <Col
                      sm={{ span: 8 }}
                      className="card-text-right card-text-strong card-text-red"
                    >
                      {formatNumberFloat(
                        dataLast.find(
                          (last) => last.ProjectId === item?.ProjectId
                        )?.OccPercent
                      )}
                      %
                    </Col>
                    <Col
                      sm={{ span: 8 }}
                      className="card-text-right card-text-strong card-text-red"
                    >
                      {formatNumberFloat(item?.OccPercent)}%
                    </Col>
                    {/* status */}
                    {item?.unitTypes?.map((type) => (
                      <>
                        <Col sm={{ span: 8 }} className="card-text-right">
                          {type?.unitType}
                        </Col>
                        <Col sm={{ span: 8 }} className="card-text-right">
                          {formatNumberFloat(
                            dataLast
                              .find(
                                (last) => last.ProjectId === item?.ProjectId
                              )
                              ?.unitTypes.find(
                                (item) => item.unitType === type?.unitType
                              )?.percent
                          )}
                          %
                        </Col>
                        <Col sm={{ span: 8 }} className="card-text-right">
                          {formatNumberFloat(type?.percent)} %
                        </Col>
                        {/* row 2 */}
                        <Col sm={{ span: 12 }} className="card-text-right">
                          {L("LEASED")}
                        </Col>
                        <Col sm={{ span: 4 }} className="card-text-right">
                          {formatNumberFloat(
                            dataLast
                              .find(
                                (last) => last.ProjectId === item?.ProjectId
                              )
                              ?.unitTypes.find(
                                (item) => item.unitType === type?.unitType
                              )?.TotalLeasedByType
                          )}
                        </Col>
                        <Col sm={{ span: 8 }} className="card-text-right">
                          {formatNumberFloat(type?.TotalLeasedByType)}
                        </Col>
                        <Col sm={{ span: 12 }} className="card-text-right">
                          {L("VACANT")}
                        </Col>
                        <Col sm={{ span: 4 }} className="card-text-right">
                          {formatNumberFloat(
                            dataLast
                              .find(
                                (last) => last.ProjectId === item?.ProjectId
                              )
                              ?.unitTypes.find(
                                (item) => item.unitType === type?.unitType
                              )?.TotalVacantByType
                          )}
                        </Col>
                        <Col sm={{ span: 8 }} className="card-text-right">
                          {formatNumberFloat(type?.TotalVacantByType)}
                        </Col>
                      </>
                    ))}
                    {/* Vacant */}
                    {/* <Col sm={{ span: 8 }} className="card-text-strong">
                      {this.L("VACANT")}
                    </Col>
                    <Col sm={{ span: 8 }} className="card-text-right">
                      {formatNumber(dataLast[index]?.TotalVacant)}
                    </Col>
                    <Col sm={{ span: 8 }} className="card-text-right">
                      {formatNumber(item?.TotalVacant)}
                    </Col> */}
                    {/* Use in other purposes */}
                    {/* <Col sm={{ span: 8 }} className="card-text-strong">
                      {this.L("USE_IN_OTHER_PURPOSOS")}
                    </Col>
                    <Col sm={{ span: 8 }} className="card-text-right">
                      {formatNumber(dataLast[index]?.TotalUnUsed)}
                    </Col>
                    <Col sm={{ span: 8 }} className="card-text-right">
                      {formatNumber(item?.TotalUnUsed)}
                    </Col> */}
                    {/* Total Unit */}
                    <Col sm={{ span: 8 }} className="card-text-strong">
                      {this.L("TOTAL_UNIT")}
                    </Col>
                    <Col sm={{ span: 8 }} className="card-text-right">
                      {formatNumber(
                        dataLast.find(
                          (last) => last.ProjectId === item?.ProjectId
                        )?.TotalUnit ?? item?.TotalUnit
                      )}
                    </Col>
                    <Col sm={{ span: 8 }} className="card-text-right">
                      {formatNumber(item?.TotalUnit)}
                    </Col>
                  </>
                ))}
              </Row>
            </Col>
          </Row>
        </Card>
      </>
    )
  }
}

export default withRouter(CardOccByUnitType)
